import 'server-only';
import { hash } from 'bcryptjs';
import { customAlphabet } from 'nanoid';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/observability/logger';
import { sendEmail } from '@/lib/email/client';
import { bookingConfirmationEmail } from '@/lib/email/templates';
import { quote } from './pricing';
import { BookingStatus, type Prisma } from '@prisma/client';
import type { CreateBookingInput } from '@/lib/validation';

const codeSuffix = customAlphabet('0123456789', 6);

function newBookingCode(): string {
  return `BK-${new Date().getFullYear()}-${codeSuffix()}`;
}

/**
 * Creates a booking from public form input. The customer account is created
 * if one does not exist (passwordless until they set credentials).
 */
export async function createBooking(input: CreateBookingInput) {
  const code = newBookingCode();

  const result = await prisma.$transaction(async (tx) => {
    const placeholderPassword = await hash(`${input.contact.email}:${code}`, 12);

    const customer = await tx.user.upsert({
      where: { email: input.contact.email },
      update: {
        name: input.contact.fullName,
        phone: input.contact.phone,
      },
      create: {
        email: input.contact.email,
        name: input.contact.fullName,
        phone: input.contact.phone,
        // placeholder so the account exists; customer is invited to set their own password
        hashedPassword: placeholderPassword,
      },
    });

    const pet = await tx.pet.create({
      data: {
        ownerId: customer.id,
        name: input.pet.name,
        species: input.pet.species,
        breed: input.pet.breed ?? null,
        sizeBand: input.pet.sizeBand,
        weightKg: input.pet.weightKg ?? null,
        color: input.pet.color ?? null,
        passedAt: input.pet.passedAt ?? null,
        notes: input.pet.notes ?? null,
      },
    });

    const priced = await quote({
      serviceId: input.service.serviceId,
      addOnIds: input.service.addOnIds,
      sizeBand: input.pet.sizeBand,
    });

    const booking = await tx.booking.create({
      data: {
        code,
        customerId: customer.id,
        petId: pet.id,
        status: BookingStatus.PENDING_PAYMENT,
        pickupRequired: input.pickup.pickupRequired,
        pickupAddress: input.pickup.pickupAddress ?? null,
        pickupCity: input.pickup.pickupCity ?? null,
        pickupDistrict: input.pickup.pickupDistrict ?? null,
        scheduledFor: input.pickup.scheduledFor,
        livestream: input.service.livestream,
        griefCounseling: input.service.griefCounseling,
        subtotalVnd: priced.subtotalVnd,
        discountVnd: priced.discountVnd,
        taxVnd: priced.taxVnd,
        totalVnd: priced.totalVnd,
        items: {
          create: priced.items.map((i) => ({
            serviceId: i.serviceId,
            quantity: i.quantity,
            unitPriceVnd: i.unitPriceVnd,
            totalVnd: i.totalVnd,
          })),
        },
        events: {
          create: { type: 'created', payload: { source: 'web' } as Prisma.InputJsonValue },
        },
      },
      include: {
        items: { include: { service: true } },
        pet: true,
        customer: true,
      },
    });

    return booking;
  });

  logger.info({ bookingId: result.id, code: result.code }, 'booking_created');

  try {
    const mainItem = result.items[0];
    if (mainItem) {
      const email = bookingConfirmationEmail({
        customerName: result.customer.name,
        bookingCode: result.code,
        petName: result.pet?.name ?? 'bé yêu',
        serviceName: mainItem.service.nameVi,
        scheduledFor: result.scheduledFor ?? new Date(),
        totalVnd: result.totalVnd,
      });
      await sendEmail({ to: result.customer.email, ...email });
    }
  } catch (err) {
    logger.error({ err, bookingId: result.id }, 'booking_confirmation_email_failed');
  }

  return result;
}

export async function getBookingByCode(code: string) {
  return prisma.booking.findUnique({
    where: { code },
    include: {
      pet: true,
      customer: true,
      items: { include: { service: true } },
      payments: true,
    },
  });
}

export async function listCustomerBookings(customerId: string) {
  return prisma.booking.findMany({
    where: { customerId },
    orderBy: { createdAt: 'desc' },
    include: {
      pet: true,
      items: { include: { service: true } },
    },
  });
}

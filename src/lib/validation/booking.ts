import { z } from 'zod';

export const PetSpeciesSchema = z.enum([
  'DOG',
  'CAT',
  'RABBIT',
  'BIRD',
  'HAMSTER',
  'REPTILE',
  'OTHER',
]);

export const PetSizeBandSchema = z.enum(['XS', 'S', 'M', 'L', 'XL']);

const vnPhoneRegex = /^(?:\+?84|0)(?:3|5|7|8|9)\d{8}$/;

export const ContactSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Vui lòng nhập họ tên')
    .max(120),
  email: z.string().email('Email không hợp lệ'),
  phone: z
    .string()
    .regex(vnPhoneRegex, 'Số điện thoại Việt Nam không hợp lệ'),
});

export const PetInputSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên bé').max(80),
  species: PetSpeciesSchema,
  breed: z.string().max(80).optional().nullable(),
  sizeBand: PetSizeBandSchema,
  weightKg: z
    .number({ invalid_type_error: 'Cân nặng không hợp lệ' })
    .positive()
    .max(200)
    .optional(),
  color: z.string().max(40).optional().nullable(),
  passedAt: z.coerce.date().optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export const ServiceSelectionSchema = z.object({
  serviceId: z.string().cuid(),
  addOnIds: z.array(z.string().cuid()).default([]),
  livestream: z.boolean().default(false),
  griefCounseling: z.boolean().default(false),
});

export const PickupSchema = z.object({
  pickupRequired: z.boolean().default(true),
  pickupAddress: z.string().min(5).max(300).optional().nullable(),
  pickupCity: z.enum(['HANOI', 'HCMC']).optional(),
  pickupDistrict: z.string().max(80).optional().nullable(),
  scheduledFor: z.coerce.date().refine((d) => d.getTime() > Date.now() - 60 * 60 * 1000, {
    message: 'Thời gian không thể trong quá khứ',
  }),
});

export const CreateBookingSchema = z.object({
  contact: ContactSchema,
  pet: PetInputSchema,
  service: ServiceSelectionSchema,
  pickup: PickupSchema,
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'Bạn cần đồng ý với điều khoản dịch vụ' }),
  }),
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
export type ContactInput = z.infer<typeof ContactSchema>;
export type PetInput = z.infer<typeof PetInputSchema>;
export type ServiceSelectionInput = z.infer<typeof ServiceSelectionSchema>;
export type PickupInput = z.infer<typeof PickupSchema>;

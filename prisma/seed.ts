import { PrismaClient, ServiceCategory, PetSizeBand, UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const services = [
  {
    slug: 'cremation-private-standard',
    category: ServiceCategory.CREMATION_PRIVATE,
    nameVi: 'Hỏa táng riêng — Gói Tiêu Chuẩn',
    nameEn: 'Private Cremation — Standard',
    shortVi: 'Hỏa táng riêng từng bé, tro cốt được trao trả nguyên vẹn trong hũ gốm.',
    shortEn: 'Solo cremation chamber, ashes returned in a ceramic urn.',
    descriptionVi:
      'Mỗi bé được hỏa táng trong buồng riêng biệt, không lẫn với thú cưng khác. Tro cốt được thu hoàn toàn và bàn giao trong hũ gốm thủ công kèm chứng nhận.',
    descriptionEn:
      'Each pet is cremated alone in a dedicated chamber. All ashes are returned in a handcrafted ceramic urn with certificate.',
    basePriceVnd: 3_500_000,
    durationMin: 180,
    isFeatured: true,
    tiers: [
      { sizeBand: PetSizeBand.XS, priceVnd: 2_500_000 },
      { sizeBand: PetSizeBand.S, priceVnd: 3_500_000 },
      { sizeBand: PetSizeBand.M, priceVnd: 4_800_000 },
      { sizeBand: PetSizeBand.L, priceVnd: 6_500_000 },
      { sizeBand: PetSizeBand.XL, priceVnd: 8_900_000 },
    ],
  },
  {
    slug: 'cremation-private-premium',
    category: ServiceCategory.CREMATION_PRIVATE,
    nameVi: 'Hỏa táng riêng — Gói Cao Cấp',
    nameEn: 'Private Cremation — Premium',
    shortVi: 'Phòng lễ riêng, livestream cho gia đình, hũ tro thủ công khắc tên.',
    shortEn: 'Private ceremony room, family livestream, hand-engraved urn.',
    descriptionVi:
      'Bao gồm phòng lễ riêng cho gia đình tiễn biệt, dịch vụ livestream HD cho người thân ở xa, hũ tro thủ công khắc tên và một khung ảnh kỷ niệm.',
    descriptionEn:
      'Includes a private farewell room, HD livestream for remote family, hand-engraved urn, and a memorial photo frame.',
    basePriceVnd: 6_900_000,
    durationMin: 240,
    isFeatured: true,
    tiers: [
      { sizeBand: PetSizeBand.XS, priceVnd: 5_500_000 },
      { sizeBand: PetSizeBand.S, priceVnd: 6_900_000 },
      { sizeBand: PetSizeBand.M, priceVnd: 8_500_000 },
      { sizeBand: PetSizeBand.L, priceVnd: 11_900_000 },
      { sizeBand: PetSizeBand.XL, priceVnd: 15_900_000 },
    ],
  },
  {
    slug: 'cremation-communal',
    category: ServiceCategory.CREMATION_COMMUNAL,
    nameVi: 'Hỏa táng chung',
    nameEn: 'Communal Cremation',
    shortVi: 'Lựa chọn kinh tế khi gia đình không cần nhận tro cốt.',
    shortEn: 'Economical option when ashes are not returned.',
    descriptionVi:
      'Hỏa táng nhóm cùng các thú cưng khác. Tro cốt được rải tại khu tưởng niệm. Phù hợp khi gia đình không có nhu cầu lưu giữ tro.',
    descriptionEn:
      'Group cremation. Ashes are scattered at our memorial garden. Suitable when ashes do not need to be kept.',
    basePriceVnd: 1_200_000,
    durationMin: 120,
    tiers: [
      { sizeBand: PetSizeBand.XS, priceVnd: 900_000 },
      { sizeBand: PetSizeBand.S, priceVnd: 1_200_000 },
      { sizeBand: PetSizeBand.M, priceVnd: 1_600_000 },
      { sizeBand: PetSizeBand.L, priceVnd: 2_200_000 },
      { sizeBand: PetSizeBand.XL, priceVnd: 2_900_000 },
    ],
  },
  {
    slug: 'burial-memorial-garden',
    category: ServiceCategory.BURIAL,
    nameVi: 'Chôn cất tại vườn tưởng niệm',
    nameEn: 'Memorial Garden Burial',
    shortVi: 'An táng tại khu vườn riêng có bia tưởng niệm khắc tên.',
    shortEn: 'Burial at our private garden with an engraved headstone.',
    descriptionVi:
      'An táng tại khu vườn tưởng niệm với bia đá khắc tên và quyền viếng thăm trọn đời.',
    descriptionEn: 'Burial in our memorial garden with an engraved headstone and lifetime visits.',
    basePriceVnd: 12_000_000,
    durationMin: 180,
    tiers: [
      { sizeBand: PetSizeBand.XS, priceVnd: 9_000_000 },
      { sizeBand: PetSizeBand.S, priceVnd: 12_000_000 },
      { sizeBand: PetSizeBand.M, priceVnd: 16_000_000 },
      { sizeBand: PetSizeBand.L, priceVnd: 22_000_000 },
      { sizeBand: PetSizeBand.XL, priceVnd: 30_000_000 },
    ],
  },
  {
    slug: 'memorial-livestream',
    category: ServiceCategory.ADD_ON,
    nameVi: 'Bổ sung: Livestream lễ tiễn',
    nameEn: 'Add-on: Farewell Livestream',
    shortVi: 'Truyền hình trực tiếp lễ tiễn cho gia đình ở xa.',
    shortEn: 'Live broadcast of the farewell for remote family.',
    descriptionVi: 'Camera HD, đường truyền riêng tư, lưu lại video trong 30 ngày.',
    descriptionEn: 'HD camera, private link, recording retained for 30 days.',
    basePriceVnd: 800_000,
    durationMin: 60,
    tiers: [],
  },
  {
    slug: 'grief-counseling-1on1',
    category: ServiceCategory.GRIEF_COUNSELING,
    nameVi: 'Tư vấn vượt đau buồn (1:1)',
    nameEn: 'Grief Counseling (1:1)',
    shortVi: 'Phiên 60 phút với chuyên gia tâm lý, qua video hoặc trực tiếp.',
    shortEn: '60-minute session with a licensed counselor, video or in-person.',
    descriptionVi:
      'Phiên cá nhân với chuyên gia tâm lý được đào tạo về mất mát thú cưng. Có thể kết hợp video call hoặc trực tiếp tại văn phòng.',
    descriptionEn:
      'One-on-one session with a counselor trained in pet bereavement. Available via video or in-person.',
    basePriceVnd: 1_500_000,
    durationMin: 60,
    tiers: [],
  },
];

const faqs = [
  {
    questionVi: 'Tôi có thể chứng kiến quá trình hỏa táng không?',
    questionEn: 'Can I witness the cremation?',
    answerVi:
      'Có. Với gói Cao Cấp, gia đình có phòng quan sát riêng. Với gói Tiêu Chuẩn, gia đình có thể quan sát giai đoạn tiễn biệt.',
    answerEn:
      'Yes. With the Premium tier, families have a private observation room. With Standard, families may observe the farewell stage.',
    sortOrder: 1,
  },
  {
    questionVi: 'Xe đón có hoạt động ngoài giờ hành chính không?',
    questionEn: 'Is pickup available outside business hours?',
    answerVi: 'Có. Chúng tôi vận hành 24/7 trên địa bàn Hà Nội và TP.HCM.',
    answerEn: 'Yes. We operate 24/7 in Hanoi and Ho Chi Minh City.',
    sortOrder: 2,
  },
  {
    questionVi: 'Tro cốt được trao trả sau bao lâu?',
    questionEn: 'When are ashes returned?',
    answerVi: 'Thông thường trong 24–48 giờ kể từ khi hoàn tất hỏa táng.',
    answerEn: 'Usually within 24–48 hours after cremation completes.',
    sortOrder: 3,
  },
];

async function main() {
  console.warn('Seeding database…');

  const adminPassword = await hash('changeme-in-production', 12);
  await prisma.user.upsert({
    where: { email: 'admin@pet-farewell.vn' },
    update: {},
    create: {
      email: 'admin@pet-farewell.vn',
      name: 'Operations Admin',
      role: UserRole.ADMIN,
      hashedPassword: adminPassword,
    },
  });

  for (const [index, s] of services.entries()) {
    const { tiers, ...service } = s;
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: { ...service, sortOrder: index },
      create: {
        ...service,
        sortOrder: index,
        tiers: { create: tiers },
      },
    });
  }

  for (const [index, faq] of faqs.entries()) {
    await prisma.faqItem.upsert({
      where: { id: `faq-${index}` },
      update: faq,
      create: { id: `faq-${index}`, ...faq },
    });
  }

  console.warn('Seed complete.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

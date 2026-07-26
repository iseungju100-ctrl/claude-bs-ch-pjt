import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const reagents = [
  {
    name_kr: '수산화나트륨',
    name_en: 'Sodium Hydroxide',
    cas_no: '1310-73-2',
    formula: 'NaOH',
    mw_anhydrous: 40.00,
    density: null,
    default_assay: 100,
    category: 'BASE',
  },
  {
    name_kr: '염산',
    name_en: 'Hydrochloric Acid',
    cas_no: '7647-01-0',
    formula: 'HCl',
    mw_anhydrous: 36.46,
    density: 1.19,
    default_assay: 37,
    category: 'ACID',
  },
  {
    name_kr: '황산',
    name_en: 'Sulfuric Acid',
    cas_no: '7664-93-9',
    formula: 'H₂SO₄',
    mw_anhydrous: 98.08,
    density: 1.84,
    default_assay: 98,
    category: 'ACID',
  },
  {
    name_kr: '프탈산수소칼륨',
    name_en: 'Potassium Hydrogen Phthalate (KHP)',
    cas_no: '877-24-7',
    formula: 'KHC₈H₄O₄',
    mw_anhydrous: 204.23,
    density: null,
    default_assay: 99.95,
    category: 'STANDARD',
  },
  {
    name_kr: '탄산나트륨',
    name_en: 'Sodium Carbonate',
    cas_no: '497-19-8',
    formula: 'Na₂CO₃',
    mw_anhydrous: 105.99,
    density: null,
    default_assay: 99.5,
    category: 'SALT',
  },
  {
    name_kr: '염화나트륨',
    name_en: 'Sodium Chloride',
    cas_no: '7647-14-5',
    formula: 'NaCl',
    mw_anhydrous: 58.44,
    density: null,
    default_assay: 99.5,
    category: 'SALT',
  },
  {
    name_kr: '초산',
    name_en: 'Acetic Acid',
    cas_no: '64-19-7',
    formula: 'CH₃COOH',
    mw_anhydrous: 60.05,
    density: 1.049,
    default_assay: 99.7,
    category: 'ACID',
  },
  {
    name_kr: '초산나트륨',
    name_en: 'Sodium Acetate',
    cas_no: '127-09-3',
    formula: 'CH₃COONa',
    mw_anhydrous: 82.03,
    density: null,
    default_assay: 99,
    category: 'BUFFER_COMPONENT',
  },
  {
    name_kr: '트로메타민',
    name_en: 'Tromethamine (Tris)',
    cas_no: '77-86-1',
    formula: '(HOCH₂)₃CNH₂',
    mw_anhydrous: 121.14,
    density: null,
    default_assay: 99.5,
    category: 'BUFFER_COMPONENT',
  },
  {
    name_kr: '붕사',
    name_en: 'Borax (Sodium Tetraborate Decahydrate)',
    cas_no: '1303-96-4',
    formula: 'Na₂B₄O₇·10H₂O',
    mw_anhydrous: 381.37,
    density: null,
    default_assay: 99.5,
    category: 'BUFFER_COMPONENT',
  },
];

async function main() {
  console.log('🌱 시드 데이터 삽입 시작...');

  // 기존 데이터 삭제
  await prisma.reagent.deleteMany();

  // 시약 데이터 삽입
  for (const reagent of reagents) {
    const created = await prisma.reagent.create({
      data: reagent,
    });
    console.log(`✅ 시약 등록: ${created.name_kr} (${created.formula})`);
  }

  // 초산-초산나트륨 완충계 추가
  const acetic = await prisma.reagent.findFirst({
    where: { cas_no: '64-19-7' },
  });
  const sodium_acetate = await prisma.reagent.findFirst({
    where: { cas_no: '127-09-3' },
  });

  if (acetic && sodium_acetate) {
    await prisma.bufferSystem.create({
      data: {
        name: '초산/초산나트륨 완충계',
        acid_component_id: acetic.id,
        base_component_id: sodium_acetate.id,
        pKa1: 4.76,
      },
    });
    console.log(`✅ 완충계 등록: 초산/초산나트륨 (pKa=4.76)`);
  }

  console.log('🎉 시드 데이터 삽입 완료!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ 시드 데이터 삽입 실패:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
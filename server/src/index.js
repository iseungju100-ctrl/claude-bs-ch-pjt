import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// ============ Reagent CRUD API ============

// GET /api/reagents - 모든 시약 조회
app.get('/api/reagents', async (req, res) => {
  try {
    const reagents = await prisma.reagent.findMany({
      include: {
        hydrateVariants: true,
        bufferAsAcid: true,
        bufferAsBase: true,
      },
    });
    res.json({
      success: true,
      data: reagents,
      count: reagents.length,
    });
  } catch (error) {
    console.error('❌ Reagent 조회 실패:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/reagents/:id - 특정 시약 조회
app.get('/api/reagents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reagent = await prisma.reagent.findUnique({
      where: { id: parseInt(id) },
      include: {
        hydrateVariants: true,
        bufferAsAcid: true,
        bufferAsBase: true,
        standardizationRecords: true,
      },
    });

    if (!reagent) {
      return res.status(404).json({
        success: false,
        error: '시약을 찾을 수 없습니다.',
      });
    }

    res.json({
      success: true,
      data: reagent,
    });
  } catch (error) {
    console.error('❌ Reagent 상세 조회 실패:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/reagents - 새 시약 등록
app.post('/api/reagents', async (req, res) => {
  try {
    const { name_kr, name_en, cas_no, formula, mw_anhydrous, density, default_assay, category } = req.body;

    // 필수 필드 검증
    if (!name_kr || !name_en || !formula || mw_anhydrous === undefined || !category) {
      return res.status(400).json({
        success: false,
        error: '필수 필드가 누락되었습니다.',
      });
    }

    const reagent = await prisma.reagent.create({
      data: {
        name_kr,
        name_en,
        cas_no,
        formula,
        mw_anhydrous: parseFloat(mw_anhydrous),
        density: density ? parseFloat(density) : null,
        default_assay: default_assay ? parseFloat(default_assay) : 100,
        category,
      },
      include: {
        hydrateVariants: true,
      },
    });

    res.status(201).json({
      success: true,
      data: reagent,
      message: '시약이 등록되었습니다.',
    });
  } catch (error) {
    console.error('❌ Reagent 등록 실패:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT /api/reagents/:id - 시약 수정
app.put('/api/reagents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name_kr, name_en, cas_no, formula, mw_anhydrous, density, default_assay, category } = req.body;

    const updateData = {};
    if (name_kr !== undefined) updateData.name_kr = name_kr;
    if (name_en !== undefined) updateData.name_en = name_en;
    if (cas_no !== undefined) updateData.cas_no = cas_no;
    if (formula !== undefined) updateData.formula = formula;
    if (mw_anhydrous !== undefined) updateData.mw_anhydrous = parseFloat(mw_anhydrous);
    if (density !== undefined) updateData.density = density ? parseFloat(density) : null;
    if (default_assay !== undefined) updateData.default_assay = parseFloat(default_assay);
    if (category !== undefined) updateData.category = category;

    const reagent = await prisma.reagent.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        hydrateVariants: true,
      },
    });

    res.json({
      success: true,
      data: reagent,
      message: '시약이 수정되었습니다.',
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: '시약을 찾을 수 없습니다.',
      });
    }
    console.error('❌ Reagent 수정 실패:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE /api/reagents/:id - 시약 삭제
app.delete('/api/reagents/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const reagent = await prisma.reagent.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      data: reagent,
      message: '시약이 삭제되었습니다.',
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: '시약을 찾을 수 없습니다.',
      });
    }
    console.error('❌ Reagent 삭제 실패:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ============ Buffer System API ============

// GET /api/buffers - 모든 완충계 조회
app.get('/api/buffers', async (req, res) => {
  try {
    const buffers = await prisma.bufferSystem.findMany({
      include: {
        acid_component: true,
        base_component: true,
      },
    });
    res.json({
      success: true,
      data: buffers,
      count: buffers.length,
    });
  } catch (error) {
    console.error('❌ Buffer 조회 실패:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ============ Standardization Records API ============

// GET /api/standardization-records - 표정 기록 조회
app.get('/api/standardization-records', async (req, res) => {
  try {
    const records = await prisma.standardizationRecord.findMany({
      include: {
        reagent: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    res.json({
      success: true,
      data: records,
      count: records.length,
    });
  } catch (error) {
    console.error('❌ 표정 기록 조회 실패:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/standardization-records - 표정 기록 저장
app.post('/api/standardization-records', async (req, res) => {
  try {
    const { reagent_id, trials, mean, sd, rsd_percent, judged_status, created_by } = req.body;

    // 필수 필드 검증
    if (!reagent_id || !trials || mean === undefined || sd === undefined) {
      return res.status(400).json({
        success: false,
        error: '필수 필드가 누락되었습니다.',
      });
    }

    const record = await prisma.standardizationRecord.create({
      data: {
        reagent_id: parseInt(reagent_id),
        trials,
        mean: parseFloat(mean),
        sd: parseFloat(sd),
        rsd_percent: parseFloat(rsd_percent),
        judged_status: judged_status || 'PENDING',
        created_by: created_by || 'unknown',
      },
      include: {
        reagent: true,
      },
    });

    res.status(201).json({
      success: true,
      data: record,
      message: '표정 기록이 저장되었습니다.',
    });
  } catch (error) {
    console.error('❌ 표정 기록 저장 실패:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ============ 서버 시작 ============
app.listen(PORT, () => {
  console.log(`\n🚀 시약 DB 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📍 API 기본 주소: http://localhost:${PORT}/api`);
  console.log(`\n주요 엔드포인트:`);
  console.log(`  GET  http://localhost:${PORT}/api/reagents`);
  console.log(`  GET  http://localhost:${PORT}/api/buffers`);
  console.log(`  GET  http://localhost:${PORT}/api/standardization-records`);
  console.log(`  POST http://localhost:${PORT}/api/standardization-records`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⏹️  서버 종료 중...');
  await prisma.$disconnect();
  process.exit(0);
});
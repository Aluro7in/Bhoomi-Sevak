import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  SYNTHETIC_LAND_RECORDS,
  SYNTHETIC_CADASTRAL_PARCELS,
  SYNTHETIC_LOCKER_DOCUMENTS,
  SYNTHETIC_MUTATION_APPLICATIONS,
  TASK_BUNDLES,
  DEMO_CITIZENS,
} from './server/data';
import { AIProviderService } from './server/ai';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // ==========================================
  // API ROUTES
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Bhoomi Sevak Backend API',
      timestamp: new Date().toISOString(),
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Current Citizen Session
  app.get('/api/citizens/current', (req, res) => {
    const demoUser = DEMO_CITIZENS[0];
    res.json(demoUser);
  });

  // AI Intent Parsing (Natural Language Voice / Text)
  app.post('/api/ai/search-intent', async (req, res) => {
    try {
      const { query, language } = req.body;
      if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
      }
      const intentResult = await AIProviderService.parseIntent(query, language || 'hi');
      res.json(intentResult);
    } catch (err: any) {
      console.error('Search intent error:', err);
      res.status(500).json({ error: 'Failed to parse search intent', details: err.message });
    }
  });

  // Deterministic Land Records Search
  app.get('/api/land-records/search', (req, res) => {
    const { q, district, tehsil, village, owner, khasra, khata } = req.query as Record<string, string>;

    let results = [...SYNTHETIC_LAND_RECORDS];

    if (q) {
      const qLower = q.toLowerCase();
      results = results.filter(rec => {
        const matchesOwner = rec.owners.some(
          o => o.name.toLowerCase().includes(qLower) || o.nameHi.includes(q)
        );
        const matchesKhasra = rec.khasraNumbers.some(k => k.toLowerCase().includes(qLower));
        const matchesKhata = rec.khataNumber.includes(q);
        const matchesVillage = rec.village.toLowerCase().includes(qLower) || rec.villageHi.includes(q);
        const matchesTehsil = rec.tehsil.toLowerCase().includes(qLower) || rec.tehsilHi.includes(q);
        return matchesOwner || matchesKhasra || matchesKhata || matchesVillage || matchesTehsil;
      });
    }

    if (district) {
      results = results.filter(r => r.district.toLowerCase() === district.toLowerCase() || r.districtHi === district);
    }
    if (tehsil) {
      results = results.filter(r => r.tehsil.toLowerCase() === tehsil.toLowerCase() || r.tehsilHi === tehsil);
    }
    if (village) {
      results = results.filter(r => r.village.toLowerCase() === village.toLowerCase() || r.villageHi === village);
    }
    if (owner) {
      const ownerLower = owner.toLowerCase();
      results = results.filter(r =>
        r.owners.some(o => o.name.toLowerCase().includes(ownerLower) || o.nameHi.includes(owner))
      );
    }
    if (khasra) {
      results = results.filter(r => r.khasraNumbers.some(k => k.includes(khasra)));
    }
    if (khata) {
      results = results.filter(r => r.khataNumber.includes(khata));
    }

    res.json({
      totalCount: results.length,
      records: results,
    });
  });

  // Single Land Record by ID
  app.get('/api/land-records/:id', (req, res) => {
    const record = SYNTHETIC_LAND_RECORDS.find(r => r.id === req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Land record not found' });
    }

    // Attach related cadastral parcels
    const relatedParcels = SYNTHETIC_CADASTRAL_PARCELS.filter(p =>
      record.khasraNumbers.some(k => p.khasraNumber.startsWith(k.split('/')[0]))
    );

    // Attach related locker documents
    const relatedDocs = SYNTHETIC_LOCKER_DOCUMENTS.filter(
      d => d.khataNumber === record.khataNumber || record.khasraNumbers.some(k => d.khasraNumber?.includes(k))
    );

    res.json({
      record,
      relatedParcels,
      relatedDocs,
    });
  });

  // Plain-Language AI Record Explanation
  app.post('/api/ai/explain-record', async (req, res) => {
    try {
      const { recordId, record, language } = req.body;
      const targetRecord = record || SYNTHETIC_LAND_RECORDS.find(r => r.id === recordId);
      if (!targetRecord) {
        return res.status(404).json({ error: 'Record not found for explanation' });
      }

      const explanation = await AIProviderService.explainRecord(targetRecord, language || 'hi');
      res.json(explanation);
    } catch (err: any) {
      console.error('Explanation error:', err);
      res.status(500).json({ error: 'Failed to explain record', details: err.message });
    }
  });

  // Plain-Language AI Parcel Explanation (Cadastral Boundaries & Rights)
  app.post('/api/ai/explain-parcel', async (req, res) => {
    try {
      const { parcelId, parcel, language } = req.body;
      const targetParcel = parcel || SYNTHETIC_CADASTRAL_PARCELS.find(p => p.id === parcelId || p.khasraNumber === parcelId);
      if (!targetParcel) {
        return res.status(404).json({ error: 'Parcel not found for explanation' });
      }

      const explanation = await AIProviderService.explainParcel(targetParcel, language || 'hi');
      res.json(explanation);
    } catch (err: any) {
      console.error('Parcel explanation error:', err);
      res.status(500).json({ error: 'Failed to explain parcel', details: err.message });
    }
  });

  // Grounded Contextual AI Q&A on Land Record
  app.post('/api/ai/context-qa', async (req, res) => {
    try {
      const { recordId, question, history, language } = req.body;
      const targetRecord = SYNTHETIC_LAND_RECORDS.find(r => r.id === recordId);
      if (!targetRecord) {
        return res.status(404).json({ error: 'Record context required for QA' });
      }
      if (!question) {
        return res.status(400).json({ error: 'Question is required' });
      }

      const answer = await AIProviderService.answerContextualQuestion(
        targetRecord,
        question,
        history || [],
        language || 'hi'
      );
      res.json(answer);
    } catch (err: any) {
      console.error('Context QA error:', err);
      res.status(500).json({ error: 'Failed to process question', details: err.message });
    }
  });

  // Audio Speech Transcription via dedicated audio transcription model
  app.post('/api/ai/transcribe-audio', async (req, res) => {
    try {
      const { base64Audio, mimeType, language } = req.body;
      const result = await AIProviderService.transcribeAudio(base64Audio, mimeType, language || 'hi');
      res.json(result);
    } catch (err: any) {
      console.error('Audio transcription error:', err);
      res.status(500).json({ error: 'Failed to transcribe audio', details: err.message });
    }
  });

  // Search Grounding with live UP land regulations & circle rates
  app.post('/api/ai/grounded-search', async (req, res) => {
    try {
      const { query, language } = req.body;
      if (!query) {
        return res.status(400).json({ error: 'Query string is required' });
      }
      const result = await AIProviderService.groundedSearch(query, language || 'hi');
      res.json(result);
    } catch (err: any) {
      console.error('Grounded search error:', err);
      res.status(500).json({ error: 'Failed to perform grounded search', details: err.message });
    }
  });

  // Revenue Administrative Centers and Offices search with Maps location data
  app.get('/api/ai/revenue-offices', async (req, res) => {
    try {
      const { query, district, tehsil } = req.query as { query?: string; district?: string; tehsil?: string };
      const offices = await AIProviderService.searchRevenueOffices(query, district || 'Moradabad', tehsil || 'Bilari');
      res.json(offices);
    } catch (err: any) {
      console.error('Revenue offices lookup error:', err);
      res.status(500).json({ error: 'Failed to find revenue offices', details: err.message });
    }
  });

  // Multi-Turn AI Chat for Land Advisory
  app.post('/api/ai/multi-turn-chat', async (req, res) => {
    try {
      const { messages, recordId, record, language } = req.body;
      const targetRecord = record || (recordId ? SYNTHETIC_LAND_RECORDS.find(r => r.id === recordId) : null);
      const result = await AIProviderService.multiTurnChat(messages || [], targetRecord, language || 'hi');
      res.json(result);
    } catch (err: any) {
      console.error('Multi-turn chat error:', err);
      res.status(500).json({ error: 'Failed to complete chat turn', details: err.message });
    }
  });

  // Document Intelligence (OCR, Entity Extraction & Bounding Boxes)
  app.post('/api/documents/analyze', async (req, res) => {
    try {
      const { base64Data, mimeType, sampleDocType } = req.body;
      const extracted = await AIProviderService.analyzeDocument(base64Data, mimeType, sampleDocType);
      res.json(extracted);
    } catch (err: any) {
      console.error('Document analyze error:', err);
      res.status(500).json({ error: 'Failed to analyze document', details: err.message });
    }
  });

  // Deterministic Document vs Record Comparison
  app.post('/api/documents/compare', async (req, res) => {
    try {
      const { recordId, extractedData, language } = req.body;
      const record = SYNTHETIC_LAND_RECORDS.find(r => r.id === recordId) || SYNTHETIC_LAND_RECORDS[0];
      if (!extractedData) {
        return res.status(400).json({ error: 'Extracted document data is required' });
      }

      const comparison = await AIProviderService.compareDocumentWithRecord(record, extractedData, language || 'hi');
      res.json(comparison);
    } catch (err: any) {
      console.error('Comparison error:', err);
      res.status(500).json({ error: 'Failed to compare document', details: err.message });
    }
  });

  // Cadastral Map Parcels (भू-नक्शा)
  app.get('/api/cadastral/parcels', (req, res) => {
    const { village } = req.query as { village?: string };
    let parcels = [...SYNTHETIC_CADASTRAL_PARCELS];
    if (village) {
      parcels = parcels.filter(p => p.village.toLowerCase() === village.toLowerCase());
    }
    res.json({
      village: village || 'Ramnagar',
      villageHi: 'रामनगर',
      tehsil: 'Bilari',
      district: 'Moradabad',
      parcels,
    });
  });

  // Bhulekh Locker Documents
  app.get('/api/locker/documents', (req, res) => {
    const { category } = req.query as { category?: string };
    let docs = [...SYNTHETIC_LOCKER_DOCUMENTS];
    if (category && category !== 'all') {
      docs = docs.filter(d => d.category === category);
    }
    res.json({
      documents: docs,
      totalCount: docs.length,
    });
  });

  // Add Document to Locker
  app.post('/api/locker/upload', (req, res) => {
    const { title, titleHi, category, fileType, khasraNumber, village, extractedFields } = req.body;
    const newDoc = {
      id: `doc-${Date.now()}`,
      title: title || 'Citizen Uploaded Document',
      titleHi: titleHi || 'नागरिक अपलोड दस्तावेज',
      category: category || 'uploaded',
      categoryHi: 'मेरे अपलोड किए कागज़',
      issueDate: new Date().toLocaleDateString('en-GB'),
      issuingAuthority: 'Citizen Upload (Bhoomi Sevak Locker)',
      issuingAuthorityHi: 'स्वयं नागरिक द्वारा अपलोड',
      khasraNumber: khasraNumber || '452',
      village: village || 'Ramnagar',
      villageHi: 'रामनगर',
      fileSize: '540 KB',
      fileType: fileType || 'image',
      isRecordLinked: false,
      verificationStatus: 'review_needed' as const,
      extractedFields: extractedFields || {},
    };
    SYNTHETIC_LOCKER_DOCUMENTS.unshift(newDoc as any);
    res.json({ success: true, document: newDoc });
  });

  // Mutation Applications
  app.get('/api/mutations', (req, res) => {
    res.json({
      applications: SYNTHETIC_MUTATION_APPLICATIONS,
    });
  });

  app.get('/api/mutations/:id', (req, res) => {
    const appRecord = SYNTHETIC_MUTATION_APPLICATIONS.find(m => m.id === req.params.id || m.applicationNumber === req.params.id);
    if (!appRecord) {
      return res.status(404).json({ error: 'Mutation application not found' });
    }
    res.json(appRecord);
  });

  // Plain-Language Grounded AI Explanation for Mutation Milestones ("इसका मतलब क्या है?")
  app.post('/api/ai/explain-mutation-milestone', async (req, res) => {
    try {
      const { mutationId, stageId, question } = req.body;
      const mutation = SYNTHETIC_MUTATION_APPLICATIONS.find(
        m => m.id === mutationId || m.applicationNumber === mutationId
      ) || SYNTHETIC_MUTATION_APPLICATIONS[0];

      if (!mutation) {
        return res.status(404).json({ error: 'Mutation application not found' });
      }

      const explanation = await AIProviderService.explainMutationMilestone(
        mutation,
        Number(stageId) || mutation.currentStage,
        question
      );
      res.json(explanation);
    } catch (err: any) {
      console.error('Mutation explanation error:', err);
      res.status(500).json({ error: 'Failed to generate mutation explanation', details: err.message });
    }
  });

  // Task-Based Bundles
  app.get('/api/bundles', (req, res) => {
    res.json({
      bundles: TASK_BUNDLES,
    });
  });

  // ==========================================
  // VITE & STATIC MIDDLEWARE
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bhoomi Sevak server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Server initialization failed:', err);
  process.exit(1);
});

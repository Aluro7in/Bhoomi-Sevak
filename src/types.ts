export interface Citizen {
  id: string;
  name: string;
  nameHi: string;
  phone: string;
  avatar?: string;
  district: string;
  districtHi: string;
  tehsil: string;
  tehsilHi: string;
  village: string;
  villageHi: string;
  isDemoUser?: boolean;
}

export interface CitizenUser {
  id: string;
  name: string;
  nameHi: string;
  phone: string;
  village: string;
  villageHi: string;
  tehsil: string;
  tehsilHi: string;
  district: string;
  districtHi: string;
  khataNumbers: string[];
  khasraNumbers: string[];
  totalAreaHectare: number;
  aadhaarLinked: boolean;
  hasActiveMutation: boolean;
}

export interface DocumentComparisonResult {
  overallMatch: boolean;
  confidenceScore: number;
  matchedFields: {
    fieldName: string;
    fieldNameHi: string;
    docValue: string | number;
    recordValue: string | number;
  }[];
  mismatches: {
    fieldName: string;
    fieldNameHi: string;
    docValue: string | number;
    recordValue: string | number;
    severity: 'high' | 'medium' | 'info';
    explanation: string;
    explanationHi: string;
  }[];
  summary: string;
  summaryHi: string;
  recommendation: string;
  recommendationHi: string;
}

export type RecordStatusIndicator = 'green' | 'yellow' | 'red';

export interface LandRecord {
  id: string;
  khataNumber: string;
  khasraNumbers: string[];
  district: string;
  districtHi: string;
  tehsil: string;
  tehsilHi: string;
  village: string;
  villageHi: string;
  villageCensusCode: string;
  fasliYear: string;
  totalAreaHectare: number;
  totalAreaBigha: number; // Local conversion
  owners: {
    name: string;
    nameHi: string;
    fatherName: string;
    fatherNameHi: string;
    shareFraction: string; // e.g. "1/2", "1/1"
    sharePercentage: number;
    areaHectare: number;
    aadhaarStatus: 'verified' | 'unlinked' | 'pending';
  }[];
  landClassification: string;
  landClassificationHi: string; // e.g. "संक्रमणीय भूमिधर"
  mortgageDetails?: {
    isMortgaged: boolean;
    bankName?: string;
    bankNameHi?: string;
    amount?: number;
    date?: string;
    description?: string;
    descriptionHi?: string;
  };
  disputeDetails?: {
    hasDispute: boolean;
    courtName?: string;
    courtNameHi?: string;
    caseNumber?: string;
    status?: string;
    statusHi?: string;
    description?: string;
    descriptionHi?: string;
  };
  mutationStatus: {
    hasPendingMutation: boolean;
    mutationId?: string;
    currentStage?: string;
    currentStageHi?: string;
  };
  indicator: RecordStatusIndicator;
  indicatorReason: string;
  indicatorReasonHi: string;
  lastUpdated: string;
  remarks: string[];
  remarksHi: string[];
}

export interface CadastralParcel {
  id: string;
  khasraNumber: string;
  khataNumber?: string;
  landRecordId?: string;
  village: string;
  villageHi: string;
  tehsil?: string;
  tehsilHi?: string;
  district?: string;
  districtHi?: string;
  areaHectare: number;
  areaBigha: number;
  areaBiswa?: number;
  areaSqMeters?: number;
  landType: 'agricultural' | 'residential' | 'water_body' | 'road' | 'gram_sabha';
  landTypeHi: string;
  coordinates: [number, number][]; // Polygon points (relative SVG or lat/lng)
  center: [number, number];
  primaryOwnerName: string;
  primaryOwnerNameHi: string;
  fatherName?: string;
  fatherNameHi?: string;
  shareInfo?: string;
  shareInfoHi?: string;
  isUserParcel?: boolean;
  isDisputed?: boolean;
  isMortgaged?: boolean;
  recordStatus?: 'clear' | 'mortgaged' | 'disputed' | 'mutation_pending';
  recordStatusReason?: string;
  recordStatusReasonHi?: string;
  documentCount?: number;
  mutationStatusText?: string;
  mutationStatusTextHi?: string;
  hasActiveMutation?: boolean;
  soilType?: string;
  soilTypeHi?: string;
  irrigationSource?: string;
  irrigationSourceHi?: string;
  boundaries?: {
    north: string;
    northHi: string;
    south: string;
    southHi: string;
    east: string;
    eastHi: string;
    west: string;
    westHi: string;
  };
}

export interface DocumentVersion {
  versionId: string;
  versionNumber: string;
  timestamp: string;
  uploadedBy: string;
  uploadedByHi: string;
  status: string;
  statusHi: string;
  sha256Hash: string;
  fileSize: string;
  changeSummary: string;
  changeSummaryHi: string;
  isCurrent: boolean;
}

export interface LockerDocument {
  id: string;
  title: string;
  titleHi: string;
  category: 'ror' | 'registry' | 'mutation' | 'uploaded' | 'certificate' | 'ai_report';
  categoryHi: string;
  provenance?: 'official_issued' | 'citizen_uploaded' | 'ai_analysis';
  provenanceHi?: string;
  propertyId?: string;
  issueDate: string;
  issuingAuthority: string;
  issuingAuthorityHi: string;
  khasraNumber?: string;
  khataNumber?: string;
  village?: string;
  villageHi?: string;
  tehsil?: string;
  tehsilHi?: string;
  district?: string;
  districtHi?: string;
  fileSize: string;
  fileType: 'pdf' | 'image' | 'report';
  isRecordLinked: boolean;
  thumbnailUrl?: string;
  sampleContent?: string;
  verificationStatus: 'verified' | 'review_needed' | 'discrepancy_detected';
  aiAnalysisStatus?: 'clean_match' | 'discrepancy_flagged' | 'chain_verified' | 'analyzed';
  aiAnalysisStatusHi?: string;
  aiExplanation?: string;
  aiExplanationHi?: string;
  linkedMapParcelId?: string;
  linkedMutationId?: string;
  versionHistory?: DocumentVersion[];
  timelineHistory?: {
    date: string;
    title: string;
    titleHi: string;
    desc: string;
    descHi: string;
  }[];
  evidencePoints?: {
    label: string;
    labelHi: string;
    value: string;
    confidence?: number;
    isMatch?: boolean;
    evidenceSnippet?: string;
  }[];
  extractedFields?: Record<string, string | number>;
  comparisonResult?: {
    isCompared: boolean;
    matchScore: number;
    mismatches: {
      field: string;
      fieldHi: string;
      recordValue: string;
      documentValue: string;
      severity: 'high' | 'medium' | 'info';
    }[];
    summary: string;
    summaryHi: string;
  };
}

export interface MutationTimelineStage {
  stageId: number;
  milestoneKey: 'application_submitted' | 'lekhpal_verification' | 'field_inspection' | 'tehsildar_review' | 'record_updated';
  name: string;
  nameHi: string;
  shortLabel: string;
  shortLabelHi: string;
  officer: string;
  officerHi: string;
  status: 'completed' | 'in_progress' | 'current' | 'pending';
  completedDate?: string;
  expectedDate?: string;
  timestampText?: string;
  timestampTextHi?: string;
  description: string;
  descriptionHi: string;
  citizenExplanation: string;
  citizenExplanationHi: string;
  citizenActionRequired: boolean;
  citizenActionGuidance: string;
  citizenActionGuidanceHi: string;
  remarks?: string;
  remarksHi?: string;
  documentRef?: string;
  reportSnippet?: string;
  reportSnippetHi?: string;
}

export interface MutationApplication {
  id: string;
  applicationNumber: string;
  type?: string;
  typeHi?: string;
  filingDate: string;
  applicantName: string;
  applicantNameHi: string;
  transferorName: string;
  transferorNameHi: string;
  khasraNumber: string;
  khataNumber?: string;
  village: string;
  villageHi: string;
  tehsil: string;
  tehsilHi: string;
  district: string;
  districtHi: string;
  areaHectare: number;
  areaBigha?: number;
  deedRegistrationNo: string;
  deedDate: string;
  currentStage: number; // 1 to 5
  totalStages: number;
  overallStatus: 'in_progress' | 'approved' | 'objection_raised';
  overallStatusHi: string;
  statusLabel: string;
  statusLabelHi: string;
  stages: MutationTimelineStage[];
  // Deep Connections
  linkedPropertyId?: string;
  linkedRecordId?: string;
  linkedParcelId?: string;
  linkedDocumentIds?: string[];
  // Officials
  lekhpalName?: string;
  lekhpalNameHi?: string;
  lekhpalPhone?: string;
  revenueInspectorName?: string;
  revenueInspectorNameHi?: string;
  tehsildarCourt?: string;
  tehsildarCourtHi?: string;
  nextHearingDate?: string;
  objectionDetails?: {
    hasObjection: boolean;
    objectorName?: string;
    reason?: string;
    hearingDate?: string;
  };
  // AI Grounded Explanation
  aiOverview?: {
    summary: string;
    summaryHi: string;
    whatHappened: string;
    whatHappenedHi: string;
    currentStageMeaning: string;
    currentStageMeaningHi: string;
    whatNext: string;
    whatNextHi: string;
    citizenGuidance: string;
    citizenGuidanceHi: string;
    groundedFacts: string[];
  };
}

export interface MutationMilestoneExplanationResult {
  milestoneKey: string;
  milestoneName: string;
  milestoneNameHi: string;
  status: string;
  statusHi: string;
  summary: string;
  summaryHi: string;
  whatThisMeans: string;
  whatThisMeansHi: string;
  whatHappened: string;
  whatHappenedHi: string;
  whatHappensNext: string;
  whatHappensNextHi: string;
  citizenAction: string;
  citizenActionHi: string;
  feesAndBriberyGuidance: string;
  feesAndBriberyGuidanceHi: string;
  groundedFacts: string[];
  responsibleOfficer: string;
  responsibleOfficerHi: string;
  disclaimer: string;
  disclaimerHi: string;
}

export interface ExtractedDocumentData {
  statusState?: 'success' | 'partial' | 'low_confidence' | 'unreadable' | 'wrong_type' | 'wrong_document_type' | 'failure' | 'error';
  documentType: string;
  documentTypeHi: string;
  confidence: number;
  fields: {
    key: string;
    label: string;
    labelHi: string;
    value: string;
    confidence: number;
    evidenceText: string;
    boundingBox?: { x: number; y: number; width: number; height: number };
  }[];
  notes: string[];
  notesHi: string[];
}

export type VerificationStatusType = 'match' | 'difference' | 'unable_to_verify';

export interface VerificationDifferenceItem {
  fieldKey: string;
  field: string;
  fieldHi: string;
  status: VerificationStatusType;
  statusLabel: 'Match' | 'Potential difference' | 'Unable to verify';
  statusLabelHi: 'पूर्णतः मिलान' | 'संभावित अंतर मिला' | 'सत्यापन में असमर्थ';
  recordValue: string;
  documentValue: string;
  evidence: string;
  boundingBox?: { x: number; y: number; width: number; height: number };
  deltaText?: string;
  deltaTextHi?: string;
  explanation: string;
  explanationHi: string;
}

export interface VerificationComparisonResult {
  matchScore: number;
  overallStatus: 'all_match' | 'potential_difference' | 'needs_review';
  overallStatusHi: string;
  hasDifferences: boolean;
  differences: VerificationDifferenceItem[];
  summary: string;
  summaryHi: string;
  aiPlainExplanation?: string;
  aiPlainExplanationHi?: string;
  disclaimer: string;
  disclaimerHi: string;
}

export interface SearchIntentResult {
  intent: 'land_search' | 'mutation_status' | 'document_query' | 'general_help';
  confidence: number;
  rawQuery: string;
  extractedEntities: {
    district?: string;
    tehsil?: string;
    village?: string;
    ownerName?: string;
    khasraNumber?: string;
    khataNumber?: string;
  };
  clarificationNeeded?: boolean;
  clarificationPrompt?: string;
  clarificationPromptHi?: string;
  suggestedAction?: string;
}

export interface TaskBundle {
  id: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  purpose: 'kcc_loan' | 'land_sale' | 'pm_kisan' | 'court_verify';
  icon: string;
  requiredDocs: {
    title: string;
    titleHi: string;
    isAvailableInLocker: boolean;
    docId?: string;
  }[];
}

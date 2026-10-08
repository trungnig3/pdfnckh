export interface X509Certificate {
  id: string;
  serialNumber: string;
  subject: {
    commonName: string;
    organization: string;
    organizationalUnit: string;
    country: string;
    email: string;
  };
  issuer: {
    commonName: string;
    organization: string;
    country: string;
  };
  validFrom: string;
  validTo: string;
  publicKeyPem: string;
  signatureAlgorithm: string; // e.g., 'SHA256withRSA'
  keySize: number; // e.g., 2048
  keyUsage: string[];
  status: 'valid' | 'revoked' | 'expired';
  revocationDate?: string;
  revocationReason?: string;
  sha256Fingerprint: string;
}

export interface KeyPairData {
  publicKeyPem: string;
  privateKeyPem?: string; // Stored only in simulated secure enclave
  cryptoKeyPair?: CryptoKeyPair;
  keyAlgorithm: string;
  keySize: number;
  creationDate: string;
  storageLocation: 'Android_Keystore' | 'iOS_Secure_Enclave' | 'Local_Mock';
  biometricEnforced: boolean;
}

export interface DocumentItem {
  id: string;
  code: string;
  title: string;
  category: 'transcript' | 'decree' | 'receipt' | 'student_cert' | 'custom_upload';
  createdAt: string;
  author: string;
  recipient: string;
  department: string;
  description: string;
  fileSizeBytes: number;
  originalHashSha256: string;
  status: 'pending' | 'signed' | 'rejected';
  signatureData?: DocumentSignature;
  tampered?: boolean;
  contentData?: any;
}

export interface DocumentSignature {
  signatureId: string;
  signedAt: string;
  signerName: string;
  signerTitle: string;
  signerEmail: string;
  certificateSerialNumber: string;
  certificateFingerprint: string;
  signatureHex: string;
  rawHash: string;
  reason: string;
  location: string;
  tsaTimestamp?: string;
  mobileDeviceModel: string;
  biometricMethod: 'Fingerprint' | 'FaceID' | 'Hardware_PIN';
  standard: 'PAdES_BASELINE_B' | 'ISO_32000_1';
  byteRange: [number, number, number, number];
}

export interface VerificationResult {
  isValid: boolean;
  documentIntegrityValid: boolean;
  signerIdentityValid: boolean;
  certificateValid: boolean;
  certificateRevoked: boolean;
  timestampValid: boolean;
  details: {
    computedHash: string;
    expectedHash: string;
    signerName: string;
    certificateIssuer: string;
    certificateSerial: string;
    signedTime: string;
    signatureAlgorithm: string;
    padesCompliance: string;
    tamperDetectedMessage?: string;
    differencesFound?: string[];
  };
}

export interface FraudIncident {
  id: string;
  documentId: string;
  documentCode: string;
  documentTitle: string;
  detectedAt: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  attackType:
    | 'CONTENT_MANIPULATION'
    | 'SIGNATURE_REPLAY_ATTACK'
    | 'GPA_FRAUD'
    | 'FINANCIAL_ALTERATION'
    | 'UNAUTHORIZED_SUBMISSION';
  originalHash: string;
  tamperedHash: string;
  bitDifferencePercentage: number;
  originalDataSummary: string;
  tamperedDataSummary: string;
  claimedSigner: string;
  signerCertificateSerial: string;
  status: 'FLAGGED_COUNTERFEIT' | 'INVESTIGATING' | 'CONFIRMED_FRAUD' | 'BLOCKED';
  forensicAnalysisNotes: string;
  actionsTaken: string[];
}


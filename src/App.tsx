import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { DocumentSignerPortal } from './components/portal/DocumentSignerPortal';
import { MobileClientSimulator } from './components/mobile/MobileClientSimulator';
import { CaServerManager } from './components/ca/CaServerManager';
import { VerifyAndTamperLab } from './components/verify/VerifyAndTamperLab';
import { FraudInvestigationCenter } from './components/fraud/FraudInvestigationCenter';
import { ResearchDefenseViewer } from './components/thesis/ResearchDefenseViewer';
import { DocumentItem, DocumentSignature, KeyPairData, X509Certificate, FraudIncident } from './types';
import { INITIAL_HUNRE_DOCUMENTS } from './data/sampleHUNREDocuments';
import { INITIAL_CERTIFICATES } from './data/initialCertificates';
import { INITIAL_FRAUD_INCIDENTS } from './data/initialIncidents';
import { generateRsaKeyPair, exportPublicKeyPem, generateCertificateSerial, calculateSha256 } from './crypto/pkiCrypto';
import { X, Smartphone } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'portal' | 'mobile' | 'ca' | 'verify' | 'fraud' | 'thesis'>('portal');
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_HUNRE_DOCUMENTS);
  const [certificates, setCertificates] = useState<X509Certificate[]>(INITIAL_CERTIFICATES);
  const [incidents, setIncidents] = useState<FraudIncident[]>(INITIAL_FRAUD_INCIDENTS);
  const [keyPair, setKeyPair] = useState<KeyPairData | null>(null);

  // Auto-initialize Mobile Keystore with real RSA keypair on first launch
  useEffect(() => {
    async function initMobileKeys() {
      try {
        const cryptoKeys = await generateRsaKeyPair();
        const pubPem = await exportPublicKeyPem(cryptoKeys.publicKey);
        setKeyPair({
          publicKeyPem: pubPem,
          cryptoKeyPair: cryptoKeys,
          keyAlgorithm: 'RSASSA-PKCS1-v1_5',
          keySize: 2048,
          creationDate: new Date().toISOString(),
          storageLocation: 'Android_Keystore',
          biometricEnforced: true,
        });
      } catch (err) {
        console.error('Failed to auto-init keys:', err);
      }
    }
    initMobileKeys();
  }, []);

  const pendingDocs = documents.filter((d) => d.status === 'pending');
  const defaultCert = certificates[0]; // Trần Thị Vân Phương

  // Handle document signed callback
  const handleDocumentSigned = (docId: string, signature: DocumentSignature) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              status: 'signed',
              signatureData: signature,
              tampered: false,
            }
          : doc
      )
    );
  };

  // Tamper simulation
  const handleTamperDocument = async (docId: string) => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;

    const tamperedHash = await calculateSha256(doc.originalHashSha256 + '_attacker_modified_bytes');

    const newIncident: FraudIncident = {
      id: 'inc-' + Math.random().toString(36).substring(2, 8),
      documentId: doc.id,
      documentCode: doc.code,
      documentTitle: doc.title,
      detectedAt: new Date().toISOString(),
      severity: 'HIGH',
      attackType: 'CONTENT_MANIPULATION',
      originalHash: doc.originalHashSha256,
      tamperedHash: tamperedHash,
      bitDifferencePercentage: 51.8,
      originalDataSummary: `Nội dung gốc được ký bảo mật bởi ${doc.signatureData?.signerName || 'Trần Thị Vân Phương'}`,
      tamperedDataSummary: 'Dữ liệu văn bản đã bị sửa đổi trái phép sau khi ký (Nghi ngờ can thiệp nhị phân)',
      claimedSigner: doc.signatureData?.signerName || 'Trần Thị Vân Phương',
      signerCertificateSerial: doc.signatureData?.certificateSerialNumber || '7B:4E:91:2A:0F:6C:83:D1:49:E0:18:24:99:BC:A1:3F',
      status: 'CONFIRMED_FRAUD',
      forensicAnalysisNotes:
        'Cảnh báo an toàn thông tin: Tài liệu đã bị can thiệp sau khi ký số trên thiết bị di động. Giá trị băm SHA-256 bị sai lệch, không khớp với chữ ký số RSA-2048 được nhúng. Hệ thống đã lập hồ sơ cảnh báo.',
      actionsTaken: [
        'Vô hiệu hóa chứng thực tài liệu trên cổng tra cứu',
        'Tạo hồ sơ giám định an toàn thông tin tự động',
        'Cảnh báo đến cơ quan quản lý và người ký hợp pháp',
      ],
    };

    setIncidents((prev) => [newIncident, ...prev]);

    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === docId) {
          return {
            ...d,
            tampered: true,
            contentData: d.contentData
              ? {
                  ...d.contentData,
                  cumulativeGpa: '4.00 (Đã bị hacker can thiệp)',
                  evaluation: 'Thủ khoa (Giả mạo)',
                  amount: '1.000.000 VNĐ (Đã bị hạ giá trị)',
                }
              : undefined,
          };
        }
        return d;
      })
    );
  };

  // Restore pristine document
  const handleRestoreDocument = (docId: string) => {
    const original = INITIAL_HUNRE_DOCUMENTS.find((d) => d.id === docId);
    if (original) {
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === docId ? { ...original, status: doc.status, signatureData: doc.signatureData, tampered: false } : doc))
      );
    } else {
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === docId ? { ...doc, tampered: false } : doc))
      );
    }
  };

  // Advanced Attack Simulation Trigger for Fraud Center
  const handleTriggerAttackSimulation = async (
    docId: string,
    attackType: FraudIncident['attackType'],
    tamperedChanges: { title?: string; gpa?: string; amount?: string; name?: string }
  ): Promise<FraudIncident> => {
    const doc = documents.find((d) => d.id === docId) || documents[0];
    const tamperedHash = await calculateSha256(
      doc.originalHashSha256 + '_malicious_injection_' + JSON.stringify(tamperedChanges)
    );

    let origSummary = '';
    let tampSummary = '';

    if (attackType === 'GPA_FRAUD') {
      origSummary = `GPA tích lũy: ${doc.contentData?.cumulativeGpa || '3.75/4.0'} | Xếp loại: ${doc.contentData?.evaluation || 'Xuất sắc'}`;
      tampSummary = `GPA bị sửa thành: ${tamperedChanges.gpa || '4.00/4.0 (Giả mạo)'} | Cố tình làm sai lệch bảng điểm HUNRE`;
    } else if (attackType === 'FINANCIAL_ALTERATION') {
      origSummary = `Học phí chính quy: ${doc.contentData?.amount || '11.850.000 VNĐ'}`;
      tampSummary = `Số tiền bị kẻ gian hạ xuống: ${tamperedChanges.amount || '1.000.000 VNĐ'} nhằm trốn tránh nộp học phí`;
    } else {
      origSummary = `Người nhận hợp pháp: ${doc.recipient}`;
      tampSummary = `Tên người nhận bị thay thế trái phép: ${tamperedChanges.name || 'Người lạ mặt (Tráo danh tính)'}`;
    }

    const newIncident: FraudIncident = {
      id: 'dfir-' + Math.random().toString(36).substring(2, 8),
      documentId: doc.id,
      documentCode: doc.code,
      documentTitle: doc.title,
      detectedAt: new Date().toISOString(),
      severity: 'CRITICAL',
      attackType: attackType,
      originalHash: doc.originalHashSha256,
      tamperedHash: tamperedHash,
      bitDifferencePercentage: 53.7,
      originalDataSummary: origSummary,
      tamperedDataSummary: tampSummary,
      claimedSigner: doc.signatureData?.signerName || 'Trần Thị Vân Phương',
      signerCertificateSerial: doc.signatureData?.certificateSerialNumber || '7B:4E:91:2A:0F:6C:83:D1:49:E0:18:24:99:BC:A1:3F',
      status: 'CONFIRMED_FRAUD',
      forensicAnalysisNotes: `Hệ thống ghi nhận hành vi giả mạo: Kẻ gian đánh cắp tệp PDF đã ký, trích xuất cấu trúc và sửa đổi nội dung (${attackType}). Thuật toán xác minh chữ ký RSA RSA-2048 / SHA-256 thất bại hoàn toàn. Đã cách ly văn bản và đưa vào danh sách đen.`,
      actionsTaken: [
        'Vô hiệu hóa chứng thực tài liệu trên cổng tra cứu HUNRE',
        'Tự động khởi tạo Biên bản Giám định Pháp y Kỹ thuật số DFIR',
        'Gửi thông báo vi phạm đến Phòng Khoa học Công nghệ & HTQT',
        'Khóa phiên truy cập của nguồn nộp tài liệu giả mạo',
      ],
    };

    setIncidents((prev) => [newIncident, ...prev]);

    // Mark document as tampered
    setDocuments((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, tampered: true } : d))
    );

    setActiveTab('fraud');
    return newIncident;
  };

  // Send to mobile
  const handleSendToMobile = (docId: string) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === docId ? { ...doc, status: 'pending' } : doc))
    );
  };

  // Revoke certificate
  const handleRevokeCertificate = (id: string, reason: string) => {
    setCertificates((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'revoked',
              revocationDate: new Date().toISOString().substring(0, 10),
              revocationReason: reason,
            }
          : c
      )
    );
  };

  // Restore revoked certificate
  const handleRestoreCertificate = (id: string) => {
    setCertificates((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'valid',
              revocationDate: undefined,
              revocationReason: undefined,
            }
          : c
      )
    );
  };

  // Issue new certificate from CA
  const handleIssueNewCertificate = (subjectData: {
    commonName: string;
    organization: string;
    organizationalUnit: string;
    email: string;
    country: string;
  }) => {
    const newCert: X509Certificate = {
      id: 'cert-' + Math.random().toString(36).substring(2, 8),
      serialNumber: generateCertificateSerial(),
      subject: subjectData,
      issuer: {
        commonName: 'HUNRE Academic Issuing CA',
        organization: 'Trường Đại học Tài nguyên và Môi trường Hà Nội',
        country: 'VN',
      },
      validFrom: new Date().toISOString().substring(0, 10),
      validTo: new Date(Date.now() + 2 * 365 * 24 * 3600 * 1000).toISOString().substring(0, 10),
      publicKeyPem: keyPair?.publicKeyPem || INITIAL_CERTIFICATES[0].publicKeyPem,
      signatureAlgorithm: 'SHA256withRSA',
      keySize: 2048,
      keyUsage: ['Digital Signature', 'Non-Repudiation'],
      status: 'valid',
      sha256Fingerprint: generateCertificateSerial(),
    };

    setCertificates((prev) => [newCert, ...prev]);
  };

  // CA request from Mobile
  const requestCertificateFromCA = async (pubKeyPem: string): Promise<X509Certificate> => {
    const cert: X509Certificate = {
      id: 'cert-mobile-' + Math.random().toString(36).substring(2, 8),
      serialNumber: generateCertificateSerial(),
      subject: {
        commonName: 'Trần Thị Vân Phương',
        organization: 'Trường Đại học Tài nguyên và Môi trường Hà Nội',
        organizationalUnit: 'Khoa Công nghệ Thông tin - Lớp ĐH13C5',
        country: 'VN',
        email: '2311061904@hunre.edu.vn',
      },
      issuer: {
        commonName: 'HUNRE Academic Issuing CA',
        organization: 'Trường Đại học Tài nguyên và Môi trường Hà Nội',
        country: 'VN',
      },
      validFrom: new Date().toISOString().substring(0, 10),
      validTo: new Date(Date.now() + 2 * 365 * 24 * 3600 * 1000).toISOString().substring(0, 10),
      publicKeyPem: pubKeyPem,
      signatureAlgorithm: 'SHA256withRSA',
      keySize: 2048,
      keyUsage: ['Digital Signature', 'Non-Repudiation'],
      status: 'valid',
      sha256Fingerprint: generateCertificateSerial(),
    };

    setCertificates((prev) => [cert, ...prev]);
    return cert;
  };

  // Upload custom PDF
  const handleUploadCustomPdf = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const sha256Hex = await calculateSha256(arrayBuffer);

    const newDoc: DocumentItem = {
      id: 'doc-upload-' + Date.now(),
      code: `HUNRE/UPLOAD/${Date.now().toString().substring(7)}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      category: 'custom_upload',
      createdAt: new Date().toISOString(),
      author: 'Người dùng tải lên',
      recipient: 'Sinh viên / Cán bộ HUNRE',
      department: 'Phòng ban tải lên',
      description: `Tệp PDF tùy chọn "${file.name}" đã được tải lên và tính toán hàm băm SHA-256 thực tế bằng Web Cryptography API.`,
      fileSizeBytes: file.size,
      originalHashSha256: sha256Hex,
      status: 'pending',
    };

    setDocuments((prev) => [newDoc, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        pendingCount={pendingDocs.length}
        fraudIncidentCount={incidents.length}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'portal' && (
          <DocumentSignerPortal
            documents={documents}
            onSendToMobile={handleSendToMobile}
            onTamperDocument={handleTamperDocument}
            onRestoreDocument={handleRestoreDocument}
            onUploadCustomPdf={handleUploadCustomPdf}
            certificates={certificates}
            openMobilePrompt={() => setMobileOpen(true)}
            onOpenFraudCenter={() => setActiveTab('fraud')}
          />
        )}

        {activeTab === 'mobile' && (
          <div className="py-4">
            <div className="text-center mb-6 space-y-1">
              <h2 className="text-xl font-bold text-slate-900">
                Ứng Dụng Di Động HUNRE Mobile PKI (Android Keystore / iOS Secure Enclave)
              </h2>
              <p className="text-xs text-slate-500">
                Mô phỏng trải nghiệm người dùng cuối: Sinh cặp khóa RSA trên chip bảo mật, xác thực sinh trắc học vân tay/FaceID và ký số tài liệu từ xa.
              </p>
            </div>
            <MobileClientSimulator
              keyPair={keyPair}
              setKeyPair={setKeyPair}
              certificate={defaultCert}
              requestCertificateFromCA={requestCertificateFromCA}
              pendingDocuments={pendingDocs}
              onDocumentSigned={handleDocumentSigned}
            />
          </div>
        )}

        {activeTab === 'ca' && (
          <CaServerManager
            certificates={certificates}
            onRevokeCertificate={handleRevokeCertificate}
            onRestoreCertificate={handleRestoreCertificate}
            onIssueNewCertificate={handleIssueNewCertificate}
          />
        )}

        {activeTab === 'verify' && (
          <VerifyAndTamperLab
            documents={documents}
            certificates={certificates}
            onOpenFraudCenter={() => setActiveTab('fraud')}
          />
        )}

        {activeTab === 'fraud' && (
          <FraudInvestigationCenter
            incidents={incidents}
            documents={documents}
            certificates={certificates}
            onTriggerAttackSimulation={handleTriggerAttackSimulation}
          />
        )}

        {activeTab === 'thesis' && <ResearchDefenseViewer />}
      </main>

      {/* Slide-over / Modal Mobile Simulator Drawer when toggled from Header or Portal */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white shadow-2xl h-full flex flex-col overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-700" />
                <span className="text-sm font-bold text-slate-900">Mô phỏng Thiết bị Di động</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 flex justify-center py-2">
              <MobileClientSimulator
                keyPair={keyPair}
                setKeyPair={setKeyPair}
                certificate={defaultCert}
                requestCertificateFromCA={requestCertificateFromCA}
                pendingDocuments={pendingDocs}
                onDocumentSigned={handleDocumentSigned}
                isEmbedded={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

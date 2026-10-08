import React, { useState } from 'react';
import { KeyPairData, X509Certificate, DocumentItem, DocumentSignature } from '../../types';
import { generateRsaKeyPair, exportPublicKeyPem, calculateSha256, signDataWithRsa } from '../../crypto/pkiCrypto';
import { Fingerprint, Smartphone, Key, Shield, CheckCircle2, Clock, AlertTriangle, RefreshCw, FileText, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MobileClientSimulatorProps {
  keyPair: KeyPairData | null;
  setKeyPair: (key: KeyPairData | null) => void;
  certificate: X509Certificate | null;
  requestCertificateFromCA: (pubKeyPem: string) => Promise<X509Certificate>;
  pendingDocuments: DocumentItem[];
  onDocumentSigned: (docId: string, signature: DocumentSignature) => void;
  isEmbedded?: boolean;
}

export const MobileClientSimulator: React.FC<MobileClientSimulatorProps> = ({
  keyPair,
  setKeyPair,
  certificate,
  requestCertificateFromCA,
  pendingDocuments,
  onDocumentSigned,
  isEmbedded = false,
}) => {
  const [osType, setOsType] = useState<'android' | 'ios'>('android');
  const [biometricMethod, setBiometricMethod] = useState<'Fingerprint' | 'FaceID'>('Fingerprint');
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [selectedPendingDoc, setSelectedPendingDoc] = useState<DocumentItem | null>(null);
  const [isBiometricPromptOpen, setIsBiometricPromptOpen] = useState(false);
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [biometricSuccess, setBiometricSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Handle Key Generation in simulated Secure Enclave
  const handleGenerateKey = async () => {
    try {
      setIsGeneratingKey(true);
      setStatusMessage('Đang khởi tạo cặp khóa RSA-2048 trong vùng bảo mật phần cứng...');
      const cryptoKeys = await generateRsaKeyPair();
      const pubPem = await exportPublicKeyPem(cryptoKeys.publicKey);

      const newKeyPair: KeyPairData = {
        publicKeyPem: pubPem,
        cryptoKeyPair: cryptoKeys,
        keyAlgorithm: 'RSASSA-PKCS1-v1_5',
        keySize: 2048,
        creationDate: new Date().toISOString(),
        storageLocation: osType === 'android' ? 'Android_Keystore' : 'iOS_Secure_Enclave',
        biometricEnforced: true,
      };

      setKeyPair(newKeyPair);
      setStatusMessage('Cặp khóa đã được sinh thành công trong Keystore. Đang gửi CSR tới CA...');
      
      // Request X.509 Certificate automatically
      await requestCertificateFromCA(pubPem);
      setStatusMessage('Chứng thư số X.509 đã được CA HUNRE phê duyệt và cài đặt trên thiết bị!');
    } catch (err: any) {
      console.error(err);
      setStatusMessage('Lỗi sinh khóa: ' + err.message);
    } finally {
      setIsGeneratingKey(false);
    }
  };

  // Trigger signing flow
  const handleStartSign = (doc: DocumentItem) => {
    setSelectedPendingDoc(doc);
    setIsBiometricPromptOpen(true);
    setBiometricScanning(false);
    setBiometricSuccess(false);
  };

  // Perform Biometric Verification and Sign
  const handlePerformBiometricAuth = async () => {
    if (!selectedPendingDoc || !keyPair?.cryptoKeyPair?.privateKey || !certificate) return;

    setBiometricScanning(true);
    // Simulate biometric hardware delay (600ms)
    setTimeout(async () => {
      setBiometricScanning(false);
      setBiometricSuccess(true);

      try {
        const hashToSign = selectedPendingDoc.originalHashSha256;
        const signatureHex = await signDataWithRsa(keyPair.cryptoKeyPair!.privateKey, hashToSign);

        const signature: DocumentSignature = {
          signatureId: 'sig-' + Math.random().toString(36).substring(2, 10),
          signedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          signerName: certificate.subject.commonName,
          signerTitle: `${certificate.subject.organizationalUnit} - ${certificate.subject.organization}`,
          signerEmail: certificate.subject.email,
          certificateSerialNumber: certificate.serialNumber,
          certificateFingerprint: certificate.sha256Fingerprint,
          signatureHex: signatureHex,
          rawHash: hashToSign,
          reason: 'Phê duyệt & Xác nhận tính toàn vẹn tài liệu học vụ',
          location: 'Trường Đại học Tài nguyên và Môi trường Hà Nội',
          tsaTimestamp: new Date().toISOString(),
          mobileDeviceModel: osType === 'android' ? 'Android Pixel (Keystore Knox)' : 'Apple iPhone (Secure Enclave)',
          biometricMethod: biometricMethod,
          standard: 'PAdES_BASELINE_B',
          byteRange: [0, 12480, 15600, 24000],
        };

        setTimeout(() => {
          onDocumentSigned(selectedPendingDoc.id, signature);
          setIsBiometricPromptOpen(false);
          setSelectedPendingDoc(null);
          setBiometricSuccess(false);
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
          });
        }, 500);
      } catch (err: any) {
        alert('Lỗi khi thực hiện ký số: ' + err.message);
      }
    }, 800);
  };

  return (
    <div className={`flex flex-col items-center ${isEmbedded ? '' : 'p-4'}`}>
      {/* Mobile Shell Frame */}
      <div className="w-[340px] sm:w-[380px] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700 relative">
        {/* Speaker / Notch bar */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-32 h-5 bg-slate-950 rounded-full flex items-center justify-center gap-2 z-20">
          <div className="w-10 h-1 bg-slate-800 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800"></div>
        </div>

        {/* Screen */}
        <div className="w-full bg-slate-50 rounded-[36px] overflow-hidden text-slate-800 flex flex-col min-h-[660px] max-h-[720px] relative">
          {/* Top Status Bar */}
          <div className="pt-4 px-6 pb-2 flex justify-between items-center text-[11px] font-mono text-slate-500 bg-white border-b border-slate-100">
            <span>09:41</span>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          {/* Mobile App Header */}
          <div className="bg-emerald-800 text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-emerald-700/60 rounded-lg">
                <Shield className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <div className="text-sm font-bold tracking-tight">HUNRE Mobile PKI</div>
                <div className="text-[10px] text-emerald-200">Bảo mật Keystore / Enclave</div>
              </div>
            </div>
            {/* OS Selector */}
            <div className="flex items-center bg-emerald-900/60 p-0.5 rounded-md text-[10px]">
              <button
                onClick={() => setOsType('android')}
                className={`px-2 py-0.5 rounded cursor-pointer ${osType === 'android' ? 'bg-emerald-600 font-bold text-white' : 'text-emerald-300'}`}
              >
                Android
              </button>
              <button
                onClick={() => setOsType('ios')}
                className={`px-2 py-0.5 rounded cursor-pointer ${osType === 'ios' ? 'bg-emerald-600 font-bold text-white' : 'text-emerald-300'}`}
              >
                iOS
              </button>
            </div>
          </div>

          {/* Scrollable Screen Content */}
          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            {/* Key & Certificate Status Card */}
            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Vùng lưu trữ khóa mật mã</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {osType === 'android' ? 'Android Keystore' : 'iOS Secure Enclave'}
                </span>
              </div>

              {keyPair ? (
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600 text-[11px]">
                    <span>Thuật toán:</span>
                    <span className="font-mono font-semibold text-slate-800">RSA 2048-bit</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 text-[11px]">
                    <span>Chữ ký:</span>
                    <span className="font-mono font-semibold text-slate-800">SHA256withRSA</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 text-[11px]">
                    <span>Khóa bí mật (Private Key):</span>
                    <span className="text-emerald-700 font-medium">Bảo vệ phần cứng ✓</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 text-[11px]">
                    <span>Sinh trắc học:</span>
                    <div className="flex items-center gap-1">
                      <select
                        value={biometricMethod}
                        onChange={(e) => setBiometricMethod(e.target.value as any)}
                        className="text-[10px] bg-slate-100 border border-slate-200 rounded px-1 py-0.5"
                      >
                        <option value="Fingerprint">Vân tay (Touch ID)</option>
                        <option value="FaceID">Khuôn mặt (Face ID)</option>
                      </select>
                    </div>
                  </div>

                  {certificate && (
                    <div className="pt-2 border-t border-slate-100 text-[11px] space-y-1">
                      <div className="text-[10px] font-semibold text-slate-700">Chứng thư số X.509:</div>
                      <div className="bg-slate-50 p-1.5 rounded text-[10px] space-y-0.5 font-mono text-slate-600">
                        <div>Chủ thể: <span className="font-bold text-slate-800">{certificate.subject.commonName}</span></div>
                        <div>Cấp bởi: {certificate.issuer.commonName}</div>
                        <div className="truncate">Serial: {certificate.serialNumber.substring(0, 16)}...</div>
                        <div className="text-emerald-600 font-sans font-semibold">Trạng thái: Hoạt động hợp lệ ✓</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-3 space-y-2">
                  <p className="text-xs text-slate-500">
                    Chưa tạo cặp khóa RSA trên thiết bị này. Khởi tạo để bắt đầu ký số.
                  </p>
                  <button
                    onClick={handleGenerateKey}
                    disabled={isGeneratingKey}
                    className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isGeneratingKey ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Đang sinh khóa RSA...</span>
                      </>
                    ) : (
                      <>
                        <Key className="w-3.5 h-3.5" />
                        <span>Tạo cặp khóa trong Enclave</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Pending Signing Queue */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Yêu cầu ký số từ Web</span>
                <span className="text-[11px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  {pendingDocuments.length} chờ xử lý
                </span>
              </div>

              {pendingDocuments.length === 0 ? (
                <div className="bg-white rounded-xl p-4 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  Không có yêu cầu ký nào đang chờ. Gửi văn bản từ Cổng Quản lý Tài liệu để ký.
                </div>
              ) : (
                pendingDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs space-y-2 hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-900 line-clamp-1">{doc.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{doc.code}</div>
                      </div>
                      <span className="shrink-0 text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        Cần ký duyệt
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 line-clamp-2">
                      {doc.description}
                    </div>

                    <div className="bg-slate-50 p-1.5 rounded text-[10px] font-mono text-slate-500 truncate">
                      SHA256: {doc.originalHashSha256.substring(0, 24)}...
                    </div>

                    <button
                      onClick={() => handleStartSign(doc)}
                      disabled={!keyPair || !certificate}
                      className={`w-full py-1.5 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        keyPair && certificate
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Fingerprint className="w-3.5 h-3.5" />
                      <span>{keyPair && certificate ? 'Xác thực sinh trắc & Ký' : 'Cần kích hoạt chứng thư'}</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            {statusMessage && (
              <div className="text-[10px] text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                {statusMessage}
              </div>
            )}
          </div>

          {/* Bottom Simulated Navigation */}
          <div className="bg-white border-t border-slate-200 py-2 px-6 flex justify-around items-center text-[10px] text-slate-500">
            <div className="flex flex-col items-center text-emerald-700 font-bold">
              <Shield className="w-4 h-4" />
              <span>Ký số PKI</span>
            </div>
            <div className="flex flex-col items-center">
              <FileText className="w-4 h-4" />
              <span>Văn bản</span>
            </div>
            <div className="flex flex-col items-center">
              <Smartphone className="w-4 h-4" />
              <span>Thiết bị</span>
            </div>
          </div>

          {/* Biometric Prompt Overlay Modal (Simulated BiometricPrompt / FaceID) */}
          {isBiometricPromptOpen && selectedPendingDoc && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex items-end sm:items-center justify-center z-30 p-4">
              <div className="bg-white w-full rounded-2xl p-5 space-y-4 shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Fingerprint className={`w-7 h-7 ${biometricScanning ? 'animate-pulse text-emerald-500' : ''}`} />
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    Xác thực {biometricMethod === 'Fingerprint' ? 'Vân tay' : 'Khuôn mặt Face ID'}
                  </div>
                  <div className="text-xs text-slate-500">
                    Mở khóa Android Keystore để ký số tài liệu
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg text-xs space-y-1">
                  <div className="font-semibold text-slate-800">{selectedPendingDoc.title}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Băm: {selectedPendingDoc.originalHashSha256.substring(0, 20)}...</div>
                  <div className="text-[11px] text-emerald-700 font-medium">Người ký: {certificate?.subject.commonName}</div>
                </div>

                {biometricScanning ? (
                  <div className="text-center py-2 text-xs font-medium text-emerald-700 flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang đối chiếu vân tay với chip bảo mật...</span>
                  </div>
                ) : biometricSuccess ? (
                  <div className="text-center py-2 text-xs font-bold text-emerald-700 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Xác thực thành công! Đang tạo chữ ký RSA...</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={handlePerformBiometricAuth}
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                    >
                      <Fingerprint className="w-4 h-4" />
                      <span>Chạm cảm biến để ký số</span>
                    </button>
                    <button
                      onClick={() => setIsBiometricPromptOpen(false)}
                      className="w-full py-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    >
                      Hủy bỏ
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

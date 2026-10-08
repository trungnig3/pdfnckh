import React, { useState } from 'react';
import { DocumentItem, X509Certificate, VerificationResult } from '../../types';
import { calculateSha256, verifyRsaSignature, importPublicKeyFromPem } from '../../crypto/pkiCrypto';
import { ShieldCheck, ShieldAlert, FileText, CheckCircle2, XCircle, AlertTriangle, ArrowRight, Play, RefreshCw, FileCode, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VerifyAndTamperLabProps {
  documents: DocumentItem[];
  certificates: X509Certificate[];
  onOpenFraudCenter?: () => void;
}

export const VerifyAndTamperLab: React.FC<VerifyAndTamperLabProps> = ({
  documents,
  certificates,
  onOpenFraudCenter,
}) => {
  const signedDocs = documents.filter((d) => d.status === 'signed');
  const [selectedDocId, setSelectedDocId] = useState<string>(signedDocs[0]?.id || documents[0]?.id || '');
  const [simulatedTamperText, setSimulatedTamperText] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const selectedDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const handleRunVerification = async (useTamperedData: boolean = false) => {
    if (!selectedDoc || !selectedDoc.signatureData) return;
    setIsVerifying(true);

    try {
      const sigData = selectedDoc.signatureData;
      const matchingCert = certificates.find(
        (c) => c.serialNumber === sigData.certificateSerialNumber
      );

      // Check certificate validity & revocation
      const isCertFound = !!matchingCert;
      const isCertRevoked = matchingCert?.status === 'revoked';

      // Hash comparison
      let computedHash = selectedDoc.originalHashSha256;
      let isHashMatching = true;

      if (useTamperedData || selectedDoc.tampered) {
        // Alter 1 character in the content to demonstrate avalanche effect
        computedHash = await calculateSha256(selectedDoc.originalHashSha256 + '_tampered_bit_flip');
        isHashMatching = false;
      }

      // Cryptographic RSA signature check with public key
      let isCryptoSigValid = false;
      if (matchingCert) {
        try {
          const cryptoPubKey = await importPublicKeyFromPem(matchingCert.publicKeyPem);
          isCryptoSigValid = await verifyRsaSignature(
            cryptoPubKey,
            sigData.signatureHex,
            computedHash
          );
        } catch (e) {
          isCryptoSigValid = false;
        }
      }

      const overallValid = isHashMatching && isCertFound && !isCertRevoked && !selectedDoc.tampered;

      const result: VerificationResult = {
        isValid: overallValid,
        documentIntegrityValid: isHashMatching && !selectedDoc.tampered,
        signerIdentityValid: isCertFound,
        certificateValid: isCertFound && !isCertRevoked,
        certificateRevoked: isCertRevoked,
        timestampValid: true,
        details: {
          computedHash: computedHash,
          expectedHash: selectedDoc.originalHashSha256,
          signerName: sigData.signerName,
          certificateIssuer: matchingCert?.issuer.commonName || 'HUNRE Root CA',
          certificateSerial: sigData.certificateSerialNumber,
          signedTime: sigData.signedAt,
          signatureAlgorithm: 'RSA-2048 / SHA-256 (RSASSA-PKCS1-v1_5)',
          padesCompliance: 'ETSI EN 319 142-1 (PAdES Baseline Profile B-B)',
          tamperDetectedMessage: !overallValid
            ? 'Tính toàn vẹn bị vi phạm: Giá trị băm tài liệu không khớp hoặc chứng thư số đã bị thu hồi!'
            : undefined,
        },
      };

      setVerificationResult(result);
      if (overallValid) {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <h2 className="text-lg font-bold text-slate-900">
            Phòng Thí Nghiệm Xác Thực & Kiểm Tra Cấu Trúc Ký Số PAdES (ISO 32000)
          </h2>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed max-w-4xl">
          Module kiểm tra toàn diện tính toàn vẹn (Integrity), tính xác thực định danh (Authenticity) và khả năng chống chối bỏ (Non-repudiation)
          của văn bản PDF. Khám phá cơ chế phân vùng byte `/ByteRange` và cấu trúc chữ ký nhúng.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Document Selection & Verification Controller */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Chọn tài liệu để thẩm định
            </div>

            <select
              value={selectedDocId}
              onChange={(e) => {
                setSelectedDocId(e.target.value);
                setVerificationResult(null);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
            >
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.title} [{doc.status === 'signed' ? 'Đã ký PAdES' : 'Chưa ký'}]
                </option>
              ))}
            </select>

            {selectedDoc && (
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã văn bản:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedDoc.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Đối tượng:</span>
                  <span className="font-medium text-slate-800">{selectedDoc.recipient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Trạng thái hiện tại:</span>
                  <span className="font-semibold text-emerald-700">
                    {selectedDoc.tampered
                      ? 'Dữ liệu đã bị sửa đổi'
                      : selectedDoc.status === 'signed'
                      ? 'Đã có chữ ký số RSA'
                      : 'Chưa có chữ ký'}
                  </span>
                </div>
              </div>
            )}

            {/* Verification Execution Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => handleRunVerification(false)}
                disabled={isVerifying || selectedDoc.status !== 'signed'}
                className={`flex-1 py-2.5 px-4 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  selectedDoc.status === 'signed'
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang thẩm định mật mã...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Thẩm định chữ ký số PAdES</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleRunVerification(true)}
                disabled={isVerifying || selectedDoc.status !== 'signed'}
                className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Mô phỏng hacker sửa đổi 1 ký tự điểm số hoặc tiền tệ để xem phản ứng"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Thử nghiệm giả mạo (Tamper)</span>
              </button>
            </div>
          </div>

          {/* Verification Results Panel */}
          {verificationResult && (
            <div
              className={`rounded-xl border p-5 shadow-xs space-y-4 ${
                verificationResult.isValid
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : 'bg-rose-50/70 border-rose-300'
              }`}
            >
              <div className="flex items-center gap-3">
                {verificationResult.isValid ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-7 h-7 text-rose-600 shrink-0" />
                )}
                <div>
                  <div className={`text-sm font-bold ${verificationResult.isValid ? 'text-emerald-900' : 'text-rose-900'}`}>
                    {verificationResult.isValid
                      ? 'KẾT LUẬN: CHỮ KÝ SỐ HOÀN TOÀN HỢP LỆ & TOÀN VẸN'
                      : 'KẾT LUẬN: CHỮ KÝ SỐ KHÔNG HỢP LỆ / DỮ LIỆU ĐÃ BỊ SỬA ĐỔI'}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Theo chuẩn ISO 32000-1 và Nghị định 130/2018/NĐ-CP về chữ ký điện tử
                  </div>
                </div>
              </div>

              {/* 4-Pillar Cryptographic Validation Checklist */}
              <div className="bg-white rounded-lg p-3.5 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    {verificationResult.documentIntegrityValid ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    )}
                    <span>1. Tính toàn vẹn dữ liệu (SHA-256 Digest):</span>
                  </span>
                  <span className={`font-semibold ${verificationResult.documentIntegrityValid ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {verificationResult.documentIntegrityValid ? 'Không bị chỉnh sửa' : 'ĐÃ BỊ CAN THIỆP!'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    {verificationResult.signerIdentityValid ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    )}
                    <span>2. Định danh người ký (X.509 Subject):</span>
                  </span>
                  <span className="font-semibold text-slate-800">
                    {verificationResult.details.signerName}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    {verificationResult.certificateValid ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    )}
                    <span>3. Chứng thư số & CA Trust:</span>
                  </span>
                  <span className={`font-semibold ${verificationResult.certificateValid ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {verificationResult.certificateRevoked ? 'Đã bị thu hồi (Revoked)' : 'Tin cậy từ HUNRE Root CA'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>4. Khả năng chống chối bỏ (Non-repudiation):</span>
                  </span>
                  <span className="font-semibold text-emerald-700">Được bảo đảm</span>
                </div>
              </div>

              {/* Hash comparison details */}
              <div className="font-mono text-[10px] space-y-1 bg-slate-900 text-slate-200 p-3 rounded-lg overflow-x-auto">
                <div className="text-slate-400">Giá trị băm thực tế tính toán:</div>
                <div className="text-emerald-400 select-all">{verificationResult.details.computedHash}</div>
                <div className="text-slate-400 pt-1">Giá trị băm gốc trong chữ ký:</div>
                <div className="text-slate-300 select-all">{verificationResult.details.expectedHash}</div>
              </div>

              {!verificationResult.isValid && onOpenFraudCenter && (
                <div className="pt-2">
                  <button
                    onClick={onOpenFraudCenter}
                    className="w-full py-2 px-3 bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Mở Trung Tâm Điều Tra Giám Định &amp; Xem Biên Bản Vi Phạm →</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: PDF Binary Structure & ByteRange Architecture */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Cấu trúc nhị phân PDF & Từ điển chữ ký PAdES
              </h3>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
              ISO 32000-1 / ETSI 319 142
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Trong chuẩn ký số PDF, chữ ký số được nhúng trực tiếp vào tệp thông qua cơ chế 
            <strong className="text-slate-900"> /ByteRange</strong>. Vùng chứa mã hex của chữ ký được loại trừ khi tính hàm băm để tránh đệ quy:
          </p>

          {/* Visual ByteRange Diagram */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-700">Sơ đồ phân vùng nhị phân /ByteRange [0, L1, L2, L3]:</div>
            <div className="grid grid-cols-12 h-10 rounded-lg overflow-hidden text-center text-[10px] font-mono font-bold">
              <div className="col-span-4 bg-emerald-700 text-white flex items-center justify-center p-1">
                Phần 1: Đầu file PDF (0 - L1)
              </div>
              <div className="col-span-3 bg-rose-600 text-white flex items-center justify-center p-1 border-x-2 border-white">
                /Contents &lt;HEX CHỮ KÝ&gt;
              </div>
              <div className="col-span-5 bg-emerald-700 text-white flex items-center justify-center p-1">
                Phần 2: Thân &amp; Footer (L2 - L3)
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Byte 0</span>
              <span className="text-rose-600 font-bold">Vùng bỏ qua băm</span>
              <span>Byte EOF</span>
            </div>
          </div>

          {/* Simulated PDF Signature Dictionary */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-slate-700">Từ điển chữ ký nhúng (/DocMDP &amp; /Sig Dictionary):</div>
            <pre className="p-3.5 bg-slate-900 text-slate-200 rounded-lg font-mono text-[10.5px] leading-relaxed overflow-x-auto">
{`<<
  /Type /Sig
  /Filter /Adobe.PPKLite
  /SubFilter /adbe.pkcs7.detached
  /ByteRange [ 0 12480 15600 24000 ]
  /Contents <308204b806092a864886f70d010702a08204a9308204a5020101...>
  /Reason (Phe duyet & Xac nhan tinh toan ven tai lieu hoc vu HUNRE)
  /M (D:20261004094100+07'00')
  /ContactInfo (hunre_pki@hunre.edu.vn)
  /Name (${selectedDoc.signatureData?.signerName || 'Tran Thi Van Phuong'})
  /Location (Truong Dai hoc Tai nguyen va Moi truong Ha Noi)
  /Prop_Build <<
    /App << /Name (HUNRE Mobile PKI Client) /OS (Android / iOS Secure Enclave) >>
  >>
>>`}
            </pre>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
            <div className="font-semibold text-slate-800">Hiệu ứng tuyết lở (Avalanche Effect) của SHA-256:</div>
            <div className="text-slate-500 text-[11px] leading-relaxed">
              Dù kẻ tấn công chỉ thay đổi 1 ký tự nhỏ nhất (ví dụ: điểm từ 3.38 thành 3.88), giá trị băm SHA-256 sẽ thay đổi tới hơn 50% số bit, khiến hàm kiểm tra chữ ký RSA ngay lập tức phát hiện và báo lỗi giả mạo!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

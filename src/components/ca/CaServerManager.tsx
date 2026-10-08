import React, { useState } from 'react';
import { X509Certificate } from '../../types';
import { Shield, Key, CheckCircle, XCircle, AlertTriangle, Download, Plus, Search, FileCheck, ArrowUpRight } from 'lucide-react';

interface CaServerManagerProps {
  certificates: X509Certificate[];
  onRevokeCertificate: (id: string, reason: string) => void;
  onRestoreCertificate: (id: string) => void;
  onIssueNewCertificate: (subjectData: {
    commonName: string;
    organization: string;
    organizationalUnit: string;
    email: string;
    country: string;
  }) => void;
}

export const CaServerManager: React.FC<CaServerManagerProps> = ({
  certificates,
  onRevokeCertificate,
  onRestoreCertificate,
  onIssueNewCertificate,
}) => {
  const [selectedCert, setSelectedCert] = useState<X509Certificate | null>(certificates[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [newCertForm, setNewCertForm] = useState({
    commonName: '',
    organization: 'Trường Đại học Tài nguyên và Môi trường Hà Nội',
    organizationalUnit: 'Khoa Công nghệ Thông tin',
    email: '',
    country: 'VN',
  });

  const filteredCerts = certificates.filter(
    (c) =>
      c.subject.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertForm.commonName || !newCertForm.email) return;
    onIssueNewCertificate(newCertForm);
    setIsIssueModalOpen(false);
    setNewCertForm({
      commonName: '',
      organization: 'Trường Đại học Tài nguyên và Môi trường Hà Nội',
      organizationalUnit: 'Khoa Công nghệ Thông tin',
      email: '',
      country: 'VN',
    });
  };

  const handleDownloadPem = (cert: X509Certificate) => {
    const certContent = `-----BEGIN CERTIFICATE-----\nMIICljCCAX4CCQDU...[HUNRE X.509 v3 CERTIFICATE]\nSubject: CN=${cert.subject.commonName}, O=${cert.subject.organization}, OU=${cert.subject.organizationalUnit}\nIssuer: CN=${cert.issuer.commonName}\nSerial: ${cert.serialNumber}\nAlgorithm: ${cert.signatureAlgorithm}\nFingerprint: ${cert.sha256Fingerprint}\n-----END CERTIFICATE-----\n\n${cert.publicKeyPem}`;
    const blob = new Blob([certContent], { type: 'application/x-x509-ca-cert' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HUNRE_Cert_${cert.subject.commonName.replace(/\s+/g, '_')}.crt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & CA Hierarchy */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-700" />
              <h2 className="text-lg font-bold text-slate-900">
                Máy Chủ Chứng Thực Số Nội Bộ (HUNRE PKI CA Authority Server)
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Quản lý vòng đời chứng thư số X.509 v3, cấp phát định danh cho giảng viên, sinh viên và hệ thống ký số PAdES.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsIssueModalOpen(true)}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Cấp mới chứng thư số</span>
            </button>
          </div>
        </div>

        {/* CA Trust Chain Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Root CA (Gốc)</div>
            <div className="font-bold text-slate-900">HUNRE Root Certificate Authority</div>
            <div className="text-[11px] text-slate-600">RSA 4096-bit · Tự ký (Self-signed)</div>
            <div className="text-[10px] text-emerald-700 font-medium">Trạng thái: Hoạt động tin cậy (Trust Store)</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Intermediate CA</div>
            <div className="font-bold text-slate-900">HUNRE Academic Issuing CA</div>
            <div className="text-[11px] text-slate-600">RSA 2048-bit · Ký bởi Root CA</div>
            <div className="text-[10px] text-emerald-700 font-medium">Cấp phát chứng thư người dùng cuối</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Dịch vụ xác thực CRL & OCSP</div>
            <div className="font-bold text-slate-900">Danh sách thu hồi chứng thư</div>
            <div className="text-[11px] text-slate-600">Giao thức RFC 5280 / RFC 6960</div>
            <div className="text-[10px] text-emerald-700 font-medium">Kiểm tra thu hồi theo thời gian thực</div>
          </div>
        </div>
      </div>

      {/* Main Content: Certificate List and Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Certificate List */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Danh sách chứng thư X.509 ({certificates.length})
              </span>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm theo tên, email, serial..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[560px]">
            {filteredCerts.map((cert) => {
              const isSelected = selectedCert?.id === cert.id;
              const isRevoked = cert.status === 'revoked';
              return (
                <div
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className={`p-3.5 transition-colors cursor-pointer text-xs space-y-1.5 ${
                    isSelected ? 'bg-emerald-50/80 border-l-4 border-emerald-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold text-slate-900 line-clamp-1">
                      {cert.subject.commonName}
                    </div>
                    {isRevoked ? (
                      <span className="text-[10px] font-medium text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 shrink-0">
                        Đã thu hồi
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                        Hợp lệ
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500">
                    {cert.subject.organizationalUnit}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>SN: {cert.serialNumber.substring(0, 12)}...</span>
                    <span>Hết hạn: {cert.validTo}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificate Detailed Inspector */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
          {selectedCert ? (
            <>
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-base font-bold text-slate-900">
                      {selectedCert.subject.commonName}
                    </h3>
                  </div>
                  <div className="text-xs text-slate-500">
                    Thuộc: {selectedCert.subject.organizationalUnit} · {selectedCert.subject.organization}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadPem(selectedCert)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                    title="Tải tệp chứng thư số (.crt / .pem)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất CRT</span>
                  </button>

                  {selectedCert.status === 'valid' ? (
                    <button
                      onClick={() => onRevokeCertificate(selectedCert.id, 'Người dùng thông báo đổi thiết bị')}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                    >
                      Thu hồi chứng thư (Revoke)
                    </button>
                  ) : (
                    <button
                      onClick={() => onRestoreCertificate(selectedCert.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                    >
                      Phục hồi chứng thư
                    </button>
                  )}
                </div>
              </div>

              {/* Status Alert if revoked */}
              {selectedCert.status === 'revoked' && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Chứng thư đã bị thu hồi trong Danh sách CRL của HUNRE CA</span>
                  </div>
                  <div className="text-[11px]">
                    Ngày thu hồi: {selectedCert.revocationDate} · Lý do: {selectedCert.revocationReason}
                  </div>
                </div>
              )}

              {/* Technical X.509 Fields */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Chi tiết cấu trúc X.509 v3 Certificate
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-[10px] text-slate-500 uppercase">Serial Number</div>
                    <div className="font-mono font-medium text-slate-800 truncate">{selectedCert.serialNumber}</div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-[10px] text-slate-500 uppercase">Thuật toán chữ ký CA</div>
                    <div className="font-mono font-medium text-slate-800">{selectedCert.signatureAlgorithm}</div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-[10px] text-slate-500 uppercase">Thời hạn hiệu lực (Validity)</div>
                    <div className="font-mono text-slate-800">{selectedCert.validFrom} đến {selectedCert.validTo}</div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-[10px] text-slate-500 uppercase">Khóa công khai (Public Key)</div>
                    <div className="font-mono text-slate-800">RSA {selectedCert.keySize} bits (Exponent: 65537)</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1.5">
                  <div className="text-[10px] text-slate-500 uppercase">X.509 Extensions & Key Usage</div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedCert.keyUsage.map((u, i) => (
                      <span key={i} className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                        {u}
                      </span>
                    ))}
                    <span className="text-[10px] font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-emerald-800">
                      Adobe PDF Signing (1.2.840.113583.1.1.5)
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase">Dấu vân tay băm SHA-256 (Thumbprint)</div>
                  <div className="font-mono text-[11px] text-slate-800 break-all select-all">
                    {selectedCert.sha256Fingerprint}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase">Định dạng PEM Public Key</div>
                  <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-[10px] rounded-lg overflow-x-auto max-h-36">
                    {selectedCert.publicKeyPem}
                  </pre>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Chọn một chứng thư trong danh sách bên trái để kiểm tra chi tiết.
            </div>
          )}
        </div>
      </div>

      {/* Modal Cấp Mới Chứng Thư Số */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-700" />
                <span>Cấp mới Chứng thư số X.509 v3</span>
              </h3>
              <button
                onClick={() => setIsIssueModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-slate-700">Họ và tên chủ thể (Common Name - CN)</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: ThS. Nguyễn Văn Hách"
                  value={newCertForm.commonName}
                  onChange={(e) => setNewCertForm({ ...newCertForm, commonName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-700">Email học vụ / cơ quan</label>
                <input
                  type="email"
                  required
                  placeholder="Ví dụ: nvhach@hunre.edu.vn"
                  value={newCertForm.email}
                  onChange={(e) => setNewCertForm({ ...newCertForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-700">Đơn vị / Khoa / Phòng ban (OU)</label>
                <input
                  type="text"
                  value={newCertForm.organizationalUnit}
                  onChange={(e) => setNewCertForm({ ...newCertForm, organizationalUnit: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-700">Tổ chức phát hành (O)</label>
                <input
                  type="text"
                  value={newCertForm.organization}
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg cursor-pointer"
                >
                  Cấp phát chứng thư
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

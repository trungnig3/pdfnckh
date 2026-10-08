import React, { useState } from 'react';
import { DocumentItem, FraudIncident, X509Certificate } from '../../types';
import { calculateSha256 } from '../../crypto/pkiCrypto';
import { generateFraudIncidentPdfReport, downloadPdfBlob } from '../../services/pdfService';
import {
  ShieldAlert,
  AlertTriangle,
  FileX2,
  FileCheck2,
  Download,
  Search,
  ExternalLink,
  Flame,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FraudInvestigationCenterProps {
  incidents: FraudIncident[];
  documents: DocumentItem[];
  certificates: X509Certificate[];
  onTriggerAttackSimulation: (
    docId: string,
    attackType: FraudIncident['attackType'],
    tamperedChanges: { title?: string; gpa?: string; amount?: string; name?: string }
  ) => Promise<FraudIncident>;
  onClearIncident?: (id: string) => void;
}

export const FraudInvestigationCenter: React.FC<FraudInvestigationCenterProps> = ({
  incidents,
  documents,
  certificates,
  onTriggerAttackSimulation,
}) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simTargetDocId, setSimTargetDocId] = useState<string>(
    documents.find((d) => d.status === 'signed')?.id || documents[0]?.id || ''
  );
  const [simAttackType, setSimAttackType] = useState<FraudIncident['attackType']>('GPA_FRAUD');
  const [simGpaValue, setSimGpaValue] = useState('4.00 (Thủ khoa giả mạo)');
  const [simAmountValue, setSimAmountValue] = useState('1.000.000 VNĐ (Hạ 90% học phí)');
  const [simNameValue, setSimNameValue] = useState('Nguyễn Văn Giả Mạo (Tráo danh tính)');
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);

  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  const filteredIncidents = incidents.filter(
    (inc) =>
      inc.documentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.documentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.claimedSigner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRunAttackSimulation = async () => {
    setIsSimulating(true);
    try {
      const createdIncident = await onTriggerAttackSimulation(simTargetDocId, simAttackType, {
        gpa: simGpaValue,
        amount: simAmountValue,
        name: simNameValue,
      });
      setSelectedIncidentId(createdIncident.id);
    } catch (err: any) {
      alert('Lỗi mô phỏng tấn công: ' + err.message);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleDownloadForensicPdf = async (incident: FraudIncident) => {
    try {
      setIsDownloadingReport(true);
      const pdfBlob = await generateFraudIncidentPdfReport(incident);
      downloadPdfBlob(pdfBlob, `HUNRE_BIEN_BAN_GIA_MAO_${incident.id.toUpperCase()}.pdf`);
    } catch (err: any) {
      alert('Lỗi tải báo cáo: ' + err.message);
    } finally {
      setIsDownloadingReport(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Alert */}
      <div className="bg-white rounded-xl border border-rose-200 p-6 shadow-xs relative overflow-hidden space-y-3">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Trung Tâm Điều Tra Giám Định &amp; Xử Lý Tài Liệu Giả Mạo (SOC / DFIR HUNRE)
              </h1>
            </div>
            <p className="text-xs text-slate-600 max-w-4xl leading-relaxed">
              Cơ chế phát hiện và ngăn chặn theo thời gian thực: Khi kẻ gian đánh cắp tài liệu đã được ký số trên di động, chỉnh sửa nội dung 
              (điểm số, tài chính, người thụ hưởng) rồi giả mạo nộp lại hệ thống, lõi mật mã sẽ tự động phát hiện vi phạm băm SHA-256, 
              lập hồ sơ chứng cứ pháp lý và xuất Biên bản Báo cáo Giả mạo chính thức.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>{incidents.length} Vụ vi phạm đã ghi nhận</span>
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Sandbox */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Mô Phỏng Kịch Bản Kẻ Gian Đánh Cắp &amp; Sửa Đổi Tài Liệu (Attack Sandbox)
            </h2>
          </div>
          <span className="text-[11px] text-slate-500">
            Thử nghiệm thực tế khả năng tự vệ của hệ thống PKI
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">1. Chọn văn bản bị đánh cắp</label>
            <select
              value={simTargetDocId}
              onChange={(e) => setSimTargetDocId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500"
            >
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.title} ({doc.code}) [{doc.status === 'signed' ? 'Đã ký di động' : 'Chưa ký'}]
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">2. Phương thức giả mạo</label>
            <select
              value={simAttackType}
              onChange={(e) => setSimAttackType(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500"
            >
              <option value="GPA_FRAUD">Sửa đổi điểm GPA &amp; Xếp loại học tập</option>
              <option value="FINANCIAL_ALTERATION">Hạ thấp số tiền đóng học phí</option>
              <option value="UNAUTHORIZED_SUBMISSION">Tráo đổi danh tính người thụ hưởng</option>
              <option value="CONTENT_MANIPULATION">Can thiệp quyết định học vụ</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">3. Nội dung kẻ gian sửa đổi</label>
            {simAttackType === 'GPA_FRAUD' && (
              <input
                type="text"
                value={simGpaValue}
                onChange={(e) => setSimGpaValue(e.target.value)}
                placeholder="Giá trị điểm giả mạo"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            )}
            {simAttackType === 'FINANCIAL_ALTERATION' && (
              <input
                type="text"
                value={simAmountValue}
                onChange={(e) => setSimAmountValue(e.target.value)}
                placeholder="Số tiền biên lai giả"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            )}
            {(simAttackType === 'UNAUTHORIZED_SUBMISSION' || simAttackType === 'CONTENT_MANIPULATION') && (
              <input
                type="text"
                value={simNameValue}
                onChange={(e) => setSimNameValue(e.target.value)}
                placeholder="Tên kẻ mạo danh"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            )}
          </div>

          <div className="flex items-end">
            <button
              onClick={handleRunAttackSimulation}
              disabled={isSimulating}
              className="w-full py-2 px-4 bg-rose-700 hover:bg-rose-800 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang phân tích gian lận...</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Kích hoạt tấn công &amp; Báo cáo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Investigation Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Incident Registry List */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Sổ Nhật Ký Giám Sát Giả Mạo ({incidents.length})
              </span>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm mã vụ việc, mã văn bản..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[580px]">
            {filteredIncidents.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Chưa có vụ việc giả mạo nào. Hãy sử dụng bảng mô phỏng ở trên để kiểm thử.
              </div>
            ) : (
              filteredIncidents.map((incident) => {
                const isSelected = selectedIncident?.id === incident.id;
                return (
                  <div
                    key={incident.id}
                    onClick={() => setSelectedIncidentId(incident.id)}
                    className={`p-4 transition-colors cursor-pointer text-xs space-y-2 ${
                      isSelected
                        ? 'bg-rose-50/70 border-l-4 border-rose-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-slate-900 line-clamp-1">
                        {incident.documentTitle}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded shrink-0">
                        {incident.severity}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 line-clamp-1">
                      Kẻ gian can thiệp: <strong className="text-rose-700">{incident.attackType}</strong>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Mã hồ sơ: {incident.id.toUpperCase()}</span>
                      <span>{new Date(incident.detectedAt).toLocaleTimeString('vi-VN')}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Forensic Dossier & Side-by-Side Comparison */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          {selectedIncident ? (
            <>
              {/* Header Dossier */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold bg-rose-600 text-white px-2 py-0.5 rounded">
                      CẢNH BÁO GIẢ MẠO
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      Hồ sơ: DFIR-{selectedIncident.id.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900">
                    {selectedIncident.documentTitle} ({selectedIncident.documentCode})
                  </h2>
                  <div className="text-xs text-slate-500">
                    Phát hiện lúc: {new Date(selectedIncident.detectedAt).toLocaleString('vi-VN')} · Người ký hợp pháp bị mạo danh: <strong className="text-slate-800">{selectedIncident.claimedSigner}</strong>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadForensicPdf(selectedIncident)}
                  disabled={isDownloadingReport}
                  className="px-3.5 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất Biên Bản Giám Định (PDF)</span>
                </button>
              </div>

              {/* Side-by-Side Forensic Evidence */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Đối chiếu pháp y nội dung (Original vs Tampered Content)
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Authentic Document */}
                  <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-300 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <FileCheck2 className="w-4 h-4 text-emerald-600" />
                      <span>BẢN CHÍNH HỢP PHÁP (KÝ TRÊN MOBILE)</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-emerald-200 text-slate-700 space-y-1 font-mono text-[11px]">
                      <div>{selectedIncident.originalDataSummary}</div>
                      <div className="text-emerald-700 font-semibold font-sans pt-1">
                        ✓ Chữ ký số RSA-2048 hợp chuẩn PAdES
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 break-all">
                      SHA256: {selectedIncident.originalHash}
                    </div>
                  </div>

                  {/* Counterfeit / Tampered Document */}
                  <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-300 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 text-rose-800 font-bold">
                      <FileX2 className="w-4 h-4 text-rose-600" />
                      <span>BẢN GIẢ MẠO BỊ ĐÁNH CẮP &amp; SỬA ĐỔI</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-rose-200 text-slate-700 space-y-1 font-mono text-[11px]">
                      <div className="text-rose-700 font-bold">{selectedIncident.tamperedDataSummary}</div>
                      <div className="text-rose-700 font-semibold font-sans pt-1">
                        ✕ Chữ ký RSA bị vô hiệu hóa hoàn toàn
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-rose-600 font-bold break-all">
                      SHA256: {selectedIncident.tamperedHash}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cryptographic Proof Details */}
              <div className="bg-slate-900 rounded-xl p-4 text-slate-200 text-xs font-mono space-y-2">
                <div className="text-emerald-400 text-[11px] font-bold uppercase">
                  Chứng cứ toán học &amp; Thuật toán mật mã (Cryptographic Verification Log)
                </div>
                <div className="text-slate-300 text-[11px] leading-relaxed">
                  {selectedIncident.forensicAnalysisNotes}
                </div>
                <div className="text-amber-400 text-[10px] pt-1">
                  Độ phân kỳ bit của hàm băm (Avalanche divergence): {selectedIncident.bitDifferencePercentage}% bit thay đổi.
                </div>
              </div>

              {/* Actions Taken */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-800 uppercase tracking-wide">
                  Các biện pháp xử lý an ninh thông tin đã tự động kích hoạt:
                </div>
                <ul className="space-y-1.5 text-slate-600 pl-1">
                  {selectedIncident.actionsTaken.map((action, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs">
              Chọn một vụ việc trong danh sách để xem hồ sơ điều tra chi tiết.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

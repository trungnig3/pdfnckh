import React, { useState } from 'react';
import { DocumentItem, DocumentSignature, X509Certificate } from '../../types';
import { generateOfficialHunrePdf, downloadPdfBlob } from '../../services/pdfService';
import { calculateSha256 } from '../../crypto/pkiCrypto';
import { HunreRedSealStamp } from '../common/HunreSealSvg';
import {
  FileText,
  FileCheck2,
  Send,
  Download,
  ShieldCheck,
  AlertTriangle,
  Upload,
  Eye,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  FileSignature
} from 'lucide-react';

interface DocumentSignerPortalProps {
  documents: DocumentItem[];
  onSendToMobile: (docId: string) => void;
  onTamperDocument: (docId: string) => void;
  onRestoreDocument: (docId: string) => void;
  onUploadCustomPdf: (file: File) => Promise<void>;
  certificates: X509Certificate[];
  openMobilePrompt: () => void;
  onOpenFraudCenter?: () => void;
}

export const DocumentSignerPortal: React.FC<DocumentSignerPortalProps> = ({
  documents,
  onSendToMobile,
  onTamperDocument,
  onRestoreDocument,
  onUploadCustomPdf,
  certificates,
  openMobilePrompt,
  onOpenFraudCenter,
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfDownloadMessage, setPdfDownloadMessage] = useState<string>('');

  const selectedDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.recipient.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownloadPdf = async (doc: DocumentItem) => {
    try {
      setIsGeneratingPdf(true);
      setPdfDownloadMessage('Đang kết xuất tệp PDF theo chuẩn ISO 32000-1...');
      const matchingCert = certificates.find(
        (c) => c.serialNumber === doc.signatureData?.certificateSerialNumber
      );
      const { pdfBlob } = await generateOfficialHunrePdf(doc, doc.signatureData, matchingCert);
      downloadPdfBlob(pdfBlob, `${doc.code.replace(/[\/\\]/g, '_')}_signed.pdf`);
      setPdfDownloadMessage('Đã tải xuống thành công tệp PDF!');
      setTimeout(() => setPdfDownloadMessage(''), 3000);
    } catch (err: any) {
      console.error(err);
      setPdfDownloadMessage('Lỗi khi tải PDF: ' + err.message);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUploadCustomPdf(file);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome / Context Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <FileSignature className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Cổng Quản Lý & Ký Số Tài Liệu PDF Học Vụ HUNRE
            </h1>
          </div>
          <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
            Hệ thống hỗ trợ gửi yêu cầu ký số từ xa (Remote Signing) đến thiết bị di động của cán bộ, giảng viên và sinh viên. 
            Mã hóa chữ ký tuân thủ tiêu chuẩn quốc tế PAdES (ETSI EN 319 142) và ISO 32000-1.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300">
            <Upload className="w-3.5 h-3.5" />
            <span>Tải lên file PDF</span>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Main Workspace: Document List & Document Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Document Explorer List */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          {/* Controls: Search and Filters */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu, mã số, người nhận..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Segmented Filter Buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs overflow-x-auto">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-2.5 py-1 font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  filterCategory === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tất cả ({documents.length})
              </button>
              <button
                onClick={() => setFilterCategory('transcript')}
                className={`px-2.5 py-1 font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  filterCategory === 'transcript'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bảng điểm
              </button>
              <button
                onClick={() => setFilterCategory('decree')}
                className={`px-2.5 py-1 font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  filterCategory === 'decree'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Quyết định
              </button>
              <button
                onClick={() => setFilterCategory('receipt')}
                className={`px-2.5 py-1 font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  filterCategory === 'receipt'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Biên lai
              </button>
            </div>
          </div>

          {/* List items */}
          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[620px]">
            {filteredDocs.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              const isSigned = doc.status === 'signed';
              const isTampered = doc.tampered;

              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-4 transition-colors cursor-pointer text-xs space-y-2 ${
                    isSelected
                      ? 'bg-emerald-50/70 border-l-4 border-emerald-600'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-slate-900 line-clamp-1">
                      {doc.title}
                    </span>
                    {isTampered ? (
                      <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 shrink-0">
                        Bị can thiệp!
                      </span>
                    ) : isSigned ? (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                        Đã ký số PAdES
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 shrink-0">
                        Chờ ký duyệt
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500 line-clamp-1">
                    {doc.recipient}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{doc.code}</span>
                    <span>{(doc.fileSizeBytes / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Document Preview & Cryptographic Inspection */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          {selectedDoc ? (
            <>
              {/* Header Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="text-xs font-mono text-emerald-700 uppercase">
                    {selectedDoc.code}
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {selectedDoc.title}
                  </h2>
                  <div className="text-xs text-slate-500">
                    Đối tượng: {selectedDoc.recipient} · {selectedDoc.department}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadPdf(selectedDoc)}
                    disabled={isGeneratingPdf}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải PDF {selectedDoc.status === 'signed' ? 'đã ký' : 'gốc'}</span>
                  </button>

                  {selectedDoc.status === 'pending' && (
                    <button
                      onClick={() => {
                        onSendToMobile(selectedDoc.id);
                        openMobilePrompt();
                      }}
                      className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi ký Mobile</span>
                    </button>
                  )}
                </div>
              </div>

              {pdfDownloadMessage && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200">
                  {pdfDownloadMessage}
                </div>
              )}

              {/* Status Notice */}
              {selectedDoc.tampered ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs text-rose-900">
                  <div className="font-bold flex items-center gap-2 text-rose-700">
                    <AlertTriangle className="w-4 h-4" />
                    <span>CẢNH BÁO TÍNH TOÀN VẸN: Dữ liệu văn bản đã bị sửa đổi trái phép sau khi ký!</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Hàm băm SHA-256 hiện tại không trùng khớp với giá trị băm đã được mã hóa trong chữ ký số RSA. 
                    Chữ ký số đã mất hiệu lực pháp lý theo tiêu chuẩn PAdES ISO 32000.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={() => onRestoreDocument(selectedDoc.id)}
                      className="px-3 py-1 bg-white border border-rose-300 rounded font-semibold text-rose-700 hover:bg-rose-50 cursor-pointer"
                    >
                      Khôi phục nội dung gốc để xác thực lại
                    </button>
                    {onOpenFraudCenter && (
                      <button
                        onClick={onOpenFraudCenter}
                        className="px-3 py-1 bg-rose-700 text-white rounded font-semibold hover:bg-rose-800 cursor-pointer flex items-center gap-1 shadow-xs"
                      >
                        <span>Xem Hồ Sơ Điều Tra Giả Mạo (DFIR) →</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : selectedDoc.status === 'signed' ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-900">
                  <div className="font-bold flex items-center gap-2 text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Văn bản đã được ký số PAdES Baseline và xác thực toàn vẹn</span>
                  </div>
                  <div className="text-[11px] text-emerald-800">
                    Ký bởi: <strong className="font-semibold">{selectedDoc.signatureData?.signerName}</strong> ({selectedDoc.signatureData?.signerTitle}) vào lúc {selectedDoc.signatureData?.signedAt}.
                  </div>
                  <div className="pt-1 flex items-center gap-3">
                    <button
                      onClick={() => onTamperDocument(selectedDoc.id)}
                      className="px-2.5 py-1 text-[11px] bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 cursor-pointer"
                      title="Mô phỏng hacker sửa đổi nội dung bảng điểm để kiểm tra khả năng phát hiện giả mạo"
                    >
                      Thử nghiệm giả mạo nội dung (Tamper Test)
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Visual Document Content Representation (Sheet Preview) */}
              <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 relative overflow-hidden shadow-xs">
                {/* Official University Seal Stamp if signed */}
                {selectedDoc.status === 'signed' && (
                  <div className="absolute top-6 right-6 z-10">
                    <HunreRedSealStamp
                      size={135}
                      signerName={selectedDoc.signatureData?.signerName}
                      signedDate={selectedDoc.signatureData?.signedAt}
                      isVerified={!selectedDoc.tampered}
                    />
                  </div>
                )}

                <div className="max-w-2xl mx-auto space-y-5 bg-white p-6 rounded-lg border border-slate-200 text-slate-800">
                  {/* Header */}
                  <div className="text-center space-y-1 pb-3 border-b border-slate-200">
                    <div className="text-xs font-bold text-slate-800 uppercase tracking-tight">
                      TRƯỜNG ĐẠI HỌC TÀI NGUYÊN VÀ MÔI TRƯỜNG HÀ NỘI
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      KHOA CÔNG NGHỆ THÔNG TIN · HỆ THỐNG KÝ SỐ DI ĐỘNG
                    </div>
                    <div className="text-sm font-bold text-slate-900 pt-2 uppercase">
                      {selectedDoc.title}
                    </div>
                  </div>

                  {/* Body Content */}
                  {selectedDoc.category === 'transcript' && selectedDoc.contentData && (
                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <div>Họ tên sinh viên: <strong className="text-slate-900">{selectedDoc.contentData.studentName}</strong></div>
                        <div>Mã sinh viên: <span className="font-mono font-bold text-slate-900">{selectedDoc.contentData.studentId}</span></div>
                        <div>Lớp chuyên ngành: <strong className="text-slate-900">{selectedDoc.contentData.className}</strong></div>
                        <div>Ngành đào tạo: <span className="text-slate-900">{selectedDoc.contentData.major}</span></div>
                      </div>

                      {/* Course Table */}
                      <table className="w-full text-[11px] border border-slate-200 text-left">
                        <thead className="bg-slate-100 font-bold text-slate-700">
                          <tr>
                            <th className="p-2 border-b">Mã HP</th>
                            <th className="p-2 border-b">Tên môn học</th>
                            <th className="p-2 border-b text-center">Tín chỉ</th>
                            <th className="p-2 border-b text-center">Điểm chữ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedDoc.contentData.courses?.map((c: any, i: number) => (
                            <tr key={i} className="hover:bg-slate-50">
                              <td className="p-2 font-mono text-slate-600">{c.code}</td>
                              <td className="p-2 font-medium text-slate-800">{c.name}</td>
                              <td className="p-2 text-center font-mono">{c.credits}</td>
                              <td className="p-2 text-center font-bold text-emerald-700">{c.grade}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* GPA Summary */}
                      <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200 text-xs space-y-1">
                        <div className="flex justify-between font-mono">
                          <span>Năm 1: {selectedDoc.contentData.gpaYear1}</span>
                          <span>Năm 2: {selectedDoc.contentData.gpaYear2}</span>
                          <span>Năm 3: {selectedDoc.contentData.gpaYear3}</span>
                        </div>
                        <div className="text-sm font-bold text-slate-900 flex justify-between pt-1 border-t border-emerald-200">
                          <span>Điểm trung bình tích lũy (GPA):</span>
                          <span className="font-mono text-emerald-800">{selectedDoc.contentData.cumulativeGpa} / 4.0</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedDoc.category === 'decree' && selectedDoc.contentData && (
                    <div className="space-y-3 text-xs leading-relaxed">
                      <div className="p-3 bg-slate-50 rounded-lg space-y-1.5">
                        <div className="font-bold text-slate-900">
                          Đề tài: {selectedDoc.contentData.projectName}
                        </div>
                        <div className="text-slate-600">
                          Thành viên thực hiện: <strong>{selectedDoc.contentData.members.join(', ')}</strong> (Lớp ĐH13C5)
                        </div>
                        <div className="text-slate-600">
                          Cán bộ hướng dẫn: <strong>{selectedDoc.contentData.instructor}</strong>
                        </div>
                        <div className="text-slate-600">
                          Kinh phí hỗ trợ: <strong>{selectedDoc.contentData.funding}</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedDoc.category === 'receipt' && selectedDoc.contentData && (
                    <div className="space-y-3 text-xs">
                      <div className="p-4 bg-slate-50 rounded-lg space-y-2">
                        <div className="flex justify-between font-mono text-[11px] text-slate-500">
                          <span>Số biên lai: {selectedDoc.contentData.receiptNumber}</span>
                          <span>Thời gian: {selectedDoc.contentData.transactionTime}</span>
                        </div>
                        <div className="text-slate-800">
                          Người nộp tiền: <strong>{selectedDoc.contentData.studentName}</strong> (MSSV: {selectedDoc.contentData.studentId})
                        </div>
                        <div className="text-lg font-bold font-mono text-emerald-800">
                          {selectedDoc.contentData.amount}
                        </div>
                        <div className="text-[11px] text-slate-500 italic">
                          Bằng chữ: {selectedDoc.contentData.amountInWords}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Visual Signature Card inside Document */}
                  {selectedDoc.signatureData && (
                    <div className="pt-4 border-t border-slate-200 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-700 uppercase">
                        Thông tin chứng thực chữ ký số PAdES
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[10px] space-y-1 text-slate-600">
                        <div>Người ký: {selectedDoc.signatureData.signerName}</div>
                        <div>Serial chứng thư: {selectedDoc.signatureData.certificateSerialNumber}</div>
                        <div className="truncate">Chữ ký RSA: {selectedDoc.signatureData.signatureHex.substring(0, 48)}...</div>
                        <div>Tiêu chuẩn: {selectedDoc.signatureData.standard} (ISO 32000-1)</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cryptographic SHA-256 Hash Digest */}
              <div className="p-3 bg-slate-900 text-slate-200 rounded-xl space-y-1 text-xs">
                <div className="text-[10px] font-mono uppercase text-emerald-400">
                  Giá trị băm SHA-256 của tài liệu (Document Digest)
                </div>
                <div className="font-mono text-[11px] break-all text-slate-300 select-all">
                  {selectedDoc.originalHashSha256}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Chọn một tài liệu để xem nội dung chi tiết.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

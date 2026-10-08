import React, { useState } from 'react';
import { HunreEmblemBadge } from '../common/HunreSealSvg';
import { BookOpen, User, Calendar, Award, CheckCircle, FileText, ChevronDown, ChevronRight, Download, Share2, Layers, Cpu } from 'lucide-react';

export const ResearchDefenseViewer: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('intro');

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Official Cover Page Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm text-center relative overflow-hidden space-y-6">
        <div className="space-y-1">
          <div className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            TRƯỜNG ĐẠI HỌC TÀI NGUYÊN VÀ MÔI TRƯỜNG HÀ NỘI
          </div>
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
            KHOA CÔNG NGHỆ THÔNG TIN
          </div>
        </div>

        <div className="flex justify-center py-2">
          <HunreEmblemBadge size={90} />
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
            ĐỀ CƯƠNG NGHIÊN CỨU KHOA HỌC
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 uppercase leading-snug tracking-tight">
            NGHIÊN CỨU VÀ XÂY DỰNG HỆ THỐNG KÝ SỐ TÀI LIỆU PDF AN TOÀN DỰA TRÊN HẠ TẦNG KHÓA CÔNG KHAI VÀ CƠ CHẾ CHỨNG THỰC SỐ TÍCH HỢP TRÊN THIẾT BỊ DI ĐỘNG
          </h1>
        </div>

        {/* Committee & Authors Grid */}
        <div className="pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left text-xs max-w-2xl mx-auto">
          <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="font-bold text-slate-900 uppercase tracking-wide text-[11px]">
              Nhóm sinh viên thực hiện:
            </div>
            <div className="space-y-1 text-slate-700">
              <div className="font-semibold text-slate-900">1. Vũ Đức Trung</div>
              <div className="font-semibold text-slate-900">2. Trần Thị Vân Phương (Chịu trách nhiệm chính)</div>
              <div className="text-slate-500">Lớp: ĐH13C5 · Ngành Công nghệ phần mềm</div>
            </div>
          </div>

          <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="font-bold text-slate-900 uppercase tracking-wide text-[11px]">
              Cán bộ hướng dẫn &amp; Phê duyệt:
            </div>
            <div className="space-y-1 text-slate-700">
              <div>Người hướng dẫn: <strong className="text-slate-900">ThS. Nguyễn Văn Hách</strong></div>
              <div>TL. Hiệu trưởng - Trưởng phòng KHCN&HTQT:</div>
              <div className="font-semibold text-slate-900">TS. Nguyễn Bá Dũng</div>
            </div>
          </div>
        </div>

        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest pt-2">
          HÀ NỘI - 2026
        </div>
      </div>

      {/* Navigation Tabs for Outline Sections */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl text-xs overflow-x-auto">
        <button
          onClick={() => setActiveSection('intro')}
          className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeSection === 'intro' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1. Thông tin sinh viên &amp; Đặt vấn đề
        </button>
        <button
          onClick={() => setActiveSection('objectives')}
          className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeSection === 'objectives' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2. Mục tiêu &amp; Khoảng trống NC
        </button>
        <button
          onClick={() => setActiveSection('chapters')}
          className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeSection === 'chapters' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3. Nội dung 3 Chương nghiên cứu
        </button>
        <button
          onClick={() => setActiveSection('timeline')}
          className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeSection === 'timeline' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          4. Phân công &amp; Tiến độ thực hiện
        </button>
        <button
          onClick={() => setActiveSection('references')}
          className={`px-3 py-1.5 font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeSection === 'references' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          5. Tài liệu tham khảo (19 TL)
        </button>
      </div>

      {/* Section Content */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-slate-800 text-sm leading-relaxed">
        {activeSection === 'intro' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-2">
                I. SƠ LƯỢC VỀ SINH VIÊN CHỊU TRÁCH NHIỆM CHÍNH THỰC HIỆN ĐỀ TÀI
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>Họ và tên: <strong className="text-slate-900">Trần Thị Vân Phương</strong></div>
                <div>Ngày sinh: <strong>07 tháng 11 năm 2005</strong></div>
                <div>Lớp: <strong>DH13C5</strong> · Khoa: <strong>Công nghệ thông tin</strong></div>
                <div>Ngành học: <strong>Công nghệ phần mềm</strong></div>
                <div>Địa chỉ: <strong>Nhà số 14, ngõ 193/64/28/22 Phú Diễn, Hà Nội</strong></div>
                <div>Email: <strong className="font-mono">2311061904@hunre.edu.vn</strong> · ĐT: <strong>0347698220</strong></div>
              </div>

              <div className="text-xs font-bold text-slate-900 pt-2">QUÁ TRÌNH HỌC TẬP (HỆ 4.0):</div>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="text-[11px] text-slate-500">Năm thứ nhất</div>
                  <div className="text-lg font-bold font-mono text-emerald-800">3.38</div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="text-[11px] text-slate-500">Năm thứ hai</div>
                  <div className="text-lg font-bold font-mono text-emerald-800">3.61</div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="text-[11px] text-slate-500">Năm thứ ba</div>
                  <div className="text-lg font-bold font-mono text-emerald-800">3.91</div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">
                1. ĐẶT VẤN ĐỀ (HIỆN TRẠNG VÀ TÍNH CẤP THIẾT CỦA ĐỀ TÀI)
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed text-justify">
                Trong bối cảnh cuộc Cách mạng công nghiệp lần thứ tư và quá trình chuyển đổi số đang diễn ra mạnh mẽ trên phạm vi toàn cầu, việc số hóa quy trình quản lý, trao đổi và lưu trữ thông tin đã trở thành yêu cầu tất yếu đối với các tổ chức, doanh nghiệp và cơ sở giáo dục. Các mô hình truyền thống dựa trên văn bản giấy đang từng bước được thay thế bằng hệ thống quản lý tài liệu điện tử nhằm nâng cao hiệu quả vận hành, giảm chi phí, rút ngắn thời gian xử lý và tăng khả năng kết nối trong môi trường số.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed text-justify">
                Tuy nhiên, tài liệu số có thể dễ dàng bị sao chép, chỉnh sửa hoặc giả mạo mà không để lại dấu vết vật lý rõ ràng. Điều này làm phát sinh nhu cầu cấp thiết về các cơ chế bảo đảm tính xác thực của người tạo lập, tính toàn vẹn của dữ liệu và khả năng chống chối bỏ. Chữ ký số dựa trên nền tảng mật mã khóa công khai (Public Key Cryptography) là giải pháp then chốt.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed text-justify">
                Tại Việt Nam, nhiều quy trình quản lý tài liệu tại các cơ sở giáo dục vẫn còn phụ thuộc vào việc ký duyệt thủ công hoặc thiết bị ký số phần cứng truyền thống (USB Token). Dù bảo mật cao, USB Token vẫn còn hạn chế về chi phí, sự phụ thuộc thiết bị vật lý và chưa đáp ứng tốt nhu cầu ký số linh hoạt trên môi trường di động. Đề tài tập trung nghiên cứu giải pháp kết hợp hạ tầng PKI, chuẩn ký số PDF PAdES (ISO 32000) và bảo vệ khóa trên vùng bảo mật phần cứng di động (Android Keystore / iOS Secure Enclave).
              </p>
            </div>
          </div>
        )}

        {activeSection === 'objectives' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-2">
                2. MỤC TIÊU NGHIÊN CỨU &amp; KHOẢNG TRỐNG KHOA HỌC
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="font-bold text-slate-900 uppercase">2.1. Mục tiêu tổng quát</div>
                  <p className="text-slate-600 leading-relaxed">
                    Nghiên cứu cơ sở lý thuyết về mật mã khóa công khai, chữ ký số và hạ tầng khóa công khai (PKI); trên cơ sở đó xây dựng mô hình hệ thống ký số tài liệu PDF an toàn tích hợp cơ chế chứng thực số trên thiết bị di động, đảm bảo xác thực người ký, tính toàn vẹn, khả năng chống chối bỏ và bảo vệ khóa bí mật.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="font-bold text-slate-900 uppercase">2.2. Mục tiêu cụ thể</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>Hệ thống hóa lý thuyết RSA, SHA-256, chuẩn ISO 32000 PAdES.</li>
                    <li>Nghiên cứu kiến trúc PKI quản lý chứng thư X.509.</li>
                    <li>Phát triển CA Server, Mobile Client, và Web Management.</li>
                    <li>Tích hợp Android Keystore &amp; iOS Secure Enclave sinh trắc học.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-3">
              <div className="text-xs font-bold uppercase text-slate-900">
                3.3. KHOẢNG TRỐNG NGHIÊN CỨU ĐƯỢC GIẢI QUYẾT:
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-1">
                  <div className="font-bold text-amber-900">1. Sự thiếu hụt giải pháp di động hóa (Mobile Signing):</div>
                  <p className="text-amber-800">
                    Các nghiên cứu trước đây chủ yếu dừng lại ở phần mềm desktop (C# WinForms), chưa tích hợp cơ chế sinh và bảo vệ khóa trong vùng phần cứng Android Keystore / iOS Keychain kết hợp vân tay/FaceID.
                  </p>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-1">
                  <div className="font-bold text-amber-900">2. Bài toán ký số PDF chuẩn hóa:</div>
                  <p className="text-amber-800">
                    Nhiều giải pháp chỉ ký trên XML hoặc chuỗi văn bản thô, chưa can thiệp vào cấu trúc nhị phân của tài liệu PDF (/ByteRange, /Contents) để tạo chữ ký trực quan tương thích Adobe Acrobat Reader.
                  </p>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-1">
                  <div className="font-bold text-amber-900">3. Quản lý chứng thư số tự động (CA Server):</div>
                  <p className="text-amber-800">
                    Thiếu mô hình CA nội bộ linh hoạt có khả năng tự động cấp phát, thu hồi và kiểm tra trạng thái chứng thư X.509 qua API cho toàn trường đại học.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'chapters' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-2">
              5. NỘI DUNG 3 CHƯƠNG NGHIÊN CỨU CHI TIẾT
            </h2>

            <div className="space-y-4 text-xs">
              {/* Chapter 1 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-emerald-800 text-sm">
                  CHƯƠNG 1. CƠ SỞ LÝ THUYẾT VỀ CHỮ KÝ SỐ, HẠ TẦNG KHÓA CÔNG KHAI VÀ BẢO MẬT TÀI LIỆU PDF
                </div>
                <div className="text-slate-600 space-y-1 pl-2">
                  <div>1.1. Tổng quan về an toàn thông tin và nhu cầu bảo vệ tài liệu số.</div>
                  <div>1.2. Cơ sở lý thuyết về mật mã khóa công khai (Public Key Cryptography &amp; RSA Algorithm).</div>
                  <div>1.3. Thuật toán băm SHA-256 và cơ chế tạo chữ ký số.</div>
                  <div>1.4. Hạ tầng khóa công khai PKI và chứng thư số chuẩn X.509.</div>
                  <div>1.5. Chuẩn chữ ký số tài liệu PDF (ISO 32000, ETSI EN 319 142 PAdES).</div>
                </div>
              </div>

              {/* Chapter 2 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-emerald-800 text-sm">
                  CHƯƠNG 2. THIẾT KẾ VÀ XÂY DỰNG HỆ THỐNG KÝ SỐ TÀI LIỆU PDF AN TOÀN TRÊN THIẾT BỊ DI ĐỘNG
                </div>
                <div className="text-slate-600 space-y-1 pl-2">
                  <div>2.1. Phân tích yêu cầu hệ thống quản lý tài liệu HUNRE.</div>
                  <div>2.2. Thiết kế kiến trúc tổng thể hệ thống phân tán (Web, Mobile Client, CA Server).</div>
                  <div>2.3. Thiết kế hạ tầng khóa công khai PKI và quy trình quản lý vòng đời chứng thư số.</div>
                  <div>2.4. Thiết kế cơ chế bảo vệ khóa bí mật trên thiết bị di động (Android Keystore / Secure Enclave).</div>
                  <div>2.5. Xây dựng module ký số và xác thực tài liệu PDF theo chuẩn PAdES.</div>
                  <div>2.6. Xây dựng ứng dụng di động hỗ trợ ký số và xác thực sinh trắc học.</div>
                  <div>2.7. Xây dựng hệ thống quản lý tài liệu và dịch vụ chứng thực trực tuyến.</div>
                </div>
              </div>

              {/* Chapter 3 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-emerald-800 text-sm">
                  CHƯƠNG 3. TÍCH HỢP, THỬ NGHIỆM VÀ ĐÁNH GIÁ HỆ THỐNG
                </div>
                <div className="text-slate-600 space-y-1.5 pl-2">
                  <div>3.1. Tích hợp các phân hệ trong hệ thống ký số PDF.</div>
                  <div>3.2. Xây dựng kịch bản thử nghiệm hệ thống (Bảng điểm, Quyết định, Biên lai học phí).</div>
                  <div>3.3. Đánh giá hiệu năng hệ thống (Thời gian sinh khóa, độ trễ ký số, tải mạng).</div>
                  <div>
                    <strong className="text-slate-800">3.4. Đánh giá an toàn bảo mật và cơ chế chống tấn công giả mạo:</strong>
                    <div className="pl-3 pt-1 space-y-1 text-slate-500 text-[11px]">
                      <div>• <em>3.4.1. Kịch bản tấn công ăn cắp tài liệu đã ký &amp; thay đổi nội dung:</em> Kẻ gian chặn bắt bản PDF đã ký hợp lệ trên di động, sửa đổi dữ liệu (nâng điểm GPA, hạ số tiền học phí, đổi tên người nhận) và nộp lại bản giả.</div>
                      <div>• <em>3.4.2. Cơ chế toán học phát hiện gian lận:</em> Hiệu ứng tuyết lở SHA-256 (&gt;50% bit biến đổi) khiến phép kiểm tra RSA với Khóa công khai <code className="font-mono text-slate-700">S^e mod n != Hash(M&apos;)</code> lập tức báo lỗi vi phạm tính toàn vẹn (Integrity Violation).</div>
                      <div>• <em>3.4.3. Quy trình tự động xử lý &amp; báo cáo tài liệu giả (DFIR Incident Response):</em> Hệ thống tự động cách ly văn bản giả, đưa vào danh sách đen, lập Biên bản Giám định Kỹ thuật số số DFIR và cảnh báo cơ quan chức năng theo Nghị định 130/2018/NĐ-CP.</div>
                    </div>
                  </div>
                  <div>3.5. Đánh giá kết quả nghiên cứu và đề xuất hướng phát triển mở rộng.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'timeline' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-2">
              8 &amp; 9. TIẾN ĐỘ THỰC HIỆN VÀ PHÂN CÔNG NHIỆM VỤ NHÓM
            </h2>

            {/* Responsibility matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm">
                  1. Sinh viên chịu trách nhiệm chính: Trần Thị Vân Phương
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Chịu trách nhiệm chung về tiến độ và kết quả đề tài.</li>
                  <li>Nghiên cứu cơ sở toán học sinh khóa RSA, giải thuật băm SHA-256.</li>
                  <li>Thiết kế và lập trình ứng dụng di động Mobile Client.</li>
                  <li>Triển khai vùng lưu trữ bảo mật khóa Android Keystore / iOS Keychain.</li>
                  <li>Tích hợp xác thực sinh trắc học vân tay / FaceID.</li>
                  <li>Viết báo cáo tổng kết và trình bày thuyết minh đề tài.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm">
                  2. Sinh viên thành viên: Vũ Đức Trung
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Thiết kế cơ sở dữ liệu và kiến trúc hạ tầng khóa công khai PKI.</li>
                  <li>Lập trình phân hệ CA Server, tự động cấp chứng thư số X.509.</li>
                  <li>Nghiên cứu can thiệp cấu trúc nhị phân tệp PDF để nhúng chữ ký số.</li>
                  <li>Lập trình lõi tính toán băm SHA-256 tài liệu PDF trên Web Server.</li>
                  <li>Tiến hành tích hợp, thử nghiệm thực nghiệm hệ thống tại HUNRE.</li>
                  <li>Đo đạc các chỉ tiêu kỹ thuật (độ trễ, an toàn bảo mật) và làm slide bảo vệ.</li>
                </ul>
              </div>
            </div>

            {/* Timeline progress table */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900 uppercase">
                Tiến độ thực hiện (Năm 2026 - 2027):
              </div>
              <div className="overflow-x-auto text-xs border border-slate-200 rounded-lg">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="p-2.5 border-b">Nội dung công việc</th>
                      <th className="p-2.5 border-b text-center">Giai đoạn</th>
                      <th className="p-2.5 border-b text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="p-2.5">Lựa chọn và xây dựng đề tài nghiên cứu</td>
                      <td className="p-2.5 text-center font-mono">08/2026</td>
                      <td className="p-2.5 text-center text-emerald-700 font-bold">Hoàn thành ✓</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">Báo cáo và thông qua đề cương nghiên cứu</td>
                      <td className="p-2.5 text-center font-mono">09/2026</td>
                      <td className="p-2.5 text-center text-emerald-700 font-bold">Hoàn thành ✓</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">Lập trình CA Server, Mobile Client, Lõi ký số PDF</td>
                      <td className="p-2.5 text-center font-mono">10 - 12/2026</td>
                      <td className="p-2.5 text-center text-emerald-700 font-bold">Đang triển khai</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">Báo cáo tiến độ &amp; Viết báo cáo tổng kết</td>
                      <td className="p-2.5 text-center font-mono">01 - 04/2027</td>
                      <td className="p-2.5 text-center text-slate-400">Theo kế hoạch</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">Nghiệm thu và bảo vệ kết quả nghiên cứu</td>
                      <td className="p-2.5 text-center font-mono">05/2027</td>
                      <td className="p-2.5 text-center text-slate-400">Theo kế hoạch</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'references' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-2">
              DANH MỤC TÀI LIỆU THAM KHẢO CHÍNH THỨC
            </h2>

            <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
              <div className="font-bold text-slate-900">Tiếng Việt:</div>
              <ol className="list-decimal list-inside space-y-1.5 pl-1">
                <li>Phan Đình Diệu (1999), <em>Giáo trình lý thuyết mật mã và an toàn thông tin</em>, NXB Đại học Quốc gia Hà Nội.</li>
                <li>Nguyễn Xuân Dũng (2007), <em>Bảo mật thông tin, mô hình và ứng dụng</em>, NXB Thống kê, Hà Nội.</li>
                <li>Phạm Huy Điển, Hà Huy Khoái (2004), <em>Mã hóa thông tin cơ sở toán học và ứng dụng</em>, NXB Viện Toán học.</li>
                <li>Lê Thanh Hà (2016), <em>Giáo trình xử lý ảnh</em>, NXB Đại học Quốc gia Hà Nội, Hà Nội.</li>
                <li>Thái Hồng Nhị, Phạm Minh Việt (2004), <em>An toàn thông tin - mạng máy tính, truyền tin số và truyền số liệu</em>, NXB Khoa học và Kỹ thuật.</li>
                <li>Lê Thị Sâm (2008), <em>Báo cáo khoa học đề tài ứng dụng mật mã RSA và chữ ký điện tử vào việc mã hóa thông tin trong thẻ ATM</em>, ĐH Sư phạm Hà Nội.</li>
                <li>Thái Thanh Tùng (2011), <em>Giáo trình mật mã học &amp; hệ thống thông tin an toàn</em>, NXB Thông tin và Truyền thông.</li>
                <li>Trần Minh Văn (2008), <em>Bài giảng An toàn và Bảo mật thông tin</em>, NXB Trường Đại học Nha Trang.</li>
              </ol>

              <div className="font-bold text-slate-900 pt-3">Tiếng nước ngoài &amp; Tiêu chuẩn quốc tế:</div>
              <ol start={9} className="list-decimal list-inside space-y-1.5 pl-1">
                <li>ITU-T (2019), <em>Information technology – Open Systems Interconnection – The Directory: Public-key and attribute certificate frameworks (X.509)</em>, Recommendation X.509.</li>
                <li>NIST (2015), <em>Digital Signature Standard (DSS)</em>, FIPS PUB 186-4, U.S. Department of Commerce.</li>
                <li>NIST (2023), <em>Digital Signature Standard (DSS)</em>, FIPS PUB 186-5, U.S. Department of Commerce.</li>
                <li>NIST (2015), <em>Secure Hash Standard (SHS)</em>, FIPS PUB 180-4, U.S. Department of Commerce.</li>
                <li>ISO (2020), <em>ISO 32000-2:2020 Document management – Portable document format – Part 2: PDF 2.0</em>, International Organization for Standardization.</li>
                <li>ETSI (2022), <em>ETSI EN 319 142-1 Electronic Signatures and Infrastructures (ESI); PAdES digital signatures</em>, ETSI Standard.</li>
                <li>Adobe Systems Incorporated (2008), <em>PDF Reference: Adobe Portable Document Format Version 1.7</em>, Adobe Systems.</li>
                <li>Android Developers (2025), <em>Android Keystore System – Secure Key Storage and Cryptographic Operations</em>, Google Android Docs.</li>
                <li>Apple Inc. (2025), <em>Keychain Services Programming Guide and Secure Enclave Overview</em>, Apple Developer Documentation.</li>
                <li>OWASP Foundation (2024), <em>OWASP Mobile Application Security Testing Guide (MASTG)</em>.</li>
                <li>OWASP Foundation (2023), <em>OWASP Application Security Verification Standard (ASVS)</em>, Version 4.0.3.</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

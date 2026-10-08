import React from 'react';
import { HunreEmblemBadge } from '../common/HunreSealSvg';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <HunreEmblemBadge size={36} />
              <div>
                <div className="font-bold text-slate-900 text-sm tracking-tight">
                  TRƯỜNG ĐẠI HỌC TÀI NGUYÊN VÀ MÔI TRƯỜNG HÀ NỘI
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  KHOA CÔNG NGHỆ THÔNG TIN · BỘ MÔN CÔNG NGHỆ PHẦN MỀM
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-lg">
              Đề tài Nghiên cứu Khoa học Sinh viên: “Nghiên cứu và xây dựng hệ thống ký số tài liệu PDF an toàn dựa trên hạ tầng khóa công khai và cơ chế chứng thực số tích hợp trên thiết bị di động”.
            </p>
            <div className="text-xs text-slate-400">
              Trụ sở chính: Số 41A Đường Phú Diễn, Phường Phú Diễn, Quận Bắc Từ Liêm, TP. Hà Nội.
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Nhóm nghiên cứu DH13C5
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>Trần Thị Vân Phương (Chủ nhiệm đề tài)</li>
              <li>Vũ Đức Trung (Thành viên nghiên cứu)</li>
              <li className="pt-1 text-slate-500">GVHD: ThS. Nguyễn Văn Hách</li>
              <li className="text-slate-400">Năm nghiệm thu: 2026</li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Tiêu chuẩn kỹ thuật
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>ISO 32000-2:2020 (PDF 2.0 Digital Signature)</li>
              <li>ETSI EN 319 142 (PAdES Baseline Profile)</li>
              <li>NIST FIPS 186-5 & RSA-2048 / SHA-256</li>
              <li>Nghị định số 130/2018/NĐ-CP & Luật GDĐT 2023</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <div>
            © 2026 Khoa Công nghệ Thông tin - Trường Đại học Tài nguyên và Môi trường Hà Nội.
          </div>
          <div className="flex items-center gap-4">
            <span>Phiên bản thử nghiệm thực nghiệm HUNRE</span>
            <span>·</span>
            <span>Môi trường bảo mật Keystore / Enclave</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

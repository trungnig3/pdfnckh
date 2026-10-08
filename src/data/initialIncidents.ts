import { FraudIncident } from '../types';

export const INITIAL_FRAUD_INCIDENTS: FraudIncident[] = [
  {
    id: 'inc-001',
    documentId: 'doc-hunre-001',
    documentCode: 'HUNRE/CNTT/2026/BD-1904',
    documentTitle: 'Bảng Điểm Học Tập Toàn Khóa Sinh Viên',
    detectedAt: '2026-10-07T14:22:15Z',
    severity: 'CRITICAL',
    attackType: 'GPA_FRAUD',
    originalHash: '9f2a74c8b2e105e94b8e8f3a1d94b15c26b7df9472e38c11aa5d79e8c4f09d21',
    tamperedHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    bitDifferencePercentage: 54.2,
    originalDataSummary: 'GPA Năm 1: 3.38 | Năm 2: 3.61 | Năm 3: 3.91 -> Điểm TBTL: 3.75 / 4.0 (Xếp loại: Xuất sắc)',
    tamperedDataSummary: 'GPA Năm 1: 4.00 | Năm 2: 4.00 | Năm 3: 4.00 -> Điểm TBTL: 4.00 / 4.0 (Thủ khoa Giả Mạo)',
    claimedSigner: 'Trần Thị Vân Phương',
    signerCertificateSerial: '7B:4E:91:2A:0F:6C:83:D1:49:E0:18:24:99:BC:A1:3F',
    status: 'CONFIRMED_FRAUD',
    forensicAnalysisNotes:
      'Kẻ gian can thiệp nhị phân vào dòng bảng điểm số 4 (Cấu trúc dữ liệu & Giải thuật) và tổng kết GPA. Giá trị băm SHA-256 bị thay đổi đột ngột khiến phép giải mã RSA với Khóa công khai của chủ thể S^e mod n != Hash(M\') không hợp lệ. Hệ thống đã tự động đình chỉ xử lý và cô lập văn bản.',
    actionsTaken: [
      'Khóa mã kiểm định tra cứu trực tuyến của văn bản bị làm giả',
      'Lập biên bản vi phạm pháp y an toàn thông tin số DFIR-HUNRE-001',
      'Gửi thông báo cảnh báo đến Phòng Đào tạo & Khảo thí HUNRE',
      'Niêm phong tệp tin số làm vật chứng theo Nghị định 130/2018/NĐ-CP',
    ],
  },
];

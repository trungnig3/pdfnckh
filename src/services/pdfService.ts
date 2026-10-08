import { jsPDF } from 'jspdf';
import { DocumentItem, DocumentSignature, X509Certificate } from '../types';
import { calculateSha256 } from '../crypto/pkiCrypto';

export async function generateOfficialHunrePdf(
  doc: DocumentItem,
  signature?: DocumentSignature,
  certificate?: X509Certificate
): Promise<{ pdfBlob: Blob; pdfArrayBuffer: ArrayBuffer; sha256Hex: string }> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;

  // Header - Institutional banner
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(30, 41, 59);

  // Top Left: Institution
  pdf.text('BO TAI NGUYEN VA MOI TRUONG', 20, 20);
  pdf.setFontSize(9);
  pdf.text('TRUONG DAI HOC TAI NGUYEN VA MOI TRUONG HA NOI', 20, 25);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.text('KHOA CONG NGHE THONG TIN', 20, 30);
  pdf.setLineWidth(0.3);
  pdf.line(20, 32, 85, 32);

  // Top Right: National Motto
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9.5);
  pdf.text('CONG HOA XA HOI CHU NGHIA VIET NAM', 120, 20);
  pdf.setFontSize(8.5);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Doc lap - Tu do - Hanh phuc', 135, 25);
  pdf.line(135, 27, 185, 27);

  // Document Reference code
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.text(`So / Ma van ban: ${doc.code}`, 20, 40);
  pdf.text(`Ha Noi, ngay ${new Date(doc.createdAt).getDate()} thang ${new Date(doc.createdAt).getMonth() + 1} nam ${new Date(doc.createdAt).getFullYear()}`, 130, 40);

  // Document Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(15, 23, 42);
  const titleLines = pdf.splitTextToSize(doc.title.toUpperCase(), 170);
  pdf.text(titleLines, pageWidth / 2, 52, { align: 'center' });

  // Description / Subtitle
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9.5);
  pdf.setTextColor(71, 85, 105);
  pdf.text(`Don vi ban hanh: ${doc.department}`, pageWidth / 2, 60, { align: 'center' });

  let currentY = 70;

  // Body content rendering based on Category
  if (doc.category === 'transcript' && doc.contentData) {
    const data = doc.contentData;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(15, 23, 42);
    pdf.text('I. THONG TIN SINH VIEN', 20, currentY);
    currentY += 6;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(51, 65, 85);
    pdf.text(`Ho va ten: ${data.studentName}`, 25, currentY);
    pdf.text(`Ma so sinh vien (MSSV): ${data.studentId}`, 115, currentY);
    currentY += 5;
    pdf.text(`Lop: ${data.className}`, 25, currentY);
    pdf.text(`Khoa: ${data.faculty}`, 115, currentY);
    currentY += 5;
    pdf.text(`Nganh dao tao: ${data.major}`, 25, currentY);
    pdf.text(`Ngay sinh: ${data.birthDate}`, 115, currentY);
    currentY += 8;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(15, 23, 42);
    pdf.text('II. KET QUA HOC TAP CAC NAM HOC (HE 4.0)', 20, currentY);
    currentY += 6;

    // Academic Table Header
    pdf.setFillColor(241, 245, 249);
    pdf.rect(20, currentY, 170, 7, 'F');
    pdf.setDrawColor(203, 213, 225);
    pdf.rect(20, currentY, 170, 7, 'D');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(30, 41, 59);
    pdf.text('STT', 23, currentY + 5);
    pdf.text('Ma HP', 35, currentY + 5);
    pdf.text('Ten hoc phan chuyen nganh', 60, currentY + 5);
    pdf.text('So tin chi', 140, currentY + 5);
    pdf.text('Diem chu', 165, currentY + 5);
    currentY += 7;

    // Courses
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    data.courses?.forEach((course: any, idx: number) => {
      pdf.rect(20, currentY, 170, 6, 'D');
      pdf.text(String(idx + 1), 24, currentY + 4.5);
      pdf.text(course.code, 35, currentY + 4.5);
      pdf.text(course.name, 60, currentY + 4.5);
      pdf.text(String(course.credits), 147, currentY + 4.5);
      pdf.text(course.grade, 168, currentY + 4.5);
      currentY += 6;
    });

    currentY += 4;
    // Summary
    pdf.setFillColor(248, 250, 252);
    pdf.rect(20, currentY, 170, 16, 'FD');
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Diem trung binh Nam 1: ${data.gpaYear1}  |  Nam 2: ${data.gpaYear2}  |  Nam 3: ${data.gpaYear3}`, 25, currentY + 5);
    pdf.text(`Diem trung binh tich luy (GPA): ${data.cumulativeGpa} / 4.0`, 25, currentY + 10);
    pdf.text(`Xep loai hoc tap: ${data.evaluation} - Du dieu kien thuc hien De tai NCKH`, 25, currentY + 14);
    currentY += 22;
  } else if (doc.category === 'decree' && doc.contentData) {
    const data = doc.contentData;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text(`QUYET DINH VE VIEC GIAO DE TAI NCKH SINH VIEN NAM 2026`, 20, currentY);
    currentY += 8;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(51, 65, 85);
    pdf.text(`- Can cu Quy che nghien cuu khoa hoc sinh vien Truong Dai hoc Tai nguyen va Moi truong Ha Noi;`, 20, currentY);
    currentY += 5;
    pdf.text(`- Can cu ket qua tham dinh de cuong cua Hoi dong Khoa hoc Khoa Cong nghe Thong tin;`, 20, currentY);
    currentY += 6;

    pdf.setFont('helvetica', 'bold');
    pdf.text('QUYET DINH:', 20, currentY);
    currentY += 6;

    pdf.setFont('helvetica', 'normal');
    pdf.text(`Dieu 1. Phe duyet de tai: "${data.projectName}"`, 20, currentY);
    currentY += 6;
    pdf.text(`Nhom sinh vien thuc hien: ${data.members.join(', ')} - Lop DH13C5`, 25, currentY);
    currentY += 5;
    pdf.text(`Giang vien huong dan: ${data.instructor}`, 25, currentY);
    currentY += 5;
    pdf.text(`Kinh phi nghien cuu ho tro: ${data.funding}`, 25, currentY);
    currentY += 6;
    pdf.text(`Dieu 2. San pham ban giao: ${data.expectedOutput}`, 20, currentY);
    currentY += 16;
  } else {
    // Generic layout for other documents
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(51, 65, 85);
    const descLines = pdf.splitTextToSize(doc.description, 170);
    pdf.text(descLines, 20, currentY);
    currentY += 30;
  }

  // Visual Signature Box (PAdES ISO 32000-1 appearance stream)
  if (signature) {
    const boxX = 110;
    const boxY = Math.max(currentY, 185);
    const boxW = 85;
    const boxH = 46;

    // Outer subtle red/crimson border box
    pdf.setFillColor(254, 242, 242);
    pdf.setDrawColor(220, 38, 38);
    pdf.setLineWidth(0.6);
    pdf.roundedRect(boxX, boxY, boxW, boxH, 2, 2, 'FD');

    // Header strip
    pdf.setFillColor(220, 38, 38);
    pdf.rect(boxX, boxY, boxW, 6.5, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6.8);
    pdf.text('CHUNG THUC CHU KY SO - PKI HUNRE', boxX + 4, boxY + 4.5);

    // Text details inside signature block
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);
    pdf.setTextColor(185, 28, 28);
    pdf.text(`DA KY BOI: ${signature.signerName.toUpperCase()}`, boxX + 4, boxY + 11);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.5);
    pdf.setTextColor(30, 41, 59);
    pdf.text(`Chuc vu / Don vi: ${signature.signerTitle}`, boxX + 4, boxY + 15);
    pdf.text(`Thoi gian ky: ${signature.signedAt} (GMT+7)`, boxX + 4, boxY + 19);
    pdf.text(`Ly do: ${signature.reason}`, boxX + 4, boxY + 23);
    pdf.text(`Thiet bi: ${signature.mobileDeviceModel} (${signature.biometricMethod})`, boxX + 4, boxY + 27);
    pdf.text(`Thuat toan: RSA-2048 / SHA-256 (PAdES)`, boxX + 4, boxY + 31);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(5.8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`Ma so chung thu: ${signature.certificateSerialNumber.substring(0, 24)}...`, boxX + 4, boxY + 36);
    pdf.text(`SHA256: ${signature.rawHash.substring(0, 32)}...`, boxX + 4, boxY + 40);
    pdf.text('Xac thuc toan ven boi Khoa CNTT - DH Tai nguyen & MT Ha Noi', boxX + 4, boxY + 44);
  }

  // Footer notice
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(148, 163, 184);
  pdf.text(
    'Van ban dien tu xac thuc boi He thong Ky so PKI Di dong Truong Dai hoc Tai nguyen va Moi truong Ha Noi (HUNRE). Tuan thu Nghi dinh 130/2018/ND-CP va Tieu chuan quoc te ISO 32000-1 PAdES.',
    pageWidth / 2,
    285,
    { align: 'center' }
  );

  const pdfArrayBuffer = pdf.output('arraybuffer');
  const pdfBlob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });
  const sha256Hex = await calculateSha256(pdfArrayBuffer);

  return {
    pdfBlob,
    pdfArrayBuffer,
    sha256Hex,
  };
}

export async function generateFraudIncidentPdfReport(
  incident: import('../types').FraudIncident
): Promise<Blob> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;

  // Header Banner
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(185, 28, 28); // Crimson red alert
  pdf.text('TRUONG DAI HOC TAI NGUYEN VA MOI TRUONG HA NOI', 20, 20);
  pdf.setFontSize(8.5);
  pdf.setTextColor(71, 85, 105);
  pdf.text('KHOA CONG NGHE THONG TIN - TRUNG TAM GIAM SAT AN TOAN THONG TIN (SOC/DFIR)', 20, 25);
  pdf.setLineWidth(0.4);
  pdf.setDrawColor(220, 38, 38);
  pdf.line(20, 28, 190, 28);

  // Motto right
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.text(`Ma so bien ban: DFIR-${incident.id.toUpperCase()}`, 130, 20);
  pdf.text(`Ngay lap: ${new Date(incident.detectedAt).toLocaleString('vi-VN')}`, 130, 25);

  // Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.setTextColor(153, 27, 27);
  pdf.text('BIEN BAN GIAM DINH KY THUAT SO & BAO CAO PHAT HIEN TAI LIEU GIA MAO', pageWidth / 2, 38, { align: 'center' });

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(220, 38, 38);
  pdf.text(`[ MUC DO NGHIEP TRONG: ${incident.severity} - TRANG THAI: DA PHAT HIEN VA CHAN DUNG ]`, pageWidth / 2, 44, { align: 'center' });

  let currentY = 52;

  // I. Summary of document
  pdf.setFillColor(254, 242, 242);
  pdf.rect(20, currentY, 170, 7, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(153, 27, 27);
  pdf.text('I. THONG TIN TAI LIEU BI DAN DUNG / LAM GIA', 23, currentY + 5);
  currentY += 10;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(30, 41, 59);
  pdf.text(`- Ten tai lieu goc: ${incident.documentTitle}`, 25, currentY);
  currentY += 5;
  pdf.text(`- Ma so van ban: ${incident.documentCode}`, 25, currentY);
  currentY += 5;
  pdf.text(`- Nguoi ky hop phap bi mao danh: ${incident.claimedSigner}`, 25, currentY);
  currentY += 5;
  pdf.text(`- Serial chung thu so X.509 bi loi dung: ${incident.signerCertificateSerial}`, 25, currentY);
  currentY += 5;
  pdf.text(`- Hinh thuc tan cong: ${incident.attackType}`, 25, currentY);
  currentY += 8;

  // II. Forensic Hash & Tamper evidence
  pdf.setFillColor(254, 242, 242);
  pdf.rect(20, currentY, 170, 7, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(153, 27, 27);
  pdf.text('II. KET QUA GIAM DINH MAT MA & CHUNG CU KY THUAT SO', 23, currentY + 5);
  currentY += 10;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.text(`1. Ma bam SHA-256 ban goc hop le (Original Hash):`, 25, currentY);
  currentY += 4.5;
  pdf.setFont('courier', 'bold');
  pdf.text(incident.originalHash, 25, currentY);
  currentY += 6;

  pdf.setFont('helvetica', 'normal');
  pdf.text(`2. Ma bam SHA-256 ban bi sua doi bat hop phap (Tampered Hash):`, 25, currentY);
  currentY += 4.5;
  pdf.setFont('courier', 'bold');
  pdf.setTextColor(220, 38, 38);
  pdf.text(incident.tamperedHash, 25, currentY);
  currentY += 6;

  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 41, 59);
  pdf.text(`Do lech ma hoa (Avalanche Bit Divergence): ${incident.bitDifferencePercentage}%`, 25, currentY);
  currentY += 5;
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Ket qua kiem tra chu ky RSA: Khong khop! Cong thuc S^e mod n != Hash(M')`, 25, currentY);
  currentY += 8;

  // III. Content alteration diff
  pdf.setFillColor(254, 242, 242);
  pdf.rect(20, currentY, 170, 7, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(153, 27, 27);
  pdf.text('III. DOI CHIEU NOI DUNG BIEN DOI TRAI PHEP (SIDE-BY-SIDE FORENSIC)', 23, currentY + 5);
  currentY += 10;

  // Box compare
  pdf.setFillColor(240, 253, 244);
  pdf.setDrawColor(34, 197, 94);
  pdf.roundedRect(25, currentY, 78, 25, 1, 1, 'FD');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(22, 101, 52);
  pdf.text('NOI DUNG GOC HOP LE (BAN CHINH)', 28, currentY + 5);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(30, 41, 59);
  const origLines = pdf.splitTextToSize(incident.originalDataSummary, 72);
  pdf.text(origLines, 28, currentY + 10);

  pdf.setFillColor(254, 242, 242);
  pdf.setDrawColor(239, 68, 68);
  pdf.roundedRect(107, currentY, 78, 25, 1, 1, 'FD');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(185, 28, 28);
  pdf.text('NOI DUNG GIA MAO BI DAN DUNG', 110, currentY + 5);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(153, 27, 27);
  const tampLines = pdf.splitTextToSize(incident.tamperedDataSummary, 72);
  pdf.text(tampLines, 110, currentY + 10);
  currentY += 32;

  // IV. Action Taken & Legal notice
  pdf.setFillColor(254, 242, 242);
  pdf.rect(20, currentY, 170, 7, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(153, 27, 27);
  pdf.text('IV. BIEN PHAP XU LY & CANH BAO PHAP LY', 23, currentY + 5);
  currentY += 10;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(30, 41, 59);
  incident.actionsTaken.forEach((act, idx) => {
    pdf.text(`${idx + 1}. ${act}`, 25, currentY);
    currentY += 5;
  });

  currentY += 4;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.5);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Can cu Dieu 8 Nghi dinh 130/2018/ND-CP va Luat Giao dich dien tu 2023:', 25, currentY);
  currentY += 4.5;
  pdf.setFont('helvetica', 'normal');
  pdf.text('Tai lieu nay hoan toan vo hieu luc phap ly. Moi hanh vi su dung van ban gia mao se bi xu ly theo quy dinh phap luat.', 25, currentY);

  // Signatures of Inspector
  currentY += 15;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.5);
  pdf.setTextColor(30, 41, 59);
  pdf.text('CAN BO GIAM DINH AN TOAN THONG TIN', 30, currentY);
  pdf.text('XAC NHAN PHONG KHCN & HTQT HUNRE', 120, currentY);

  currentY += 16;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.text('He thong tu dong HUNRE DFIR Engine', 30, currentY);
  pdf.text('TS. Nguyen Ba Dung', 130, currentY);

  const pdfArrayBuffer = pdf.output('arraybuffer');
  return new Blob([pdfArrayBuffer], { type: 'application/pdf' });
}

export function downloadPdfBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

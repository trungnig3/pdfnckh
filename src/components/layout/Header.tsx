import React from 'react';
import { HunreEmblemBadge } from '../common/HunreSealSvg';
import { ShieldCheck, Smartphone, FileSignature } from 'lucide-react';

interface HeaderProps {
  activeTab: 'portal' | 'mobile' | 'ca' | 'verify' | 'fraud' | 'thesis';
  setActiveTab: (tab: 'portal' | 'mobile' | 'ca' | 'verify' | 'fraud' | 'thesis') => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  pendingCount: number;
  fraudIncidentCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
  pendingCount,
  fraudIncidentCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <HunreEmblemBadge size={38} />
          <button
            onClick={() => setActiveTab('portal')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
              HUNRE Mobile PKI
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs text-slate-500 font-medium">
              Hệ thống Ký số PDF Di động
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('portal')}
            className={`cursor-pointer transition-colors py-1 ${
              activeTab === 'portal'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            Quản lý tài liệu
          </button>
          <button
            onClick={() => setActiveTab('mobile')}
            className={`cursor-pointer transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'mobile'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            Ứng dụng di động
            {pendingCount > 0 && (
              <span className="text-[11px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('ca')}
            className={`cursor-pointer transition-colors py-1 ${
              activeTab === 'ca'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            Máy chủ CA
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`cursor-pointer transition-colors py-1 ${
              activeTab === 'verify'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            Kiểm tra PAdES
          </button>
          <button
            onClick={() => setActiveTab('fraud')}
            className={`cursor-pointer transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'fraud'
                ? 'text-rose-700 font-semibold border-b-2 border-rose-600'
                : 'hover:text-slate-900'
            }`}
          >
            Giám sát giả mạo
            {fraudIncidentCount > 0 && (
              <span className="text-[11px] font-mono font-bold bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded">
                {fraudIncidentCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('thesis')}
            className={`cursor-pointer transition-colors py-1 ${
              activeTab === 'thesis'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            Đề cương NCKH
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              mobileOpen
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
            title="Bật/Tắt màn hình mô phỏng thiết bị di động"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Khung di động</span>
          </button>

          <button
            onClick={() => setActiveTab('portal')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <FileSignature className="w-3.5 h-3.5" />
            <span>Ký số PDF</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar row for small screens */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 py-2 px-2 bg-slate-50 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('portal')}
          className={`px-2 py-1 rounded font-medium whitespace-nowrap ${activeTab === 'portal' ? 'text-emerald-700 font-bold' : 'text-slate-600'}`}
        >
          Tài liệu
        </button>
        <button
          onClick={() => setActiveTab('mobile')}
          className={`px-2 py-1 rounded font-medium whitespace-nowrap flex items-center gap-1 ${activeTab === 'mobile' ? 'text-emerald-700 font-bold' : 'text-slate-600'}`}
        >
          Mobile {pendingCount > 0 && `(${pendingCount})`}
        </button>
        <button
          onClick={() => setActiveTab('ca')}
          className={`px-2 py-1 rounded font-medium whitespace-nowrap ${activeTab === 'ca' ? 'text-emerald-700 font-bold' : 'text-slate-600'}`}
        >
          Máy chủ CA
        </button>
        <button
          onClick={() => setActiveTab('verify')}
          className={`px-2 py-1 rounded font-medium whitespace-nowrap ${activeTab === 'verify' ? 'text-emerald-700 font-bold' : 'text-slate-600'}`}
        >
          Kiểm định
        </button>
        <button
          onClick={() => setActiveTab('fraud')}
          className={`px-2 py-1 rounded font-medium whitespace-nowrap ${activeTab === 'fraud' ? 'text-rose-700 font-bold' : 'text-slate-600'}`}
        >
          Giả mạo {fraudIncidentCount > 0 && `(${fraudIncidentCount})`}
        </button>
        <button
          onClick={() => setActiveTab('thesis')}
          className={`px-2 py-1 rounded font-medium whitespace-nowrap ${activeTab === 'thesis' ? 'text-emerald-700 font-bold' : 'text-slate-600'}`}
        >
          Đề tài
        </button>
      </div>
    </header>
  );
};

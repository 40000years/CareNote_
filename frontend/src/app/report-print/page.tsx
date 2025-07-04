"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from 'next/link';

interface Report {
  date: string;
  time: string;
  name: string;
  location: string;
  event: string;
  imageUrl: string;
}

export default function ReportPrint() {
  const searchParams = useSearchParams();
  const reportId = searchParams.get('id');
  
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (reports.length > 0 && reportId) {
      const id = parseInt(reportId);
      if (id >= 0 && id < reports.length) {
        setSelectedReport(reports[id]);
      }
    }
  }, [reports, reportId]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/report');
      const data = await response.json();
      
      if (data.success) {
        setReports(data.reports);
      } else {
        console.error(data.error || 'Failed to fetch reports');
      }
    } catch (err) {
      console.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // เพิ่มฟังก์ชันแปลง Google Drive URL เป็น direct image link
  function getDirectImageUrl(driveUrl?: string) {
    if (!driveUrl) return '';
    const fileIdMatch = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || driveUrl.match(/id=([a-zA-Z0-9_-]+)/);
    const fileId = fileIdMatch ? fileIdMatch[1] : null;
    if (!fileId) return driveUrl;
    // Use smaller sz=w400 to reduce rate limiting
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
  }

  // เพิ่มฟังก์ชัน extract fileId
  function getDriveFileId(url: string) {
    const match = url.match(/\/d\/([\w-]+)/) || url.match(/id=([\w-]+)/);
    return match ? match[1] : null;
  }

  if (loading) {
    return (
      <div className="min-h-screen futuristic-bg flex items-center justify-center relative">
        {/* Animated background effect */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
          <div className="w-full max-w-2xl h-80 bg-gradient-to-br from-white/90 via-cyan-200/80 to-indigo-200/70 rounded-3xl blur-2xl shadow-2xl opacity-90 animate-bg-move"></div>
          <div className="absolute left-1/4 top-10 w-32 h-32 bg-cyan-300/30 rounded-full blur-3xl animate-float-particle2"></div>
          <div className="absolute right-1/4 bottom-10 w-24 h-24 bg-indigo-400/20 rounded-full blur-2xl animate-float-particle3"></div>
          <div className="absolute left-1/2 top-1/2 w-20 h-20 bg-white/40 rounded-full blur-2xl animate-float-particle"></div>
        </div>
        <div className="glass-card max-w-md w-full mx-auto p-10 rounded-3xl shadow-2xl border border-indigo-100 animate-fade-in relative z-10 flex flex-col items-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-400 via-cyan-400 to-indigo-300 animate-spin-slow shadow-xl flex items-center justify-center">
              <svg className="w-12 h-12 text-white/80 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.2" strokeWidth="4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 0 1 10 10" stroke="#6366f1" strokeWidth="4" />
              </svg>
            </div>
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-cyan-300/60 rounded-full blur-md animate-float-particle2"></div>
          </div>
          <h2 className="text-2xl font-bold text-indigo-700 mb-2 drop-shadow-lg">กำลังโหลดข้อมูล...</h2>
          <p className="text-gray-500 text-lg">โปรดรอสักครู่</p>
        </div>
      </div>
    );
  }

  if (!selectedReport) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-600 text-xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">ไม่พบรายงานที่เลือก</p>
          <Link 
            href="/reports"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            กลับไปหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white print:bg-white print:text-black">
      <div className="relative">
        <div className="navbar-bubble navbar-bubble-1"></div>
        <div className="navbar-bubble navbar-bubble-2"></div>
        <div className="navbar-bubble navbar-bubble-3"></div>
        <div className="navbar-bubble navbar-bubble-4"></div>
        <div className="navbar-bubble navbar-bubble-5"></div>
        <div className="navbar-bubble navbar-bubble-6"></div>
        <div className="navbar-bubble navbar-bubble-7"></div>
        <div className="navbar-bubble navbar-bubble-8"></div>
        <div className="navbar-bubble navbar-bubble-9"></div>
        <div className="navbar-bubble navbar-bubble-10"></div>
      {/* Navigation - only on screen, not print */}
        <nav className="nav-glass navbar-animate-in print:hidden">
          <div className="container-futuristic">
            <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-3">
                <img src="/singburi-logo.png" alt="Singburi School Logo" className="w-12 h-12 rounded-2xl border border-gray-300 navbar-logo navbar-logo-animate" />
                <span className="text-2xl font-bold gradient-text-primary">
                CareNote
              </span>
            </Link>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/report-form" className="text-gray-600 nav-link-animate font-medium">
                  สร้างรายงานใหม่
                </Link>
              <button
                onClick={handlePrint}
                  className="text-gray-600 nav-link-animate font-medium flex items-center ml-4"
                  type="button"
              >
                  <svg className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                พิมพ์รายงาน
              </button>
              </div>
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen && setMobileMenuOpen((v:boolean) => !v)}
                className="md:hidden p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-white/20">
                <div className="flex flex-col space-y-4">
                  <Link 
                    href="/report-form" 
                    className="text-gray-600 nav-link-animate font-medium w-full text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    สร้างรายงานใหม่
                  </Link>
                  <button
                    onClick={() => { setMobileMenuOpen(false); handlePrint(); }}
                    className="text-gray-600 nav-link-animate font-medium w-full text-center"
                    type="button"
                  >
                    พิมพ์รายงาน
                  </button>
                  <Link 
                    href="/reports" 
                    className="text-gray-600 nav-link-animate font-medium w-full text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                กลับไปหน้ารายงาน
              </Link>
            </div>
          </div>
            )}
        </div>
      </nav>
      </div>

      {/* Official Report Header - Same as print page */}
      <div className="max-w-4xl mx-auto pt-4 pb-3 border-b-2 border-gray-400 mb-4 print:mb-3 flex flex-col items-center">
        <div className="flex flex-col items-center gap-2 mb-2">
          <img src="/singburi-logo.png" alt="Singburi School Logo" className="w-10 h-10 rounded-full border border-gray-400 print:w-8 print:h-8" />
          <div className="text-center">
            <div className="text-xl font-bold tracking-wide text-gray-800 print:text-lg">โรงเรียนสิงห์บุรี</div>
          </div>
        </div>
        <div className="text-base font-bold mt-1 text-gray-800 print:text-sm border-t border-gray-300 pt-1">รายงานการปฏิบัติหน้าที่</div>
      </div>

      {/* Main Content - Same layout as print page */}
      <div className="max-w-4xl mx-auto px-4 pb-4 print:pb-2">
        {/* Info Section */}
        <div className="mb-4 print:mb-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 print:gap-3">
            <div className="space-y-1">
              <div className="font-bold text-gray-800 text-base print:text-sm">วันที่ปฏิบัติหน้าที่</div>
              <div className="border-b border-gray-400 pb-1 text-base print:text-sm font-medium">
                {formatDate(selectedReport.date)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-bold text-gray-800 text-base print:text-sm">เวลาการปฏิบัติหน้าที่</div>
              <div className="border-b border-gray-400 pb-1 text-base print:text-sm font-medium">
                {selectedReport.time}
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-bold text-gray-800 text-base print:text-sm">ชื่อผู้ปฏิบัติหน้าที่</div>
              <div className="border-b border-gray-400 pb-1 text-base print:text-sm font-medium">
                {selectedReport.name}
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-bold text-gray-800 text-base print:text-sm">สถานที่ปฏิบัติงาน</div>
              <div className="border-b border-gray-400 pb-1 text-base print:text-sm font-medium">
                {selectedReport.location}
              </div>
            </div>
          </div>
        </div>

        {/* Event Section */}
        <div className="mb-4 print:mb-3">
          <div className="font-bold text-gray-800 text-base mb-2 print:text-sm">รายละเอียดเหตุการณ์</div>
          <div className="border border-gray-300 rounded-lg p-3 min-h-[80px] text-sm whitespace-pre-line bg-white print:bg-white print:text-sm print:min-h-[60px] font-medium">
            {selectedReport.event}
          </div>
        </div>

        {/* Image Section */}
        {selectedReport.imageUrl && (
          <div className="mb-4 print:mb-3">
            <div className="font-bold text-gray-800 text-base mb-2 print:text-sm">รูปภาพประกอบ</div>
            <div className="flex justify-center">
              <img
                src={getDirectImageUrl(selectedReport.imageUrl)}
                alt="Report"
                className="w-full max-w-sm h-auto object-contain border border-gray-300 rounded-lg bg-white print:bg-white print:max-w-xs"
                style={{ maxHeight: '180px' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
          </div>
        )}

        {/* Signature/Footer Section */}
        <div className="mt-6 flex flex-col items-end print:mt-4 border-t border-gray-300 pt-3 print:pt-2">
          <div className="mb-3 print:mb-2 text-right">
            <div className="text-gray-800 mb-1 print:text-sm font-medium">ลงชื่อ....................................................</div>
            <div className="text-gray-800 mb-1 print:text-sm">(....................................................)</div>
            <div className="text-gray-800 print:text-sm">วันที่ {new Date().toLocaleDateString("th-TH")}</div>
          </div>
          <div className="text-xs text-gray-500 print:text-xs border-t border-gray-200 pt-1">
            เอกสารนี้สร้างจากระบบ CareNote | พิมพ์เมื่อ {new Date().toLocaleDateString("th-TH")} {new Date().toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
} 
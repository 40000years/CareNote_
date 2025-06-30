"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";

interface Report {
  id: string;
  date: string;
  time: string;
  name: string;
  location: string;
  event: string;
  imageUrl?: string;
}

export default function ReportPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editable state for print fields
  const [editData, setEditData] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    event: "",
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [resolvedParams.id]);

  async function fetchReport() {
    try {
      const response = await fetch(`/api/report/${resolvedParams.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch report");
      }
      const data = await response.json();
      // Handle the API response structure: { report: {...} }
      setReport(data.report || data);
      setEditData({
        name: data.report?.name || "",
        date: data.report?.date || "",
        time: data.report?.time || "",
        location: data.report?.location || "",
        event: data.report?.event || "",
      });
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      console.error("Error fetching report:", err);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatTime(timeString: string) {
    return timeString;
  }

  function handlePrint() {
    window.print();
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  }

  // เพิ่มฟังก์ชันแปลง Google Drive URL เป็น direct image link
  function getDirectImageUrl(driveUrl?: string) {
    if (!driveUrl) return '';
    const fileIdMatch = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || driveUrl.match(/id=([a-zA-Z0-9_-]+)/);
    const fileId = fileIdMatch ? fileIdMatch[1] : null;
    if (!fileId) return driveUrl;
    // Use smaller sz=w400 to reduce rate limiting
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
  }

  function getDriveFileId(driveUrl?: string) {
    if (!driveUrl) return null;
    const fileIdMatch = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || driveUrl.match(/id=([a-zA-Z0-9_-]+)/);
    return fileIdMatch ? fileIdMatch[1] : null;
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

  if (error || !report) {
    return (
      <div className="min-h-screen futuristic-bg">
        <div className="container-futuristic py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="glass-card text-center max-w-md mx-auto">
              <div className="w-20 h-20 neumorphic rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">ไม่พบรายงาน</h3>
              <p className="text-gray-600 mb-8">{error || "รายงานที่คุณค้นหาอาจถูกลบหรือไม่พบ"}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/reports" className="btn-futuristic-secondary">
                  กลับไปหน้ารายงาน
                </Link>
                <Link href="/report-form" className="btn-futuristic-primary">
                  สร้างรายงานใหม่
                </Link>
              </div>
            </div>
          </div>
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
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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

      {/* Official Print Header - Compact and professional */}
      <div className="max-w-4xl mx-auto pt-4 pb-3 border-b-2 border-gray-400 mb-4 print:mb-3 flex flex-col items-center">
        <div className="flex flex-col items-center gap-2 mb-2">
          <img src="/singburi-logo.png" alt="Singburi School Logo" className="w-10 h-10 rounded-full border border-gray-400 print:w-8 print:h-8" />
          <div className="text-center">
            <div className="text-xl font-bold tracking-wide text-gray-800 print:text-lg">โรงเรียนสิงห์บุรี</div>
          </div>
        </div>
        <div className="text-base font-bold mt-1 text-gray-800 print:text-sm border-t border-gray-300 pt-1">รายงานการปฏิบัติหน้าที่</div>
      </div>

      {/* Main Content - Compact layout */}
      <div className="max-w-4xl mx-auto px-4 pb-4 print:pb-2">
        {/* Info Section - Compact spacing */}
        <div className="mb-4 print:mb-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 print:gap-3">
            <div className="space-y-1">
              <div className="font-bold text-gray-800 text-base print:text-sm">วันที่ปฏิบัติหน้าที่</div>
              <input
                type="date"
                name="date"
                value={editData.date}
                onChange={handleEditChange}
                className="input-futuristic w-full border-b border-gray-400 pb-1 bg-white print:bg-white print:text-sm font-medium"
                readOnly={false}
              />
            </div>
            <div className="space-y-1">
              <div className="font-bold text-gray-800 text-base print:text-sm">เวลาการปฏิบัติหน้าที่</div>
              <input
                type="text"
                name="time"
                value={editData.time}
                onChange={handleEditChange}
                className="input-futuristic w-full border-b border-gray-400 pb-1 bg-white print:bg-white print:text-sm font-medium"
                readOnly={false}
              />
            </div>
            <div className="space-y-1">
              <div className="font-bold text-gray-800 text-base print:text-sm">ชื่อผู้ปฏิบัติหน้าที่</div>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleEditChange}
                className="input-futuristic w-full border-b border-gray-400 pb-1 bg-white print:bg-white print:text-sm font-medium"
                readOnly={false}
              />
            </div>
            <div className="space-y-1">
              <div className="font-bold text-gray-800 text-base print:text-sm">สถานที่ปฏิบัติงาน</div>
              <input
                type="text"
                name="location"
                value={editData.location}
                onChange={handleEditChange}
                className="input-futuristic w-full border-b border-gray-400 pb-1 bg-white print:bg-white print:text-sm font-medium"
                readOnly={false}
              />
            </div>
          </div>
        </div>

        {/* Event Section - Compact */}
        <div className="mb-4 print:mb-3">
          <div className="font-bold text-gray-800 text-base mb-2 print:text-sm">รายละเอียดเหตุการณ์</div>
          <textarea
            name="event"
            value={editData.event}
            onChange={handleEditChange}
            className="input-futuristic w-full border border-gray-300 rounded-lg p-3 min-h-[80px] text-sm whitespace-pre-line bg-white print:bg-white print:text-sm print:min-h-[60px] font-medium"
            readOnly={false}
          />
        </div>

        {/* Image Section - Compact */}
        {report.imageUrl && (
          <div className="mb-4 print:mb-3">
            <div className="font-bold text-gray-800 text-base mb-2 print:text-sm">รูปภาพประกอบ</div>
            <div className="flex justify-center">
              {getDriveFileId(report.imageUrl) && (
                <iframe
                  src={`https://drive.google.com/file/d/${getDriveFileId(report.imageUrl)}/preview`}
                  width="100%"
                  height="224"
                  style={{ border: 0, borderRadius: '16px', boxShadow: '0 2px 8px #0002' }}
                  allow="autoplay"
                  title="Report Image"
                ></iframe>
              )}
            </div>
          </div>
        )}

        {/* Signature/Footer Section - Compact */}
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
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

  if (loading) {
    return (
      <div className="min-h-screen futuristic-bg">
        <div className="container-futuristic py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="spinner-futuristic mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg">กำลังโหลดข้อมูล...</p>
            </div>
          </div>
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
      {/* Navigation - only on screen, not print */}
      <nav className="nav-glass print:hidden">
        <div className="container-futuristic py-2">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/singburi-logo.png" alt="Singburi School Logo" className="w-8 h-8 rounded-full border border-gray-300" />
              <span className="text-xl font-bold gradient-text-primary">
                CareNote
              </span>
            </Link>
            <div className="flex items-center space-x-6">
              <button
                onClick={handlePrint}
                className="btn-futuristic-primary group"
              >
                <svg className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                พิมพ์รายงาน
              </button>
              <Link href="/reports" className="btn-futuristic-secondary group">
                <svg className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                กลับไปหน้ารายงาน
              </Link>
            </div>
          </div>
        </div>
      </nav>

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
              <img
                src={report.imageUrl}
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
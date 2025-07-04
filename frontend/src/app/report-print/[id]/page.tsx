"use client";
import { useEffect, useState, use, useRef, useCallback } from "react";
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

// เพิ่ม type ให้กับ props ของ InlineEditableText
interface InlineEditableTextProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  as?: 'div' | 'textarea';
  placeholder?: string;
}

// Inline editable text component
function InlineEditableText({ value, onChange, className, as = "div", placeholder = "-" }: InlineEditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);
  useEffect(() => { setTemp(value); }, [value]);

  function handleBlur() {
    setEditing(false);
    if (temp !== value) onChange(temp);
  }
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (e.key === "Enter" && (!editing || as !== "textarea" || e.ctrlKey)) {
      setEditing(false);
      if (temp !== value) onChange(temp);
    } else if (e.key === "Escape") {
      setEditing(false);
      setTemp(value);
    }
  }

  if (editing) {
    if (as === "textarea") {
      return (
        <textarea
          ref={ref}
          className={className + " border border-blue-300 rounded px-2 py-1 bg-white"}
          value={temp}
          onChange={e => setTemp(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          rows={4}
          style={{ minHeight: 80 }}
        />
      );
    }
    return (
      <input
        ref={ref}
        className={className + " border border-blue-300 rounded px-2 py-1 bg-white"}
        value={temp}
        onChange={e => setTemp(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    );
  }
  // Not editing: show as plain text, no border, no bg
  return (
    <span
      className={className + " cursor-pointer hover:bg-blue-50 transition block whitespace-pre-line min-h-[80px]"}
      onClick={() => setEditing(true)}
      tabIndex={0}
      title="คลิกเพื่อแก้ไข"
      style={{ border: "none", background: "none", padding: 0 }}
    >
      {value?.trim() ? value : <span className="text-gray-400">{placeholder}</span>}
    </span>
  );
}

// Memory cache for base64 images (per session)
const base64Cache = {} as Record<string, string>;

function getDriveFileId(url: string | undefined | null) {
  if (!url) return null;
  const match = url.match(/\/d\/([\w-]+)/) || url.match(/id=([\w-]+)/);
  return match ? match[1] : null;
}

function DriveImage({ imageUrl, alt }: { imageUrl?: string, alt?: string }) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileId = getDriveFileId(imageUrl);

  useEffect(() => {
    let ignore = false;
    if (!fileId) return;
    if (base64Cache[fileId]) {
      setImgSrc(base64Cache[fileId]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/drive-base64/${fileId}`)
      .then(res => res.json())
      .then(data => {
        if (!ignore && data.base64 && data.mimeType) {
          const src = `data:${data.mimeType};base64,${data.base64}`;
          base64Cache[fileId] = src;
          setImgSrc(src);
        }
      })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [fileId]);

  if (!fileId) return null;
  if (loading) return <div className="w-full h-72 bg-gray-100 animate-pulse rounded-xl" />;
  if (!imgSrc) return <div className="w-full h-72 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">ไม่พบรูป</div>;
  return (
    <img
      src={imgSrc}
      alt={alt}
      className="rounded-md max-w-full max-h-[320px] border"
      style={{ margin: '0 auto', background: '#f3f4f6' }}
      loading="lazy"
    />
  );
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

  const [base64Image, setBase64Image] = useState<string | null>(null);

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

  function handlePrint() {
    window.print();
  }

  // โหลด base64 image เฉพาะตอน print
  const fetchBase64Image = useCallback(async (fileId: string) => {
    try {
      const res = await fetch(`/api/drive-base64/${fileId}`);
      const data = await res.json();
      if (data.base64 && data.mimeType) {
        setBase64Image(`data:${data.mimeType};base64,${data.base64}`);
      }
    } catch {
      setBase64Image(null);
    }
  }, []);

  // โหลด base64 image เมื่อจะ print (หรือเมื่อเข้าโหมด print)
  useEffect(() => {
    const fileId = getDriveFileId(report?.imageUrl);
    if (!fileId) return;
    function beforePrint() {
      if (!base64Image) fetchBase64Image(fileId);
    }
    window.addEventListener('beforeprint', beforePrint);
    // สำหรับกรณีเข้า print preview บาง browser
    if (window.matchMedia) {
      const mediaQueryList = window.matchMedia('print');
      const listener = (mql) => { if (mql.matches && !base64Image) fetchBase64Image(fileId); };
      mediaQueryList.addEventListener('change', listener);
      return () => {
        window.removeEventListener('beforeprint', beforePrint);
        mediaQueryList.removeEventListener('change', listener);
      };
    } else {
      return () => window.removeEventListener('beforeprint', beforePrint);
    }
  }, [report?.imageUrl, base64Image, fetchBase64Image]);

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
      {/* Navbar/Menu (แสดงเฉพาะบนหน้าจอ) */}
      <div className="relative print:hidden">
        <div className="navbar-bubble navbar-bubble-1 print:hidden"></div>
        <div className="navbar-bubble navbar-bubble-2 print:hidden"></div>
        <div className="navbar-bubble navbar-bubble-3 print:hidden"></div>
        <div className="navbar-bubble navbar-bubble-4 print:hidden"></div>
        <div className="navbar-bubble navbar-bubble-5 print:hidden"></div>
        <div className="navbar-bubble navbar-bubble-6 print:hidden"></div>
        <div className="navbar-bubble navbar-bubble-7 print:hidden"></div>
        <div className="navbar-bubble navbar-bubble-8 print:hidden"></div>
        <div className="navbar-bubble navbar-bubble-9 print:hidden"></div>
        <div className="navbar-bubble navbar-bubble-10 print:hidden"></div>
        <nav className="nav-glass navbar-animate-in">
          <div className="container-futuristic">
            <div className="flex items-center justify-between h-20">
              <Link href="/" className="flex items-center space-x-3">
                <img src="/singburi-logo.png" alt="Singburi School Logo" className="w-12 h-12 rounded-2xl border border-gray-300 navbar-logo navbar-logo-animate" />
                <span className="text-2xl font-bold gradient-text-primary">CareNote</span>
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/report-form" className="text-gray-600 nav-link-animate font-medium">สร้างรายงานใหม่</Link>
                <button onClick={handlePrint} className="text-gray-600 nav-link-animate font-medium flex items-center ml-4" type="button">
                  <svg className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  พิมพ์รายงาน
                </button>
              </div>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            {mobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-white/20">
                <div className="flex flex-col space-y-4">
                  <Link href="/report-form" className="text-gray-600 nav-link-animate font-medium w-full text-center" onClick={() => setMobileMenuOpen(false)}>สร้างรายงานใหม่</Link>
                  <button onClick={() => { setMobileMenuOpen(false); handlePrint(); }} className="text-gray-600 nav-link-animate font-medium w-full text-center" type="button">พิมพ์รายงาน</button>
                  <Link href="/reports" className="text-gray-600 nav-link-animate font-medium w-full text-center" onClick={() => setMobileMenuOpen(false)}>กลับไปหน้ารายงาน</Link>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* ฟอร์มราชการ: โลโก้และหัวข้อ */}
      <div className="max-w-[800px] mx-auto pt-6 pb-1 flex flex-col items-center print:pt-2 print:pb-0">
        <img src="/singburi-logo.png" alt="โลโก้" className="w-20 h-20 mb-1 print:w-16 print:h-16" />
        <div className="text-2xl font-bold text-center mt-1 mb-0.5 print:text-xl">รายงานการปฏิบัติหน้าที่ดูแลนักเรียนในวันทำการ</div>
        <div className="text-base font-medium text-center mt-0 mb-0.5 print:text-sm">โรงเรียนสิงห์บุรี</div>
        <div className="text-base font-medium text-center mt-0 print:text-sm">วันที่ {editData.date ? formatDate(editData.date) : "-"}</div>
      </div>

      {/* รายชื่อผู้ปฏิบัติหน้าที่ */}
      <div className="max-w-[800px] mx-auto mt-4 print:mt-2">
        <div className="font-bold text-base print:text-sm mb-1">ผู้ปฏิบัติหน้าที่เวรประจำวัน ดังนี้</div>
        <div className="ml-6 print:ml-8 text-base print:text-sm">
          <InlineEditableText
            value={editData.name}
            onChange={val => setEditData(d => ({ ...d, name: val }))}
            className=""
            placeholder="............................................."
          />
        </div>
      </div>

      {/* เนื้อหาเหตุการณ์ */}
      <div className="max-w-[800px] mx-auto mt-6 print:mt-4">
        <div className="font-bold text-base print:text-sm mb-1">เหตุการณ์โดยภาพรวม มีเหตุการณ์เกิดขึ้น อธิบาย</div>
        <InlineEditableText
          value={editData.event}
          onChange={val => setEditData(d => ({ ...d, event: val }))}
          className="border border-gray-300 rounded-md p-4 min-h-[80px] text-base print:text-sm whitespace-pre-line bg-white print:bg-white w-full"
          as="textarea"
          placeholder="............................................."
        />
      </div>

      {/* รูปภาพกิจกรรม */}
      {report.imageUrl && (
        <div className="max-w-[800px] mx-auto mt-6 print:mt-4">
          <div className="font-bold text-base print:text-sm mb-1">รูปภาพประกอบ</div>
          <div className="flex justify-center">
            <DriveImage imageUrl={report.imageUrl} alt="Report Image" />
          </div>
        </div>
      )}

      {/* ลายเซ็น/ผู้รับรอง */}
      <div className="max-w-[800px] mx-auto mt-10 print:mt-8 flex flex-col items-end">
        <div className="mb-2 text-right">
          <div className="text-base print:text-sm mb-1">ลงชื่อ............................................................</div>
          <div className="text-base print:text-sm mb-1">(............................................................)</div>
          <div className="text-base print:text-sm">ตำแหน่ง....................................................</div>
        </div>
      </div>
    </div>
  );
} 
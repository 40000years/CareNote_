"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TIME_OPTIONS = [
  "07.00 – 08.00 น.",
  "07.30 – 08.20 น.",
  "08.00 – 09.00 น.",
  "11.05 – 11.55 น.",
  "12.00 – 12.50 น.",
  "15.35 – 17.00 น."
];
const LOCATION_OPTIONS = [
  "บริเวณสะพานลอย",
  "บริเวณจุดรับ-ส่งนักเรียนหน้าโรงเรียน(ป้ายโรงเรียน)",
  "หลังป้อมตำรวจและแนวกำแพงด้านนอกโรงเรียนด้านที่ติดกับสนามกีฬาจังหวัดสิงห์บุรี",
  "บริเวณประตูเข้า-ออกหน้าโรงเรียน",
  "บริเวณประตูเข้า-ออกโรงเก็บรถจักรยานยนต์",
  "บริเวณถนนหน้าพระพุทธสิหิงมงคล",
  "บริเวณสี่แยกอาคาร ๕ และอาคาร ๕",
  "ดูแลนักเรียนมาสาย",
  "โรงอาหาร คาบเรียนที่ ๕",
  "โรงอาหาร คาบเรียนที่ ๖",
  "สนามกีฬาจังหวัดสิงห์บุรี",
  "งานประชาสัมพันธ์และกิจกรรมหน้าเสาธง",
  "หัวหน้าประจำวันและดูแลความปลอดภัยในโรงเรียน"
];

export default function ReportForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    date: "",
    time: "",
    name: "",
    location: "",
    event: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setProgress("กำลังอัปโหลดรูปภาพ...");
    
    try {
      let imageUrl = "";
      
      // Start image upload if there's an image
      const uploadPromise = image ? (async () => {
        const formData = new FormData();
        formData.append("file", image);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        return uploadData.fileUrl;
      })() : Promise.resolve("");

      // Wait for image upload to complete
      imageUrl = await uploadPromise;
      
      setProgress("กำลังบันทึกข้อมูล...");

      // Save report data
      const reportData = {
        date: form.date,
        time: form.time,
        name: form.name,
        location: form.location,
        event: form.event,
        imageUrl: imageUrl,
      };

      const reportRes = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
      });

      if (!reportRes.ok) {
        throw new Error('Failed to save report');
      }

      setProgress("บันทึกสำเร็จ! กำลังไปยังหน้ารายงาน...");

      // Success - redirect to reports page
      setTimeout(() => {
        router.push("/reports");
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
      setProgress("");
    }
  }

  return (
    <div className="min-h-screen futuristic-bg relative overflow-hidden">
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
        {/* Navigation */}
        <nav className="nav-glass navbar-animate-in">
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
                <Link href="/reports" className="text-gray-600 nav-link-animate font-medium">
                  รายงานทั้งหมด
                </Link>
                <Link href="/" className="text-gray-600 nav-link-animate font-medium">
                  หน้าแรก
                </Link>
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
                    href="/reports" 
                    className="text-gray-600 hover:text-indigo-600 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-white/10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    รายงานทั้งหมด
                  </Link>
                  <Link 
                    href="/" 
                    className="btn-futuristic-secondary w-full text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    หน้าแรก
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center py-12 relative z-10">
        {/* Animated background effect behind form block */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
          <div className="w-full max-w-2xl h-96 bg-gradient-to-br from-white/95 via-cyan-200/80 to-indigo-200/70 rounded-3xl blur-2xl shadow-2xl opacity-90 animate-bg-move"></div>
          <div className="absolute left-1/4 top-10 w-32 h-32 bg-cyan-300/30 rounded-full blur-3xl animate-float-particle2"></div>
          <div className="absolute right-1/4 bottom-10 w-24 h-24 bg-indigo-400/20 rounded-full blur-2xl animate-float-particle3"></div>
          <div className="absolute left-1/2 top-1/2 w-20 h-20 bg-white/40 rounded-full blur-2xl animate-float-particle"></div>
        </div>
        <div className="glass-card max-w-2xl w-full mx-auto p-8 rounded-3xl shadow-2xl border border-indigo-100 animate-fade-in relative z-10">
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-8 text-center drop-shadow-lg tracking-tight">
            สร้างรายงานใหม่
          </h1>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-700">
                  วันที่ปฏิบัติหน้าที่ *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className="input-futuristic-with-icon rounded-xl shadow-inner border border-gray-300 focus:border-indigo-300 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-700">
                  เวลาการปฏิบัติหน้าที่ *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <select
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    required
                    className="input-futuristic-with-icon appearance-none pr-8 rounded-xl shadow-inner border border-gray-300 focus:border-indigo-300 focus:ring-indigo-500"
                  >
                    <option value="" disabled>เลือกช่วงเวลา</option>
                    {TIME_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-700">
                  ชื่อผู้ปฏิบัติหน้าที่ *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="ชื่อ-นามสกุล"
                    className="input-futuristic-with-icon rounded-xl shadow-inner border border-gray-300 focus:border-indigo-300 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-700">
                  สถานที่ปฏิบัติงาน *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <select
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                    className="input-futuristic-with-icon appearance-none pr-8 rounded-xl shadow-inner border border-gray-300 focus:border-indigo-300 focus:ring-indigo-500"
                  >
                    <option value="" disabled>เลือกสถานที่</option>
                    {LOCATION_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-700">
                รายละเอียดเหตุการณ์ *
              </label>
              <div className="relative">
                <div className="absolute top-4 left-4 flex items-start pointer-events-none">
                  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-2h6a2 2 0 012 2v12a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <textarea
                  name="event"
                  value={form.event}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="รายละเอียดการปฏิบัติหน้าที่ เหตุการณ์ที่เกิดขึ้น และข้อสังเกตสำคัญ..."
                  className="textarea-futuristic-with-icon rounded-xl shadow-inner border border-gray-300 focus:border-indigo-300 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                รูปภาพประกอบ (Optional)
              </label>
              <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-2xl border-2 border-dashed border-indigo-200 shadow-inner">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-indigo-400 file:to-cyan-400 file:text-white hover:file:from-indigo-500 hover:file:to-cyan-500 transition-all duration-200"
                />
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-xl border-2 border-indigo-200 shadow-md mb-2" />
                ) : (
                  <svg className="w-16 h-16 text-indigo-400 animate-bounce mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                )}
                <p className="text-gray-500 text-lg font-medium mb-2">{imagePreview ? 'เลือกรูปใหม่ได้อีกครั้ง' : 'ยังไม่ได้เลือกรูปภาพ'}</p>
                <p className="text-gray-400 text-sm">(รองรับไฟล์ภาพ JPG, PNG, GIF ขนาดไม่เกิน 5MB)</p>
              </div>
            </div>
            {loading && (
              <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen">
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
                  <h2 className="text-2xl font-bold text-indigo-700 mb-2 drop-shadow-lg">{progress || 'กำลังโหลดข้อมูล...'}</h2>
                  <p className="text-gray-500 text-lg">โปรดรอสักครู่</p>
                </div>
              </div>
            )}
            {!loading && (
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 text-white font-bold text-lg shadow-lg hover:from-indigo-600 hover:to-cyan-500 active:scale-95 transition-all duration-200 mt-6"
                disabled={loading}
              >
                {loading ? 'กำลังบันทึก...' : 'บันทึกรายงาน'}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
} 
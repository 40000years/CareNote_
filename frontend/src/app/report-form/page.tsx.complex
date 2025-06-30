"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const icons = {
  date: (
    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  ),
  time: (
    <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ),
  name: (
    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  ),
  location: (
    <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  ),
  event: (
    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-2h6a2 2 0 012 2v12a2 2 0 01-2 2z" /></svg>
  ),
  image: (
    <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 11a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
  ),
};

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
  const [showTimeFallback, setShowTimeFallback] = useState(false);
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
        return uploadData.url;
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

  // Detect if input type="time" is supported
  function handleTimeFocus(e: React.FocusEvent<HTMLInputElement>) {
    if (e.target.type !== "time") {
      setShowTimeFallback(true);
    }
  }

  return (
    <div className="min-h-screen futuristic-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="nav-glass">
        <div className="container-futuristic">
          <div 
            className="flex items-center justify-between h-20"
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <Link 
              href="/" 
              className="flex items-center space-x-3"
              style={{
                flexShrink: 0,
                marginRight: 'auto'
              }}
            >
              <img src="/singburi-logo.png" alt="Singburi School Logo" className="w-12 h-12 rounded-2xl border border-gray-300 navbar-logo" />
              <span className="text-2xl font-bold gradient-text-primary">
                CareNote
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/reports" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium hover:scale-105 transform duration-200">
                รายงานทั้งหมด
              </Link>
              <Link href="/" className="btn-futuristic-secondary">
                หน้าแรก
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20"
              style={{
                marginLeft: 'auto',
                flexShrink: 0
              }}
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

      {/* Main Content */}
      <div className="container-futuristic py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              สร้างรายงานใหม่
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              บันทึกรายละเอียดการปฏิบัติหน้าที่ของคุณอย่างครบถ้วนและเป็นระเบียบ
            </p>
          </div>

          {/* Form */}
          <div className="glass-card animate-scale-in">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Date and Time Row */}
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
                      className="input-futuristic-with-icon"
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
                      className="input-futuristic-with-icon appearance-none pr-8"
                    >
                      <option value="" disabled>เลือกช่วงเวลา</option>
                      {TIME_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Name and Location Row */}
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
                      className="input-futuristic-with-icon"
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
                      className="input-futuristic-with-icon appearance-none pr-8"
                    >
                      <option value="" disabled>เลือกสถานที่</option>
                      {LOCATION_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Event Description */}
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
                    className="textarea-futuristic-with-icon"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-700">
                  อัปโหลดรูปภาพ (ไม่บังคับ)
                </label>
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-2xl shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImage(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="btn-futuristic-secondary text-red-600 hover:text-red-700"
                      >
                        ลบรูปภาพ
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="neumorphic-inset p-12 text-center cursor-pointer hover:scale-105 transition-transform duration-300"
                    >
                      <div className="w-20 h-20 neumorphic rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 gradient-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold text-gray-700 mb-2">คลิกเพื่ออัปโหลดรูปภาพ</p>
                      <p className="text-gray-500">รองรับไฟล์ JPG, PNG, GIF ขนาดไม่เกิน 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Indicator */}
              {loading && (
                <div className="glass-card text-center">
                  <div className="spinner-futuristic mx-auto mb-4"></div>
                  <p className="text-lg font-semibold text-gray-700">{progress}</p>
                </div>
              )}

              {/* Submit Button */}
              {!loading && (
                <div className="flex flex-col sm:flex-row gap-6 pt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-futuristic-primary text-lg px-12 py-5 group flex-1"
                  >
                    <svg className="w-7 h-7 mr-3 inline group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    บันทึกรายงาน
                  </button>
                  
                  <Link href="/reports" className="btn-futuristic-secondary text-lg px-12 py-5 group flex-1 text-center">
                    <svg className="w-7 h-7 mr-3 inline group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    ยกเลิก
                  </Link>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 
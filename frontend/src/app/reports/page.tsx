"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Report {
  id: string;
  date: string;
  time: string;
  name: string;
  location: string;
  event: string;
  imageUrl?: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [timeFilter, setTimeFilter] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  const totalPages = Math.ceil(filteredReports.length / pageSize);
  const paginatedReports = filteredReports.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchReports();
  }, []);

  // Filter reports when search or filters change
  useEffect(() => {
    let filtered = reports;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.event.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter(report => report.date === dateFilter);
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter(report =>
        report.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  }, [reports, searchTerm, dateFilter, locationFilter]);

  // Reset to page 1 when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateFilter, locationFilter]);

  async function fetchReports() {
    try {
      const response = await fetch("/api/reports");
      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }
      const data = await response.json();
      // Handle the API response structure: { reports: [...] }
      setReports(data.reports || []);
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      console.error("Error fetching reports:", err);
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

  function clearFilters() {
    setSearchTerm("");
    setDateFilter("");
    setLocationFilter("");
    setTimeFilter("");
  }

  // Get unique locations for filter dropdown
  const uniqueLocations = [...new Set(reports.map(report => report.location))];
  const uniqueDates = [...new Set(reports.map(report => report.date))];

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

  if (error) {
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
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">เกิดข้อผิดพลาด</h3>
              <p className="text-gray-600 mb-8">{error}</p>
              <button
                onClick={fetchReports}
                className="btn-futuristic-primary"
              >
                ลองใหม่อีกครั้ง
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/singburi-logo.png" alt="Singburi School Logo" className="w-12 h-12 rounded-2xl border border-gray-300 navbar-logo" />
              <span className="text-2xl font-bold gradient-text-primary">
                CareNote
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/report-form" className="btn-futuristic-primary">
                สร้างรายงานใหม่
              </Link>
              <Link href="/" className="btn-futuristic-secondary">
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
                  href="/report-form" 
                  className="btn-futuristic-primary w-full text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  สร้างรายงานใหม่
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
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            รายงานการปฏิบัติหน้าที่
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            ดูรายงานทั้งหมดที่บันทึกไว้ในระบบ
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="container-futuristic mb-8">
          <div className="glass-card p-6 search-filter-container">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="ค้นหารายงาน..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-futuristic-with-icon w-full pl-10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex-1 sm:flex-none">
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="input-futuristic w-full sm:w-auto"
                    placeholder="วันที่"
                  />
                </div>
                <div className="flex-1 sm:flex-none">
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="input-futuristic w-full sm:w-auto"
                  >
                    <option value="">ทุกสถานที่</option>
                    <option value="อาคาร 1">อาคาร 1</option>
                    <option value="อาคาร 2">อาคาร 2</option>
                    <option value="อาคาร 3">อาคาร 3</option>
                    <option value="อาคาร 4">อาคาร 4</option>
                    <option value="อาคาร 5">อาคาร 5</option>
                    <option value="โรงอาหาร">โรงอาหาร</option>
                    <option value="สนามกีฬา">สนามกีฬา</option>
                    <option value="ห้องสมุด">ห้องสมุด</option>
                    <option value="ห้องพยาบาล">ห้องพยาบาล</option>
                    <option value="ห้องประชุม">ห้องประชุม</option>
                    <option value="ลานหน้าโรงเรียน">ลานหน้าโรงเรียน</option>
                    <option value="ลานหลังโรงเรียน">ลานหลังโรงเรียน</option>
                    <option value="ถนนในโรงเรียน">ถนนในโรงเรียน</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                </div>
                <div className="flex-1 sm:flex-none">
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="input-futuristic w-full sm:w-auto"
                  >
                    <option value="">ทุกเวลา</option>
                    <option value="08:00">08:00</option>
                    <option value="08:30">08:30</option>
                    <option value="09:00">09:00</option>
                    <option value="09:30">09:30</option>
                    <option value="10:00">10:00</option>
                    <option value="10:30">10:30</option>
                    <option value="11:00">11:00</option>
                    <option value="11:30">11:30</option>
                    <option value="12:00">12:00</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reports List */}
        {filteredReports.length === 0 ? (
          <div className="text-center py-20 animate-scale-in">
            <div className="glass-card max-w-md mx-auto">
              <div className="w-24 h-24 neumorphic rounded-3xl flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                {reports.length === 0 ? "ยังไม่มีรายงาน" : "ไม่พบรายงานที่ตรงกับเงื่อนไข"}
              </h3>
              <p className="text-gray-600 mb-8">
                {reports.length === 0 
                  ? "เริ่มต้นด้วยการสร้างรายงานแรกของคุณ" 
                  : "ลองปรับเงื่อนไขการค้นหาหรือตัวกรองใหม่"
                }
              </p>
              {reports.length === 0 ? (
                <Link href="/report-form" className="btn-futuristic-primary">
                  <svg className="w-6 h-6 mr-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  สร้างรายงานใหม่
                </Link>
              ) : (
                <button
                  onClick={clearFilters}
                  className="btn-futuristic-secondary"
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {paginatedReports.map((report, index) => (
                <div 
                  key={report.id} 
                  className="glass-card card-hover animate-slide-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {/* Image */}
                  {report.imageUrl && (
                    <div className="mb-6">
                      <img
                        src={report.imageUrl}
                        alt="Report"
                        className="w-full h-56 object-cover rounded-2xl shadow-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="space-y-6">
                    {/* Date and Time */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 neumorphic rounded-xl flex items-center justify-center glow-secondary">
                          <svg className="w-5 h-5 gradient-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-gray-600">
                          {formatDate(report.date)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 neumorphic rounded-xl flex items-center justify-center glow-accent">
                          <svg className="w-5 h-5 gradient-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-gray-600">
                          {formatTime(report.time)}
                        </span>
                      </div>
                    </div>

                    {/* Name */}
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 neumorphic rounded-xl flex items-center justify-center glow-primary">
                        <svg className="w-5 h-5 gradient-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500">ชื่อผู้ปฏิบัติหน้าที่</h4>
                        <p className="text-lg font-semibold text-gray-900">{report.name}</p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 neumorphic rounded-xl flex items-center justify-center glow-secondary">
                        <svg className="w-5 h-5 gradient-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500">สถานที่ปฏิบัติงาน</h4>
                        <p className="text-lg font-semibold text-gray-900">{report.location}</p>
                      </div>
                    </div>

                    {/* Event */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 neumorphic rounded-xl flex items-center justify-center glow-accent">
                          <svg className="w-5 h-5 gradient-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-2h6a2 2 0 012 2v12a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h4 className="text-sm font-semibold text-gray-500">รายละเอียดเหตุการณ์</h4>
                      </div>
                      <p className="text-gray-700 leading-relaxed pl-13">
                        {report.event}
                      </p>
                    </div>

                    {/* View Details Button */}
                    <div className="pt-4">
                      <Link 
                        href={`/report-print/${report.id}`}
                        className="btn-futuristic-secondary w-full text-center group"
                      >
                        <svg className="w-5 h-5 mr-2 inline group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        ดูรายละเอียด
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="container-futuristic mt-8">
                <div className="glass-card p-4 pagination-container">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="text-sm text-gray-600 text-center sm:text-left">
                      แสดง {((currentPage - 1) * pageSize) + 1} ถึง {Math.min(currentPage * pageSize, filteredReports.length)} จาก {filteredReports.length} รายงาน
                    </div>
                    
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="btn-futuristic-secondary px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <div className="flex space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                                currentPage === pageNum
                                  ? "bg-indigo-600 text-white shadow-lg"
                                  : "bg-white/50 text-gray-700 hover:bg-white/80 hover:shadow-md"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="btn-futuristic-secondary px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 
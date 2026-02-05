import React from 'react';
import { Store, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.svg";

function Dashboard() {
  const loginOptions = [
    {
      title: "สำหรับร้านอาหาร",
      description: "จัดการเมนูและโปรโมชั่น",
      path: "/loginrestaurent",
      icon: <Store className="w-7 h-7 md:w-8 md:h-8" />,
      theme: "hover:border-red-500 ring-red-500/10",
      iconBg: "bg-red-50 text-red-600",
      accent: "bg-red-600"
    },
    {
      title: "สำหรับผู้ดูและระบบ",
      description: "ควบคุมและดูแลภาพรวมระบบ",
      path: "/loginadmin",
      icon: <ShieldCheck className="w-7 h-7 md:w-8 md:h-8" />,
      theme: "hover:border-gray-900 ring-gray-900/10",
      iconBg: "bg-gray-100 text-gray-900",
      accent: "bg-gray-900"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col items-center justify-start md:justify-center p-5 relative overflow-hidden">
      
      {/* Background Blobs (สวยทั้งคอมและมือถือ) */}
      <div className="absolute top-[-5%] left-[-10%] w-72 h-72 bg-red-50 rounded-full blur-[80px] opacity-70 pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-10%] w-72 h-72 bg-orange-50 rounded-full blur-[80px] opacity-70 pointer-events-none" />

      <div className="relative z-10 w-full max-w-[480px] md:max-w-4xl mt-10 md:mt-0">
        
        {/* Header - ปรับขนาดตัวอักษรให้พอดีมือถือ */}
        <div className="text-center mb-10 md:mb-16">
          <img 
            src={Logo} 
            alt="Logo" 
            className="w-20 h-20 mx-auto mb-6 drop-shadow-sm active:scale-95 transition-transform" 
          />
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-3 tracking-tight">
            ยินดีต้อนรับ
          </h1>
          <p className="text-gray-500 text-sm md:text-lg font-medium px-4">
            กรุณาเลือกประเภทผู้ใช้งานเพื่อเข้าสู่ระบบจัดการ
          </p>
        </div>

        {/* Selection Cards - บนมือถือจะเป็นแนวตั้ง 1 คอลัมน์ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {loginOptions.map((item, index) => (
            <Link 
              key={index} 
              to={item.path}
              className={`group relative bg-white p-6 md:p-10 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 active:scale-[0.97] md:hover:-translate-y-2 hover:ring-8 ${item.theme}`}
            >
              <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0">
                {/* Icon - ขนาดเล็กลงบนมือถือ */}
                <div className={`p-4 md:p-5 rounded-2xl md:mb-8 transition-transform ${item.iconBg}`}>
                  {item.icon}
                </div>
                
                <div className="flex-1">
                  <h2 className="text-lg md:text-2xl font-black text-gray-800 md:mb-3">
                    {item.title}
                  </h2>
                  <p className="text-gray-500 text-xs md:text-base leading-relaxed font-medium line-clamp-2 md:line-clamp-none">
                    {item.description}
                  </p>
                </div>

                {/* Arrow - แสดงเด่นชัดบนมือถือ */}
                <div className="md:hidden text-gray-300 group-hover:text-inherit">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>

              {/* Action Button - ซ่อนบนมือถือเพื่อความ Clean / โชว์บน Desktop */}
              <div className="hidden md:flex mt-8 items-center gap-2 font-bold text-gray-400 group-hover:text-inherit transition-all">
                <span className="text-[16px] uppercase tracking-widest"><h1>เข้าใช้งานระบบ</h1></span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Status */}
        <div className="mt-12 md:mt-20 flex flex-col items-center gap-3">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            © 2026 โปรเจคระบบดูดวงปาจื่อในร้านอาหาร
          </p>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
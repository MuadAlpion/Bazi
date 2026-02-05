import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { User, LogOut, ChefHat } from 'lucide-react'
import useEcom from '../store/bazi'
import toast from "react-hot-toast"
// นำเข้า Logo จาก assets
import LogoImg from '../assets/logo.svg' 

const Restaurentnav = () => {
  const actionLogout = useEcom((state) => state.actionLogout)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    actionLogout()
    navigate('/restaurent')
    toast.success("ออกจากระบบแล้ว")
  }

  const isActive = (path) => location.pathname === path

  return (
    <header className="fixed top-0 left-0 w-full z-50 shadow-sm border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 h-16 flex justify-between items-center">
        
        {/* LOGO SECTION - ปรับให้รองรับไฟล์ SVG */}
        <Link to="/restaurent" className="flex items-center gap-3 group">
          <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-xl group-hover:scale-105 transition-transform duration-300">
            <img 
              src={LogoImg} 
              alt="Bazi Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="font-black text-slate-800 text-base md:text-lg leading-none tracking-tight">
              BAZI <span className="text-rose-500">RESTAURANT</span>
            </h1>
            <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase hidden sm:block">
              Management System
            </span>
          </div>
        </Link>

        {/* ACTIONS SECTION - ปรับขนาดให้เหมาะกับนิ้วกดในมือถือ */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* ปุ่มหน้าเว็บร้าน */}
          <Link 
            to="/restaurent"
            className={`p-2.5 rounded-xl transition-all flex items-center gap-2 ${
              isActive('/restaurent') 
              ? 'bg-rose-50 text-rose-500' 
              : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <ChefHat size={22} />
          </Link>

          {/* ปุ่มโปรไฟล์ */}
          <Link 
            to="/restaurent/profilerestaurent"
            className={`p-2.5 rounded-xl transition-all flex items-center gap-2 ${
              isActive('/restaurent/profilerestaurent') 
              ? 'bg-rose-50 text-rose-500' 
              : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <User size={22} />
          </Link>

          {/* เส้นคั่นเล็กๆ */}
          <div className="w-[1px] h-5 bg-slate-200 mx-1"></div>

          {/* ปุ่ม Logout */}
          <button 
            onClick={handleLogout}
            className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all active:scale-90"
          >
            <LogOut size={22} />
          </button>
        </div>

      </div>
    </header>
  )
}

export default Restaurentnav
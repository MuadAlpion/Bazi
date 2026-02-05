import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, User, LogOut, X, LayoutDashboard, UtensilsCrossed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useUser from '../store/useUser';
import toast from "react-hot-toast";

// นำเข้า Logo จาก assets
import LogoImg from '../assets/logo.svg';

const Usernav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const actionLogout = useUser((state) => state.actionLogout);

  const toggleMenu = () => setIsOpen(!isOpen);
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    actionLogout();
    navigate('/goodbye'); // หรือ path ที่คุณต้องการ
    toast.success("ออกจากระบบแล้ว");
  };

  // Animation Variants สำหรับ Mobile Menu
  const menuVariants = {
    closed: { opacity: 0, height: 0, transition: { duration: 0.2 } },
    opened: { opacity: 1, height: "auto", transition: { duration: 0.3 } }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 shadow-sm border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 h-16 flex justify-between items-center">
          
          {/* LOGO SECTION - สไตล์เดียวกับ Restaurentnav */}
          <Link to="/user" className="flex items-center gap-3 group">
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
                Customer Portal
              </span>
            </div>
          </Link>

          {/* DESKTOP MENU - สไตล์ปุ่มแบบเดียวกับ Restaurentnav */}
          <nav className="hidden md:flex items-center gap-2">
            <Link 
              to="/user" 
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                isActive('/user') ? 'bg-rose-50 text-rose-500' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              แดชบอร์ด
            </Link>
            <Link 
              to="/user/allmenu" 
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                isActive('/user/allmenu') ? 'bg-rose-50 text-rose-500' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              รายการอาหารทั้งหมด
            </Link>

            <div className="w-[1px] h-5 bg-slate-200 mx-2"></div>

            <Link to='/user/profileuser' className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
              <User size={20} />
            </Link>
            <button onClick={handleLogout} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
              <LogOut size={20} />
            </button>
          </nav>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu} 
              className={`p-2 rounded-xl transition-all ${isOpen ? 'bg-rose-50 text-rose-500' : 'text-slate-500 bg-slate-50'}`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU - ปรับ UI ให้พรีเมียมและโค้งมน */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="opened"
              exit="closed"
              variants={menuVariants}
              className="absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl overflow-hidden md:hidden"
            >
              <div className="p-4 space-y-2">
                <Link 
                  to="/user" 
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-bold transition-all ${
                    isActive('/user') ? 'bg-rose-500 text-white' : 'text-slate-600 active:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard size={18} />
                  แดชบอร์ด
                </Link>
                <Link 
                  to="/user/allmenu" 
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-bold transition-all ${
                    isActive('/user/allmenu') ? 'bg-rose-500 text-white' : 'text-slate-600 active:bg-slate-50'
                  }`}
                >
                  <UtensilsCrossed size={18} />
                  รายการอาหารทั้งหมด
                </Link>
                
                <div className="pt-2 grid grid-cols-2 gap-3">
                  <Link 
                    to='/user/profileuser' 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 p-4 bg-slate-50 rounded-2xl text-slate-700 font-bold"
                  >
                    <User size={18} className="text-rose-500" />
                    <span className="text-xs">โปรไฟล์</span>
                  </Link>
                  <button 
                    onClick={() => { setIsOpen(false); handleLogout(); }}
                    className="flex items-center justify-center gap-2 p-4 bg-rose-50 rounded-2xl text-rose-600 font-bold"
                  >
                    <LogOut size={18} />
                    <span className="text-xs">ออกระบบ</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      {/* Spacer เพื่อป้องกันเนื้อหาโดนทับ */}
      <div className="h-16"></div>
    </>
  );
};

export default Usernav;
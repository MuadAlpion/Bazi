import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, ChevronRight, User, X, Filter, ArrowUpDown, Utensils, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useUser from "../../store/useUser";

const API_URL = import.meta.env.VITE_API_URL;
const FALLBACK_IMAGE = "https://t4.ftcdn.net/jpg/05/72/86/19/360_F_572861950_RfPLbfdWyCYB9B9vCGWuak9UFA0pN5Qo.jpg";

const ELEMENTS = ["ไม้", "ไฟ", "ดิน", "ทอง", "น้ำ"];

export default function Allmenu() {
  const navigate = useNavigate();
  const token = useUser((state) => state.token);
  const user = useUser((state) => state.user);

  const [menus, setMenus] = useState([]);
  const [loadingMenus, setLoadingMenus] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selectedMenu, setSelectedMenu] = useState(null);

  // Filter state
  const [selectedElements, setSelectedElements] = useState([]);
  const [priceSort, setPriceSort] = useState("asc");

  useEffect(() => {
    if (!token) navigate("/loginuser");
  }, [token, navigate]);

  // แก้บัค: เมื่อเปลี่ยนหน้าหรือ Filter ให้โหลดข้อมูลใหม่และเลื่อนขึ้นบน
  useEffect(() => {
    if (token) {
      fetchFilteredMenus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [token, page, selectedElements, priceSort]);

  const fetchFilteredMenus = async () => {
    try {
      setLoadingMenus(true);
      const res = await fetch(`${API_URL}/api/auth/menu/filter`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          element: selectedElements,
          price: priceSort,
          page: page,
        }),
      });

      const data = await res.json();
      setMenus(data.menu || []);
      setLastPage(data.lastPage || 1);
    } catch (err) {
      setMenus([]);
    } finally {
      setLoadingMenus(false);
    }
  };

  const toggleElement = (el) => {
    setPage(1); // รีเซ็ตหน้าเป็น 1 เสมอเมื่อเปลี่ยนตัวกรอง
    setSelectedElements((prev) =>
      prev.includes(el) ? prev.filter((e) => e !== el) : [...prev, el]
    );
  };

  const handlePriceSort = (sort) => {
    setPage(1); // รีเซ็ตหน้าเป็น 1 เสมอเมื่อเปลี่ยนการเรียงลำดับ
    setPriceSort(sort);
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-[#FCFBFA] pb-20 antialiased text-slate-900">
      <main className="container mx-auto px-4 md:px-10 pt-10 md:pt-16 max-w-7xl space-y-10">
        <HeaderSection user={user} />

        {/* FILTER BAR - สไตล์พรีเมียม */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-red-900 font-black uppercase tracking-widest text-xs">
            <Filter size={14} />
            <span>ปรับแต่งการค้นหา</span>
          </div>
          <FilterBar
            selectedElements={selectedElements}
            toggleElement={toggleElement}
            priceSort={priceSort}
            setPriceSort={handlePriceSort}
          />
        </div>

        <RecommendedMenusSection
          menus={menus}
          loading={loadingMenus}
          page={page}
          lastPage={lastPage}
          setPage={setPage}
          setSelectedMenu={setSelectedMenu}
        />
      </main>

      <AnimatePresence>
        {selectedMenu && (
          <MenuModal menu={selectedMenu} onClose={() => setSelectedMenu(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function HeaderSection({ user }) {
  return (
    <header className="space-y-1">
      <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
        ขอให้ทานอาหารอย่างมีความสุข,
      </h1>
      <h1 className="text-2xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-amber-600">
        {user?.displayName || user?.name}
      </h1>
    </header>
  );
}

function FilterBar({ selectedElements, toggleElement, priceSort, setPriceSort }) {
  return (
    <div className="bg-white rounded-[2rem] p-4 md:p-6 shadow-xl shadow-red-900/5 border border-amber-100 flex flex-col lg:flex-row lg:items-center gap-6">
      
      {/* Element Filters */}
      <div className="flex flex-wrap gap-2 flex-grow">
        {ELEMENTS.map((el) => {
          const isActive = selectedElements.includes(el);
          return (
            <button
              key={el}
              onClick={() => toggleElement(el)}
              className={`px-5 py-2 rounded-full font-black text-xs md:text-sm transition-all border-2 
                ${isActive 
                  ? "bg-red-900 border-red-900 text-amber-400 shadow-lg scale-105" 
                  : "bg-white border-slate-100 text-slate-400 hover:border-amber-200 hover:text-red-700"}`}
            >
              ธาตุ{el}
            </button>
          );
        })}
      </div>

      {/* Price Sort */}
      <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
        <button
          onClick={() => setPriceSort("asc")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs transition-all ${
            priceSort === "asc" ? "bg-white shadow-sm text-red-700" : "text-slate-400"
          }`}
        >
          <ArrowUpDown size={14} /> ราคา: น้อยไปมาก
        </button>
        <button
          onClick={() => setPriceSort("desc")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs transition-all ${
            priceSort === "desc" ? "bg-white shadow-sm text-red-700" : "text-slate-400"
          }`}
        >
          <ArrowUpDown size={14} className="rotate-180" /> ราคา: มากไปน้อย
        </button>
      </div>
    </div>
  );
}

function RecommendedMenusSection({ menus, loading, page, lastPage, setPage, setSelectedMenu }) {
  return (
    <section className="space-y-8">
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="aspect-[3/4] bg-slate-100 animate-pulse rounded-[2.5rem]" />
          ))}
        </div>
      ) : menus.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
          {menus.map((menu) => (
            <MenuCard key={menu.id} menu={menu} onClick={() => setSelectedMenu(menu)} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
          <Utensils className="mx-auto text-slate-200 mb-4" size={48} />
          <p className="text-slate-400 font-bold">ไม่พบเมนูที่ตรงตามเงื่อนไข</p>
        </div>
      )}

      {/* Pagination สไตล์พรีเมียม */}
      {lastPage > 1 && (
        <div className="flex justify-center pt-8">
          <div className="flex items-center gap-1 bg-red-950 p-1.5 rounded-full shadow-2xl border border-amber-500/30">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="w-10 h-10 flex items-center justify-center text-amber-500 disabled:opacity-20 hover:bg-white/10 rounded-full transition-all"
            >
              <ChevronRight size={20} className="rotate-180" />
            </button>
            <span className="px-4 text-white font-black text-sm">
              {page} / {lastPage}
            </span>
            <button
              disabled={page === lastPage}
              onClick={() => setPage((p) => p + 1)}
              className="w-10 h-10 flex items-center justify-center text-amber-500 disabled:opacity-20 hover:bg-white/10 rounded-full transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function MenuCard({ menu, onClick }) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl shadow-red-900/5 overflow-hidden border border-slate-50 flex flex-col h-full"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={menu.image_url || FALLBACK_IMAGE}
          alt={menu.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {menu.element?.map(el => (
            <span key={el} className="px-3 py-1 bg-red-900/90 text-amber-400 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-widest">
              {el}
            </span>
          ))}
        </div>
      </div>
      <div className="p-4 md:p-6 space-y-2 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-black text-sm md:text-xl text-slate-800 line-clamp-2 leading-tight group-hover:text-red-700 transition-colors">
            {menu.name}
          </h3>
        </div>
        <div className="flex justify-between items-center pt-2">
          <p className="text-red-700 font-black text-base md:text-2xl">฿{menu.price}</p>
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-700 group-hover:bg-red-700 group-hover:text-white transition-all">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MenuModal({ menu, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-red-950/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="bg-white rounded-t-[2.5rem] md:rounded-[3.5rem] w-full max-w-4xl overflow-hidden relative z-10 shadow-2xl max-h-[95vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-20 bg-red-50 text-red-900 p-2 rounded-full hover:bg-red-900 hover:text-white transition-all">
          <X size={24} />
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 h-72 md:h-[550px]">
            <img src={menu.image_url || FALLBACK_IMAGE} className="w-full h-full object-cover" />
          </div>
          <div className="p-8 md:p-12 md:w-1/2 space-y-6 flex flex-col justify-center">
            <div className="space-y-2">
               <div className="flex gap-2">
                {menu.element?.map(el => (
                  <span key={el} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">
                    ธาตุ{el}
                  </span>
                ))}
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">{menu.name}</h2>
              <p className="text-2xl md:text-3xl font-black text-amber-600">฿{menu.price}</p>
            </div>
            
            <p className="text-slate-500 leading-relaxed text-sm md:text-base">
              เมนูมงคลที่ช่วยปรับสมดุลธาตุในร่างกาย เสริมดวงชะตาและสร้างพลังบวกให้แก่คุณในมื้ออาหารที่แสนพิเศษนี้
            </p>

            <button onClick={onClose} className="w-full py-4 bg-red-900 text-amber-400 rounded-2xl font-black text-lg transition-all shadow-xl shadow-red-900/20 active:scale-95">
              รับทราบเมนูมงคล
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
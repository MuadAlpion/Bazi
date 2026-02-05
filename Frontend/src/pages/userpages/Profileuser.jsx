import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useUser from "../../store/useUser";
import toast from "react-hot-toast";
import {
  X, Loader2, User, LogOut, Phone,
  Calendar, MapPin, Sparkles, Clock, Settings, ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

function Profileuser() {
  const token = useUser((state) => state.token);
  const actionLogout = useUser((state) => state.actionLogout);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    gender: "",
    phone: "",
    birth_time: "",
    birth_place: "",
  });

  const [thaiBirthDate, setThaiBirthDate] = useState({
    day: "",
    month: "",
    year: ""
  });

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear() + 543;
    return Array.from({ length: 120 }, (_, i) => currentYear - i);
  }, []);

  const months = [
    { value: "01", label: "มกราคม" }, { value: "02", label: "กุมภาพันธ์" },
    { value: "03", label: "มีนาคม" }, { value: "04", label: "เมษายน" },
    { value: "05", label: "พฤษภาคม" }, { value: "06", label: "มิถุนายน" },
    { value: "07", label: "กรกฎาคม" }, { value: "08", label: "สิงหาคม" },
    { value: "09", label: "กันยายน" }, { value: "10", label: "ตุลาคม" },
    { value: "11", label: "พฤศจิกายน" }, { value: "12", label: "ธันวาคม" }
  ];

  const daysInMonth = useMemo(() => {
    if (!thaiBirthDate.month || !thaiBirthDate.year) return 31;
    const yearAD = parseInt(thaiBirthDate.year) - 543;
    const month = parseInt(thaiBirthDate.month);
    return new Date(yearAD, month, 0).getDate();
  }, [thaiBirthDate.month, thaiBirthDate.year]);

  useEffect(() => {
    if (!token) navigate("/loginuser");
  }, [token, navigate]);

  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/api/auth/detial`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const info = res.data?.info?.[0] || null;
      setProfile(info);
      if (info) {
        setForm({
          name: info.name || "",
          gender: info.gender || "",
          phone: info.phone || "",
          birth_time: info.birth_time?.slice(0, 5) || "",
          birth_place: info.birth_place || "",
        });
        if (info.birth_date) {
          const [y, m, d] = info.birth_date.split("-");
          setThaiBirthDate({ year: y, month: m, day: parseInt(d).toString() });
        }
      }
    } catch {
      toast.error("ดาวน์โหลดข้อมูลล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (v) => {
    const onlyNums = v.replace(/[^0-9]/g, "");
    if (onlyNums.length <= 10) setForm({ ...form, phone: onlyNums });
  };

  const handleUpdateProfile = async () => {
    if (!form.name.trim()) return toast.error("กรุณาระบุชื่อ-นามสกุล");
    if (form.phone.length !== 10) return toast.error("กรุณาระบุเบอร์โทรศัพท์ให้ครบ 10 หลัก");
    if (!thaiBirthDate.year || !thaiBirthDate.month || !thaiBirthDate.day) 
        return toast.error("กรุณาระบุวันเดือนปีเกิดให้ครบถ้วน");

    try {
      setSaving(true);
      const formattedDate = `${thaiBirthDate.year}-${thaiBirthDate.month}-${thaiBirthDate.day.padStart(2, '0')}`;
      const payload = { ...form, birth_date: formattedDate, birth_time: form.birth_time.slice(0, 5) };
      await axios.put(`${API_URL}/api/auth/editProfile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("ปรับปรุงข้อมูลเรียบร้อยแล้ว");
      setOpenEdit(false);
      fetchProfile();
    } catch (err) {
      toast.error("ไม่สามารถบันทึกข้อมูลได้");
    } finally {
      setSaving(false);
    }
  };

  if (!token || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-red-700" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FCFBFA] text-slate-900 antialiased font-line">
      {/* HEADER: ปรับให้กระชับขึ้นและลบรูปออก */}
      <div className="relative h-48 md:h-64 bg-red-950 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/50 to-red-950"></div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md mb-3">
            {profile?.name}
          </h1>
          <div className="px-4 py-1.5 bg-amber-500/20 backdrop-blur-md border border-amber-500/30 rounded-full">
            <p className="text-xs md:text-sm font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={14} /> ธาตุเจ้าเรือน: {profile?.main_element || "ไม่ระบุ"}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT: ปรับความกว้างให้พอดี Desktop (max-w-2xl) และ Mobile (w-full) */}
      <main className="container mx-auto max-w-2xl px-4 -mt-10 pb-12 relative z-20">
        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-red-900/10 border border-amber-100 overflow-hidden">
          
          <div className="px-6 md:px-10 py-6 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-red-700 rounded-full"></div>
                <h2 className="font-black text-lg md:text-xl text-slate-800">ข้อมูลดวงชะตา</h2>
            </div>
            <button onClick={() => setOpenEdit(true)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-700 rounded-full transition-all hover:bg-red-50">
                <Settings size={22} />
            </button>
          </div>

          <div className="divide-y divide-slate-50">
            <InfoRow label="นามที่ปรากฏ" value={profile?.name} icon={<User size={20}/>} />
            <InfoRow label="เพศกำเนิด" value={profile?.gender === 'male' ? 'ชาย' : 'หญิง'} icon={<ShieldCheck size={20}/>} />
            <InfoRow label="เลขหมายโทรศัพท์" value={profile?.phone} icon={<Phone size={20}/>} />
            <InfoRow label="วันเกิด (พ.ศ.)" value={profile?.birth_date} icon={<Calendar size={20}/>} />
            <InfoRow label="เวลาตกฟาก" value={profile?.birth_time?.slice(0,5)} icon={<Clock size={20}/>} />
            <InfoRow label="สถานที่เกิด" value={profile?.birth_place} icon={<MapPin size={20}/>} />
          </div>

          <div className="p-6 md:p-8 space-y-4 bg-slate-50/30">
            <button
              onClick={() => setOpenEdit(true)}
              className="w-full py-4 bg-red-900 text-amber-400 rounded-2xl font-black text-lg shadow-lg shadow-red-900/20 active:scale-[0.98] transition-all hover:bg-red-800"
            >
              แก้ไขข้อมูลส่วนตัว
            </button>
            <button
              onClick={() => { actionLogout(); navigate("/loginuser"); }}
              className="w-full py-2 text-slate-400 font-bold hover:text-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={18} /> ออกจากระบบ
            </button>
          </div>
        </div>
      </main>

      {/* EDIT MODAL: ปรับให้ Responsive */}
      <AnimatePresence>
        {openEdit && (
            <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-red-950/70 backdrop-blur-sm" onClick={() => setOpenEdit(false)} />

                <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                    className="relative bg-white w-full max-w-xl rounded-t-[2.5rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl overflow-y-auto max-h-[92vh]"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-black text-2xl text-slate-900">แก้ไขข้อมูลดวง</h3>
                        <button onClick={() => setOpenEdit(false)} className="p-2 bg-slate-100 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <ModernInput label="ชื่อ-นามสกุล" value={form.name} onChange={(v)=>setForm({...form,name:v})}/>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">เพศ</label>
                              <select value={form.gender} onChange={(e)=>setForm({...form, gender:e.target.value})}
                                  className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500 appearance-none">
                                  <option value="">เลือกเพศ</option>
                                  <option value="male">ชาย</option>
                                  <option value="female">หญิง</option>
                              </select>
                          </div>
                          <ModernInput label="เบอร์โทรศัพท์" value={form.phone} onChange={handlePhoneChange} maxLength={10} placeholder="0xxxxxxxxx" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">วัน/เดือน/ปีเกิด (พ.ศ.)</label>
                            <div className="grid grid-cols-3 gap-2">
                                <select value={thaiBirthDate.year} 
                                    onChange={(e) => setThaiBirthDate({ year: e.target.value, month: "", day: "" })}
                                    className="bg-slate-50 p-4 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-amber-500">
                                    <option value="">ปี พ.ศ.</option>
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                                <select value={thaiBirthDate.month} disabled={!thaiBirthDate.year}
                                    onChange={(e) => setThaiBirthDate(prev => ({ ...prev, month: e.target.value, day: "" }))}
                                    className="bg-slate-50 p-4 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50">
                                    <option value="">เดือน</option>
                                    {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                </select>
                                <select value={thaiBirthDate.day} disabled={!thaiBirthDate.month}
                                    onChange={(e) => setThaiBirthDate(prev => ({ ...prev, day: e.target.value }))}
                                    className="bg-slate-50 p-4 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50">
                                    <option value="">วันที่</option>
                                    {Array.from({ length: daysInMonth }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">เวลาตกฟาก</label>
                                <input type="time" value={form.birth_time} onChange={(e)=>setForm({...form, birth_time: e.target.value})}
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500" />
                            </div>
                            <ModernInput label="สถานที่เกิด" value={form.birth_place} onChange={(v)=>setForm({...form,birth_place:v})}/>
                        </div>

                        <button onClick={handleUpdateProfile} disabled={saving}
                            className="w-full bg-amber-500 hover:bg-amber-600 text-red-950 py-4 rounded-2xl font-black text-xl transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center active:scale-[0.98]">
                            {saving ? <Loader2 className="animate-spin"/> : "บันทึกการเปลี่ยนแปลง"}
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Sub-Components ---------- */

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 md:gap-6 px-6 md:px-10 py-5 hover:bg-slate-50/80 transition-colors group">
      <div className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-red-700 group-hover:bg-red-50 transition-all border border-transparent group-hover:border-red-100">
        {React.cloneElement(icon, { size: 22 })}
      </div>
      <div className="flex-1">
        <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="font-bold text-slate-800 text-sm md:text-base">{value || "ไม่ระบุ"}</p>
      </div>
    </div>
  );
}

function ModernInput({ label, value, onChange, type="text", maxLength, placeholder }) {
  return (
    <div className="space-y-1 w-full text-left">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <input 
          type={type} 
          value={value} 
          onChange={(e)=>onChange(e.target.value)}
          maxLength={maxLength}
          placeholder={placeholder}
          className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:ring-2 focus:ring-amber-500 transition-all outline-none" />
      </div>
    </div>
  );
}

export default Profileuser;
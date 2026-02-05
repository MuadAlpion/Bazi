import React, { useState, useEffect } from "react";
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useEcom from "../store/bazi";
import Logo from "../assets/logo.svg"; 

function LoginRestaurant() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const actionLogin = useEcom((state) => state.actionLogin);
  const token = useEcom((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/restaurent");
    }
  }, [token, navigate]);

  const validateForm = () => {
    if (password.length < 8) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;
    setLoading(true);
    try {
      await actionLogin({ email, password });
      navigate("/restaurent");
    } catch (err) {
      const status = err.response?.status;
      if (status === 401 || status === 400) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      } else {
        setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อระบบ");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🛡️ ส่วนที่เพิ่มเพื่อแก้ปัญหา Microsoft Edge Eye Icon */}
      <style dangerouslySetInnerHTML={{ __html: `
        input::-ms-reveal,
        input::-ms-clear {
          display: none;
        }
      `}} />

      <div className="min-h-screen flex items-center justify-center bg-[#fdfdfd] p-4 sm:p-6 font-sans">
        {/* ... (โค้ดส่วน Background และ Card เหมือนเดิม) ... */}
        <div className="relative z-10 w-full max-w-[440px]">
          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-gray-100 p-8 md:p-12">
            
            <div className="text-center mb-10">
              <div className="inline-block mb-6 transition-transform hover:scale-105 duration-300">
                <img src={Logo} alt="Logo" className="w-24 h-24 md:w-28 md:h-28 object-contain" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">จัดการร้านอาหาร</h1>
              <p className="text-gray-400 mt-2 font-medium">เข้าสู่ระบบเพื่อจัดการร้านค้าของคุณ</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[14px] md:text-xs uppercase tracking-wider font-bold text-gray-500 ml-1">อีเมลร้านค้า</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                  <input
                    type="email"
                    placeholder="restaurent@email.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[14px] md:text-xs uppercase tracking-wider font-bold text-gray-500 ml-1">รหัสผ่าน</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder=""
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    required
                    className={`w-full pl-12 pr-12 py-4 bg-gray-50 border transition-all outline-none rounded-2xl focus:bg-white focus:ring-4 
                      ${error && password.length < 8 ? 'border-red-500 focus:ring-red-500/10' : 'border-transparent focus:ring-red-500/10 focus:border-red-500'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm font-semibold p-4 rounded-xl flex items-center gap-3 border border-red-100 animate-pulse">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                disabled={loading}
                className="group w-full relative py-4 rounded-2xl bg-gradient-to-r from-red-700 to-red-600 text-white font-bold shadow-xl shadow-red-100 active:scale-[0.97] transition-all disabled:opacity-70 mt-4 overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      <span>เข้าสู่ระบบร้านค้า</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginRestaurant;
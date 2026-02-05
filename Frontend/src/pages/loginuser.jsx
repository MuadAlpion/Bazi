import { useEffect, useState, useRef } from "react"
import { Utensils } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import liff from "@line/liff"
import useUser from "../store/useUser"

const T_KEY = "BAZI_LOGIN_T"

function Loginuser() {
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const actionLogin = useUser((s) => s.actionLogin)
  const token = useUser((s) => s.token)
  const clearT = useUser((s) => s.clearT)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const didLoginRef = useRef(false)

  const tFromUrl = params.get("t")
  const hasCode = params.get("code")

  useEffect(() => {
    // 🔥 เก็บ t ทันทีก่อนทำอะไร (นอก async function)
    if (tFromUrl) {
      console.log("✅ เก็บ t ลง localStorage (sync):", tFromUrl)
      try {
        localStorage.setItem(T_KEY, tFromUrl)
        const stored = localStorage.getItem(T_KEY)
        console.log("✅ ตรวจสอบ localStorage:", stored)
      } catch (e) {
        console.error("❌ localStorage ไม่สามารถใช้งานได้:", e)
      }
    }

    let cancelled = false

    const run = async () => {
      try {
        await liff.init({
          liffId: import.meta.env.VITE_LIFF_ID,
          withLoginOnExternalBrowser: true,
        })

        if (cancelled) return

        // 🐛 Debug
        console.log("=== DEBUG ===")
        console.log("Full URL:", window.location.href)
        console.log("tFromUrl:", tFromUrl)
        console.log("hasCode:", hasCode)
        console.log("localStorage t:", localStorage.getItem(T_KEY))
        console.log("liff.isLoggedIn:", liff.isLoggedIn())
        console.log("liff.isInClient:", liff.isInClient())

        // ✅ login แล้ว
        if (token) {
          navigate("/user", { replace: true })
          return
        }

        /**
         * 3️⃣ ดึง t จาก URL หรือ localStorage
         */
        const t = tFromUrl || localStorage.getItem(T_KEY)

        console.log("📦 t ที่ใช้:", t)

        if (!t) {
          console.log("❌ ไม่มี t")
          setError("ลิงก์ไม่ถูกต้อง กรุณาเข้าผ่านลิงก์จากร้าน")
          setLoading(false)
          return
        }

        /**
         * 4️⃣ ยังไม่ login LINE → login พร้อม redirect กลับมาที่เดิม
         */
        if (!liff.isLoggedIn()) {
          console.log("🔐 ยังไม่ login LINE, กำลัง redirect...")
          // สร้าง URL ที่จะกลับมา (รวม t ด้วย)
          const redirectUri = `${window.location.origin}/loginuser?t=${t}`
          console.log("redirectUri:", redirectUri)
          liff.login({ redirectUri })
          return
        }

        /**
         * 2️⃣ LINE redirect กลับมา (มี code แต่ไม่มี t ใน URL)
         * → redirect ไปใหม่พร้อม t
         */
        if (!tFromUrl && hasCode && t) {
          console.log("📍 LINE redirect กลับมา, redirect ใหม่พร้อม t:", t)
          setLoading(true)
          window.location.replace(`/loginuser?t=${t}`)
          return
        }

        /**
         * 🚨 ถ้าไม่มี t เลย และมี code = user เข้าโดยไม่มี t
         */
        if (!t && hasCode) {
          console.log("❌ LINE redirect กลับมา แต่ไม่มี t ใน localStorage")
          setError("ลิงก์ไม่ถูกต้อง กรุณาเข้าผ่านลิงก์จากร้าน")
          setLoading(false)
          return
        }

        /**
         * 🟡 รอ LIFF stable หลัง redirect
         */
        if (hasCode && !liff.getAccessToken()) {
          // ยังไม่พร้อม รอ re-render ครั้งถัดไป
          setLoading(true)
          return
        }

        // 🛑 กันยิง backend ซ้ำ
        if (didLoginRef.current) return
        didLoginRef.current = true

        /**
         * 5️⃣ login backend
         */
        const profile = await liff.getProfile()

        try {
          const res = await actionLogin({
            lineUid: profile.userId,
            t,
          })

          if (res?.data) {
            // ✅ login สำเร็จจริง → ลบ t ออกจาก localStorage + store
            localStorage.removeItem(T_KEY)
            clearT()

            navigate("/user", { replace: true })
            return
          }
        } catch (err) {
          if (
            err.response?.status === 404 &&
            err.response?.data?.action === "Register"
          ) {
            // ส่งไป register พร้อม t
            navigate(`/register?t=${t}`, { replace: true })
            return
          }
          throw err
        }
      } catch (e) {
        console.error(e)
        setError("เข้าสู่ระบบไม่สำเร็จ โปรดลองอีกครั้ง")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [token, navigate, tFromUrl, hasCode, actionLogin, clearT])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow max-w-md w-full text-center space-y-4">
        <Utensils className="mx-auto w-10 h-10 text-red-600" />
        <h1 className="text-xl font-bold">กำลังเข้าสู่ระบบด้วย LINE</h1>

        {loading && <p className="text-gray-500">กำลังตรวจสอบข้อมูล...</p>}
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </div>
  )
}

export default Loginuser
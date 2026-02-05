import { useEffect } from "react"
import liff from "@line/liff"
import useUser from "../store/useUser"
import { useNavigate, useSearchParams } from "react-router-dom"

function LineCallback() {
  const actionLogin = useUser((s) => s.actionLogin)
  const navigate = useNavigate()
  const [params] = useSearchParams()

  useEffect(() => {
    const initLine = async () => {
      await liff.init({ liffId: import.meta.env.VITE_LIFF_ID })

      if (!liff.isLoggedIn()) {
        liff.login()
        return
      }

      const profile = await liff.getProfile()
      const lineUid = profile.userId

      // 👇 t มาจาก query (ร้านไหนก็ร้านมัน)
      const t = params.get("t")

      await actionLogin({
        lineUid,
        t,
      })

      navigate("/user")
    }

    initLine()
  }, [])

  return <p>กำลังเข้าสู่ระบบด้วย LINE...</p>
}

export default LineCallback

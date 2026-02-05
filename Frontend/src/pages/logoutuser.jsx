import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function Goodbye() {
  const navigate = useNavigate()

  useEffect(() => {
    // ดัน state ซ้ำเข้าไปใน history
    window.history.pushState(null, "", window.location.href)

    const handleBack = () => {
      window.history.pushState(null, "", window.location.href)
    }

    window.addEventListener("popstate", handleBack)

    return () => {
      window.removeEventListener("popstate", handleBack)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          ขอบคุณที่ใช้บริการ 🙏
        </h1>

        <p className="text-gray-600">
          คุณได้ออกจากระบบเรียบร้อยแล้ว  
          <br />
          สามารถปิดแท็บนี้ได้เลย
        </p>
      </div>
    </div>
  )
}

export default Goodbye

import React from "react"

function Goodbye() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          ขอบคุณที่ใช้บริการ 🙏
        </h1>

        <p className="text-gray-600 mb-6">
          คุณได้ออกจากระบบเรียบร้อยแล้ว  
          <br />
          สามารถปิดแท็บนี้ได้เลย
        </p>

        <p className="text-sm text-gray-400">
          Thank you for using our service
        </p>
      </div>
    </div>
  )
}

export default Goodbye

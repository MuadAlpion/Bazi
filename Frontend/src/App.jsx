import React from "react"
import Approutes from "./routes/appRoutes"
import { Toaster } from "react-hot-toast"

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#1f2937",
            color: "#fff",
          },
        }}
      />
      <Approutes />
    </>
  )
}

export default App

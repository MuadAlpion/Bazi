import app from "./app.js"
import http from "http"
import { Server } from "socket.io"

const PORT = process.env.PORT || 3000

// ✅ สร้าง http server จาก express app
const server = http.createServer(app)

// ✅ สร้าง socket server
const io = new Server(server, {
  cors: {
    origin: [
      "https://meningococcic-geratologic-harriett.ngrok-free.dev",
      "https://noncognizant-toshia-unslyly.ngrok-free.dev"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
})

// ✅ ผูก io เข้ากับ express
app.set("io", io)

// ✅ ตั้งค่า socket
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id)

  socket.on("joinRestaurant", (restaurantId) => {
    socket.join(String(restaurantId))
    console.log(`Socket ${socket.id} joined room ${restaurantId}`)
  })

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id)
  })
})

// ✅ ใช้ server.listen แทน app.listen
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

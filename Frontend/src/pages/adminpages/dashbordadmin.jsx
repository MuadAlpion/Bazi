import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useAdmin from "../../store/useAdmin"

function Dashboardadmin() {
  const token = useAdmin((state) => state.token)
  const user = useAdmin((state) => state.user)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate("/loginadmin")
    }
  }, [token, navigate])

  if (!token) return null

  return (
    <div>
      <h1>Dashboard ร้าน {user?.name}</h1>
    </div>
  )
}

export default Dashboardadmin

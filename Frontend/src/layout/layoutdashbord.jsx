import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"

function Layoutdashbord() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const liffState = params.get("liff.state")

    if (liffState) {
      navigate(liffState, { replace: true })
    }
  }, [location, navigate])

  return <Outlet />
}

export default Layoutdashbord

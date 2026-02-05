import axios from "axios"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

const Bazires = (set) => ({
  user: null,
  token: null,

  actionLogin: async (form) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/restaurant/login`,
      form,
      { withCredentials: true }
    )

    set({
      user: res.data.user,
      token: res.data.tokens.accessToken,
    })

    return res
  },

  // ✅ logout
  actionLogout: () => {
    set({
      user: null,
      token: null,
    })

    // ถ้าต้องการล้าง localStorage ทั้ง store
    localStorage.removeItem("bazirestaurent")
  },
})

const usePersist = {
  name: "bazirestaurent",
  storage: createJSONStorage(() => localStorage),
}

const useEcom = create(persist(Bazires, usePersist))

export default useEcom

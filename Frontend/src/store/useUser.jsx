import axios from "axios"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

const userStore = (set) => ({
  user: null,
  token: null,

  setToken: (token) => set({ token }),

  actionLogin: async ({ lineUid, t }) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/lineUIDCheck?t=${t}`,
      { lineUid },
      { withCredentials: true }
    )

    const { user, bazi, tokens } = res.data

    set({
      user: {
        ...user,
        baziElement: bazi?.main_element || null,
        favorableElements: bazi?.favorable_elements || [],
      },
      token: tokens?.accessToken || null,
    })

    return res
  },

  actionLogout: () => {
    set({ user: null, token: null })
    localStorage.removeItem("bazirestaurentuser")
  },
})

const useUser = create(
  persist(userStore, {
    name: "bazirestaurentuser",
    storage: createJSONStorage(() => localStorage),
  })
)

export default useUser

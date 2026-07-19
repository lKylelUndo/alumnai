"use client"
import { LoginInputTypes, SignupInputTypes } from "@/schema/auth"
import { Skill } from "@/schema/skill"
import { authService } from "@/services/auth.service"
import { useRouter } from "next/navigation"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string | null
  student_id_number: string | null
  role: string
  isAccountVerified: boolean
  profile?: {
    id?: string
    userId?: string
    profilePicture?: string | null
    aboutMe?: string | null
    yearLevel?: string | null
    graduatedYear?: string | null
    fullName?: string | null
    work_field?: string | null
    companyName?: string | null
    socialLink?: string
    current_position?: string | null
    certifications?: string[]
    skills?: Skill[]
  } | null
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  login: (data: LoginInputTypes) => Promise<void>
  signup: (data: SignupInputTypes) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem("user")
      if (savedUser) {
        try {
          // Parse since this is json format
          const parsedUser = JSON.parse(savedUser)
          setUser(parsedUser)

          // Verify session
          const response = await authService.getMe()
          if (response.code !== 200) {
            throw new Error("Session invalid")
          }

          // Update user data with latest
          setUser(response.data.user)
          localStorage.setItem("user", JSON.stringify(response.data.user))
        } catch (error: any) {
          console.error("Session verification failed", error)
          // Only clear session if it's a definitive auth failure (401/403)
          const status = error.response?.status
          if (status === 401 || status === 403) {
            setUser(null)
            localStorage.removeItem("user")
          }
          console.log("[AuthContext]", error)
        }
      }

      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (data: LoginInputTypes) => {
    try {   
      const response = await authService.login(data)

      if (response.code === 200) {
        const userData = response.data.user
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))

        // Trigger Role Base
        if (userData.role === "STUDENT") {
          router.push("/student/dashboard")
        } else if (userData.role === "ALUMNI") {
          router.push("/alumni/dashboard")
        } else if (userData.role === "ADMIN") {
          router.push("/admin/dashboard")
        }
      } else {
        console.log("Failed to login")
        throw new Error("Invalid credentials")
      }
    } catch (error: any) {
      console.error("Login Error:", error.response)
      throw error;
    }
  }

  const signup = async (data: SignupInputTypes) => {
    try {
      const response = await authService.signup(data)
      if (response.code === 200 || response.code === 201) {
        router.push("/login")
      } else {
        console.log("Failed to signup")
        throw new Error("Invalid credentials")
      }
    } catch (error: any) {
      console.error("Signup Error:", error.response)
      throw error;
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("Logout error", error)
    } finally {
      setUser(null)
      localStorage.removeItem("user")
      router.push("/login")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        setUser,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined)
    throw new Error(
      "UseAuthContext must be used within an AuthProvider children components"
    )
  return context
}

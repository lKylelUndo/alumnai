"use client"
import { LoginInputTypes, SignupInputTypes } from "@/schema/auth"
import { authService } from "@/services/auth.service"
import { useRouter } from "next/navigation"
import { createContext, ReactNode, useContext, useState } from "react"

interface User {
  id: string
  name: string
  email: string
  student_id_number: string | null
  role: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginInputTypes) => Promise<void>
  signup: (data: SignupInputTypes) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const login = async (data: LoginInputTypes) => {
    try {
      const response = await authService.login(data)
      router.push("/profile")
    } catch (error) {
      throw error
    }
  }

  const signup = async (data: SignupInputTypes) => {
    try {
      await authService.signup(data)
      router.push("/profile")
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      //revalidatePath("/profile")
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
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

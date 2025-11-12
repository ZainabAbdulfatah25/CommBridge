"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  phone: string
  profileImage: string
  createdAt: string
}

interface UserProgress {
  wordsLearned: number[]
  translations: number[]
  practiceSessions: number[]
  recentActivity: Array<{
    title: string
    time: string
    accuracy: string
  }>
  recentAchievements: Array<{
    title: string
    time: string
    accuracy: string
  }>
  completedLessons: {
    [module: string]: number[]
  }
}

interface UserContextType {
  user: User | null
  userProgress: UserProgress
  setUser: (user: User) => void
  updateUserProgress: (progress: Partial<UserProgress>) => void
  completeLesson: (module: string, lessonIndex: number) => void
  addActivity: (activity: { title: string; time: string; accuracy: string }) => void
  addAchievement: (achievement: { title: string; time: string; accuracy: string }) => void
  isNewUser: boolean
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
  checkUserExists: (email: string) => boolean
  signUp: (userData: Omit<User, "id" | "createdAt">, password: string) => boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [isNewUser, setIsNewUser] = useState(true)
  const [userProgress, setUserProgress] = useState<UserProgress>({
    wordsLearned: [0, 0, 0, 0, 0, 0, 0],
    translations: [0, 0, 0, 0, 0, 0, 0],
    practiceSessions: [0, 0, 0, 0, 0, 0, 0],
    recentActivity: [],
    recentAchievements: [],
    completedLessons: {},
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const loadUserData = () => {
      try {
        const activeSession = localStorage.getItem("commbridge_session")
        const storedUser = localStorage.getItem("commbridge_user")
        const storedProgress = localStorage.getItem("commbridge_progress")

        if (activeSession && storedUser) {
          setUserState(JSON.parse(storedUser))
          setIsAuthenticated(true)
          setIsNewUser(false)
        }

        if (storedProgress) {
          setUserProgress(JSON.parse(storedProgress))
        }
      } catch (error) {
        console.warn("[v0] Failed to load user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(loadUserData)
      } else {
        setTimeout(loadUserData, 0)
      }
    }
  }, [])

  const checkUserExists = (email: string): boolean => {
    try {
      const registeredUsers = localStorage.getItem("commbridge_registered_users")
      if (!registeredUsers) return false

      const users = JSON.parse(registeredUsers)
      return users.some((u: { email: string }) => u.email.toLowerCase() === email.toLowerCase())
    } catch {
      return false
    }
  }

  const signUp = (userData: Omit<User, "id" | "createdAt">, password: string): boolean => {
    try {
      if (checkUserExists(userData.email)) {
        return false
      }

      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }

      const registeredUsers = localStorage.getItem("commbridge_registered_users")
      const users = registeredUsers ? JSON.parse(registeredUsers) : []
      users.push({ email: userData.email, password, userId: newUser.id })
      localStorage.setItem("commbridge_registered_users", JSON.stringify(users))

      setUserState(newUser)
      setIsAuthenticated(true)
      localStorage.setItem("commbridge_user", JSON.stringify(newUser))
      localStorage.setItem("commbridge_session", "active")
      setIsNewUser(true)

      return true
    } catch (error) {
      console.warn("[v0] Sign up failed:", error)
      return false
    }
  }

  const login = (email: string, password: string): boolean => {
    try {
      const registeredUsers = localStorage.getItem("commbridge_registered_users")
      if (!registeredUsers) return false

      const users = JSON.parse(registeredUsers)
      const userCredentials = users.find(
        (u: { email: string; password: string }) =>
          u.email.toLowerCase() === email.toLowerCase() && u.password === password,
      )

      if (!userCredentials) return false

      const storedUser = localStorage.getItem("commbridge_user")
      if (storedUser) {
        const user = JSON.parse(storedUser)
        if (user.email.toLowerCase() === email.toLowerCase()) {
          setUserState(user)
          setIsAuthenticated(true)
          localStorage.setItem("commbridge_session", "active")
          setIsNewUser(false)
          return true
        }
      }

      return false
    } catch (error) {
      console.warn("[v0] Login failed:", error)
      return false
    }
  }

  const logout = () => {
    setUserState(null)
    setIsAuthenticated(false)
    localStorage.removeItem("commbridge_session")
  }

  const setUser = (newUser: User) => {
    setUserState(newUser)
    requestAnimationFrame(() => {
      localStorage.setItem("commbridge_user", JSON.stringify(newUser))
    })
    setIsNewUser(true)
  }

  const updateUserProgress = (progress: Partial<UserProgress>) => {
    const updatedProgress = { ...userProgress, ...progress }
    setUserProgress(updatedProgress)
    requestAnimationFrame(() => {
      localStorage.setItem("commbridge_progress", JSON.stringify(updatedProgress))
    })
    setIsNewUser(false)
  }

  const completeLesson = (module: string, lessonIndex: number) => {
    const dayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

    const completedLessons = { ...userProgress.completedLessons }
    if (!completedLessons[module]) {
      completedLessons[module] = []
    }
    if (!completedLessons[module].includes(lessonIndex)) {
      completedLessons[module].push(lessonIndex)
    }

    const wordsLearned = [...userProgress.wordsLearned]
    wordsLearned[dayIndex] = (wordsLearned[dayIndex] || 0) + 1

    const practiceSessions = [...userProgress.practiceSessions]
    practiceSessions[dayIndex] = (practiceSessions[dayIndex] || 0) + 1

    const updatedProgress = {
      ...userProgress,
      wordsLearned,
      practiceSessions,
      completedLessons,
    }

    setUserProgress(updatedProgress)
    requestAnimationFrame(() => {
      localStorage.setItem("commbridge_progress", JSON.stringify(updatedProgress))
    })
    setIsNewUser(false)
  }

  const addActivity = (activity: { title: string; time: string; accuracy: string }) => {
    const recentActivity = [activity, ...userProgress.recentActivity]
    const updatedProgress = { ...userProgress, recentActivity }
    setUserProgress(updatedProgress)
    requestAnimationFrame(() => {
      localStorage.setItem("commbridge_progress", JSON.stringify(updatedProgress))
    })
  }

  const addAchievement = (achievement: { title: string; time: string; accuracy: string }) => {
    const recentAchievements = [achievement, ...userProgress.recentAchievements]
    const updatedProgress = { ...userProgress, recentAchievements }
    setUserProgress(updatedProgress)
    requestAnimationFrame(() => {
      localStorage.setItem("commbridge_progress", JSON.stringify(updatedProgress))
    })
  }

  return (
    <UserContext.Provider
      value={{
        user,
        userProgress,
        setUser,
        updateUserProgress,
        completeLesson,
        addActivity,
        addAchievement,
        isNewUser,
        isLoading,
        isAuthenticated,
        login,
        logout,
        checkUserExists,
        signUp,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

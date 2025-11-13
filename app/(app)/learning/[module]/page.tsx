"use client"

import { useState, useEffect, useCallback, useTransition, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Volume2, Mic } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { FeatureNavTabs } from "@/components/feature-nav-tabs"

type LessonContent = {
  word: string
  translation: string
  imageUrl: string
  description: string
}

const moduleData: Record<string, { title: string; lessons: LessonContent[] }> = {
  basics: {
    title: "Basics",
    lessons: [
      {
        word: "Hello",
        translation: "Greeting sign",
        imageUrl: "/sign-language-hello.jpg",
        description: "Wave your hand near your forehead",
      },
      {
        word: "Thank You",
        translation: "Gratitude sign",
        imageUrl: "/sign-language-thank-you.png",
        description: "Touch your chin and move hand forward",
      },
      {
        word: "Please",
        translation: "Request sign",
        imageUrl: "/sign-language-please.jpg",
        description: "Rub your chest in a circular motion",
      },
      {
        word: "Yes",
        translation: "Affirmative sign",
        imageUrl: "/sign-language-yes.png",
        description: "Nod your fist up and down",
      },
      {
        word: "No",
        translation: "Negative sign",
        imageUrl: "/sign-language-no.jpg",
        description: "Close index and middle finger with thumb",
      },
      {
        word: "Sorry",
        translation: "Apology sign",
        imageUrl: "/sign-language-sorry.jpg",
        description: "Make a fist and rub chest in circular motion",
      },
      {
        word: "Help",
        translation: "Assistance sign",
        imageUrl: "/sign-language-help.png",
        description: "Place thumb side of fist on flat palm and lift both hands",
      },
      {
        word: "Good",
        translation: "Positive sign",
        imageUrl: "/sign-language-good.jpg",
        description: "Touch chin and move hand forward and down",
      },
      {
        word: "Bad",
        translation: "Negative sign",
        imageUrl: "/sign-language-bad.jpg",
        description: "Touch chin and flip hand down",
      },
      {
        word: "Friend",
        translation: "Friendship sign",
        imageUrl: "/sign-language-friend.jpg",
        description: "Hook index fingers together twice, alternating",
      },
      {
        word: "Family",
        translation: "Family sign",
        imageUrl: "/sign-language-family.jpg",
        description: "Make F signs with both hands and circle them",
      },
      {
        word: "Love",
        translation: "Love sign",
        imageUrl: "/sign-language-love.jpg",
        description: "Cross arms over chest",
      },
    ],
  },
  numbers: {
    title: "Numbers",
    lessons: [
      {
        word: "One",
        translation: "Number 1",
        imageUrl: "/sign-language-number-one.jpg",
        description: "Hold up index finger",
      },
      {
        word: "Two",
        translation: "Number 2",
        imageUrl: "/sign-language-number-two.jpg",
        description: "Hold up index and middle finger",
      },
      {
        word: "Three",
        translation: "Number 3",
        imageUrl: "/sign-language-number-three.jpg",
        description: "Hold up thumb, index, and middle finger",
      },
      {
        word: "Four",
        translation: "Number 4",
        imageUrl: "/sign-language-number-four.jpg",
        description: "Hold up four fingers, thumb folded",
      },
      {
        word: "Five",
        translation: "Number 5",
        imageUrl: "/sign-language-number-five.jpg",
        description: "Hold up all five fingers spread",
      },
      {
        word: "Six",
        translation: "Number 6",
        imageUrl: "/sign-language-number-six.jpg",
        description: "Hold up thumb and pinky",
      },
      {
        word: "Seven",
        translation: "Number 7",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Hold up thumb and ring finger",
      },
      {
        word: "Eight",
        translation: "Number 8",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Hold up thumb and middle finger",
      },
      {
        word: "Nine",
        translation: "Number 9",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Hold up thumb and index finger",
      },
      {
        word: "Ten",
        translation: "Number 10",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Make a thumbs up and shake",
      },
      {
        word: "Twenty",
        translation: "Number 20",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Touch thumb and index finger twice",
      },
      {
        word: "Hundred",
        translation: "Number 100",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Make 1 then C shape",
      },
    ],
  },
  phrases: {
    title: "Phrases",
    lessons: [
      {
        word: "How are you?",
        translation: "Question phrase",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Sign 'how' then 'you' with questioning expression",
      },
      {
        word: "Nice to meet you",
        translation: "Greeting phrase",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Combine signs for 'nice', 'meet', and 'you'",
      },
      {
        word: "What's your name?",
        translation: "Introduction phrase",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Point to person, then sign 'name' with question",
      },
      {
        word: "I don't understand",
        translation: "Confusion phrase",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Touch forehead and shake head",
      },
      {
        word: "Can you help me?",
        translation: "Request phrase",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Combine 'can', 'you', 'help', pointing to self",
      },
      {
        word: "Where is...?",
        translation: "Location phrase",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Point and move index finger side to side",
      },
      {
        word: "I'm sorry",
        translation: "Apology phrase",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Rub fist on chest in circular motion",
      },
      {
        word: "Excuse me",
        translation: "Polite phrase",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Brush fingers across opposite palm",
      },
      {
        word: "Good morning",
        translation: "Morning greeting",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Sign 'good' then 'morning'",
      },
      {
        word: "Good night",
        translation: "Evening greeting",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Sign 'good' then 'night'",
      },
      {
        word: "See you later",
        translation: "Farewell phrase",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Point to eyes, then 'you', then 'later'",
      },
      {
        word: "Take care",
        translation: "Caring phrase",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Cross K hands and move down body",
      },
    ],
  },
  advanced: {
    title: "Advanced",
    lessons: [
      {
        word: "Communication",
        translation: "Complex concept",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Move C hands alternately from mouth",
      },
      {
        word: "Understanding",
        translation: "Complex concept",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Flick index finger up from forehead",
      },
      {
        word: "Responsibility",
        translation: "Complex concept",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Tap R hands on shoulders twice",
      },
      {
        word: "Important",
        translation: "Complex concept",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Bring F hands together and up",
      },
      {
        word: "Experience",
        translation: "Complex concept",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Pull hand down side of face",
      },
      {
        word: "Opportunity",
        translation: "Complex concept",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Move O hands up and forward",
      },
      {
        word: "Education",
        translation: "Complex concept",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Move E hands from temples forward",
      },
      {
        word: "Community",
        translation: "Complex concept",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Circle C hand around in front",
      },
      {
        word: "Collaborate",
        translation: "Complex concept",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Interlock hands and move together",
      },
      {
        word: "Achievement",
        translation: "Complex concept",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Raise A hands above head",
      },
      {
        word: "Perspective",
        translation: "Complex concept",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Move P hands from eyes alternately",
      },
      {
        word: "Independence",
        translation: "Complex concept",
        imageUrl: "/placeholder.svg?height=300&width=300",
        description: "Twist I hand while moving down",
      },
    ],
  },
}

export default function LessonModulePage() {
  const router = useRouter()
  const params = useParams()
  const module = params.module as string
  const { user } = useAuth()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [completed, setCompleted] = useState<number[]>([])
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [isRecording, setIsRecording] = useState(false)
  const [spokenText, setSpokenText] = useState("")
  const recognitionRef = useRef<any>(null)

  const moduleContent = moduleData[module]

  const playAudio = useCallback(() => {
    const utterance = new SpeechSynthesisUtterance(moduleContent?.lessons[currentLesson]?.word || "")
    speechSynthesis.speak(utterance)
  }, [currentLesson, moduleContent])

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      if (!recognitionRef.current) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join("")
          setSpokenText(transcript)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.warn("[v0] Speech recognition error:", event.error)
          setIsRecording(false)
        }

        recognitionRef.current.onend = () => {
          setIsRecording(false)
        }
      }
    }
  }, [])

  const handleMicClick = useCallback(() => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.")
      return
    }

    if (isRecording) {
      recognitionRef.current.stop()
    } else {
      try {
        setSpokenText("")
        recognitionRef.current.start()
        setIsRecording(true)
      } catch (error) {
        console.warn("[v0] Could not start recognition:", error)
      }
    }
  }, [isRecording])

  useEffect(() => {
    if (!moduleContent) {
      startTransition(() => {
        router.push("/learning")
      })
    }
  }, [moduleContent, router])

  useEffect(() => {
    setImageLoaded(false)
    setSpokenText("")
    setIsRecording(false)
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop()
    }
  }, [currentLesson])

  const saveProgress = async () => {
    if (!user) return

    try {
      const progressPercentage = Math.round(((currentLesson + 1) / moduleContent.lessons.length) * 100)
      const isCompleted = currentLesson === moduleContent.lessons.length - 1

      await fetch("/api/learning/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleName: module,
          progressPercentage,
          completed: isCompleted,
        }),
      })
    } catch (error) {
      console.error("Error saving progress:", error)
    }
  }

  if (!user || !moduleContent) {
    return null
  }

  const progress = ((currentLesson + 1) / moduleContent.lessons.length) * 100
  const currentLessonData = moduleContent.lessons[currentLesson]

  const handleNext = () => {
    if (currentLesson < moduleContent.lessons.length - 1) {
      setCompleted([...completed, currentLesson])
      setCurrentLesson(currentLesson + 1)
      setShowAnswer(false)

      saveProgress()
    } else {
      saveProgress()

      startTransition(() => {
        router.push("/learning")
      })
    }
  }

  const handlePrevious = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1)
      setShowAnswer(false)
    }
  }

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      <FeatureNavTabs />

      <div className="bg-white border-b px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="max-w-6xl mx-auto space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              onClick={() => startTransition(() => router.push("/learning"))}
              className="gap-1 h-8 text-xs"
              size="sm"
              disabled={isPending}
            >
              <ArrowLeft className="h-3 w-3" />
              Back
            </Button>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex-1 text-center">
              {moduleContent?.title}
            </h1>
            <div className="text-xs text-gray-600 hidden sm:block w-28 text-right">
              Lesson {currentLesson + 1} / {moduleContent?.lessons.length}
            </div>
          </div>
          <div className="w-full">
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6">
        <div className="max-w-6xl mx-auto">
          <Card className="w-full">
            <CardContent className="p-4 sm:p-5 lg:p-6">
              <div className="space-y-4 sm:space-y-5">
                {/* Lesson Word */}
                <div className="text-center">
                  <div className="mb-2 flex items-center justify-center gap-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{currentLessonData.word}</h2>
                    <Button variant="ghost" size="icon" onClick={playAudio} className="rounded-full h-8 w-8">
                      <Volume2 className="h-5 w-5 text-[#3b82f6]" />
                    </Button>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600">{currentLessonData.translation}</p>
                </div>

                <div className="flex justify-center">
                  {spokenText ? (
                    <div className="relative h-48 w-48 sm:h-56 sm:w-56 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                      <img
                        src="/sign-language-interpreter-displaying-words.jpg"
                        alt="Sign language display"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1">
                        <p className="text-center font-semibold text-gray-800 text-xs sm:text-sm">{spokenText}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-48 w-48 sm:h-56 sm:w-56 overflow-hidden rounded-lg bg-gray-100">
                      {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-8 w-8 animate-spin rounded-full border-3 border-gray-300 border-t-[#3b82f6]" />
                        </div>
                      )}
                      <img
                        src={currentLessonData.imageUrl || "/placeholder.svg"}
                        alt={currentLessonData.word}
                        className={`h-full w-full object-cover transition-opacity duration-300 ${
                          imageLoaded ? "opacity-100" : "opacity-0"
                        }`}
                        onLoad={() => setImageLoaded(true)}
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-700">Practice Speaking:</p>
                    <button
                      className={`flex h-10 w-10 items-center justify-center rounded-full transition-all flex-shrink-0 ${
                        isRecording ? "animate-pulse bg-red-500" : "bg-[#3b82f6]"
                      } hover:opacity-90`}
                      onClick={handleMicClick}
                      title={isRecording ? "Stop recording" : "Start recording"}
                    >
                      <Mic className="h-5 w-5 text-white" />
                    </button>
                  </div>
                  {isRecording && (
                    <div className="text-center">
                      <p className="text-xs text-red-500 animate-pulse">
                        🔴 Recording... Say "{currentLessonData.word}"
                      </p>
                    </div>
                  )}
                  {spokenText && !isRecording && (
                    <div className="rounded-lg bg-blue-50 p-2 text-center">
                      <p className="text-xs text-gray-600 mb-0.5">You said:</p>
                      <p className="text-sm font-semibold text-gray-800">{spokenText}</p>
                    </div>
                  )}
                </div>

                {/* Show Answer Button */}
                {!showAnswer ? (
                  <div className="text-center">
                    <Button
                      onClick={() => setShowAnswer(true)}
                      size="sm"
                      className="bg-[#3b82f6] hover:bg-[#2563eb] text-xs"
                    >
                      Show Instructions
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-lg bg-blue-50 p-3 text-center">
                    <p className="text-sm text-gray-800">{currentLessonData.description}</p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-2 pt-2 justify-center sm:justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentLesson === 0}
                    className="w-24 sm:w-32 bg-transparent text-xs sm:text-sm h-8"
                    size="sm"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="w-24 sm:w-32 bg-[#3b82f6] hover:bg-[#2563eb] text-xs sm:text-sm h-8"
                    size="sm"
                    disabled={isPending}
                  >
                    {currentLesson === moduleContent.lessons.length - 1 ? "Finish" : "Next"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

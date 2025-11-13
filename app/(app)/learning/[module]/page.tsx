"use client"

import { useState, useEffect, useCallback, useTransition, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Volume2, Mic } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

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
    <div className="h-full bg-gray-50">
      <div className="border-b bg-white px-4 sm:px-6 lg:px-8 py-4">
        <h1 className="text-lg font-semibold text-gray-900">Learning Module</h1>
      </div>

      {/* Module Title and Progress */}
      <div className="border-b bg-white px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={() => startTransition(() => router.push("/learning"))}
            className="gap-2"
            disabled={isPending}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 text-center flex-1">{moduleContent?.title}</h1>
          <div className="text-sm text-gray-600 hidden sm:block">
            Lesson {currentLesson + 1} of {moduleContent?.lessons.length}
          </div>
        </div>
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-200px)] items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="w-full max-w-3xl">
          <CardContent className="p-6 sm:p-8 lg:p-12">
            <div className="space-y-6 sm:space-y-8">
              {/* Lesson Word */}
              <div className="text-center">
                <div className="mb-4 flex items-center justify-center gap-4">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{currentLessonData.word}</h2>
                  <Button variant="ghost" size="icon" onClick={playAudio} className="rounded-full">
                    <Volume2 className="h-6 w-6 text-[#3b82f6]" />
                  </Button>
                </div>
                <p className="text-base sm:text-lg text-gray-600">{currentLessonData.translation}</p>
              </div>

              <div className="flex justify-center">
                {spokenText ? (
                  <div className="relative h-64 w-64 sm:h-80 sm:w-80 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                    <img
                      src="/sign-language-interpreter-displaying-words.jpg"
                      alt="Sign language display"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
                      <p className="text-center font-semibold text-gray-800 text-sm sm:text-base">{spokenText}</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-64 w-64 sm:h-80 sm:w-80 overflow-hidden rounded-lg bg-gray-100">
                    {!imageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-[#3b82f6]" />
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

              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <p className="text-sm font-medium text-gray-700">Practice Speaking:</p>
                  <button
                    className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                      isRecording ? "animate-pulse bg-red-500" : "bg-[#3b82f6]"
                    } hover:opacity-90`}
                    onClick={handleMicClick}
                    title={isRecording ? "Stop recording" : "Start recording"}
                  >
                    <Mic className="h-6 w-6 text-white" />
                  </button>
                </div>
                {isRecording && (
                  <div className="text-center">
                    <p className="text-sm text-red-500 animate-pulse">🔴 Recording... Say "{currentLessonData.word}"</p>
                  </div>
                )}
                {spokenText && !isRecording && (
                  <div className="rounded-lg bg-blue-50 p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">You said:</p>
                    <p className="text-base sm:text-lg font-semibold text-gray-800">{spokenText}</p>
                  </div>
                )}
              </div>

              {/* Show Answer Button */}
              {!showAnswer ? (
                <div className="text-center">
                  <Button onClick={() => setShowAnswer(true)} className="bg-[#3b82f6] hover:bg-[#2563eb]">
                    Show Instructions
                  </Button>
                </div>
              ) : (
                <div className="rounded-lg bg-blue-50 p-6 text-center">
                  <p className="text-base sm:text-lg text-gray-800">{currentLessonData.description}</p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-4 justify-center sm:justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentLesson === 0}
                  className="w-32 bg-transparent"
                >
                  Previous
                </Button>
                <Button onClick={handleNext} className="w-32 bg-[#3b82f6] hover:bg-[#2563eb]" disabled={isPending}>
                  {currentLesson === moduleContent.lessons.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect, useCallback, useTransition, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Volume2, Mic } from "lucide-react"
import { useUser } from "@/contexts/user-context"

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
  const [currentLesson, setCurrentLesson] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [completed, setCompleted] = useState<number[]>([])
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { completeLesson, addActivity, addAchievement } = useUser()

  const [isRecording, setIsRecording] = useState(false)
  const [spokenText, setSpokenText] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentWord, setCurrentWord] = useState("")
  const recognitionRef = useRef<any>(null)
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null)

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

    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current)
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
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current)
    }

    if (spokenText && isRecording) {
      setIsAnimating(true)
      const words = spokenText.split(" ")
      let wordIndex = 0

      animationIntervalRef.current = setInterval(() => {
        if (wordIndex < words.length) {
          setCurrentWord(words[wordIndex])
          wordIndex++
        } else {
          wordIndex = 0
        }
      }, 800)
    } else {
      setIsAnimating(false)
      setCurrentWord("")
    }

    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current)
      }
    }
  }, [spokenText, isRecording])

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

  if (!moduleContent) {
    return null
  }

  const progress = ((currentLesson + 1) / moduleContent.lessons.length) * 100
  const currentLessonData = moduleContent.lessons[currentLesson]

  const handleNext = () => {
    if (currentLesson < moduleContent.lessons.length - 1) {
      completeLesson(module, currentLesson)
      addActivity({
        title: `${moduleContent.title} - ${currentLessonData.word}`,
        time: "Just now",
        accuracy: "98% Accuracy",
      })

      setCompleted([...completed, currentLesson])
      setCurrentLesson(currentLesson + 1)
      setShowAnswer(false)
    } else {
      completeLesson(module, currentLesson)
      addActivity({
        title: `Completed ${moduleContent.title} Module`,
        time: "Just now",
        accuracy: "100% Complete",
      })
      addAchievement({
        title: `${moduleContent.title} Master`,
        time: "Just now",
        accuracy: "12 lessons completed",
      })
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
      {/* Header */}
      <div className="border-b bg-white px-8 py-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => startTransition(() => router.push("/learning"))}
            className="gap-2"
            disabled={isPending}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Learning
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{moduleContent.title}</h1>
          <div className="text-sm text-gray-600">
            Lesson {currentLesson + 1} of {moduleContent.lessons.length}
          </div>
        </div>
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-180px)] items-center justify-center p-8">
        <Card className="w-full max-w-3xl">
          <CardContent className="p-12">
            <div className="space-y-8">
              {/* Lesson Word */}
              <div className="text-center">
                <div className="mb-4 flex items-center justify-center gap-4">
                  <h2 className="text-4xl font-bold text-gray-900">{currentLessonData.word}</h2>
                  <Button variant="ghost" size="icon" onClick={playAudio} className="rounded-full">
                    <Volume2 className="h-6 w-6 text-[#3b82f6]" />
                  </Button>
                </div>
                <p className="text-lg text-gray-600">{currentLessonData.translation}</p>
              </div>

              <div className="flex justify-center">
                <div className="relative h-80 w-80 overflow-hidden rounded-lg bg-gray-100">
                  {isAnimating && spokenText ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-6">
                      <div className="relative mb-4">
                        <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 animate-pulse shadow-lg" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-24 w-24 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                            <div className="text-5xl">👋</div>
                          </div>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-800 animate-pulse mb-2">{currentWord}</p>
                      <p className="text-sm text-gray-600 text-center max-w-xs">{spokenText}</p>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
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
                    <p className="text-lg font-semibold text-gray-800">{spokenText}</p>
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
                  <p className="text-lg text-gray-800">{currentLessonData.description}</p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-4 pt-4">
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

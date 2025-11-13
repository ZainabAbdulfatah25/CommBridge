interface SignLanguageAvatarProps {
  currentWord: string
  fullText?: string
  isAnimating?: boolean
}

export function SignLanguageAvatar({ currentWord, fullText, isAnimating = true }: SignLanguageAvatarProps) {
  return (
    <div className="relative h-64 w-64 rounded-lg bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden shadow-lg">
      <div className={`text-center ${isAnimating ? "animate-pulse" : ""}`}>
        {/* Avatar Circle */}
        <div className="relative mb-3">
          <div className="h-28 w-28 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-xl flex items-center justify-center">
            <div className="h-24 w-24 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
              <div className="text-6xl">🤟</div>
            </div>
          </div>
        </div>

        {/* Current Word Display */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-6 py-3 mx-4 shadow-md">
          <p className="text-2xl font-bold text-gray-800">{currentWord || "Ready"}</p>
        </div>

        {/* Full Text Display (optional) */}
        {fullText && (
          <div className="mt-3 mx-4">
            <p className="text-sm text-gray-700 bg-white/70 rounded px-3 py-1">{fullText}</p>
          </div>
        )}
      </div>
    </div>
  )
}

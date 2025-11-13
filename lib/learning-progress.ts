import { createClient } from "@/lib/supabase/server"

export async function updateLearningProgress(
  userId: string,
  moduleName: string,
  progressPercentage: number,
  completed = false,
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("learning_progress")
    .upsert(
      {
        user_id: userId,
        module_name: moduleName,
        progress_percentage: progressPercentage,
        completed,
        last_accessed: new Date().toISOString(),
      },
      {
        onConflict: "user_id,module_name",
      },
    )
    .select()
    .single()

  if (error) {
    console.error("Error updating learning progress:", error)
    return null
  }

  return data
}

export async function saveTranslationHistory(
  userId: string,
  type: "voice-to-sign" | "sign-to-text" | "text-to-sign",
  inputText: string,
  outputText: string,
  language = "english",
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("translation_history")
    .insert({
      user_id: userId,
      type,
      input_text: inputText,
      output_text: outputText,
      language,
    })
    .select()
    .single()

  if (error) {
    console.error("Error saving translation history:", error)
    return null
  }

  return data
}

export async function saveSignDetectionSession(
  userId: string,
  detectedSigns: string[],
  detectedText: string,
  confidenceScores: Record<string, number>,
  durationSeconds: number,
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("sign_detection_sessions")
    .insert({
      user_id: userId,
      detected_signs: detectedSigns,
      detected_text: detectedText,
      confidence_scores: confidenceScores,
      duration_seconds: durationSeconds,
    })
    .select()
    .single()

  if (error) {
    console.error("Error saving sign detection session:", error)
    return null
  }

  return data
}

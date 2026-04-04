import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { buildMedicalContext } from "./medical-dataset.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MODEL_MAP: Record<string, { endpoint: string; model: string }> = {
  gemini_pro: { endpoint: "https://ai.gateway.lovable.dev/v1/chat/completions", model: "google/gemini-2.5-pro" },
  gemini_flash: { endpoint: "https://ai.gateway.lovable.dev/v1/chat/completions", model: "google/gemini-2.5-flash" },
  gpt5: { endpoint: "https://ai.gateway.lovable.dev/v1/chat/completions", model: "openai/gpt-5-mini" },
  fine_tuned: { endpoint: "", model: "" }, // Placeholder for external fine-tuned model
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const startTime = Date.now();

  try {
    const { symptoms, language, userProfile, modelPreference } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Select model
    const selectedModel = modelPreference && MODEL_MAP[modelPreference]
      ? MODEL_MAP[modelPreference]
      : MODEL_MAP.gemini_flash;

    // Check if fine-tuned model is requested but not configured
    if (modelPreference === "fine_tuned") {
      const externalEndpoint = Deno.env.get("FINE_TUNED_MODEL_URL");
      if (!externalEndpoint) {
        return new Response(JSON.stringify({
          error: "Fine-tuned model endpoint is not configured. Please set FINE_TUNED_MODEL_URL in your backend secrets.",
          fallback: "gemini_flash"
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      selectedModel.endpoint = externalEndpoint;
      selectedModel.model = "fine-tuned-medical";
    }

    const langMap: Record<string, string> = { en: "English", te: "Telugu", hi: "Hindi", ta: "Tamil" };
    const responseLang = langMap[language] || "English";

    const profileContext = userProfile ? `
Patient Profile:
- Age: ${userProfile.age || "Unknown"}
- Gender: ${userProfile.gender || "Unknown"}
- Blood Type: ${userProfile.blood_type || "Unknown"}
- Height: ${userProfile.height_cm ? userProfile.height_cm + " cm" : "Unknown"}
- Weight: ${userProfile.weight_kg ? userProfile.weight_kg + " kg" : "Unknown"}
- BMI: ${userProfile.height_cm && userProfile.weight_kg ? (userProfile.weight_kg / Math.pow(userProfile.height_cm / 100, 2)).toFixed(1) : "Unknown"}
- Pre-existing Conditions: ${userProfile.pre_existing_conditions?.length ? userProfile.pre_existing_conditions.join(", ") : "None reported"}
- Known Allergies: ${userProfile.allergies?.length ? userProfile.allergies.join(", ") : "None reported"}
- Current Medications: ${userProfile.current_medications?.length ? userProfile.current_medications.join(", ") : "None reported"}
- Smoking: ${userProfile.smoking_status || "Unknown"}
- Alcohol: ${userProfile.alcohol_consumption || "Unknown"}
- Location: ${userProfile.village_location || "Unknown"}
` : "";

    // Build enhanced prompt with medical dataset context
    const medicalContext = buildMedicalContext();

    const systemPrompt = `You are a highly accurate medical symptom analysis AI assistant for rural healthcare communities. Your analysis should be thorough, evidence-based, and achieve clinical-level accuracy.

${medicalContext}

${profileContext}

IMPORTANT INSTRUCTIONS:
1. Analyze the patient's symptoms carefully, cross-referencing with the medical knowledge base above.
2. Consider their health profile (age, gender, pre-existing conditions, allergies, BMI, medications).
3. Check for drug interactions with current medications and known allergies.
4. Factor in rural health context (mosquito-borne diseases, waterborne diseases, nutritional deficiencies).
5. If input is in a non-English language, detect the language and understand the symptoms using the multilingual keyword reference.
6. Respond ENTIRELY in ${responseLang}.
7. You MUST respond with a valid JSON object with this EXACT structure (no markdown, no code blocks, just raw JSON):

{
  "detected_symptoms": ["list of detected symptoms in ${responseLang}"],
  "possible_conditions": [
    {"name": "condition name in ${responseLang}", "probability": "High/Medium/Low", "explanation": "brief explanation in ${responseLang}"}
  ],
  "severity": "Mild/Moderate/Moderate-High/High/Critical",
  "precautions": ["list of precautions in ${responseLang}"],
  "when_to_visit": "guidance on when to see a doctor in ${responseLang}",
  "medication_warnings": ["any warnings about allergies or drug interactions in ${responseLang}"],
  "lifestyle_advice": "personalized advice based on patient profile in ${responseLang}",
  "confidence_score": 0.85
}

Provide 3-6 possible conditions ranked by probability. Be thorough with precautions (4-6 items). Always mention if any precaution/medication conflicts with known allergies or current medications. Include a confidence_score between 0 and 1.`;

    const response = await fetch(selectedModel.endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Patient says: "${symptoms}"` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    let parsed;
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse analysis");
    }

    const latencyMs = Date.now() - startTime;

    // Add evaluation metadata to response
    parsed._evaluation = {
      model_used: modelPreference || "gemini_flash",
      latency_ms: latencyMs,
      detected_symptoms_count: parsed.detected_symptoms?.length || 0,
      conditions_count: parsed.possible_conditions?.length || 0,
      confidence_score: parsed.confidence_score || null,
      response_valid: true,
    };

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const latencyMs = Date.now() - startTime;
    console.error("analyze-symptoms error:", e);
    return new Response(JSON.stringify({
      error: e instanceof Error ? e.message : "Analysis failed",
      _evaluation: { latency_ms: latencyMs, response_valid: false },
    }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { symptoms, language, userProfile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const langMap: Record<string, string> = {
      en: "English", te: "Telugu", hi: "Hindi", ta: "Tamil"
    };
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
` : "";

    const systemPrompt = `You are a highly accurate medical symptom analysis AI assistant for rural healthcare communities. Your analysis should be thorough, evidence-based, and achieve clinical-level accuracy.

${profileContext}

IMPORTANT INSTRUCTIONS:
1. Analyze the patient's symptoms carefully, considering their health profile (age, gender, pre-existing conditions, allergies, BMI).
2. Consider drug interactions with known allergies.
3. Factor in pre-existing conditions that may affect diagnosis.
4. Respond ENTIRELY in ${responseLang}.
5. You MUST respond with a valid JSON object with this EXACT structure (no markdown, no code blocks, just raw JSON):

{
  "detected_symptoms": ["list of detected symptoms in ${responseLang}"],
  "possible_conditions": [
    {"name": "condition name in ${responseLang}", "probability": "High/Medium/Low", "explanation": "brief explanation in ${responseLang}"}
  ],
  "severity": "Mild/Moderate/Moderate-High/High/Critical",
  "precautions": ["list of precautions in ${responseLang}"],
  "when_to_visit": "guidance on when to see a doctor in ${responseLang}",
  "medication_warnings": ["any warnings about allergies or drug interactions in ${responseLang}"],
  "lifestyle_advice": "personalized advice based on patient profile in ${responseLang}"
}

Provide 3-6 possible conditions ranked by probability. Be thorough with precautions (4-6 items). Always mention if any precaution/medication conflicts with known allergies.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
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

    // Parse JSON from response, handling potential markdown code blocks
    let parsed;
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse analysis");
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-symptoms error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Analysis failed" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

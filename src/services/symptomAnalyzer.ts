// Simulated symptom analysis engine (client-side) — returns translation keys for multilingual support

export interface SymptomResult {
  detected_symptoms: string[]; // keys like "fever", "headache"
  possible_conditions: { name_key: string; probability_key: string }[];
  precaution_keys: string[];
  severity_key: string;
  when_to_visit_key: string;
}

const symptomDatabase: Record<string, {
  conditions: { name_key: string; probability_key: string }[];
  severity_key: string;
  precaution_keys: string[];
  when_to_visit_key: string;
}> = {
  fever: {
    conditions: [
      { name_key: "common_cold_flu", probability_key: "high" },
      { name_key: "viral_infection", probability_key: "medium" },
      { name_key: "malaria", probability_key: "low_medium" },
    ],
    severity_key: "moderate",
    precaution_keys: ["rest_hydrated", "paracetamol", "monitor_temp", "light_clothing"],
    when_to_visit_key: "fever",
  },
  headache: {
    conditions: [
      { name_key: "tension_headache", probability_key: "high" },
      { name_key: "migraine", probability_key: "medium" },
      { name_key: "dehydration", probability_key: "medium" },
    ],
    severity_key: "mild",
    precaution_keys: ["rest_quiet", "stay_hydrated", "pain_reliever", "cold_compress"],
    when_to_visit_key: "headache",
  },
  cough: {
    conditions: [
      { name_key: "common_cold", probability_key: "high" },
      { name_key: "bronchitis", probability_key: "medium" },
      { name_key: "allergic_reaction", probability_key: "low" },
    ],
    severity_key: "mild_moderate",
    precaution_keys: ["warm_fluids", "honey_throat", "avoid_cold", "cover_mouth"],
    when_to_visit_key: "cough",
  },
  stomach: {
    conditions: [
      { name_key: "gastritis", probability_key: "high" },
      { name_key: "food_poisoning", probability_key: "medium" },
      { name_key: "gastroenteritis", probability_key: "medium" },
    ],
    severity_key: "moderate",
    precaution_keys: ["ors", "bland_food", "avoid_spicy", "rest"],
    when_to_visit_key: "stomach",
  },
  diarrhea: {
    conditions: [
      { name_key: "gastroenteritis", probability_key: "high" },
      { name_key: "food_poisoning", probability_key: "high" },
      { name_key: "cholera", probability_key: "low" },
    ],
    severity_key: "moderate_high",
    precaution_keys: ["ors_frequently", "avoid_dairy", "rice_banana", "wash_hands"],
    when_to_visit_key: "diarrhea",
  },
  bodyache: {
    conditions: [
      { name_key: "viral_fever", probability_key: "high" },
      { name_key: "dengue", probability_key: "medium" },
      { name_key: "chikungunya", probability_key: "low_medium" },
    ],
    severity_key: "moderate",
    precaution_keys: ["bed_rest", "stay_hydrated", "paracetamol", "mosquito_nets"],
    when_to_visit_key: "bodyache",
  },
};

const symptomKeywords: Record<string, string[]> = {
  fever: ["fever", "temperature", "hot", "burning", "జ్వరం", "बुखार", "காய்ச்சல்", "ज्वर", "తాపం"],
  headache: ["headache", "head pain", "head ache", "తలనొప్పి", "सिरदर्द", "தலைவலி"],
  cough: ["cough", "coughing", "దగ్గు", "खांसी", "இருமல்"],
  stomach: ["stomach", "stomach pain", "belly", "abdomen", "కడుపు నొప్పి", "పొట్ట", "पेट दर्द", "வயிற்று வலி"],
  diarrhea: ["diarrhea", "loose motion", "loose stool", "విరేచనాలు", "दस्त", "வயிற்றுப்போக்கு"],
  bodyache: ["body ache", "body pain", "joint pain", "aches", "ఒళ్ళు నొప్పులు", "बदन दर्द", "உடல் வலி"],
};

export function analyzeSymptoms(input: string): Promise<SymptomResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      const detectedKeys: string[] = [];

      for (const [key, keywords] of Object.entries(symptomKeywords)) {
        if (keywords.some((kw) => lowerInput.includes(kw))) {
          detectedKeys.push(key);
        }
      }

      if (detectedKeys.length === 0) {
        resolve({
          detected_symptoms: [input],
          possible_conditions: [{ name_key: "unknown", probability_key: "na" }],
          precaution_keys: ["rest_well", "stay_hydrated", "monitor", "consult"],
          severity_key: "unknown",
          when_to_visit_key: "default",
        });
        return;
      }

      const allConditions: { name_key: string; probability_key: string }[] = [];
      const allPrecautions: string[] = [];
      let maxSeverity = "mild";
      const whenKeys: string[] = [];

      for (const key of detectedKeys) {
        const data = symptomDatabase[key];
        allConditions.push(...data.conditions);
        allPrecautions.push(...data.precaution_keys);
        whenKeys.push(data.when_to_visit_key);
        if (data.severity_key === "moderate_high" || data.severity_key === "high") maxSeverity = "high";
        else if (data.severity_key === "moderate" && maxSeverity !== "high") maxSeverity = "moderate";
        else if (data.severity_key === "mild_moderate" && maxSeverity === "mild") maxSeverity = "mild_moderate";
      }

      const uniqueConditions = allConditions.filter((c, i, arr) => arr.findIndex((x) => x.name_key === c.name_key) === i);
      const uniquePrecautions = [...new Set(allPrecautions)];

      resolve({
        detected_symptoms: detectedKeys,
        possible_conditions: uniqueConditions.slice(0, 5),
        precaution_keys: uniquePrecautions.slice(0, 6),
        severity_key: maxSeverity,
        when_to_visit_key: whenKeys[0] || "default",
      });
    }, 1500);
  });
}

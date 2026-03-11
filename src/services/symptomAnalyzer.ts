// Simulated symptom analysis engine (client-side)
interface SymptomResult {
  detected_symptoms: string[];
  possible_conditions: { name: string; probability: string }[];
  precautions: string[];
  severity_level: string;
  when_to_visit: string;
}

const symptomDatabase: Record<string, { conditions: { name: string; probability: string }[]; severity: string; precautions: string[]; when_to_visit: string }> = {
  fever: {
    conditions: [
      { name: "Common Cold / Flu", probability: "High" },
      { name: "Viral Infection", probability: "Medium" },
      { name: "Malaria", probability: "Low-Medium" },
    ],
    severity: "Moderate",
    precautions: ["Rest and stay hydrated", "Take paracetamol for fever", "Monitor temperature regularly", "Use light clothing"],
    when_to_visit: "If fever persists for more than 3 days or exceeds 103°F (39.4°C)",
  },
  headache: {
    conditions: [
      { name: "Tension Headache", probability: "High" },
      { name: "Migraine", probability: "Medium" },
      { name: "Dehydration", probability: "Medium" },
    ],
    severity: "Mild",
    precautions: ["Rest in a quiet, dark room", "Stay hydrated", "Take a mild pain reliever", "Apply cold compress"],
    when_to_visit: "If headache is severe, sudden, or accompanied by vision changes",
  },
  cough: {
    conditions: [
      { name: "Common Cold", probability: "High" },
      { name: "Bronchitis", probability: "Medium" },
      { name: "Allergic Reaction", probability: "Low" },
    ],
    severity: "Mild-Moderate",
    precautions: ["Drink warm fluids", "Use honey for sore throat", "Avoid cold drinks", "Cover mouth while coughing"],
    when_to_visit: "If cough persists for more than 2 weeks or produces blood",
  },
  stomach: {
    conditions: [
      { name: "Gastritis", probability: "High" },
      { name: "Food Poisoning", probability: "Medium" },
      { name: "Gastroenteritis", probability: "Medium" },
    ],
    severity: "Moderate",
    precautions: ["Stay hydrated with ORS", "Eat light, bland food", "Avoid spicy and oily food", "Rest adequately"],
    when_to_visit: "If pain is severe, persistent, or accompanied by blood in stool",
  },
  diarrhea: {
    conditions: [
      { name: "Gastroenteritis", probability: "High" },
      { name: "Food Poisoning", probability: "High" },
      { name: "Cholera", probability: "Low" },
    ],
    severity: "Moderate-High",
    precautions: ["Drink ORS frequently", "Avoid dairy products", "Eat light foods like rice and banana", "Wash hands frequently"],
    when_to_visit: "If diarrhea persists for more than 2 days or signs of dehydration appear",
  },
  bodyache: {
    conditions: [
      { name: "Viral Fever", probability: "High" },
      { name: "Dengue", probability: "Medium" },
      { name: "Chikungunya", probability: "Low-Medium" },
    ],
    severity: "Moderate",
    precautions: ["Complete bed rest", "Stay hydrated", "Take paracetamol", "Use mosquito nets and repellents"],
    when_to_visit: "If body ache is accompanied by high fever, rash, or joint swelling",
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
        // Fallback
        resolve({
          detected_symptoms: [input],
          possible_conditions: [{ name: "Unable to determine specific condition", probability: "N/A" }],
          precautions: ["Rest well", "Stay hydrated", "Monitor your symptoms", "Consult a healthcare provider"],
          severity_level: "Unknown",
          when_to_visit: "If symptoms persist or worsen, please visit a doctor.",
        });
        return;
      }

      const allConditions: { name: string; probability: string }[] = [];
      const allPrecautions: string[] = [];
      let maxSeverity = "Mild";
      const whenToVisit: string[] = [];

      for (const key of detectedKeys) {
        const data = symptomDatabase[key];
        allConditions.push(...data.conditions);
        allPrecautions.push(...data.precautions);
        whenToVisit.push(data.when_to_visit);
        if (data.severity === "Moderate-High" || data.severity === "High") maxSeverity = "High";
        else if (data.severity === "Moderate" && maxSeverity !== "High") maxSeverity = "Moderate";
      }

      // Deduplicate
      const uniqueConditions = allConditions.filter((c, i, arr) => arr.findIndex((x) => x.name === c.name) === i);
      const uniquePrecautions = [...new Set(allPrecautions)];

      resolve({
        detected_symptoms: detectedKeys.map((k) => k.charAt(0).toUpperCase() + k.slice(1)),
        possible_conditions: uniqueConditions.slice(0, 5),
        precautions: uniquePrecautions.slice(0, 6),
        severity_level: maxSeverity,
        when_to_visit: whenToVisit[0] || "Consult a doctor if symptoms persist.",
      });
    }, 1500);
  });
}

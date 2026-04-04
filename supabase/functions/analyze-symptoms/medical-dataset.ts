// Structured medical knowledge dataset for enhanced AI prompt context
// Based on WHO guidelines and common rural health conditions

export const medicalKnowledgeBase = {
  symptom_patterns: [
    {
      symptoms: ["fever", "headache", "body ache"],
      conditions: [
        { name: "Viral Fever", probability: "High", severity: "Moderate", explanation: "Common viral infection causing systemic inflammation" },
        { name: "Dengue Fever", probability: "Medium", severity: "High", explanation: "Mosquito-borne viral infection, common in tropical regions" },
        { name: "Malaria", probability: "Medium", severity: "High", explanation: "Parasitic infection transmitted by Anopheles mosquitoes" },
        { name: "Chikungunya", probability: "Low-Medium", severity: "Moderate-High", explanation: "Mosquito-borne viral disease causing joint pain" },
      ],
      precautions: [
        "Rest and stay hydrated with ORS or clean water",
        "Take paracetamol for fever (avoid aspirin if dengue suspected)",
        "Use mosquito nets and repellents",
        "Monitor temperature every 4-6 hours",
        "Seek immediate medical attention if fever exceeds 103°F (39.4°C)",
        "Watch for warning signs: bleeding, severe abdominal pain, persistent vomiting"
      ],
      when_to_visit: "If fever persists beyond 3 days, or if accompanied by rash, bleeding gums, severe joint pain, or confusion"
    },
    {
      symptoms: ["cough", "cold", "sore throat", "runny nose"],
      conditions: [
        { name: "Common Cold", probability: "High", severity: "Mild", explanation: "Upper respiratory viral infection" },
        { name: "Influenza", probability: "Medium", severity: "Moderate", explanation: "Seasonal flu virus affecting respiratory system" },
        { name: "Bronchitis", probability: "Low-Medium", severity: "Moderate", explanation: "Inflammation of bronchial tubes" },
        { name: "COVID-19", probability: "Low", severity: "Variable", explanation: "Coronavirus respiratory infection" },
        { name: "Tuberculosis", probability: "Low", severity: "High", explanation: "Bacterial infection, consider if cough persists >2 weeks" },
      ],
      precautions: [
        "Drink warm fluids (water, soups, herbal tea)",
        "Gargle with warm salt water for sore throat",
        "Use honey and ginger for cough relief",
        "Avoid cold beverages and foods",
        "Cover mouth while coughing or sneezing",
        "Get adequate rest in a well-ventilated room"
      ],
      when_to_visit: "If cough persists beyond 2 weeks, produces blood or greenish sputum, or is accompanied by high fever and difficulty breathing"
    },
    {
      symptoms: ["stomach pain", "nausea", "vomiting"],
      conditions: [
        { name: "Gastritis", probability: "High", severity: "Moderate", explanation: "Inflammation of stomach lining" },
        { name: "Food Poisoning", probability: "High", severity: "Moderate", explanation: "Bacterial contamination of food" },
        { name: "Gastroenteritis", probability: "Medium", severity: "Moderate", explanation: "Viral or bacterial stomach infection" },
        { name: "Appendicitis", probability: "Low", severity: "High", explanation: "Inflammation of appendix, surgical emergency if confirmed" },
      ],
      precautions: [
        "Start with clear fluids and ORS to prevent dehydration",
        "Follow BRAT diet (bananas, rice, applesauce, toast)",
        "Avoid spicy, oily, and heavy foods",
        "Take small, frequent sips rather than large amounts",
        "Rest the stomach for a few hours after vomiting stops",
        "Maintain strict hand hygiene"
      ],
      when_to_visit: "If pain is severe and localized (especially right lower abdomen), vomiting persists beyond 24 hours, blood in vomit, or signs of severe dehydration"
    },
    {
      symptoms: ["diarrhea", "loose motion", "dehydration"],
      conditions: [
        { name: "Gastroenteritis", probability: "High", severity: "Moderate", explanation: "Viral or bacterial stomach/intestinal infection" },
        { name: "Food Poisoning", probability: "High", severity: "Moderate", explanation: "Contaminated food or water consumption" },
        { name: "Cholera", probability: "Low-Medium", severity: "High", explanation: "Bacterial infection from contaminated water, causes severe dehydration" },
        { name: "Dysentery", probability: "Low-Medium", severity: "Moderate-High", explanation: "Intestinal infection causing bloody diarrhea" },
      ],
      precautions: [
        "Drink ORS solution frequently (1 liter of clean water + 6 tsp sugar + ½ tsp salt)",
        "Continue eating light foods when possible",
        "Avoid dairy, caffeine, and fatty foods",
        "Eat bananas, rice, and boiled potatoes",
        "Wash hands thoroughly with soap after each episode",
        "Drink only boiled or purified water"
      ],
      when_to_visit: "If diarrhea persists beyond 2 days, contains blood or mucus, high fever accompanies, or signs of severe dehydration (dry mouth, no urination, dizziness)"
    },
    {
      symptoms: ["chest pain", "breathlessness", "palpitations"],
      conditions: [
        { name: "Anxiety/Panic Attack", probability: "Medium", severity: "Moderate", explanation: "Stress-related chest tightness and rapid heartbeat" },
        { name: "Acid Reflux (GERD)", probability: "Medium", severity: "Mild-Moderate", explanation: "Stomach acid causing chest burning" },
        { name: "Angina", probability: "Low-Medium", severity: "High", explanation: "Reduced blood flow to heart muscle" },
        { name: "Heart Attack", probability: "Low", severity: "Critical", explanation: "Blocked blood supply to heart - emergency" },
      ],
      precautions: [
        "Sit upright and try to breathe slowly and deeply",
        "Loosen any tight clothing",
        "If suspected heart attack, chew an aspirin and seek emergency care immediately",
        "Avoid physical exertion",
        "Note the time symptoms started",
        "Do not ignore recurring chest pain episodes"
      ],
      when_to_visit: "IMMEDIATELY if chest pain is crushing, radiates to arm/jaw, accompanied by sweating, nausea, or shortness of breath. Any chest pain should be evaluated."
    },
    {
      symptoms: ["skin rash", "itching", "redness"],
      conditions: [
        { name: "Allergic Dermatitis", probability: "High", severity: "Mild", explanation: "Skin reaction to allergens or irritants" },
        { name: "Fungal Infection", probability: "Medium", severity: "Mild-Moderate", explanation: "Common in humid/tropical climates" },
        { name: "Scabies", probability: "Low-Medium", severity: "Moderate", explanation: "Parasitic skin infestation, contagious" },
        { name: "Measles", probability: "Low", severity: "High", explanation: "Viral infection with characteristic rash, especially in unvaccinated" },
      ],
      precautions: [
        "Keep affected area clean and dry",
        "Avoid scratching to prevent secondary infection",
        "Apply calamine lotion for itch relief",
        "Wear loose, cotton clothing",
        "Wash clothes and bedding in hot water",
        "Identify and avoid potential allergens"
      ],
      when_to_visit: "If rash spreads rapidly, is accompanied by fever, blisters, or pus; or if itching is severe and unresponsive to basic treatment"
    },
    {
      symptoms: ["joint pain", "swelling", "stiffness"],
      conditions: [
        { name: "Arthritis", probability: "Medium", severity: "Moderate", explanation: "Joint inflammation, common in older adults" },
        { name: "Chikungunya", probability: "Medium", severity: "Moderate-High", explanation: "Mosquito-borne virus causing severe joint pain" },
        { name: "Gout", probability: "Low-Medium", severity: "Moderate", explanation: "Uric acid crystal deposits in joints" },
        { name: "Rheumatic Fever", probability: "Low", severity: "High", explanation: "Inflammatory condition following streptococcal infection" },
      ],
      precautions: [
        "Rest the affected joints",
        "Apply warm or cold compress alternately",
        "Gentle range-of-motion exercises when pain reduces",
        "Anti-inflammatory foods (turmeric, ginger, omega-3)",
        "Maintain healthy body weight",
        "Use mosquito repellent if in endemic area"
      ],
      when_to_visit: "If joint pain is accompanied by fever, rash, or if swelling is severe and sudden; or if pain persists beyond 2 weeks"
    },
    {
      symptoms: ["eye pain", "redness", "watery eyes", "blurred vision"],
      conditions: [
        { name: "Conjunctivitis", probability: "High", severity: "Mild", explanation: "Eye infection (pink eye), highly contagious" },
        { name: "Allergic Eye Reaction", probability: "Medium", severity: "Mild", explanation: "Allergic response causing eye irritation" },
        { name: "Corneal Ulcer", probability: "Low", severity: "High", explanation: "Infection or injury to cornea, risk of vision loss" },
      ],
      precautions: [
        "Wash hands frequently, avoid touching eyes",
        "Clean eyes with cool, clean water",
        "Do not share towels or eye drops",
        "Wear sunglasses to protect from bright light",
        "Avoid contact lenses until healed",
        "Use prescribed antibiotic eye drops if bacterial"
      ],
      when_to_visit: "If vision is affected, severe pain, sensitivity to light, or discharge is thick and yellow/green"
    }
  ],

  // Multilingual symptom keywords for better detection
  multilingual_keywords: {
    fever: { en: "fever", te: "జ్వరం", hi: "बुखार", ta: "காய்ச்சல்" },
    headache: { en: "headache", te: "తలనొప్పి", hi: "सिरदर्द", ta: "தலைவலி" },
    cough: { en: "cough", te: "దగ్గు", hi: "खांसी", ta: "இருமல்" },
    cold: { en: "cold", te: "జలుబు", hi: "सर्दी", ta: "சளி" },
    stomach_pain: { en: "stomach pain", te: "కడుపు నొప్పి", hi: "पेट दर्द", ta: "வயிற்று வலி" },
    diarrhea: { en: "diarrhea", te: "విరేచనాలు", hi: "दस्त", ta: "வயிற்றுப்போக்கு" },
    vomiting: { en: "vomiting", te: "వాంతులు", hi: "उल्टी", ta: "வாந்தி" },
    body_ache: { en: "body ache", te: "ఒళ్ళు నొప్పులు", hi: "बदन दर्द", ta: "உடல் வலி" },
    chest_pain: { en: "chest pain", te: "ఛాతి నొప్పి", hi: "सीने में दर्द", ta: "நெஞ்சு வலி" },
    breathlessness: { en: "breathlessness", te: "ఊపిరి ఆడకపోవడం", hi: "सांस की तकलीफ", ta: "மூச்சுத் திணறல்" },
    rash: { en: "skin rash", te: "చర్మంపై దద్దుర్లు", hi: "त्वचा पर दाने", ta: "தோல் அரிப்பு" },
    joint_pain: { en: "joint pain", te: "కీళ్ళ నొప్పి", hi: "जोड़ों का दर्द", ta: "மூட்டு வலி" },
    weakness: { en: "weakness", te: "బలహీనత", hi: "कमजोरी", ta: "பலவீனம்" },
    dizziness: { en: "dizziness", te: "తలతిరగడం", hi: "चक्कर आना", ta: "தலைச்சுற்றல்" },
  },

  // Rural-specific health context
  rural_health_context: `
RURAL HEALTHCARE CONTEXT:
- Many patients may have limited access to hospitals (nearest facility could be 20-50 km away)
- Clean water may not always be available — ORS preparation instructions are critical
- Mosquito-borne diseases (dengue, malaria, chikungunya) are prevalent in rural tropical areas
- Waterborne diseases are common due to unclean water sources
- Nutritional deficiencies are common, especially in women and children
- Traditional remedies may be used alongside — respect but ensure safety
- Agricultural workers may have exposure to pesticides and injuries
- Seasonal disease patterns: monsoon increases water/mosquito-borne diseases
- Many patients may present late due to distance, cost, or cultural factors
  `.trim(),
};

export function buildMedicalContext(): string {
  const patterns = medicalKnowledgeBase.symptom_patterns
    .map(p => `Symptoms: ${p.symptoms.join(", ")} → Conditions: ${p.conditions.map(c => `${c.name} (${c.probability})`).join(", ")}`)
    .join("\n");

  return `
MEDICAL KNOWLEDGE BASE (use this as reference for accurate diagnosis):

${patterns}

${medicalKnowledgeBase.rural_health_context}

MULTILINGUAL SYMPTOM KEYWORDS (use to detect symptoms in non-English input):
${Object.entries(medicalKnowledgeBase.multilingual_keywords)
  .map(([key, langs]) => `${key}: ${Object.entries(langs).map(([l, w]) => `${l}="${w}"`).join(", ")}`)
  .join("\n")}
  `.trim();
}

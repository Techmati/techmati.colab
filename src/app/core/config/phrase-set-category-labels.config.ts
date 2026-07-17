export type PhraseSetCategory =
  | 'not_specified'
  | 'general_conversation'
  | 'chief_complaint'
  | 'symptom_location'
  | 'pain_characteristics'
  | 'general_symptoms'
  | 'respiratory_symptoms'
  | 'dengue_related_symptoms'
  | 'medical_history'
  | 'lifestyle_habits'
  | 'physical_examination'
  | 'preliminary_diagnosis'
  | 'treatment_and_instructions'
  | 'patient_questions'
  | 'patient_short_responses';

export const PHRASE_SET_CATEGORY_LABELS: Record<PhraseSetCategory, string> = {
  not_specified: 'Sin especificar',
  general_conversation: 'Conversación general',
  chief_complaint: 'Motivo de consulta',
  symptom_location: 'Localización del síntoma',
  pain_characteristics: 'Características del dolor',
  general_symptoms: 'Síntomas generales',
  respiratory_symptoms: 'Síntomas respiratorios',
  dengue_related_symptoms: 'Síntomas compatibles con dengue',
  medical_history: 'Antecedentes',
  lifestyle_habits: 'Hábitos relevantes',
  physical_examination: 'Exploración médica',
  preliminary_diagnosis: 'Diagnóstico preliminar',
  treatment_and_instructions: 'Tratamiento',
  patient_questions: 'Preguntas frecuentes del paciente',
  patient_short_responses: 'Respuestas cortas del paciente',
};

export const PHRASE_SET_CATEGORIES = Object.keys(PHRASE_SET_CATEGORY_LABELS) as PhraseSetCategory[];

export const PHRASE_SET_CATEGORY_OPTIONS = PHRASE_SET_CATEGORIES.map((value) => ({
  label: PHRASE_SET_CATEGORY_LABELS[value],
  value,
}));

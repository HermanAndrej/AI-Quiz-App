/**
 * Shared type definitions for the application
 */

export interface Question {
  question_id: number;
  question_text: string;
  options: Record<string, string>;
  correct_option: string;
}

export interface QuizHistory {
  result: {
    quiz_id: number;
    score: number;
    total_questions: number;
    submitted_answers: Record<string, string>;
    created_at: string;
  };
  quiz: {
    topic: string;
    difficulty: string;
    number_of_questions: number;
    questions: Question[];
  };
  percentage: number;
  completed_at: string;
}

export interface QuizStats {
  total_quizzes: number;
  average_score: number;
  best_score: number;
  total_questions_answered: number;
  difficulty_breakdown: Record<string, { count: number; avg_score: number }>;
  topic_breakdown: Record<string, { count: number; avg_score: number }>;
  recent_activity: number;
}

export interface UserProfile {
  user_id: number;
  email: string;
  username: string;
  joined_at: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface QuizQuestion {
  question_id: number;
  question_text: string;
  options: Record<string, string>;
}

export interface QuizFormData {
  topic: string;
  difficulty: string;
  number_of_questions: number;
}

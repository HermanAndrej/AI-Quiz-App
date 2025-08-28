import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, CheckCircle, XCircle, Clock } from "lucide-react";
import { getDifficultyColor, getScoreColor, formatQuizDate, formatDetailedDate } from "@/lib/quiz-utils";
import type { Question } from "@/types";

interface QuizReviewProps {
  quiz: {
    topic: string;
    difficulty: string;
    questions: Question[];
  };
  result: {
    quiz_id: number;
    score: number;
    total_questions: number;
    submitted_answers: Record<string, string>;
    created_at: string;
  };
  onClose: () => void;
}

export default function QuizReview({ quiz, result, onClose }: QuizReviewProps) {

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card>
          <CardHeader className="sticky top-0 bg-background border-b">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">{quiz.topic}</CardTitle>
                <div className="flex items-center gap-3">
                  <Badge className={getDifficultyColor(quiz.difficulty)}>
                    {quiz.difficulty}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {quiz.questions.length} questions
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatQuizDate(result.created_at)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                    {result.score}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {Object.values(result.submitted_answers).filter((answer, index) => 
                      answer === quiz.questions[index]?.correct_option
                    ).length} / {quiz.questions.length} correct
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="space-y-6">
              {quiz.questions.map((question, index) => {
                const userAnswer = result.submitted_answers[question.question_id.toString()];
                const isCorrect = userAnswer === question.correct_option;
                
                return (
                  <div key={question.question_id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className="font-medium text-sm">
                          Question {index + 1}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-4">
                      {question.question_text}
                    </h3>
                    
                    <div className="space-y-2">
                      {Object.entries(question.options).map(([key, value]) => {
                        const isUserAnswer = userAnswer === key;
                        const isCorrectAnswer = question.correct_option === key;
                        
                        let className = "p-3 rounded-lg border ";
                        
                        if (isCorrectAnswer) {
                          className += "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400";
                        } else if (isUserAnswer && !isCorrect) {
                          className += "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400";
                        } else {
                          className += "bg-muted/30";
                        }
                        
                        return (
                          <div key={key} className={className}>
                            <div className="flex items-center justify-between">
                              <span>
                                <strong>{key}.</strong> {value}
                              </span>
                              <div className="flex items-center gap-2">
                                {isUserAnswer && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                    Your Answer
                                  </span>
                                )}
                                {isCorrectAnswer && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                    Correct
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 p-4 bg-muted/30 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                Quiz completed on {formatDetailedDate(result.created_at)}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

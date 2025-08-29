import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Target, BookOpen, TrendingUp, Eye } from "lucide-react";
import QuizReview from "@/components/QuizReview";
import { getDifficultyColor, getScoreColor, formatQuizDate } from "@/lib/quiz-utils";
import { quizApi, userApi } from "@/lib/api";
import type { QuizHistory, QuizStats } from "@/types";

export default function History() {
  const [history, setHistory] = useState<QuizHistory[]>([]);
  const [stats, setStats] = useState<QuizStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizHistory | null>(null);

  useEffect(() => {
    fetchQuizData();
  }, []);

  const fetchQuizData = async () => {
    try {
      // Fetch history and stats in parallel using API utilities
      const [historyData, statsData] = await Promise.all([
        quizApi.getHistory(20),
        userApi.getStatistics(),
      ]);

      setHistory(historyData);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || "Failed to load quiz history");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-20 text-center">
          <p>Loading your quiz history...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-20 text-center">
          <Card className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-card/80 to-card/60">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Quiz History
          </h1>

          {/* Statistics Overview */}
          {stats && stats.total_quizzes > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <p className="text-2xl font-bold">{stats.total_quizzes}</p>
                  <p className="text-sm text-muted-foreground">Quizzes Completed</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">{stats.average_score}%</p>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">{stats.best_score}%</p>
                  <p className="text-sm text-muted-foreground">Best Score</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <p className="text-2xl font-bold">{stats.total_questions_answered}</p>
                  <p className="text-sm text-muted-foreground">Questions Answered</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Quiz History List */}
          {history.length === 0 ? (
            <Card className="text-center p-8">
              <p className="text-muted-foreground mb-4">No quiz history yet</p>
              <Button asChild>
                <a href="/quiz">Take Your First Quiz</a>
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Recent Quizzes</h2>
              {history.map((item, index) => (
                <motion.div
                  key={`${item.result.quiz_id}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{item.quiz.topic}</CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getDifficultyColor(item.quiz.difficulty)}>
                              {item.quiz.difficulty}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {item.quiz.number_of_questions} questions
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${getScoreColor(item.result.score)}`}>
                            {item.result.score}%
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => setSelectedQuiz(item)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatQuizDate(item.completed_at)}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
      
      {/* Quiz Review Modal */}
      {selectedQuiz && (
        <QuizReview
          quiz={selectedQuiz.quiz}
          result={selectedQuiz.result}
          onClose={() => setSelectedQuiz(null)}
        />
      )}
    </div>
  );
}

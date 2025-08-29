import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { getValidAuthToken, isLoggedIn } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

type QuizQuestion = {
  question_id: number;
  question_text: string;
  options: Record<string, string>;
};

type QuizResponse = {
  questions: QuizQuestion[];
  quiz_id: number;
  created_at: string;
  created_by: number;
};

type SubmitResponse = {
  score: number;
  total: number;
  message: string;
  correct_answers: Record<number, string>;
};

export default function Quiz() {
  const [form, setForm] = useState({
    topic: "",
    difficulty: "Easy",
    number_of_questions: 5,
  });
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
    }
  }, [navigate]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setQuiz(null);
    setSubmitResult(null);
    setAnswers({});

    const token = getValidAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic: form.topic,
          difficulty: form.difficulty,
          number_of_questions: Number(form.number_of_questions),
        }),
      });
      if (!res.ok) throw new Error("Failed to generate quiz");
      const data = await res.json();
      setQuiz(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (qid: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: option }));
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;
    setLoading(true);
    setError(null);

    const token = getValidAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quiz_id: quiz.quiz_id,
          answers,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit quiz");
      const data = await res.json();
      setSubmitResult(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center">
        <Card className="w-full max-w-xl p-8 mb-8">
          <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Generate a Quiz
          </h1>
          <form onSubmit={handleGenerate} className="space-y-5">
            <Input
              name="topic"
              value={form.topic}
              onChange={handleFormChange}
              placeholder="Quiz Topic (e.g. JavaScript, History)"
              required
              disabled={loading}
            />
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleFormChange}
              className="w-full border border-input/60 rounded-md p-2 bg-background/50 backdrop-blur-sm shadow-md transition-all duration-200 focus:border-ring focus:ring-ring/50 focus:ring-[3px] focus:shadow-lg hover:border-ring/60 hover:shadow-lg ring-1 ring-border/10"
              disabled={loading}
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <Input
              type="number"
              name="number_of_questions"
              min={1}
              max={10}
              value={form.number_of_questions}
              onChange={handleFormChange}
              placeholder="Number of Questions"
              required
              disabled={loading}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Generating..." : "Generate Quiz"}
            </Button>
          </form>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </Card>

        {quiz && (
          <Card className="w-full max-w-2xl p-8 mb-8">
            <h2 className="text-xl font-semibold mb-4">Quiz: {form.topic} ({form.difficulty})</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitQuiz();
              }}
              className="space-y-6"
            >
              {quiz.questions.map((q, idx) => {
                const userAnswer = answers[q.question_id];
                const correctAnswer = submitResult?.correct_answers?.[q.question_id];
                const isCorrect = userAnswer === correctAnswer;
                return (
                  <Card key={q.question_id} className="mb-6 p-6">
                    <div className="font-semibold text-lg mb-4 text-foreground">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-white text-sm font-bold rounded-full mr-3">
                        {idx + 1}
                      </span>
                      {q.question_text}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(q.options).map(([key, val]) => {
                        let highlight = "border-border hover:border-primary/60 hover:bg-accent/30";
                        if (submitResult) {
                          if (key === userAnswer && isCorrect) {
                            highlight = "bg-green-100 border-green-500";
                          } else if (key === userAnswer && !isCorrect) {
                            highlight = "bg-red-100 border-red-500";
                          } else if (key === correctAnswer) {
                            highlight = "bg-green-50 border-green-400";
                          }
                        }
                        return (
                          <label
                            key={key}
                            className={`flex items-center gap-3 cursor-pointer border rounded-lg p-4 transition-colors duration-200 ${highlight}`}
                          >
                            <input
                              type="radio"
                              name={`q_${q.question_id}`}
                              value={key}
                              checked={answers[q.question_id] === key}
                              onChange={() => handleAnswer(q.question_id, key)}
                              required
                              disabled={!!submitResult}
                            />
                            <span>{val}</span>
                          </label>
                        );
                      })}
                    </div>
                  </Card>
                );
              })}
              {!submitResult && (
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Quiz"}
                </Button>
              )}
            </form>
            {submitResult && (
              <div className="mt-6 text-center">
                <div className="text-lg font-bold mb-2">{submitResult.message}</div>
                <div className="text-2xl font-semibold">
                  Score: {submitResult.score} / 100
                </div>
              </div>
            )}
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}
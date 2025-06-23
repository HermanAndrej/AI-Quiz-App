import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

function getAuthToken() {
  return localStorage.getItem("token");
}

type UserProfile = {
  user_id: number;
  email: string;
  username: string;
  joined_at: string;
};

type UserStats = {
  total_quizzes: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
};

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/user/me", {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
        // Fetch stats
        const statsRes = await fetch(`/api/user/${data.user_id}/statistics`, {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
        });
        if (statsRes.status === 404) {
          setStats(null); // No stats yet, not an error
        } else if (!statsRes.ok) {
          throw new Error("Failed to fetch stats");
        } else {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center">
        <Card className="w-full max-w-xl p-8 mb-8">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Your account details and quiz stats</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && <div className="text-center py-8">Loading...</div>}
            {error && <div className="text-red-500 text-center py-8">{error}</div>}
            {profile && (
              <div className="space-y-4">
                <div>
                  <span className="font-semibold">Username:</span> {profile.username}
                </div>
                <div>
                  <span className="font-semibold">Email:</span> {profile.email}
                </div>
                <div>
                  <span className="font-semibold">User ID:</span> {profile.user_id}
                </div>
                <div>
                  <span className="font-semibold">Joined:</span> {new Date(profile.joined_at).toLocaleDateString()}
                </div>
              </div>
            )}
            {stats && (
              <div className="mt-8">
                <div className="font-semibold mb-2">Quiz Stats</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold">Total Quizzes:</span> {stats.total_quizzes}
                  </div>
                  <div>
                    <span className="font-semibold">Average Score:</span> {stats.average_score?.toFixed(1) ?? "-"}
                  </div>
                  <div>
                    <span className="font-semibold">Highest Score:</span> {stats.highest_score ?? "-"}
                  </div>
                  <div>
                    <span className="font-semibold">Lowest Score:</span> {stats.lowest_score ?? "-"}
                  </div>
                </div>
              </div>
            )}
            {stats === null && !loading && !error && (
              <div className="mt-8 text-center text-muted-foreground">No quiz stats yet.</div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
} 
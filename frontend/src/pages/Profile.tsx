import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import ProfileSettings from "@/components/ProfileSettings";
import { getValidAuthToken, removeAuthToken } from "@/lib/auth";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Calendar, Trophy, BookOpen, Settings, LogOut, Edit } from "lucide-react";

type UserProfile = {
  user_id: number;
  email: string;
  username: string;
  joined_at: string;
};

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Redirect to login if not logged in or token invalid
  useEffect(() => {
    const token = getValidAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          navigate("/login");
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setProfile(data);
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    removeAuthToken();
    navigate("/");
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  const getMembershipDuration = (joinedAt: string) => {
    const joined = new Date(joinedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joined.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} day${diffDays === 1 ? '' : 's'}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months === 1 ? '' : 's'}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years === 1 ? '' : 's'}`;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-20 flex items-center justify-center">
          <Card className="w-full max-w-md text-center p-6">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {profile && (
            <>
              {/* Profile Header */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profile.username.charAt(0).toUpperCase()}
                  </div>
                  <Badge className="absolute -bottom-2 -right-2 bg-green-500 hover:bg-green-500">
                    Active
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold mb-2">{profile.username}</h1>
                <p className="text-muted-foreground">
                  Member for {getMembershipDuration(profile.joined_at)}
                </p>
              </motion.div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Account Information */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Account Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <User className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Username</p>
                          <p className="text-sm text-muted-foreground">{profile.username}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">{profile.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Member Since</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(profile.joined_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full" onClick={() => setShowSettings(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Actions */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button asChild className="w-full justify-start" size="lg">
                        <Link to="/quiz">
                          <BookOpen className="w-5 h-5 mr-3" />
                          Take a New Quiz
                        </Link>
                      </Button>
                      
                      <Button asChild variant="outline" className="w-full justify-start" size="lg">
                        <Link to="/history">
                          <Trophy className="w-5 h-5 mr-3" />
                          View Quiz History
                        </Link>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        size="lg"
                        onClick={() => setShowSettings(true)}
                      >
                        <Settings className="w-5 h-5 mr-3" />
                        Account Settings
                      </Button>
                      
                      <div className="pt-2 border-t">
                        <Button 
                          variant="destructive" 
                          className="w-full justify-start" 
                          size="lg"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-5 h-5 mr-3" />
                          Sign Out
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Welcome Message */}
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                  <CardContent className="py-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Welcome to AI Quiz! 🎯
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Ready to challenge yourself with personalized quizzes? 
                      Your learning journey continues here.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button asChild>
                        <Link to="/quiz">Start Learning</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link to="/about">Learn More</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Profile Settings Modal */}
        {showSettings && profile && (
          <ProfileSettings
            profile={profile}
            onClose={() => setShowSettings(false)}
            onProfileUpdate={handleProfileUpdate}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

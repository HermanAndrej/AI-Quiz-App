import { getValidAuthToken } from "./auth";

/**
 * Base API configuration and utilities
 */
const API_BASE_URL = "/api";

class ApiError extends Error {
  status: number;
  response?: any;

  constructor(message: string, status: number, response?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.response = response;
  }
}

/**
 * Create authenticated headers for API requests
 */
function createAuthHeaders(): HeadersInit {
  const token = getValidAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

/**
 * Generic API request wrapper with error handling
 */
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions: RequestInit = {
    headers: createAuthHeaders(),
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    // Handle 401 specifically for auth redirects
    if (response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
      throw new ApiError("Unauthorized", 401);
    }

    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new ApiError(
        data?.detail || data?.message || "Request failed",
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Network error", 0, error);
  }
}

/**
 * API convenience methods
 */
export const api = {
  get: <T = any>(endpoint: string) => apiRequest<T>(endpoint),
  
  post: <T = any>(endpoint: string, data: any) =>
    apiRequest<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),
    
  put: <T = any>(endpoint: string, data: any) =>
    apiRequest<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
    
  delete: <T = any>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: "DELETE" }),
};

/**
 * Specific API endpoints
 */
export const userApi = {
  getProfile: () => api.get("/user/me"),
  getStatistics: () => api.get("/user/statistics"),
  changePassword: (data: { current_password: string; new_password: string }) =>
    api.post("/user/change-password", data),
  updateProfile: (data: { username?: string; email?: string }) =>
    api.post("/user/update-profile", data),
};

export const quizApi = {
  generate: (data: { topic: string; difficulty: string; number_of_questions: number }) =>
    api.post("/quiz/generate", data),
  submit: (data: { quiz_id: number; answers: Record<number, string> }) =>
    api.post("/quiz/submit", data),
  getHistory: (limit: number = 20) => api.get(`/quiz/history/${limit}`),
  getQuiz: (quizId: number) => api.get(`/quiz/${quizId}`),
};

export { ApiError };

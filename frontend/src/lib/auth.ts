// JWT payload interface based on backend implementation
interface JWTPayload {
  sub: string; // user_id as string
  exp: number; // expiration timestamp
}

export function getAuthToken(): string | null {
  return localStorage.getItem("token");
}

export function isLoggedIn(): boolean {
  return isTokenValid();
}

export function setAuthToken(token: string): void {
  localStorage.setItem("token", token);
}

export function removeAuthToken(): void {
  localStorage.removeItem("token");
}

// Decode JWT without verification (client-side validation only)
function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    return payload as JWTPayload;
  } catch {
    return null;
  }
}

// Check if token is expired (based on backend 30-minute expiration)
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return true;
  
  // Check if token is expired (with 5 second buffer)
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now + 5;
}

// Enhanced token validation that matches backend expectations
export function isTokenValid(): boolean {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    // Check JWT structure
    const parts = token.split('.');
    if (parts.length !== 3) {
      removeAuthToken();
      return false;
    }
    
    // Check if token is expired
    if (isTokenExpired(token)) {
      // Auto-remove expired token
      removeAuthToken();
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

// Get user ID from token (matches backend user_id extraction)
export function getUserIdFromToken(): number | null {
  const token = getAuthToken();
  if (!token || !isTokenValid()) return null;
  
  const payload = decodeJWT(token);
  if (!payload || !payload.sub) return null;
  
  return parseInt(payload.sub, 10);
}

// Enhanced getAuthToken with validation and automatic cleanup
export function getValidAuthToken(): string | null {
  const token = getAuthToken();
  if (!token) return null;
  
  if (!isTokenValid()) {
    // Token is invalid/expired, clean it up
    removeAuthToken();
    return null;
  }
  
  return token;
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../lib/api";
import { useAuthStore } from "../stores/auth";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await authApi.login({ username, password });
      setToken(res.data.access_token);
      navigate("/admin");
    } catch {
      setError("잘못된 아이디 또는 비밀번호입니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-surface-container rounded-xl border border-white/10">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <span
            className="material-symbols-outlined text-primary-container text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            play_circle
          </span>
          <span className="text-headline-lg font-bold text-on-surface">Streamfolio Studio</span>
        </div>

        <h1 className="text-headline-lg text-on-surface mb-6 text-center">Sign in</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-body-sm text-on-surface-variant mb-1 block">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              data-testid="username-input"
              autoComplete="username"
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary-container transition-colors"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="text-body-sm text-on-surface-variant mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="password-input"
              autoComplete="current-password"
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary-container transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-error text-body-sm" data-testid="login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            data-testid="login-submit"
            className="w-full bg-primary-container text-on-primary font-bold py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

import { useState } from "react";
import { authService } from "../services/authService";

type RegisterPageProps = {
  onSwitchToLogin: () => void;
};

export function RegisterPage({ onSwitchToLogin }: RegisterPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      // Artık 'result' objesi içinde bir 'message' alanı bekliyoruz.
      const result = await authService.register({ email, password });
      setSuccess(result.message || "Kayıt başarılı! Lütfen giriş yapın.");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Bilinmeyen bir hata oluştu.");
      }
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Kayıt Ol</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-posta"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Şifre"
          required
        />
        {/* Hata mesajı birden çok satır içerebileceği için (örn: şifre politikaları), bu şekilde göstermek daha iyi. */}
        {error && (
          <p className="error-message">
            {error.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </p>
        )}
        {success && <p className="success-message">{success}</p>}
        <button type="submit">Kayıt Ol</button>
        <button type="button" onClick={onSwitchToLogin} className="link-button">
          Zaten hesabın var mı? Giriş Yap
        </button>
      </form>
    </div>
  );
}

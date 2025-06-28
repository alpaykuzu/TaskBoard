import { useState } from "react";
import { authService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

type LoginPageProps = {
  onSwitchToRegister: () => void;
};

export function LoginPage({ onSwitchToRegister }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const data = await authService.login({ email, password });
      login(data.token);
    } catch (err) {
      // Hatanın bir Error nesnesi olup olmadığını kontrol ederek mesajını alıyoruz
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
        <h2>Giriş Yap</h2>
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
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Giriş Yap</button>
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="link-button"
        >
          Hesabın yok mu? Kayıt Ol
        </button>
      </form>
    </div>
  );
}

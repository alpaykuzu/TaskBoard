import type { LoginDto, RegisterDto, AuthResponseDto } from "../types/auth";

const API_BASE_URL = "https://localhost:7220/api/Auth"; // Kendi port numaranı kullan

export const authService = {
  // Dönüş tipini, backend'in yeni cevabına uygun hale getiriyoruz.
  register: async (registerData: RegisterDto): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Backend'den gelen hata mesajlarını fırlat
      const errorMessage = Array.isArray(data.Errors)
        ? data.Errors.join("\n")
        : "Kayıt başarısız oldu.";
      throw new Error(errorMessage);
    }
    return data;
  },

  login: async (loginData: LoginDto): Promise<AuthResponseDto> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      throw new Error("E-posta veya şifre hatalı.");
    }
    return await response.json();
  },
};

// Token'ı alıp Authorization header'ını oluşturan yardımcı bir fonksiyon
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

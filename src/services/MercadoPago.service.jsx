const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ENDPOINT = "/mercadopago";

export async function getStatusPaymentMp(PAYMENTID) {
  const token = sessionStorage.getItem("auth_token");
  try {
    const response = await fetch(
      `${BASE_URL}${ENDPOINT}${"/status/"}${PAYMENTID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      window.dispatchEvent(new Event("forceLogout"));
      throw new Error("Sesión expirada");
    }

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("GET request failed:", error);
    throw error;
  }
}
export async function postMpBuy({ amount, userId, ffUser, ffRegion, packageId }) {
  const token = sessionStorage.getItem("auth_token");
  try {
    const bodyToEndpoint = {
      amount,
      currency: "ARS",
      userId,
      ffUser,
      ffRegion,
      packageId,
    };

    const response = await fetch(`${BASE_URL}${ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyToEndpoint),
    });

    if (response.status === 401) {
      window.dispatchEvent(new Event("forceLogout"));
      throw new Error("Sesión expirada");
    }

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("POST request failed:", error);
    throw error;
  }
}


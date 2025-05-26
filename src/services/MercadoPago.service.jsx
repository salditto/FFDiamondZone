const BASE_URL = "/api/";
const ENDPOINT = "mercadopago";

export async function getStatusPaymentMp(PAYMENTID) {
  const token = localStorage.getItem("auth_token");
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

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("GET request failed:", error);
    throw error;
  }
}

export async function postMpBuy({ amount, userId }) {
    const token = localStorage.getItem("auth_token");
  try {
    const bodyToEndpoint = {
      amount: 1000,
      currency: "ARS",
      userId,
    };

    const response = await fetch(`${BASE_URL}${ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyToEndpoint),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("POST request failed:", error);
    throw error;
  }
}

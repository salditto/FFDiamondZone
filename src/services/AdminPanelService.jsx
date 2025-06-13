// services/AdminDashboardService.js

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ENDPOINT = "/AdminDashboard";

export async function getAllReceipts() {
  const token = sessionStorage.getItem("auth_token");

  try {
    const response = await fetch(`${BASE_URL}${ENDPOINT}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (response.status === 401) {
      window.dispatchEvent(new Event("forceLogout"));
      throw new Error("Sesión expirada");
    }

    const rawText = await response.text();

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return JSON.parse(rawText);
  } catch (error) {
    console.error("GET all receipts failed:", error);
    throw error;
  }
}

export async function getReceiptById(id) {
  const token = sessionStorage.getItem("auth_token");

  try {
    const response = await fetch(`${BASE_URL}${ENDPOINT}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (response.status === 401) {
      window.dispatchEvent(new Event("forceLogout"));
      throw new Error("Sesión expirada");
    }

    const rawText = await response.text();

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return JSON.parse(rawText);
  } catch (error) {
    console.error(`GET receipt ${id} failed:`, error);
    throw error;
  }
}

export async function updateReceiptStatus({ transferId, status, id }) {
  const token = sessionStorage.getItem("auth_token");

  try {
    const response = await fetch(`${BASE_URL}${ENDPOINT}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({
        transferId: transferId,
        status: status,
        id: id,
      }),
    });

    if (response.status === 401) {
      window.dispatchEvent(new Event("forceLogout"));
      throw new Error("Sesión expirada");
    }

    if (response.status === 204) {
      return { success: true, status: 204 };
    }

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("PUT update status failed:", error);
    throw error;
  }
}

export async function getReceiptsByStatus(status) {
  const token = sessionStorage.getItem("auth_token");

  try {
    const response = await fetch(`${BASE_URL}${ENDPOINT}/status/${status}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (response.status === 401) {
      window.dispatchEvent(new Event("forceLogout"));
      throw new Error("Sesión expirada");
    }

    const rawText = await response.text();

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return JSON.parse(rawText);
  } catch (error) {
    console.error(`GET receipts by status ${status} failed:`, error);
    throw error;
  }
}

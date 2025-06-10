// services/AdminDashboardService.js

const BASE_URL = "/api/";
const ENDPOINT = "AdminDashboard";

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

    const rawText = await response.text();
    console.log("Respuesta cruda:", rawText);

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

    const rawText = await response.text();
    console.log("Respuesta cruda:", rawText);

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

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
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

    const rawText = await response.text();
    console.log("Respuesta cruda:", rawText);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return JSON.parse(rawText);
  } catch (error) {
    console.error(`GET receipts by status ${status} failed:`, error);
    throw error;
  }
}

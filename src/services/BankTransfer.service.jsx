const BASE_URL = "/api/";
const ENDPOINT = "BankTransfers";

export async function getBankTransferInfo() {
  try {
    const response = await fetch("/api/BankTransfers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const rawText = await response.text();
    console.log("Respuesta cruda:", rawText);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return JSON.parse(rawText);
  } catch (error) {
    console.error("GET request failed:", error);
    throw error;
  }
}

export async function postBankTransferComprobante({
  userId,
  FFUser,
  FFRegion,
  packageId,
  file,
}) {
  const token = sessionStorage.getItem("auth_token");
  try {
    const formData = new FormData();
    formData.append("UserId", userId);
    formData.append("FFUser", FFUser);
    formData.append("FFRegion", FFRegion);
    formData.append("PackageId", packageId);
    formData.append("ProofFile", file); // acá file debería ser un File, no un string con el path

    const response = await fetch(` ${BASE_URL}${ENDPOINT}`, {
      method: "POST",
      headers: {
        // NO pongas Content-Type, el navegador lo pone solo para FormData
        Authorization: ` Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(` Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("POST request failed:", error);
    throw error;
  }
}
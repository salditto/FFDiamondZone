const BASE_URL = '/api/';
const ENDPOINT = 'BankTransfers';


export async function getBankTransferInfo() {
  try {
    const response = await fetch('/api/BankTransfers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
  packageId,
  file,
}) {
  try {
    const formData = new FormData();
    formData.append("UserId", userId);
    formData.append("PackageId", packageId);
    formData.append("ProofFile", file);

    const response = await fetch(`${BASE_URL}${ENDPOINT}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("POST request failed:", error);
    throw error;
  }
}

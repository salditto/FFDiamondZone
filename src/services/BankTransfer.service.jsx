const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ENDPOINT = 'BankTransfers';

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
    const bodyToEndpoint = {
      UserId: userId,
      FFUser: FFUser,
      FFRegion: FFRegion,
      PackageId: packageId,
      ProofFile: file,
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
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("POST request failed:", error);
    throw error;
  }
}

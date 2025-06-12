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
    formData.append("ProofFile", file);

    const response = await fetch(` ${BASE_URL}${ENDPOINT}`, {
      method: "POST",
      headers: {
        Authorization: ` Bearer ${token}`,
      },
      body: formData,
    });

    if (response.status === 401) {
      window.dispatchEvent(new Event("forceLogout"));
      throw new Error("Sesión expirada");
    }

    if (!response.ok) {
      throw new Error(` Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("POST request failed:", error);
    throw error;
  }
}

export async function getPackageInfo() {
  try {
    const response = await fetch(`${BASE_URL}${ENDPOINT}/packages`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // Usar blob para archivos binarios (como PDFs)
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("GET Package request failed:", error);
    throw error;
  }
}

export async function getPdfFile({ idFile }) {
  const token = sessionStorage.getItem("auth_token");

  try {
    const response = await fetch(`${BASE_URL}${ENDPOINT}/${idFile}/proof`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      window.dispatchEvent(new Event("forceLogout"));
      throw new Error("Sesión expirada");
    }

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // Usar blob para archivos binarios (como PDFs)
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");

    return blob;
  } catch (error) {
    console.error("GET PDF request failed:", error);
    throw error;
  }
}

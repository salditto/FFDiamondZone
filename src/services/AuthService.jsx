const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function registerUser(credentials) {
  try {
    const response = await fetch(`${BASE_URL}/Auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al registrar:", error);
    throw error;
  }
}

export async function loginUser(credentials) {
  try {
    const response = await fetch(`${BASE_URL}/Auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    // Si el token viene en el body
    if (data.token) {
      sessionStorage.setItem("auth_token", data.token);
      sessionStorage.setItem("userId", data.userId);
    }

    return data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
}

export async function verifyEmailToken(token) {
  const bodyToEndpoint = {
    token: token,
  };
  try {
    const response = await fetch(`${BASE_URL}/Auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyToEndpoint),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al vericar la cuenta", error);
    throw error;
  }
}

export async function isAdmin() {
  const id = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("auth_token");

  try {
    const response = await fetch(`${BASE_URL}/isAdmin?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      window.dispatchEvent(new Event("forceLogout"));
      throw new Error("Sesión expirada");
    }


    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error al verificar la cuenta", error);
    return false;
  }
}

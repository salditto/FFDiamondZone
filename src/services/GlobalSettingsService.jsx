const BASE_URL = import.meta.env.VITE_API_BASE_URL
const ENDPOINT = '/GlobalSettings'

export async function getPaymentsEnabled () {
  try {
    const response = await fetch(`${BASE_URL}${ENDPOINT}/payments-enabled`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      }
    })

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }

    const data = await response.json()
    return data.paymentsEnabled
  } catch (error) {
    console.error('GET payments enabled failed:', error)
    // Return true as default to avoid blocking users if API fails
    return true
  }
}

export async function updatePaymentsEnabled (paymentsEnabled) {
  const token = sessionStorage.getItem('auth_token')

  try {
    const response = await fetch(`${BASE_URL}${ENDPOINT}/payments-enabled`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify({ paymentsEnabled })
    })

    if (response.status === 401) {
      window.dispatchEvent(new Event('forceLogout'))
      throw new Error('Sesión expirada')
    }

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error('PUT update payments enabled failed:', error)
    throw error
  }
}

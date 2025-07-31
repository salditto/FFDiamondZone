// Stripe Service - API calls for Stripe payments
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

class StripeService {
  // Get auth token from session storage
  getAuthToken () {
    return sessionStorage.getItem('auth_token')
  }

  // Get auth headers
  getAuthHeaders () {
    const token = this.getAuthToken()
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  // Handle API response
  async handleResponse (response) {
    if (response.status === 401) {
      this.handleSessionExpired()
      throw new Error('Session expired')
    }

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    return response.json()
  }

  // Create Stripe payment intent (recommended approach)
  async createPaymentIntent (packageData) {
    try {
      const response = await fetch(`${API_BASE_URL}/StripePayments/intent`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          packageId: packageData.packageId,
          playerId: packageData.playerId, // FF Player ID
          region: packageData.region, // FF Region
          currency: packageData.currency || 'USD',
          amount: packageData.amount,
          description: packageData.description,
          metadata: packageData.metadata || {}
        })
      })

      return await this.handleResponse(response)
    } catch (error) {
      console.error('Error creating Stripe payment intent:', error)
      throw error
    }
  }

  // Update payment details with FF user ID and region
  async updatePaymentDetails (paymentData) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/StripePayments/update-payment-details`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            paymentId: paymentData.paymentId,
            ffPlayerId: paymentData.ffPlayerId,
            region: paymentData.region,
            userId: paymentData.userId,
            packageId: paymentData.packageId,
            status: paymentData.status || 'pending_payment'
          })
        }
      )

      return await this.handleResponse(response)
    } catch (error) {
      console.error('Error updating payment details:', error)
      throw error
    }
  }

  // Complete payment record
  async completePayment (paymentData) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/StripePayments/complete-payment`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            paymentIntentId: paymentData.paymentIntentId,
            ffPlayerId: paymentData.ffPlayerId,
            region: paymentData.region,
            packageId: paymentData.packageId,
            diamonds: paymentData.diamonds,
            status: paymentData.status || 'completed',
            stripePaymentId: paymentData.stripePaymentId
          })
        }
      )

      return await this.handleResponse(response)
    } catch (error) {
      console.error('Error completing payment:', error)
      throw error
    }
  }

  // Create Stripe checkout session (for predefined prices)
  async createCheckoutSession (priceId) {
    try {
      const response = await fetch(`${API_BASE_URL}/StripePayments/checkout`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          priceId: priceId
        })
      })

      return await this.handleResponse(response)
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error)
      throw error
    }
  }

  // Get session status
  async getSessionStatus (sessionId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/StripePayments?session_id=${sessionId}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders()
        }
      )

      return await this.handleResponse(response)
    } catch (error) {
      console.error('Error getting session status:', error)
      throw error
    }
  }

  // Verify payment completion
  async verifyPayment (paymentIntentId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/StripePayments/verify/${paymentIntentId}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders()
        }
      )

      const result = await this.handleResponse(response)

      return {
        success: result.status === 'succeeded',
        data: result
      }
    } catch (error) {
      console.error('Error verifying payment:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Handle session expired error
  handleSessionExpired () {
    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('userId')
    window.location.href = '/login'
  }

  // Retry API call with error handling
  async retryApiCall (apiCall, maxRetries = 3) {
    let lastError

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await apiCall()
      } catch (error) {
        lastError = error

        // If unauthorized, handle session expiry
        if (error.message.includes('401')) {
          this.handleSessionExpired()
          return
        }

        // If it's the last retry, throw the error
        if (i === maxRetries - 1) {
          throw error
        }

        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
      }
    }

    throw lastError
  }
}

// Export singleton instance
export default new StripeService()

// Named exports for specific functions
export const {
  createPaymentIntent,
  updatePaymentDetails,
  completePayment,
  createCheckoutSession,
  getSessionStatus,
  verifyPayment
} = new StripeService()

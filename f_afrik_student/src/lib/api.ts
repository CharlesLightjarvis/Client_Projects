import type { ApiResponse } from '@/types/post'
import axios from 'axios'
import type { AxiosResponse, AxiosError } from 'axios'

const api = axios.create({
  baseURL: 'http://posttest.test', // LOCAL API URL
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
  withXSRFToken: true,
})

// Response interceptor to handle API responses
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    // If the API returns success: false, we still want to handle it appropriately
    if (response.data && response.data.success === false) {
      const error: any = new Error(response.data.message || 'API Error')
      error.errors = response.data.errors || {}
      return Promise.reject(error)
    }
    return response
  },
  (error: AxiosError<ApiResponse<any>>) => {
    // Handle network errors, server errors, etc.
    if (error.response) {
      // Server responded with error status
      const responseData = error.response.data
      const err: any = new Error(responseData?.message || 'Server Error')
      err.errors = responseData?.errors || {}
      return Promise.reject(err)
    } else if (error.request) {
      // Network error
      return Promise.reject(new Error('Network Error'))
    } else {
      // Other errors
      return Promise.reject(new Error(error.message || 'Unknown Error'))
    }
  },
)

export default api

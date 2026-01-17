


interface DefaultResponse {
    success: boolean;
    message: string;
    error?: string;
    fieldErrors?: Record<string, string[]>
}



export interface ApiSuccess<T = unknown> {
  success: true
  message: string
  data?: T
}

export interface ApiError {
  success: false
  error: string
  fieldErrors?: Record<string, string[]>
}

 type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError

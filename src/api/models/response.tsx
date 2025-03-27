export interface MessageResponse {
  message: string;
}

export interface DataResponse<T> {
  data: T;
  message: string;
}

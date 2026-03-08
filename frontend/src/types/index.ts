export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Document {
  id: number;
  filename: string;
  file_hash: string;
  file_size: number;
  uploaded_at: string;
  is_verified: boolean;
  block_index: number;
  block_hash: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}


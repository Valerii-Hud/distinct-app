export interface User {
  email: string;
  password: string;
  fullName?: string;
  profilePic?: string;
  isVerified?: boolean;
  createdAt?: string;
}

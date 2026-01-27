export interface User {
  _id?: string;
  email: string;
  password: string;
  fullName?: string;
  profilePic?: string;
  isVerified?: boolean;
  createdAt?: string;
}

export interface User {
  _id?: string;
  email: string;
  password: string;
  fullName?: string;
  profilePic?: string;
  isVerified?: boolean;
  createdAt?: string;
}

export interface Message {
  _id?: string;
  senderId: string;
  receiverId: string;
  text: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

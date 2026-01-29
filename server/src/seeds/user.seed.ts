import { config } from 'dotenv';
import connectToMongoDB from '../db/connectToMongoDB';
import User from '../models/user.model';

config();

interface UserSeed {
  email: string;
  fullName: string;
  password: string;
  profilePic: string;
  isVerified: boolean;
}

const seedUsers: UserSeed[] = [
  {
    email: 'emma.thompson@example.com',
    fullName: 'Emma Thompson',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/women/1.jpg',
    isVerified: true,
  },
  {
    email: 'olivia.miller@example.com',
    fullName: 'Olivia Miller',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/women/2.jpg',
    isVerified: true,
  },
  {
    email: 'sophia.davis@example.com',
    fullName: 'Sophia Davis',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/women/3.jpg',
    isVerified: true,
  },
  {
    email: 'ava.wilson@example.com',
    fullName: 'Ava Wilson',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/women/4.jpg',
    isVerified: true,
  },
  {
    email: 'isabella.brown@example.com',
    fullName: 'Isabella Brown',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/women/5.jpg',
    isVerified: false,
  },
  {
    email: 'mia.johnson@example.com',
    fullName: 'Mia Johnson',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/women/6.jpg',
    isVerified: false,
  },
  {
    email: 'charlotte.williams@example.com',
    fullName: 'Charlotte Williams',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/women/7.jpg',
    isVerified: false,
  },
  {
    email: 'amelia.garcia@example.com',
    fullName: 'Amelia Garcia',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/women/8.jpg',
    isVerified: false,
  },

  // Male Users
  {
    email: 'james.anderson@example.com',
    fullName: 'James Anderson',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
    isVerified: false,
  },
  {
    email: 'william.clark@example.com',
    fullName: 'William Clark',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/men/2.jpg',
    isVerified: false,
  },
  {
    email: 'benjamin.taylor@example.com',
    fullName: 'Benjamin Taylor',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/men/3.jpg',
    isVerified: false,
  },
  {
    email: 'lucas.moore@example.com',
    fullName: 'Lucas Moore',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/men/4.jpg',
    isVerified: true,
  },
  {
    email: 'henry.jackson@example.com',
    fullName: 'Henry Jackson',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/men/5.jpg',
    isVerified: false,
  },
  {
    email: 'alexander.martin@example.com',
    fullName: 'Alexander Martin',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/men/6.jpg',
    isVerified: false,
  },
  {
    email: 'daniel.rodriguez@example.com',
    fullName: 'Daniel Rodriguez',
    password: '123456',
    profilePic: 'https://randomuser.me/api/portraits/men/7.jpg',
    isVerified: false,
  },
];

const seedDatabase = async () => {
  try {
    await connectToMongoDB();

    await User.insertMany(seedUsers);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

seedDatabase();

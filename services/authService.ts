
import { User, UserRole } from '../types';
import { MOCK_ADMIN_EMAIL, MOCK_ADMIN_USER_ID } from '../constants';

const USERS_KEY = 'celebriSaludos_users';
const CURRENT_USER_KEY = 'celebriSaludos_currentUser';

export const MOCK_ADMIN_CREDENTIALS = {
  email: MOCK_ADMIN_EMAIL,
  password: 'adminpassword', // En una app real, esto estaría hasheado y seguro
};

const getStoredUsers = (): User[] => {
  const usersJson = localStorage.getItem(USERS_KEY);
  if (usersJson) {
    return JSON.parse(usersJson);
  }
  // Initialize with admin user if not present
  const adminUser: User = {
    id: MOCK_ADMIN_USER_ID,
    email: MOCK_ADMIN_CREDENTIALS.email,
    name: 'Admin Famoso', // Translated name
    role: UserRole.ADMIN,
  };
  localStorage.setItem(USERS_KEY, JSON.stringify([adminUser]));
  return [adminUser];
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const loginUser = async (email: string, pass: string): Promise<User | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const users = getStoredUsers();
  
  if (email === MOCK_ADMIN_CREDENTIALS.email && pass === MOCK_ADMIN_CREDENTIALS.password) {
    const adminUser = users.find(u => u.email === email && u.role === UserRole.ADMIN);
    if (adminUser) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(adminUser));
      return adminUser;
    }
  }

  const user = users.find(u => u.email === email && u.role === UserRole.FAN); // Simple check, no password hashing for mock
  if (user) {
    // For fans, we are not checking password for simplicity in this mock
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }
  throw new Error('Credenciales inválidas o usuario no encontrado');
};

export const registerUser = async (email: string, pass: string, name: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const users = getStoredUsers();
  if (users.some(u => u.email === email)) {
    throw new Error('Ya existe un usuario con este correo electrónico');
  }
  const newUser: User = {
    id: `user_${Date.now()}`,
    email,
    name,
    role: UserRole.FAN,
  };
  users.push(newUser);
  saveUsers(users);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  return newUser;
};

export const logoutUser = async (): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

/**
 * Manual Authentication Service
 * Uses localStorage to simulate a database for demo purposes.
 */

export interface User {
  id: string;
  username: string;
  email: string;
}

const USERS_KEY = "news_authentix_users";
const CURRENT_USER_KEY = "news_authentix_current_user";

export const authService = {
  signup: async (username: string, email: string, password: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    
    if (users.find((u: any) => u.email === email)) {
      throw new Error("User with this email already exists.");
    }

    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      username,
      email,
      password // In a real app, NEVER store passwords in plain text!
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  },

  login: async (email: string, password: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
};

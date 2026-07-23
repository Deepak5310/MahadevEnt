import { create } from 'zustand';
import type { User, UserRole } from '../types';
import { storage } from '../services/storage';

interface AuthState {
  user: User;
  users: User[];
  setUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  switchUser: (userId: string) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const users = storage.getUsers();
  const currentUser = storage.getActiveUser();

  return {
    user: currentUser,
    users,
    setUser: (user: User) => {
      storage.setActiveUser(user);
      set({ user });
    },
    switchRole: (role: UserRole) => {
      const match = users.find((u) => u.role === role) || {
        ...currentUser,
        role,
      };
      storage.setActiveUser(match);
      set({ user: match });
    },
    switchUser: (userId: string) => {
      const found = users.find((u) => u.id === userId);
      if (found) {
        storage.setActiveUser(found);
        set({ user: found });
      }
    },
  };
});

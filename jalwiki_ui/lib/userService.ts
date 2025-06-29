// E:/Project/miniProject/JalWiKi/jalwiki_ui/lib/userService.ts
import { api } from '@/lib/api';
import type { ApiUser } from '@/types/auth'; // Adjust path if your type is elsewhere

export async function fetchUserProfile(userId: number): Promise<ApiUser> {
  try {

    const response = await api.get<ApiUser>(`/users/${userId}/`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching user profile for ${userId}:`, error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch user profile');
  }
}
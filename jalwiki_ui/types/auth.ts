export interface ApiUser {
  id: number;
  username: string;
  email?: string; // Optional, as it might not be displayed here
  profile_pic: string | null; // Expecting the full URL for the profile picture
  // Add other fields if your API returns them and you might need them later
  first_name?: string | null;
  last_name?: string | null;
}
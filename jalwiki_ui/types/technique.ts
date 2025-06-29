export interface Category {
  id: number;
  name: string;
  description?: string; // Optional if not always present (matches API)
}

export interface Region {
  id: number;
  name: string;
}

export interface TechniqueImage {
  id: number;
  image: string;
  caption?: string; // API shows empty string, so string is fine, optional makes it more robust
  order?: number;
  type?: string; // e.g., 'main', 'other' (matches API)
}

export interface TechniqueLike {
  // Define structure if your API returns like details.
  // Based on the empty "likes": [], and presence of "likes_count",
  // "likes" might be an array of user IDs or full like objects if populated.
  // For now, keeping it flexible.
  user_id: number; // Example, adjust if your API provides more detail for a like
  // timestamp?: string;
}

export interface Technique {
  id: number;
  title: string;
  slug: string;
  added_by?: number; // Or a more complex user object if your API changes
  added_by_username?: string; // New field from API response
  impact?: "high" | "moderate" | "low" | string; // Allow string for flexibility (matches API)
  regions: Region[]; // Changed from 'region' to 'regions' to match API
  categories: Category[];
  summary: string;
  detailed_content: string;
  benefits: string[];
  materials: string[];
  steps: string[];
  main_image: string | null; // Allow null if it can be missing (matches API)
  created_on: string; // ISO date string
  updated_on: string; // ISO date string
  is_published: boolean;
  likes?: TechniqueLike[] | number[]; // Array of like objects or user IDs. API shows [], so this is flexible.
  likes_count?: number; // New field from API response
  images: TechniqueImage[];
  // Add any other fields your API provides
}
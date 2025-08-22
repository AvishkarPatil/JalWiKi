"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/context/theme-context";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import Image from "next/image"; // Import Next/Image
import {
  UserCircle,
  MapPin,
  Phone,
  Mail,
  Edit3,
  Droplet,
  Users,
  Loader2,
  ChevronRight,
  Briefcase,
  Activity,
  Settings,
  Award,
  TrendingUp,
  UploadCloud,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const { darkMode } = useTheme();
  if (!isOpen) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative w-full max-w-lg rounded-lg bg-card p-6 shadow-lg border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
};

interface EditProfileFormProps {
  currentUserData: UserDetails;
  onClose: () => void;
  onProfileUpdate: (updatedData: UserDetails) => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ currentUserData, onClose, onProfileUpdate }) => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState(currentUserData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(currentUserData.profile_pic || null); // UPDATED KEY

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    const dataToSubmit = new FormData();
    (Object.keys(formData) as Array<keyof UserDetails>).forEach(key => {
      if (key !== 'profile_pic' && formData[key] !== null && formData[key] !== undefined) { // UPDATED KEY
        dataToSubmit.append(key, String(formData[key]));
      }
    });
    if (profileImageFile) {
      dataToSubmit.append('profile_pic', profileImageFile); // Key for backend
    }
    try {
      const response = await api.patch<UserDetails>(`/users/${currentUserData.id}/`, dataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onProfileUpdate(response.data);
      onClose();
    } catch (err: any) {
      let errorMessage = "Failed to update profile.";
      if (err.response && err.response.data) {
        const errors = err.response.data;
        if (typeof errors === 'object' && errors !== null) {
          errorMessage = Object.entries(errors).map(([key, value]) =>
            `${key.replace(/_/g, ' ')}: ${(Array.isArray(value) ? value.join(', ') : String(value))}`
          ).join('; ');
        } else if (typeof errors === 'string') { errorMessage = errors; }
      } else if (err.message) { errorMessage = err.message; }
      setFormError(errorMessage);
    } finally { setIsSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      {formError && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
          {formError}
        </div>
      )}
      <div className="flex flex-col items-center space-y-3">
        <label htmlFor="profile_picture_upload" className="cursor-pointer group">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-semibold ring-2 ring-primary/50 overflow-hidden relative transition-all duration-300 bg-muted group-hover:ring-primary/80">
            {imagePreview ? (
              <Image src={imagePreview} alt="Profile Preview" layout="fill" objectFit="cover" />
            ) : (
              <span className="text-foreground">
                {getInitials(formData.first_name, formData.last_name, formData.username)}
              </span>
            )}
            <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <UploadCloud className="w-8 h-8 text-background" />
            </div>
          </div>
        </label>
        <input type="file" id="profile_picture_upload" accept="image/*" onChange={handleImageChange} className="hidden" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium mb-1 text-foreground">First Name</label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            value={formData.first_name || ''}
            onChange={handleChange}
            className="w-full p-2.5 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium mb-1 text-foreground">Last Name</label>
          <input
            type="text"
            name="last_name"
            id="last_name"
            value={formData.last_name || ''}
            onChange={handleChange}
            className="w-full p-2.5 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none transition-colors"
          />
        </div>
      </div>
      <div>
        <label htmlFor="mobile_no" className="block text-sm font-medium mb-1 text-foreground">Mobile Number</label>
        <input
          type="tel"
          name="mobile_no"
          id="mobile_no"
          value={formData.mobile_no || ''}
          onChange={handleChange}
          className="w-full p-2.5 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none transition-colors"
        />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-1 text-foreground">Address</label>
        <textarea
          name="address"
          id="address"
          value={formData.address || ''}
          onChange={handleChange}
          rows={2}
          className="w-full p-2.5 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none transition-colors resize-none"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-1 text-foreground">City</label>
          <input
            type="text"
            name="city"
            id="city"
            value={formData.city || ''}
            onChange={handleChange}
            className="w-full p-2.5 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium mb-1 text-foreground">State</label>
          <input
            type="text"
            name="state"
            id="state"
            value={formData.state || ''}
            onChange={handleChange}
            className="w-full p-2.5 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label htmlFor="pincode" className="block text-sm font-medium mb-1 text-foreground">Pincode</label>
          <input
            type="text"
            name="pincode"
            id="pincode"
            value={formData.pincode || ''}
            onChange={handleChange}
            className="w-full p-2.5 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none transition-colors"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4 border-t border-border mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 flex items-center transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </button>
      </div>
    </form>
  );
};

interface UserDetails {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  mobile_no?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  profile_pic?: string | null; // UPDATED KEY to match likely API response
}

const getInitials = (firstName?: string, lastName?: string, username?: string): string => {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
  if (firstName && firstName.length >= 2) return firstName.substring(0, 2).toUpperCase();
  if (firstName) return firstName[0].toUpperCase();
  if (username && username.length >= 2) return username.substring(0, 2).toUpperCase();
  if (username) return username[0].toUpperCase();
  return "U";
};

export default function Dashboard() {
  const { darkMode } = useTheme();
  const { user, loading: isLoadingAuth, setUser: setAuthUser } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserDetails | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);

  // Removed manual theme classes in favor of design system tokens

  useEffect(() => {
    if (userData?.profile_pic) { // UPDATED KEY
      setProfileImageError(false);
    }
  }, [userData?.profile_pic]); // UPDATED KEY

  useEffect(() => {
    if (isLoadingAuth) return;
    if (!user) router.push("/auth");
  }, [user, isLoadingAuth, router]);

  useEffect(() => {
    if (!isLoadingAuth && user && (isDataLoading || !userData)) {
      const fetchUserData = async () => {
        setError("");
        setProfileImageError(false);
        try {
          const response = await api.get<UserDetails>(`/users/${user.id}/`);
          console.log("Fetched User Data from API:", response.data); // DEBUG LOG
          setUserData(response.data);
        } catch (err: any) {
          setError(err.response?.data?.detail || "Failed to load dashboard data.");
        } finally {
          setIsDataLoading(false);
        }
      };
      fetchUserData();
    } else if (!isLoadingAuth && !user) {
      if (isDataLoading) setIsDataLoading(false);
    }
  }, [user, isLoadingAuth, isDataLoading, userData]);

  const pageVariants = { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.5 } }, exit: { opacity: 0, transition: { duration: 0.3 } } };
  const sectionVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };
  const itemVariants = { hidden: { opacity: 0, scale: 0.95, y: 10 }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };
  const staggerContainer = { hidden: { opacity: 1 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

  if (isLoadingAuth || (!user && !isLoadingAuth)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const handleProfileUpdate = (updatedData: UserDetails) => {
    setUserData(updatedData);
    if (user && setAuthUser) {
      setAuthUser({ ...user, username: updatedData.username });
    }
  };

  const userStats = {
    techniquesContributed: userData?.id ? Math.floor(Math.random() * 10) + 1 : 0,
    impactScore: userData?.id ? Math.floor(Math.random() * 500) + 50 : 0,
    forumPosts: userData?.id ? Math.floor(Math.random() * 30) : 0,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key="dashboard-content" 
        className="min-h-screen py-10 md:py-12 bg-background text-foreground" 
        variants={pageVariants} 
        initial="initial" 
        animate="animate" 
        exit="exit"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-10" 
            variants={sectionVariants} 
            initial="hidden" 
            animate="visible"
          >
            Welcome, <span className="text-primary">{userData?.first_name || user?.username || 'User'}</span>!
          </motion.h1>

          {isDataLoading && !userData && (
            <motion.div 
              className="flex items-center justify-center py-20" 
              variants={sectionVariants} 
              initial="hidden" 
              animate="visible"
            >
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="ml-4 text-lg text-foreground">Loading your dashboard...</p>
            </motion.div>
          )}
          {error && !isDataLoading && (
            <motion.div 
              className="p-6 rounded-lg border border-destructive/20 bg-destructive/10 mb-8" 
              variants={sectionVariants} 
              initial="hidden" 
              animate="visible"
            >
              <h2 className="text-xl font-semibold mb-2 text-destructive">Oops! Something went wrong.</h2>
              <p className="text-destructive/90">{error}</p>
              <button 
                onClick={() => { 
                  setIsDataLoading(true); 
                  setError(""); 
                  setUserData(null); 
                }} 
                className="mt-4 px-4 py-2 rounded-md text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {!isDataLoading && !error && userData && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <motion.div 
                className="lg:col-span-4 xl:col-span-3 space-y-6" 
                variants={sectionVariants} 
                initial="hidden" 
                animate="visible"
              >
                {/* Profile Card */}
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative mb-4 h-28 w-28 sm:h-32 sm:w-32">
                      <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center text-4xl font-semibold text-primary">
                        {userData.profile_pic && !profileImageError ? (
                          <Image
                            src={
                              userData.profile_pic.startsWith('http')
                                ? userData.profile_pic
                                : `${BACKEND_URL}${userData.profile_pic}`
                            }
                            alt={`${userData.first_name || userData.username}'s profile`}
                            fill
                            className="rounded-full object-cover"
                            priority
                            onError={() => {
                              console.warn("Dashboard: Failed to load profile image");
                              setProfileImageError(true);
                            }}
                          />
                        ) : (
                          <span className="text-3xl">
                            {getInitials(userData.first_name, userData.last_name, userData.username)}
                          </span>
                        )}
                      </div>
                    </div>
                    <h2 className="text-2xl font-semibold text-center text-foreground">
                      {userData.first_name || ""} {userData.last_name || ""}
                    </h2>
                    <p className="text-sm text-muted-foreground">@{userData.username}</p>
                  </div>
                  
                  <div className="space-y-3 text-sm mb-6">
                    <div className="flex items-center">
                      <Mail className="mr-3 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                      <span className="text-foreground">{userData.email}</span>
                    </div>
                    {userData.mobile_no && (
                      <div className="flex items-center">
                        <Phone className="mr-3 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                        <span className="text-foreground">{userData.mobile_no}</span>
                      </div>
                    )}
                    {userData.address && (
                      <div className="flex items-start">
                        <MapPin className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                        <span className="text-foreground">
                          {userData.address}
                          {userData.city && `, ${userData.city}`}
                          {userData.state && `, ${userData.state}`}
                          {userData.pincode && ` - ${userData.pincode}`}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <motion.button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                  </motion.button>
                </div>
                
                {/* Stats Card */}
                <motion.div 
                  className="rounded-xl border bg-card p-6 shadow-sm"
                  variants={itemVariants}
                >
                  <h3 className="mb-4 flex items-center text-lg font-semibold">
                    <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                    Your Impact
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Techniques Contributed</span>
                      <span className="text-lg font-bold text-primary">
                        {userStats.techniquesContributed}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Overall Impact Score</span>
                      <span className="text-lg font-bold text-primary">
                        {userStats.impactScore}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Forum Posts</span>
                      <span className="text-lg font-bold text-primary">
                        {userStats.forumPosts}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
              <motion.div 
                className="lg:col-span-8 xl:col-span-9 space-y-8" 
                variants={staggerContainer} 
                initial="hidden" 
                animate="visible"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { 
                      title: "Browse Techniques", 
                      description: "Explore water saving methods.", 
                      href: "/techniques", 
                      icon: Droplet,
                      color: "text-blue-500"
                    },
                    { 
                      title: "My Contributions", 
                      description: "View techniques you've added.", 
                      href: "/dashboard/my-techniques", 
                      icon: Briefcase,
                      color: "text-green-500"
                    },
                    { 
                      title: "Community Forum", 
                      description: "Connect and discuss with others.", 
                      href: "/forum", 
                      icon: Users,
                      color: "text-purple-500"
                    },
                    { 
                      title: "Account Settings", 
                      description: "Manage your preferences.", 
                      href: "/profile/settings", 
                      icon: Settings,
                      color: "text-amber-500"
                    },
                  ].map((action) => (
                    <motion.div 
                      key={action.title} 
                      variants={itemVariants} 
                      whileHover={{ y: -5, scale: 1.02 }} 
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Link href={action.href} passHref>
                        <div className="group h-full cursor-pointer rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md">
                          <div className="flex flex-col justify-between h-full">
                            <div>
                              <div className={`mb-3 h-10 w-10 rounded-lg ${action.color} bg-opacity-10 flex items-center justify-center`}>
                                <action.icon className="h-6 w-6" />
                              </div>
                              <h3 className="mb-1 text-lg font-semibold text-foreground">
                                {action.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {action.description}
                              </p>
                            </div>
                            <span className="mt-4 flex items-center text-sm font-medium text-primary group-hover:underline">
                              Go to {action.title.split(' ')[0]}
                              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <motion.div 
                  className="rounded-xl border bg-card p-6 shadow-sm sm:p-8" 
                  variants={sectionVariants}
                >
                  <h2 className="mb-4 flex items-center text-xl font-semibold">
                    <Activity className="mr-2 h-6 w-6 text-primary" />
                    Recent Activity
                  </h2>
                  <div className="space-y-3 text-sm">
                    <motion.div 
                      variants={itemVariants} 
                      className="flex items-center rounded-md p-3 transition-colors hover:bg-accent/30"
                    >
                      <span className="mr-3 h-2 w-2 rounded-full bg-primary"></span>
                      <span className="text-foreground">Logged in successfully.</span>
                      <span className="ml-auto text-xs text-muted-foreground">Just now</span>
                    </motion.div>
                    <motion.div 
                      variants={itemVariants} 
                      className="flex items-center rounded-md p-3 transition-colors hover:bg-accent/30"
                    >
                      <span className="mr-3 h-2 w-2 rounded-full bg-green-500"></span>
                      <span className="text-foreground">Viewed 'Drip Irrigation' technique.</span>
                      <span className="ml-auto text-xs text-muted-foreground">5 mins ago</span>
                    </motion.div>
                    {userData && !userData.first_name && (
                      <motion.div 
                        variants={itemVariants} 
                        className="rounded-md bg-yellow-500/10 p-3 text-yellow-600 dark:text-yellow-400"
                      >
                        Consider completing your profile for a better experience!
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
      {userData && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Your Profile">
          <EditProfileForm currentUserData={userData} onClose={() => setIsEditModalOpen(false)} onProfileUpdate={handleProfileUpdate} />
        </Modal>
      )}
    </AnimatePresence>
  );
}
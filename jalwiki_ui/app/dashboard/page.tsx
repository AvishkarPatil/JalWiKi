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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={cn(
          "relative w-full max-w-lg rounded-xl p-6 shadow-2xl",
          darkMode ? "bg-gray-800 text-gray-100 border border-gray-700" : "bg-white text-gray-900"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className={cn(
              "p-1 rounded-full transition-colors",
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
            )}
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
      {formError && <p className="text-sm text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-md my-2">{formError}</p>}
      <div className="flex flex-col items-center space-y-3">
        <label htmlFor="profile_picture_upload" className="cursor-pointer group">
          <div className={cn(
            "w-24 h-24 rounded-full flex items-center justify-center text-3xl font-semibold ring-2 overflow-hidden relative transition-all duration-300",
            darkMode ? "bg-gray-700 text-gray-300 ring-purple-500/50 group-hover:ring-purple-400" : "bg-gray-200 text-gray-600 ring-purple-300 group-hover:ring-purple-500"
          )}>
            {imagePreview ? (
              <Image src={imagePreview} alt="Profile Preview" layout="fill" objectFit="cover" />
            ) : ( getInitials(formData.first_name, formData.last_name, formData.username) )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <UploadCloud className="w-8 h-8 text-white" />
            </div>
          </div>
        </label>
        <input type="file" id="profile_picture_upload" accept="image/*" onChange={handleImageChange} className="hidden" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium mb-1">First Name</label>
          <input type="text" name="first_name" id="first_name" value={formData.first_name || ''} onChange={handleChange}
            className={cn("w-full p-2.5 rounded-md border text-sm", darkMode ? "bg-gray-700 border-gray-600 focus:border-purple-500" : "bg-gray-50 border-gray-300 focus:border-purple-500", "focus:ring-purple-500 focus:ring-1 outline-none")} />
        </div>
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium mb-1">Last Name</label>
          <input type="text" name="last_name" id="last_name" value={formData.last_name || ''} onChange={handleChange}
            className={cn("w-full p-2.5 rounded-md border text-sm", darkMode ? "bg-gray-700 border-gray-600 focus:border-purple-500" : "bg-gray-50 border-gray-300 focus:border-purple-500", "focus:ring-purple-500 focus:ring-1 outline-none")} />
        </div>
      </div>
      <div>
        <label htmlFor="mobile_no" className="block text-sm font-medium mb-1">Mobile Number</label>
        <input type="tel" name="mobile_no" id="mobile_no" value={formData.mobile_no || ''} onChange={handleChange}
          className={cn("w-full p-2.5 rounded-md border text-sm", darkMode ? "bg-gray-700 border-gray-600 focus:border-purple-500" : "bg-gray-50 border-gray-300 focus:border-purple-500", "focus:ring-purple-500 focus:ring-1 outline-none")} />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
        <textarea name="address" id="address" value={formData.address || ''} onChange={handleChange} rows={2}
          className={cn("w-full p-2.5 rounded-md border text-sm resize-none", darkMode ? "bg-gray-700 border-gray-600 focus:border-purple-500" : "bg-gray-50 border-gray-300 focus:border-purple-500", "focus:ring-purple-500 focus:ring-1 outline-none")} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
          <input type="text" name="city" id="city" value={formData.city || ''} onChange={handleChange}
            className={cn("w-full p-2.5 rounded-md border text-sm", darkMode ? "bg-gray-700 border-gray-600 focus:border-purple-500" : "bg-gray-50 border-gray-300 focus:border-purple-500", "focus:ring-purple-500 focus:ring-1 outline-none")} />
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium mb-1">State</label>
          <input type="text" name="state" id="state" value={formData.state || ''} onChange={handleChange}
            className={cn("w-full p-2.5 rounded-md border text-sm", darkMode ? "bg-gray-700 border-gray-600 focus:border-purple-500" : "bg-gray-50 border-gray-300 focus:border-purple-500", "focus:ring-purple-500 focus:ring-1 outline-none")} />
        </div>
        <div>
          <label htmlFor="pincode" className="block text-sm font-medium mb-1">Pincode</label>
          <input type="text" name="pincode" id="pincode" value={formData.pincode || ''} onChange={handleChange}
            className={cn("w-full p-2.5 rounded-md border text-sm", darkMode ? "bg-gray-700 border-gray-600 focus:border-purple-500" : "bg-gray-50 border-gray-300 focus:border-purple-500", "focus:ring-purple-500 focus:ring-1 outline-none")} />
        </div>
      </div>
      <div className={cn("flex justify-end space-x-3 pt-4 border-t mt-6", darkMode ? "border-gray-700" : "border-gray-200")}>
        <button type="button" onClick={onClose}
          className={cn("px-4 py-2 rounded-md text-sm font-medium transition-colors", darkMode ? "bg-gray-600 hover:bg-gray-500 text-gray-200" : "bg-gray-200 hover:bg-gray-300 text-gray-700")}>
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting}
          className={cn("px-4 py-2 rounded-md text-sm font-medium text-white flex items-center transition-colors",
            darkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-600 hover:bg-purple-700",
            isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:shadow-md hover:shadow-purple-500/30"
          )}>
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

  const themeClasses = {
    bgPage: darkMode ? "bg-gray-950" : "bg-gradient-to-br from-slate-50 to-purple-50",
    textPrimary: darkMode ? "text-gray-100" : "text-slate-800",
    textSecondary: darkMode ? "text-slate-400" : "text-slate-500",
    textAccent: darkMode ? "text-purple-400" : "text-purple-600",
    textSuccess: darkMode ? "text-green-400" : "text-green-600",
    textWarning: darkMode ? "text-yellow-400" : "text-yellow-500",
    bgCard: darkMode ? "bg-gray-900" : "bg-white",
    borderCard: darkMode ? "border-gray-700/60" : "border-slate-200",
    shadowCard: darkMode ? "shadow-2xl shadow-purple-900/10" : "shadow-xl shadow-slate-200/70",
    iconColor: darkMode ? "text-purple-400" : "text-purple-600",
    iconSecondary: darkMode ? "text-slate-500" : "text-slate-400",
    buttonPrimary: darkMode ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-purple-600 hover:bg-purple-700 text-white",
    buttonSecondary: darkMode ? "bg-slate-700 hover:bg-slate-600 text-slate-200" : "bg-slate-200 hover:bg-slate-300 text-slate-700",
    avatarBg: darkMode ? "bg-purple-600/30" : "bg-purple-500",
    avatarText: darkMode ? "text-purple-200" : "text-white",
    statValue: darkMode ? "text-sky-400" : "text-sky-600",
    statLabel: darkMode ? "text-slate-400" : "text-slate-500",
  };

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
    return <div className={cn("min-h-screen flex items-center justify-center", themeClasses.bgPage)}><Loader2 className="h-16 w-16 animate-spin text-purple-500" /></div>;
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
      <motion.div key="dashboard-content" className={cn("min-h-screen py-10 md:py-12", themeClasses.bgPage, themeClasses.textPrimary)} variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 className="text-3xl sm:text-3xl font-bold mb-8 sm:mb-10" variants={sectionVariants} initial="hidden" animate="visible">
            Welcome, <span className={themeClasses.textAccent}>{userData?.first_name || user?.username || 'User'}</span>!
          </motion.h1>

          {isDataLoading && !userData && (
            <motion.div className="flex items-center justify-center py-20" variants={sectionVariants} initial="hidden" animate="visible">
              <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
              <p className="ml-4 text-lg">Loading your dashboard...</p>
            </motion.div>
          )}
          {error && !isDataLoading && (
            <motion.div className={cn("p-6 rounded-lg shadow-md mb-8", darkMode ? "bg-red-900/30 border border-red-700" : "bg-red-100 border border-red-300")} variants={sectionVariants} initial="hidden" animate="visible">
              <h2 className="text-xl font-semibold mb-2 text-red-500">Oops! Something went wrong.</h2>
              <p className={darkMode ? "text-red-300" : "text-red-700"}>{error}</p>
              <button onClick={() => { setIsDataLoading(true); setError(""); setUserData(null); }} className={cn("mt-4 px-4 py-2 rounded text-sm", themeClasses.buttonPrimary)}>Try Again</button>
            </motion.div>
          )}

          {!isDataLoading && !error && userData && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <motion.div className="lg:col-span-4 xl:col-span-3" variants={sectionVariants} initial="hidden" animate="visible">
                <div className={cn("p-6 sm:p-8 rounded-xl border", themeClasses.bgCard, themeClasses.borderCard, themeClasses.shadowCard)}>
                  <div className="flex flex-col items-center mb-6">
                    <div className={cn(
                      "w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-4xl sm:text-5xl font-semibold mb-4 ring-4 overflow-hidden relative",
                      themeClasses.avatarBg, themeClasses.avatarText, darkMode ? "ring-purple-500/30" : "ring-purple-300"
                    )}>
                      {/* DEBUG LOGGING INLINE */}
                      {/* {console.log("Render - profile_pic:", userData?.profile_pic, "profileImageError:", profileImageError)} */}
                      {userData.profile_pic && !profileImageError ? ( // UPDATED KEY
                        <Image
                          src={
                            userData.profile_pic.startsWith('http') // UPDATED KEY
                              ? userData.profile_pic // UPDATED KEY
                              : `${BACKEND_URL}${userData.profile_pic}` // UPDATED KEY
                          }
                          alt={`${userData.first_name || userData.username}'s profile`}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-full"
                          priority
                          onError={() => {
                            console.warn("Dashboard: Failed to load profile image from src:", userData.profile_pic); // UPDATED KEY
                            setProfileImageError(true);
                          }}
                        />
                      ) : (
                        getInitials(userData.first_name, userData.last_name, userData.username)
                      )}
                    </div>
                    <h2 className="text-2xl font-semibold text-center">{userData.first_name || ""} {userData.last_name || ""}</h2>
                    <p className={cn("text-sm", themeClasses.textSecondary)}>@{userData.username}</p>
                  </div>
                  <div className="space-y-3 text-sm mb-6">
                    <div className="flex items-center"><Mail className={cn("mr-3 h-5 w-5 flex-shrink-0", themeClasses.iconSecondary)} /><span>{userData.email}</span></div>
                    {userData.mobile_no && (<div className="flex items-center"><Phone className={cn("mr-3 h-5 w-5 flex-shrink-0", themeClasses.iconSecondary)} /><span>{userData.mobile_no}</span></div>)}
                    {userData.address && (<div className="flex items-start"><MapPin className={cn("mr-3 mt-0.5 h-5 w-5 flex-shrink-0", themeClasses.iconSecondary)} /><span>{userData.address}{userData.city ? `, ${userData.city}` : ''}{userData.state ? `, ${userData.state}` : ''}{userData.pincode ? ` - ${userData.pincode}` : ''}</span></div>)}
                  </div>
                  <motion.button onClick={() => setIsEditModalOpen(true)} className={cn("w-full flex items-center justify-center px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300", themeClasses.buttonPrimary, "hover:shadow-lg hover:shadow-purple-500/40")} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
                    <Edit3 className="mr-2 h-4 w-4" />Edit Profile
                  </motion.button>
                </div>
                <motion.div className={cn("mt-8 p-6 rounded-xl border", themeClasses.bgCard, themeClasses.borderCard, themeClasses.shadowCard)} variants={itemVariants}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center"><TrendingUp className={cn("mr-2 h-5 w-5", themeClasses.iconColor)} />Your Impact</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center"><span className={themeClasses.statLabel}>Techniques Contributed:</span><span className={cn("font-bold text-lg", themeClasses.statValue)}>{userStats.techniquesContributed}</span></div>
                    <div className="flex justify-between items-center"><span className={themeClasses.statLabel}>Overall Impact Score:</span><span className={cn("font-bold text-lg", themeClasses.statValue)}>{userStats.impactScore}</span></div>
                    <div className="flex justify-between items-center"><span className={themeClasses.statLabel}>Forum Posts:</span><span className={cn("font-bold text-lg", themeClasses.statValue)}>{userStats.forumPosts}</span></div>
                  </div>
                </motion.div>
              </motion.div>
              <motion.div className="lg:col-span-8 xl:col-span-9" variants={staggerContainer} initial="hidden" animate="visible">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  {[
                    { title: "Browse Techniques", description: "Explore water saving methods.", href: "/techniques", icon: Droplet },
                    { title: "My Contributions", description: "View techniques you've added.", href: "/dashboard/my-techniques", icon: Briefcase },
                    { title: "Community Forum", description: "Connect and discuss with others.", href: "/forum", icon: Users },
                    { title: "Account Settings", description: "Manage your preferences.", href: "/profile/settings", icon: Settings },
                  ].map((action) => (
                    <motion.div key={action.title} variants={itemVariants} whileHover={{y: -5, scale: 1.02}} transition={{type: "spring", stiffness:300}}>
                      <Link href={action.href} passHref>
                        <div className={cn("p-6 rounded-xl border h-full flex flex-col justify-between cursor-pointer transition-all duration-300 ease-out", themeClasses.bgCard, themeClasses.borderCard, themeClasses.shadowCard, darkMode ? "hover:border-purple-500 hover:shadow-purple-600/20" : "hover:border-purple-400 hover:shadow-lg")}>
                          <div><action.icon className={cn("h-8 w-8 mb-3", themeClasses.iconColor)} /><h3 className="text-lg font-semibold mb-1">{action.title}</h3><p className={cn("text-sm", themeClasses.textSecondary)}>{action.description}</p></div>
                          <span className={cn("mt-4 text-sm font-medium flex items-center", themeClasses.textAccent)}>Go to {action.title.split(' ')[0]}<ChevronRight className="ml-1 h-4 w-4" /></span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <motion.div className={cn("p-6 sm:p-8 rounded-xl border", themeClasses.bgCard, themeClasses.borderCard, themeClasses.shadowCard)} variants={sectionVariants}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center"><Activity className={cn("mr-2 h-6 w-6", themeClasses.iconColor)} />Recent Activity</h2>
                  <div className={cn("space-y-3 text-sm", themeClasses.textSecondary)}>
                    <motion.div variants={itemVariants} className="flex items-center p-3 rounded-md hover:bg-gray-500/10 transition-colors"><span className={cn("w-2 h-2 rounded-full mr-3", darkMode ? "bg-purple-400" : "bg-purple-500")}></span>Logged in successfully.<span className="ml-auto text-xs">Just now</span></motion.div>
                    <motion.div variants={itemVariants} className="flex items-center p-3 rounded-md hover:bg-gray-500/10 transition-colors"><span className={cn("w-2 h-2 rounded-full mr-3", darkMode ? "bg-green-400" : "bg-green-500")}></span>Viewed 'Drip Irrigation' technique.<span className="ml-auto text-xs">5 mins ago</span></motion.div>
                    {userData && !userData.first_name && (<motion.p variants={itemVariants} className="p-3 rounded-md bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">Consider completing your profile for a better experience!</motion.p>)}
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
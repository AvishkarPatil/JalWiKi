// E:/Project/miniProject/JalWiKi/jalwiki_ui/app/auth/page.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/context/theme-context';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthFormData {
  email: string;
  password: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

enum AuthMode {
  Login = 'login',
  Signup = 'signup',
}

export default function AuthPage() {
  const [activeMode, setActiveMode] = useState<AuthMode>(AuthMode.Login);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login, register, user, loading: isLoadingAuth } = useAuth();
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState<AuthFormData>({
    email: '', password: '', username: '', first_name: '', last_name: '',
  });

  const redirectInitiated = useRef(false);

  useEffect(() => {
    console.log(`AuthPage Redirect Check: isLoadingAuth=${isLoadingAuth}, user=${!!user}, redirectInitiated=${redirectInitiated.current}`);
    if (!isLoadingAuth && user && !redirectInitiated.current) {
      console.log("AuthPage (useEffect): Redirect condition met. Setting flag and attempting redirect to / ...");
      redirectInitiated.current = true;
      try {
        router.replace('/');
        console.log("AuthPage (useEffect): router.replace('/') called.");
      } catch (e) {
        console.error("AuthPage (useEffect): Error during router.replace call:", e);
        redirectInitiated.current = false;
      }
    } else if (!isLoadingAuth && !user) {
        redirectInitiated.current = false;
        console.log("AuthPage (useEffect): User is not logged in, ensuring redirect flag is reset.");
    } else {
        if (isLoadingAuth) console.log("AuthPage (useEffect): Redirect condition NOT met (isLoadingAuth is true).");
        else if (redirectInitiated.current) console.log("AuthPage (useEffect): Redirect condition NOT met (redirect already initiated).");
    }
  }, [user, isLoadingAuth, router]);

  const handleModeChange = (newMode: AuthMode) => {
    if (isSubmitting) return;
    if (newMode !== activeMode) {
      setActiveMode(newMode);
      setError("");
      setFormData({ email: '', password: '', username: '', first_name: '', last_name: '' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");
    console.log(`AuthPage (handleSubmit): Submitting form in ${activeMode} mode.`);

    try {
      let result;
      if (activeMode === AuthMode.Signup) {
        if (!formData.username || !formData.first_name || !formData.last_name || !formData.email || !formData.password) {
          setError("Please fill in all required fields for signup.");
          setIsSubmitting(false); return;
        }
        // Updated Password Validation
        if (formData.password.length < 8) {
           setError("Password must be at least 8 characters long.");
           setIsSubmitting(false); return;
        }
        if (!/[A-Z]/.test(formData.password)) {
            setError("Password must contain at least one uppercase letter.");
            setIsSubmitting(false); return;
        }
        if (!/[0-9]/.test(formData.password)) { // or !/\d/.test(formData.password)
            setError("Password must contain at least one number.");
            setIsSubmitting(false); return;
        }

        result = await register({
            username: formData.username, first_name: formData.first_name, last_name: formData.last_name,
            email: formData.email, password: formData.password
        });
      } else {
         if (!formData.email || !formData.password) {
            setError("Please enter both email and password to log in.");
            setIsSubmitting(false); return;
          }
        result = await login({ email: formData.email, password: formData.password });
      }

      console.log(`AuthPage (handleSubmit): ${activeMode} result:`, result);

      if (!result.success) {
        setError(result.message || (activeMode === AuthMode.Signup ? 'Registration failed.' : 'Login failed.'));
        setIsSubmitting(false);
      }

    } catch (err: any) {
      console.error('AuthPage (handleSubmit): Unexpected error:', err);
      setError(err.message || 'An unexpected error occurred during submission.');
      setIsSubmitting(false);
    }
    console.log("AuthPage (handleSubmit): Form submission process finished.");
  };


  const showLoader = isLoadingAuth;
  const showRedirecting = !isLoadingAuth && user && redirectInitiated.current;
  const showForm = !isLoadingAuth && !user;

  console.log(`AuthPage Render: showLoader=${showLoader}, showRedirecting=${showRedirecting}, showForm=${showForm}, isSubmitting=${isSubmitting}`);

  if (showLoader) {
    console.log("AuthPage: Rendering Context Loader");
    return (
      <div className={cn("flex min-h-screen items-center justify-center p-4", darkMode ? "bg-gray-950" : "bg-gray-100")}>
        <Loader2 className="h-16 w-16 animate-spin text-purple-500" />
      </div>
    );
  }

  if (showRedirecting) {
    console.log("AuthPage: Rendering Redirecting message");
     return (
        <div className={cn("flex min-h-screen items-center justify-center p-4", darkMode ? "bg-gray-950 text-gray-300" : "bg-gray-100 text-gray-700")}>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Redirecting...
        </div>
     );
  }

  if (showForm) {
    console.log("AuthPage: Rendering form.");
    return (
      <div className={cn("flex min-h-screen items-center justify-center p-4 transition-colors duration-300", darkMode ? "bg-gray-950" : "bg-gray-100")}>
        <div className={cn("w-full max-w-md overflow-hidden rounded-2xl shadow-xl transition-colors duration-300", darkMode ? "bg-black border border-gray-800/50" : "bg-white border border-gray-200")}>
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 text-center text-white">
            <h2 className="text-2xl font-bold">{activeMode === AuthMode.Login ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="mt-1 text-sm opacity-90">{activeMode === AuthMode.Login ? 'Sign in to continue' : 'Join our community today'}</p>
          </div>

          <div className={cn("flex border-b", darkMode ? "border-gray-800" : "border-gray-200")}>
            <button onClick={() => handleModeChange(AuthMode.Login)} disabled={isSubmitting} className={cn( "flex-1 py-3 px-4 text-center text-sm font-medium transition-all", activeMode === AuthMode.Login ? (darkMode ? "border-b-2 border-purple-500 text-white" : "border-b-2 border-purple-600 text-purple-700 font-semibold") : (darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-800") )}> Login </button>
            <button onClick={() => handleModeChange(AuthMode.Signup)} disabled={isSubmitting} className={cn( "flex-1 py-3 px-4 text-center text-sm font-medium transition-all", activeMode === AuthMode.Signup ? (darkMode ? "border-b-2 border-purple-500 text-white" : "border-b-2 border-purple-600 text-purple-700 font-semibold") : (darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-800") )}> Sign Up </button>
          </div>

          <div className="p-6">
             {error && (<div className={cn("px-3 py-2 rounded-md text-sm mb-4 text-center border", darkMode ? "bg-red-900/40 border-red-700/60 text-red-300" : "bg-red-100 border-red-400 text-red-700")}>{error}</div>)}

            {activeMode === AuthMode.Login && (
              <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   <Button type="button" variant="outline" size="sm" className={cn("h-10 text-sm w-full flex items-center justify-center gap-2", darkMode ? "border-gray-700 bg-gray-800/50 hover:bg-gray-700/60 text-gray-300" : "border-gray-300 bg-white hover:bg-gray-50 text-gray-700")} disabled={isSubmitting}>
                     <svg className="h-4 w-4" viewBox="0 0 24 24"> <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/> <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/> <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/> <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/> </svg>
                     Google
                   </Button>
                   <Button type="button" variant="outline" size="sm" className={cn("h-10 text-sm w-full flex items-center justify-center gap-2", darkMode ? "border-gray-700 bg-gray-800/50 hover:bg-gray-700/60 text-gray-300" : "border-gray-300 bg-white hover:bg-gray-50 text-gray-700")} disabled={isSubmitting}>
                     <Github className="h-4 w-4" /> Github
                   </Button>
                </div>
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center"><div className={cn("w-full border-t", darkMode ? "border-gray-800" : "border-gray-300")}></div></div>
                  <div className="relative flex justify-center text-xs"><span className={cn("px-2", darkMode ? "bg-black text-gray-400" : "bg-white text-gray-500")}>Or continue with</span></div>
                </div>

                <div className="space-y-1">
                  <Input id="login-email" name="email" className={cn("h-10 focus:ring-1 focus:ring-purple-500 focus:border-purple-500", darkMode ? "border-gray-800 bg-gray-900 text-white placeholder:text-gray-400" : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-500")} placeholder="Email" type="email" value={formData.email} onChange={handleChange} required disabled={isSubmitting} />
                </div>
                <div className="space-y-1">
                  <Input id="login-password" name="password" className={cn("h-10 focus:ring-1 focus:ring-purple-500 focus:border-purple-500", darkMode ? "border-gray-800 bg-gray-900 text-white placeholder:text-gray-400" : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-500")} placeholder="Password" type="password" value={formData.password} onChange={handleChange} required disabled={isSubmitting} />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="remember" className={cn("h-3.5 w-3.5 rounded text-purple-600 focus:ring-purple-500 focus:ring-offset-1", darkMode ? "border-gray-700 bg-gray-900 focus:ring-offset-black" : "border-gray-300 bg-white focus:ring-offset-white")} disabled={isSubmitting} />
                    <label htmlFor="remember" className={cn("select-none", darkMode ? "text-gray-400" : "text-gray-600")}>Remember me</label>
                  </div>
                  <Link href="#" className={cn("hover:underline", darkMode ? "text-purple-400" : "text-purple-600")}>Forgot password?</Link>
                </div>

                <Button type="submit" className="h-10 w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:from-purple-600 hover:to-purple-800 disabled:opacity-60" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Processing...' : 'Log In'}
                </Button>
              </form>
            )}

            {activeMode === AuthMode.Signup && (
              <form onSubmit={handleSubmit} className="space-y-3 animate-fadeIn">
                <div className="grid gap-3 md:grid-cols-2">
                   <Input id="signup-first_name" name="first_name" className={cn("h-10 focus:ring-1 focus:ring-purple-500 focus:border-purple-500", darkMode ? "border-gray-800 bg-gray-900 text-white placeholder:text-gray-400" : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-500")} placeholder="First Name" type="text" value={formData.first_name} onChange={handleChange} required disabled={isSubmitting} />
                   <Input id="signup-last_name" name="last_name" className={cn("h-10 focus:ring-1 focus:ring-purple-500 focus:border-purple-500", darkMode ? "border-gray-800 bg-gray-900 text-white placeholder:text-gray-400" : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-500")} placeholder="Last Name" type="text" value={formData.last_name} onChange={handleChange} required disabled={isSubmitting} />
                </div>
                <Input id="signup-username" name="username" className={cn("h-10 focus:ring-1 focus:ring-purple-500 focus:border-purple-500", darkMode ? "border-gray-800 bg-gray-900 text-white placeholder:text-gray-400" : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-500")} placeholder="Username" type="text" value={formData.username} onChange={handleChange} required disabled={isSubmitting} />
                <Input id="signup-email" name="email" className={cn("h-10 focus:ring-1 focus:ring-purple-500 focus:border-purple-500", darkMode ? "border-gray-800 bg-gray-900 text-white placeholder:text-gray-400" : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-500")} placeholder="Email" type="email" value={formData.email} onChange={handleChange} required disabled={isSubmitting} />
                <Input id="signup-password" name="password" className={cn("h-10 focus:ring-1 focus:ring-purple-500 focus:border-purple-500", darkMode ? "border-gray-800 bg-gray-900 text-white placeholder:text-gray-400" : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-500")} placeholder="Password" type="password" value={formData.password} onChange={handleChange} required minLength={8} disabled={isSubmitting} />
                <p className={cn("text-xs px-1", darkMode ? "text-gray-400" : "text-gray-500")}>
                  Must be at least 8 characters, include alphanumeric characters.
                </p>
                <Button type="submit" className="h-10 w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:from-purple-600 hover:to-purple-800 disabled:opacity-60" disabled={isSubmitting}>
                   {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Processing...' : 'Sign Up'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  console.warn("AuthPage: Reached fallback render state.");
  return (
      <div className={cn("flex min-h-screen items-center justify-center p-4", darkMode ? "bg-gray-950 text-gray-300" : "bg-gray-100 text-gray-700")}>
          An unexpected rendering state occurred.
      </div>
  );
}
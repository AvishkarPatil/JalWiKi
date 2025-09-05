"use client"

import React, { useState } from "react"
import { useTheme } from "@/context/theme-context"
import { cn } from "@/lib/utils"

export default function ContactUsForm() {
  const { darkMode } = useTheme()
  
  type FormState = {
    name: string
    email: string
    phone?: string
    subject: string
    message: string
    company?: string
  }

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    company: "", 
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  function validate(values: FormState) {
    const newErrors: Partial<Record<keyof FormState, string>> = {}

    if (!values.name.trim()) newErrors.name = "Please enter your name."

    if (!values.email.trim()) {
      newErrors.email = "Please enter your email."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(values.email)) {
      newErrors.email = "Enter a valid email address."
    }

    if (!values.subject.trim()) newErrors.subject = "Please add a subject."

    if (!values.message.trim() || values.message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters."
    }

    if (values.phone && values.phone.trim() && !/^[+\d\s()\-]{7,20}$/.test(values.phone)) {
      newErrors.phone = "Enter a valid phone number (optional)."
    }

    if (values.company && values.company.trim().length > 0) {
      newErrors.company = "" 
    }

    return newErrors
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("idle")

    const v = validate(form)
    setErrors(v)
    if (Object.keys(v).length > 0) return

    setSubmitting(true)

    try {
      await new Promise((res) => setTimeout(res, 900))
      setStatus("success")
      setForm({ name: "", email: "", phone: "", subject: "", message: "", company: "" })
      setErrors({})
    } catch (err) {
      console.error(err)
      setStatus("error")
    } finally {
      setSubmitting(false)
    }
  }

  function handleChange<T extends keyof FormState>(key: T, value: FormState[T]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  // Theme-based styles
  const containerBg = darkMode 
    ? "bg-gradient-to-br from-gray-900 to-gray-800" 
    : "bg-gradient-to-br from-slate-50 to-slate-100"

  const cardBg = darkMode 
    ? "bg-gray-800/90 backdrop-blur ring-gray-700" 
    : "bg-white/90 backdrop-blur ring-slate-200"

  const textColor = darkMode ? "text-gray-100" : "text-slate-800"
  const mutedTextColor = darkMode ? "text-gray-300" : "text-slate-600"
  const labelColor = darkMode ? "text-gray-200" : "text-slate-700"
  const placeholderColor = darkMode ? "placeholder-gray-500" : "placeholder-slate-400"

  const inputBg = darkMode ? "bg-gray-700" : "bg-white"
  const inputBorder = darkMode ? "border-gray-600" : "border-slate-300"
  const inputFocusBorder = darkMode ? "focus:border-purple-400" : "focus:border-slate-400"
  const inputFocusRing = darkMode 
    ? "focus:ring-purple-500/30" 
    : "focus:ring-slate-200"

  const successBg = darkMode 
    ? "border-green-800 bg-green-900/50 text-green-200" 
    : "border-green-200 bg-green-50 text-green-800"

  const errorBg = darkMode 
    ? "border-red-800 bg-red-900/50 text-red-200" 
    : "border-red-200 bg-red-50 text-red-800"

  const buttonBg = darkMode 
    ? "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500/30" 
    : "bg-slate-900 hover:bg-slate-800 focus:ring-slate-200"

  const linkColor = darkMode 
    ? "text-purple-300 underline decoration-purple-500 hover:decoration-purple-300" 
    : "text-slate-900 underline decoration-slate-300 hover:decoration-slate-800"

  return (
    <div className={cn("min-h-screen flex items-center justify-center p-6 transition-colors duration-300", containerBg)}>
      <div className="w-full max-w-3xl">
        <div className="mb-6 text-center">
          <h1 className={cn("text-3xl font-bold tracking-tight", textColor)}>
            Contact Us
          </h1>
        </div>

        <div className={cn("rounded-2xl shadow-lg ring-1 p-6 md:p-8", cardBg)}>
          {/* Success / Error banners */}
          {status === "success" && (
            <div className={cn("mb-6 rounded-xl border px-4 py-3 text-sm", successBg)}>
              ✅ Your message has been sent. We'll get back to you soon!
            </div>
          )}
          {status === "error" && (
            <div className={cn("mb-6 rounded-xl border px-4 py-3 text-sm", errorBg)}>
              ❌ Something went wrong. Please try again.
            </div>
          )}

          <form onSubmit={onSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className={cn("block text-sm font-medium", labelColor)}>
                  Full name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={cn(
                    "mt-1 w-full rounded-xl px-3 py-2 shadow-sm outline-none transition focus:ring-4",
                    inputBg,
                    inputBorder,
                    inputFocusBorder,
                    inputFocusRing,
                    placeholderColor,
                    darkMode ? "text-gray-100" : "text-slate-900"
                  )}
                  placeholder="Your Name"
                  required
                />
                {errors.name && (
                  <p id="name-error" className="mt-1 text-xs text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={cn("block text-sm font-medium", labelColor)}>
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={cn(
                    "mt-1 w-full rounded-xl px-3 py-2 shadow-sm outline-none transition focus:ring-4",
                    inputBg,
                    inputBorder,
                    inputFocusBorder,
                    inputFocusRing,
                    placeholderColor,
                    darkMode ? "text-gray-100" : "text-slate-900"
                  )}
                  placeholder="jane@example.com"
                  required
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-xs text-red-400">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Phone (optional) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className={cn("block text-sm font-medium", labelColor)}>
                  Phone (optional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  className={cn(
                    "mt-1 w-full rounded-xl px-3 py-2 shadow-sm outline-none transition focus:ring-4",
                    inputBg,
                    inputBorder,
                    inputFocusBorder,
                    inputFocusRing,
                    placeholderColor,
                    darkMode ? "text-gray-100" : "text-slate-900"
                  )}
                  placeholder="+91 98765 43210"
                />
                {errors.phone && (
                  <p id="phone-error" className="mt-1 text-xs text-red-400">{errors.phone}</p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className={cn("block text-sm font-medium", labelColor)}>
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  aria-invalid={!!errors.subject}
                  aria-describedby={errors.subject ? "subject-error" : undefined}
                  className={cn(
                    "mt-1 w-full rounded-xl px-3 py-2 shadow-sm outline-none transition focus:ring-4",
                    inputBg,
                    inputBorder,
                    inputFocusBorder,
                    inputFocusRing,
                    placeholderColor,
                    darkMode ? "text-gray-100" : "text-slate-900"
                  )}
                  placeholder="How can we help?"
                  required
                />
                {errors.subject && (
                  <p id="subject-error" className="mt-1 text-xs text-red-400">{errors.subject}</p>
                )}
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className={cn("block text-sm font-medium", labelColor)}>
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
                placeholder="Write your message here..."
                className={cn(
                  "mt-1 w-full rounded-xl px-3 py-2 shadow-sm outline-none transition focus:ring-4",
                  inputBg,
                    inputBorder,
                    inputFocusBorder,
                    inputFocusRing,
                    placeholderColor,
                    darkMode ? "text-gray-100" : "text-slate-900"
                )}
                required
              />
              {errors.message && (
                <p id="message-error" className="mt-1 text-xs text-red-400">{errors.message}</p>
              )}
            </div>

            {/* Honeypot (hidden from users) */}
            <div className="hidden" aria-hidden>
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.company}
                onChange={(e) => handleChange("company", e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <p className={cn("text-xs", mutedTextColor)}>
                By submitting, you agree to our terms and privacy policy.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className={cn(
                  "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-70",
                  buttonBg
                )}
              >
                {submitting ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>Send message</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Contact details footer */}
        <div className={cn("mt-6 text-center text-sm", mutedTextColor)}>
          Or email us directly at{" "}
          <a 
            href="mailto:contact@jalwiki.com" 
            className={cn("font-medium underline underline-offset-4", linkColor)}
          >
            contact@jalwiki.com
          </a>
        </div>
      </div>
    </div>
  )
}
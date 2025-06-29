// E:/Project/miniProject/JalWiKi/jalwiki_ui/components/water_ai/water-efficiency-form.tsx
"use client"

import type React from "react"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { RecommendationResults } from "@/components/water_ai/recommendation-results"
import { ProcessingAnimation } from "@/components/water_ai/processing-animation"
import {
  InfoIcon as InfoCircle,
  MapPin,
  User,
  BarChart2,
  Settings,
  Home,
  Droplet,
  Crop,
  Building2,
  BrainCircuit,
  ImageIcon,
  Loader2,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getWaterEfficiencyRecommendation, type GeminiRecommendation } from "@/lib/gemini-api"
import { useTheme } from "@/context/theme-context"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  location: z.string().min(2, {
    message: "Please enter a valid location.",
  }),
  userType: z.string({
    required_error: "Please select a user type.",
  }),
  waterUsage: z.string().optional(),
  currentPractices: z.string().optional(),
  currentWaterResource: z.string().optional(),
  rainwaterHarvesting: z.enum(["yes", "no"]),
  size: z.string().optional(),
  waterUsageAreas: z.string().optional(),
  landArea: z.string().optional(),
  cropType: z.string().optional(),
  industryType: z.string().optional(),
  awarenessLevel: z.string({
    required_error: "Please select your awareness level.",
  }),
  image: z.any().optional(),
})

export function WaterEfficiencyForm() {
  const { darkMode } = useTheme();
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<GeminiRecommendation | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      userType: undefined,
      waterUsage: "",
      currentPractices: "",
      currentWaterResource: "",
      rainwaterHarvesting: "no",
      size: "",
      waterUsageAreas: "",
      landArea: "",
      cropType: "",
      industryType: "",
      awarenessLevel: undefined,
      image: undefined,
    },
  })

  const userType = form.watch("userType")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsProcessing(true)
    setResults(null)

    try {
      const geminiResponse: GeminiRecommendation = await getWaterEfficiencyRecommendation(values);
      setResults(geminiResponse);
      toast({
        title: "Recommendation Generated",
        description: "Your personalized water efficiency recommendation is ready!",
      })
    } catch (error: any) {
      console.error("Error in onSubmit:", error);
      toast({
        variant: "destructive",
        title: "Error Generating Recommendation",
        description: error.message || "Failed to generate recommendation. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      form.setValue("image", file);
    } else {
      setImagePreview(null);
      form.setValue("image", undefined);
    }
  }

  if (results) {
    return (
      // Corrected: Set max-w-5xl for the results container to match the form's width
      <div className="mx-auto max-w-5xl"> {/* <<<< CORRECTED THIS LINE */}
        <RecommendationResults
          results={results}
          onStartNew={() => {
            setResults(null)
            form.reset()
            setImagePreview(null)
          }}
          onEdit={() => {
            setResults(null)
          }}
        />
      </div>
    )
  }

  if (isProcessing && !results) {
    return <ProcessingAnimation />
  }

  return (
    <Card className={cn(
      "shadow-xl mx-auto max-w-5xl", // Form card is max-w-5xl
      darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
    )}>
      <CardContent className="pt-6 sm:pt-8 px-4 sm:px-6 md:px-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <MapPin className={cn("h-4 w-4", darkMode ? "text-purple-400" : "text-purple-600")} />
                      <FormLabel className={cn("text-sm font-medium", darkMode ? "text-gray-200" : "text-gray-800")}>Location</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoCircle className={cn("h-4 w-4 cursor-help", darkMode ? "text-gray-500" : "text-gray-400")} />
                          </TooltipTrigger>
                          <TooltipContent className={cn(darkMode ? "bg-gray-700 text-gray-200 border-gray-600" : "")}>
                            <p className="w-[200px] text-xs">Helps us understand your climate context</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Enter your location"
                        {...field}
                        className={cn(
                          darkMode
                            ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500"
                            : "bg-white border-gray-300 focus:border-purple-500"
                        )}
                      />
                    </FormControl>
                    <FormMessage className={cn(darkMode ? "text-red-400" : "")}/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <User className={cn("h-4 w-4", darkMode ? "text-purple-400" : "text-purple-600")} />
                      <FormLabel className={cn("text-sm font-medium", darkMode ? "text-gray-200" : "text-gray-800")}>User Type</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoCircle className={cn("h-4 w-4 cursor-help", darkMode ? "text-gray-500" : "text-gray-400")} />
                          </TooltipTrigger>
                          <TooltipContent className={cn(darkMode ? "bg-gray-700 text-gray-200 border-gray-600" : "")}>
                            <p className="w-[200px] text-xs">Select the category that best describes your water usage</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={cn(
                          darkMode
                            ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:ring-purple-500"
                            : "bg-white border-gray-300 focus:ring-purple-500"
                        )}>
                          <SelectValue placeholder="Select user type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className={cn(
                        darkMode ? "bg-gray-800 text-gray-200 border-gray-700" : ""
                      )}>
                        <SelectItem value="household" className={cn(darkMode ? "focus:bg-gray-700" : "")}>Household</SelectItem>
                        <SelectItem value="agriculture" className={cn(darkMode ? "focus:bg-gray-700" : "")}>Agriculture</SelectItem>
                        <SelectItem value="industry" className={cn(darkMode ? "focus:bg-gray-700" : "")}>Industry</SelectItem>
                        <SelectItem value="institution" className={cn(darkMode ? "focus:bg-gray-700" : "")}>Institution</SelectItem>
                        <SelectItem value="other" className={cn(darkMode ? "focus:bg-gray-700" : "")}>Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className={cn(darkMode ? "text-red-400" : "")}/>
                  </FormItem>
                )}
              />
            </div>

            {/* Water Usage & Current Water Resource */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <FormField control={form.control} name="waterUsage" render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <BarChart2 className={cn("h-4 w-4", darkMode ? "text-purple-400" : "text-purple-600")} />
                    <FormLabel className={cn("text-sm font-medium", darkMode ? "text-gray-200" : "text-gray-800")}>Water Usage</FormLabel>
                    <TooltipProvider><Tooltip><TooltipTrigger asChild><InfoCircle className={cn("h-4 w-4 cursor-help", darkMode ? "text-gray-500" : "text-gray-400")} /></TooltipTrigger><TooltipContent className={cn(darkMode ? "bg-gray-700 text-gray-200 border-gray-600" : "")}><p className="w-[200px] text-xs">Daily/Monthly water consumption in liters/gallons</p></TooltipContent></Tooltip></TooltipProvider>
                  </div>
                  <FormControl><Input placeholder="Optional, e.g., 500 liters/day" {...field} className={cn(darkMode ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500" : "bg-white border-gray-300 focus:border-purple-500")} /></FormControl>
                  <FormMessage className={cn(darkMode ? "text-red-400" : "")}/>
                </FormItem>
              )} />
              <FormField control={form.control} name="currentWaterResource" render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Droplet className={cn("h-4 w-4", darkMode ? "text-purple-400" : "text-purple-600")} />
                    <FormLabel className={cn("text-sm font-medium", darkMode ? "text-gray-200" : "text-gray-800")}>Current Water Resource</FormLabel>
                    <TooltipProvider><Tooltip><TooltipTrigger asChild><InfoCircle className={cn("h-4 w-4 cursor-help", darkMode ? "text-gray-500" : "text-gray-400")} /></TooltipTrigger><TooltipContent className={cn(darkMode ? "bg-gray-700 text-gray-200 border-gray-600" : "")}><p className="w-[200px] text-xs">Your primary source of water (e.g., municipal, well, river)</p></TooltipContent></Tooltip></TooltipProvider>
                  </div>
                  <FormControl><Input placeholder="Optional, e.g., Municipal" {...field} className={cn(darkMode ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500" : "bg-white border-gray-300 focus:border-purple-500")} /></FormControl>
                  <FormMessage className={cn(darkMode ? "text-red-400" : "")}/>
                </FormItem>
              )} />
            </div>

            {/* Current Practices */}
            <FormField control={form.control} name="currentPractices" render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <Settings className={cn("h-4 w-4", darkMode ? "text-purple-400" : "text-purple-600")} />
                  <FormLabel className={cn("text-sm font-medium", darkMode ? "text-gray-200" : "text-gray-800")}>Current Water Practices</FormLabel>
                  <TooltipProvider><Tooltip><TooltipTrigger asChild><InfoCircle className={cn("h-4 w-4 cursor-help", darkMode ? "text-gray-500" : "text-gray-400")} /></TooltipTrigger><TooltipContent className={cn(darkMode ? "bg-gray-700 text-gray-200 border-gray-600" : "")}><p className="w-[200px] text-xs">Describe what you're already doing to conserve water</p></TooltipContent></Tooltip></TooltipProvider>
                </div>
                <FormControl><Textarea placeholder="Optional, e.g., low-flow showerheads, fixing leaks" className={cn("resize-none", darkMode ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500" : "bg-white border-gray-300 focus:border-purple-500")} {...field} /></FormControl>
                <FormMessage className={cn(darkMode ? "text-red-400" : "")}/>
              </FormItem>
            )} />

            {/* Size & Water Usage Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              {userType && (
                <FormField control={form.control} name="size" render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <Home className={cn("h-4 w-4", darkMode ? "text-purple-400" : "text-purple-600")} />
                      <FormLabel className={cn("text-sm font-medium", darkMode ? "text-gray-200" : "text-gray-800")}>
                        {userType === "household" && "Household Size"}
                        {userType === "agriculture" && "Farm Size (e.g., acres)"}
                        {userType === "industry" && "Facility Size (e.g., sq ft)"}
                        {userType === "institution" && "Institution Size (e.g., students, beds)"}
                        {userType === "other" && "Size"}
                      </FormLabel>
                      <TooltipProvider><Tooltip><TooltipTrigger asChild><InfoCircle className={cn("h-4 w-4 cursor-help", darkMode ? "text-gray-500" : "text-gray-400")} /></TooltipTrigger><TooltipContent className={cn(darkMode ? "bg-gray-700 text-gray-200 border-gray-600" : "")}><p className="w-[200px] text-xs">Number of people or size of your facility</p></TooltipContent></Tooltip></TooltipProvider>
                    </div>
                    <FormControl><Input placeholder="Optional" {...field} className={cn(darkMode ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500" : "bg-white border-gray-300 focus:border-purple-500")} /></FormControl>
                    <FormMessage className={cn(darkMode ? "text-red-400" : "")}/>
                  </FormItem>
                )} />
              )}
              <FormField control={form.control} name="waterUsageAreas" render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Droplet className={cn("h-4 w-4", darkMode ? "text-purple-400" : "text-purple-600")} />
                    <FormLabel className={cn("text-sm font-medium", darkMode ? "text-gray-200" : "text-gray-800")}>Water Usage Areas</FormLabel>
                    <TooltipProvider><Tooltip><TooltipTrigger asChild><InfoCircle className={cn("h-4 w-4 cursor-help", darkMode ? "text-gray-500" : "text-gray-400")} /></TooltipTrigger><TooltipContent className={cn(darkMode ? "bg-gray-700 text-gray-200 border-gray-600" : "")}><p className="w-[200px] text-xs">List areas where you use water (e.g., kitchen, bathroom, irrigation)</p></TooltipContent></Tooltip></TooltipProvider>
                  </div>
                  <FormControl><Input placeholder="Optional, e.g., kitchen, bathroom, irrigation" {...field} className={cn(darkMode ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500" : "bg-white border-gray-300 focus:border-purple-500")} /></FormControl>
                  <FormMessage className={cn(darkMode ? "text-red-400" : "")}/>
                </FormItem>
              )} />
            </div>

            {/* Agriculture Specific */}
            {userType === "agriculture" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <FormField control={form.control} name="landArea" render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <Crop className={cn("h-4 w-4", darkMode ? "text-purple-400" : "text-purple-600")} />
                      <FormLabel className={cn("text-sm font-medium", darkMode ? "text-gray-200" : "text-gray-800")}>Land Area</FormLabel>
                      <TooltipProvider><Tooltip><TooltipTrigger asChild><InfoCircle className={cn("h-4 w-4 cursor-help", darkMode ? "text-gray-500" : "text-gray-400")} /></TooltipTrigger><TooltipContent className={cn(darkMode ? "bg-gray-700 text-gray-200 border-gray-600" : "")}><p className="w-[200px] text-xs">Size in acres/hectares</p></TooltipContent></Tooltip></TooltipProvider>
                    </div>
                    <FormControl><Input placeholder="Optional, e.g., 10 acres" {...field} className={cn(darkMode ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500" : "bg-white border-gray-300 focus:border-purple-500")} /></FormControl>
                    <FormMessage className={cn(darkMode ? "text-red-400" : "")}/>
                  </FormItem>
                )} />
                <FormField control={form.control} name="cropType" render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <Crop className={cn("h-4 w-4", darkMode ? "text-purple-400" : "text-purple-600")} />
                      <FormLabel className={cn("text-sm font-medium", darkMode ? "text-gray-200" : "text-gray-800")}>Crop Type</FormLabel>
                      <TooltipProvider><Tooltip><TooltipTrigger asChild><InfoCircle className={cn("h-4 w-4 cursor-help", darkMode ? "text-gray-500" : "text-gray-400")} /></TooltipTrigger><TooltipContent className={cn(darkMode ? "bg-gray-700 text-gray-200 border-gray-600" : "")}><p className="w-[200px] text-xs">Type of crops you grow</p></TooltipContent></Tooltip></TooltipProvider>
                    </div>
                    <FormControl><Input placeholder="Optional, e.g., Corn, Wheat" {...field} className={cn(darkMode ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500" : "bg-white border-gray-300 focus:border-purple-500")} /></FormControl>
                    <FormMessage className={cn(darkMode ? "text-red-400" : "")}/>
                  </FormItem>
                )} />
              </div>
            )}

            {/* Industry Specific */}
            {userType === "industry" && (
              <FormField control={form.control} name="industryType" render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Building2 className={cn("h-4 w-4", darkMode ? "text-purple-400" : "text-purple-600")} />
                    <FormLabel className={cn("text-sm font-medium", darkMode ? "text-gray-200" : "text-gray-800")}>Industry Type</FormLabel>
                    <TooltipProvider><Tooltip><TooltipTrigger asChild><InfoCircle className={cn("h-4 w-4 cursor-help", darkMode ? "text-gray-500" : "text-gray-400")} /></TooltipTrigger><TooltipContent className={cn(darkMode ? "bg-gray-700 text-gray-200 border-gray-600" : "")}><p className="w-[200px] text-xs">Type of industry or manufacturing</p></TooltipContent></Tooltip></TooltipProvider>
                  </div>
                  <FormControl><Input placeholder="Optional, e.g., Textile, Food Processing" {...field} className={cn(darkMode ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500" : "bg-white border-gray-300 focus:border-purple-500")} /></FormControl>
                  <FormMessage className={cn(darkMode ? "text-red-400" : "")}/>
                </FormItem>
              )} />
            )}

            {/* Awareness Level */}
            <FormField
              control={form.control}
              name="awarenessLevel"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <BrainCircuit className={cn("h-4 w-4", darkMode ? "text-purple-400" : "text-purple-600")} />
                    <FormLabel className={cn("text-sm font-medium", darkMode ? "text-gray-200" : "text-gray-800")}>Awareness Level</FormLabel>
                    <TooltipProvider><Tooltip><TooltipTrigger asChild><InfoCircle className={cn("h-4 w-4 cursor-help", darkMode ? "text-gray-500" : "text-gray-400")} /></TooltipTrigger><TooltipContent className={cn(darkMode ? "bg-gray-700 text-gray-200 border-gray-600" : "")}><p className="w-[200px] text-xs">Your familiarity with water conservation techniques</p></TooltipContent></Tooltip></TooltipProvider>
                  </div>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className={cn(
                        darkMode ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:ring-purple-500"
                                 : "bg-white border-gray-300 focus:ring-purple-500"
                      )}>
                        <SelectValue placeholder="Select your awareness level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className={cn(darkMode ? "bg-gray-800 text-gray-200 border-gray-700" : "")}>
                      <SelectItem value="beginner" className={cn(darkMode ? "focus:bg-gray-700" : "")}>Beginner</SelectItem>
                      <SelectItem value="intermediate" className={cn(darkMode ? "focus:bg-gray-700" : "")}>Intermediate</SelectItem>
                      <SelectItem value="expert" className={cn(darkMode ? "focus:bg-gray-700" : "")}>Expert</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className={cn(darkMode ? "text-red-400" : "")}/>
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <ImageIcon className={cn("h-4 w-4", darkMode ? "text-purple-400" : "text-purple-600")} />
                    <FormLabel className={cn("text-sm font-medium", darkMode ? "text-gray-200" : "text-gray-800")}>Image Upload (Optional)</FormLabel>
                    <TooltipProvider><Tooltip><TooltipTrigger asChild><InfoCircle className={cn("h-4 w-4 cursor-help", darkMode ? "text-gray-500" : "text-gray-400")} /></TooltipTrigger><TooltipContent className={cn(darkMode ? "bg-gray-700 text-gray-200 border-gray-600" : "")}><p className="w-[200px] text-xs">Upload an image of your space for more accurate recommendations</p></TooltipContent></Tooltip></TooltipProvider>
                  </div>
                  <FormControl>
                    <div className={cn(
                      "border-2 border-dashed rounded-lg p-4 transition-colors",
                      darkMode
                        ? "border-gray-600 hover:border-purple-500 bg-gray-800/50"
                        : "border-gray-200 hover:border-purple-300 bg-gray-50/50"
                    )}>
                      {!imagePreview ? (
                        <div className="flex flex-col items-center justify-center py-4">
                          <ImageIcon className={cn("h-8 w-8 mb-2", darkMode ? "text-gray-600" : "text-gray-400")} />
                          <p className={cn("text-sm mb-2", darkMode ? "text-gray-400" : "text-gray-500")}>Drag and drop or click to upload</p>
                          <p className={cn("text-xs", darkMode ? "text-gray-500" : "text-gray-400")}>JPG, PNG (max 5MB)</p>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="image-upload"
                            {...fieldProps}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className={cn("mt-2", darkMode ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600" : "bg-white")}
                            onClick={() => document.getElementById("image-upload")?.click()}
                          >
                            Select File
                          </Button>
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-auto object-cover rounded-md max-h-[200px]"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setImagePreview(null)
                              form.setValue("image", undefined)
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className={cn(darkMode ? "text-red-400" : "")}/>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className={cn(
                "w-full text-white font-semibold py-3",
                darkMode
                  ? "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
                  : "bg-purple-700 hover:bg-purple-800 focus:ring-purple-600"
              )}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Water Efficiency Recommendations"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
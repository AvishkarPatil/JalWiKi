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
// Removed useTheme as we're using design system tokens
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
      <div className="mx-auto max-w-5xl">
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
    <Card className="shadow-xl mx-auto max-w-5xl bg-card border-border">
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
                      <MapPin className="h-4 w-4 text-primary" />
                      <FormLabel className="text-sm font-medium text-foreground">Location</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-popover text-popover-foreground border-border">
                            <p className="w-[200px] text-xs">Helps us understand your climate context</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Enter your location"
                        {...field}
                        className="bg-background text-foreground border-border placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <FormLabel className="text-sm font-medium text-foreground">User Type</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-popover text-popover-foreground border-border">
                            <p className="w-[200px] text-xs">Select the category that best describes your water usage</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background text-foreground border-border focus:ring-ring">
                          <SelectValue placeholder="Select user type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover text-popover-foreground border-border">
                        <SelectItem value="household">Household</SelectItem>
                        <SelectItem value="agriculture">Agriculture</SelectItem>
                        <SelectItem value="industry">Industry</SelectItem>
                        <SelectItem value="institution">Institution</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
            </div>

            {/* Water Usage & Current Water Resource */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <FormField control={form.control} name="waterUsage" render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <BarChart2 className="h-4 w-4 text-primary" />
                    <FormLabel className="text-sm font-medium text-foreground">Water Usage</FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-popover text-popover-foreground border-border">
                          <p className="w-[200px] text-xs">Daily/Monthly water consumption in liters/gallons</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormControl>
                    <Input 
                      placeholder="Optional, e.g., 500 liters/day" 
                      {...field} 
                      className="bg-background text-foreground border-border placeholder:text-muted-foreground focus:ring-ring" 
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )} />
              <FormField control={form.control} name="currentWaterResource" render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-primary" />
                    <FormLabel className="text-sm font-medium text-foreground">Current Water Resource</FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-popover text-popover-foreground border-border">
                          <p className="w-[200px] text-xs">Your primary source of water (e.g., municipal, well, river)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormControl>
                    <Input 
                      placeholder="Optional, e.g., Municipal" 
                      {...field} 
                      className="bg-background text-foreground border-border placeholder:text-muted-foreground focus:ring-ring" 
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )} />
            </div>

            {/* Current Practices */}
            <FormField control={form.control} name="currentPractices" render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-primary" />
                  <FormLabel className="text-sm font-medium text-foreground">Current Water Practices</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-popover text-popover-foreground border-border">
                        <p className="w-[200px] text-xs">Describe what you're already doing to conserve water</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormControl>
                  <Textarea 
                    placeholder="Optional, e.g., low-flow showerheads, fixing leaks" 
                    className="resize-none bg-background text-foreground border-border placeholder:text-muted-foreground focus:ring-ring" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-destructive"/>
              </FormItem>
            )} />

            {/* Size & Water Usage Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              {userType && (
                <FormField control={form.control} name="size" render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-primary" />
                      <FormLabel className="text-sm font-medium text-foreground">
                        {userType === "household" && "Household Size"}
                        {userType === "agriculture" && "Farm Size (e.g., acres)"}
                        {userType === "industry" && "Facility Size (e.g., sq ft)"}
                        {userType === "institution" && "Institution Size (e.g., students, beds)"}
                        {userType === "other" && "Size"}
                      </FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-popover text-popover-foreground border-border">
                            <p className="w-[200px] text-xs">Number of people or size of your facility</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Input 
                        placeholder="Optional" 
                        {...field} 
                        className="bg-background text-foreground border-border placeholder:text-muted-foreground focus:ring-ring" 
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )} />
              )}
              <FormField control={form.control} name="waterUsageAreas" render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-primary" />
                    <FormLabel className="text-sm font-medium text-foreground">Water Usage Areas</FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-popover text-popover-foreground border-border">
                          <p className="w-[200px] text-xs">List areas where you use water (e.g., kitchen, bathroom, irrigation)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormControl>
                    <Input 
                      placeholder="Optional, e.g., kitchen, bathroom, irrigation" 
                      {...field} 
                      className="bg-background text-foreground border-border placeholder:text-muted-foreground focus:ring-ring" 
                    />
                  </FormControl>
                  <FormMessage className="text-destructive"/>
                </FormItem>
              )} />
            </div>

            {/* Agriculture Specific */}
            {userType === "agriculture" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <FormField control={form.control} name="landArea" render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <Crop className="h-4 w-4 text-primary" />
                      <FormLabel className="text-sm font-medium text-foreground">Land Area</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-popover text-popover-foreground border-border">
                            <p className="w-[200px] text-xs">Size in acres/hectares</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Input 
                        placeholder="Optional, e.g., 10 acres" 
                        {...field} 
                        className="bg-background text-foreground border-border placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2" 
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="cropType" render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <FormLabel className="text-sm font-medium text-foreground">User Type</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-popover text-popover-foreground border-border">
                            <p className="w-[200px] text-xs">Select the category that best describes you</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl><Input placeholder="Optional, e.g., Corn, Wheat" {...field} className="bg-background text-foreground border-border placeholder:text-muted-foreground focus:border-accent" /></FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )} />
              </div>
            )}

            {/* Industry Specific */}
            {userType === "industry" && (
              <FormField control={form.control} name="industryType" render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <FormLabel className="text-sm font-medium text-foreground">Industry Type</FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-popover text-popover-foreground border-border">
                          <p className="w-[200px] text-xs">Type of industry or manufacturing</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormControl>
                    <Input 
                      placeholder="Optional, e.g., Textile, Food Processing" 
                      {...field} 
                      className="bg-background text-foreground border-border placeholder:text-muted-foreground focus:ring-ring" 
                    />
                  </FormControl>
                  <FormMessage className="text-destructive"/>
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
                    <BrainCircuit className="h-4 w-4 text-primary" />
                    <FormLabel className="text-sm font-medium text-foreground">Awareness Level</FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-popover text-popover-foreground border-border">
                          <p className="w-[200px] text-xs">Your familiarity with water conservation techniques</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background text-foreground border-border hover:bg-accent">
                        <SelectValue placeholder="Select your awareness level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover text-popover-foreground border-border">
                      <SelectItem value="beginner">Beginner (Just starting to learn)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (Some knowledge)</SelectItem>
                      <SelectItem value="advanced">Advanced (Extensive knowledge)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-destructive" />
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
                    <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-primary" />
                      Upload Image
                    </FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-popover text-popover-foreground border-border">
                          <p className="w-[200px] text-xs">Upload an image of your space for more accurate recommendations</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormControl>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 transition-colors hover:border-primary/50 bg-muted/50">
                      {!imagePreview ? (
                        <div className="flex flex-col items-center justify-center py-4">
                          <ImageIcon className="h-8 w-8 mb-2 text-muted-foreground/70" />
                          <p className="text-sm mb-2 text-muted-foreground">Drag and drop or click to upload</p>
                          <p className="text-xs text-muted-foreground/70">JPG, PNG (max 5MB)</p>
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
                            className="mt-2 bg-background hover:bg-accent hover:text-accent-foreground"
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
                  <FormMessage className="text-destructive"/>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-3"
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
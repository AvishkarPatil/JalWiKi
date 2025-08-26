"use client"

import React, { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Grid3x3,
  List,
  Search,
  GlassWaterIcon as WaterIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { techniques as initialTechniquesData } from "@/lib/data" // Renamed for clarity
import { useTheme } from "@/context/theme-context"
import { useAuth } from "@/context/auth-context"
import { cn } from "@/lib/utils"
import { AddTechniqueModal, TechniqueFormData } from "@/components/AddTechniqueModal" // Ensure this path is correct
import { GlobalSearchBar } from "@/components/global-search-bar"

interface Region { id: number; name: string; }
interface Category { id: number; name: string; description: string; }
interface TechniqueImage { id: number; image: string; caption: string; order: number; type: string; }
type ImpactLevel = "low" | "moderate" | "high";

interface Technique {
  id: number;
  title: string;
  slug: string;
  added_by: number;
  impact: ImpactLevel;
  region: Region[];
  categories: Category[];
  summary: string;
  detailed_content: string;
  benefits: string[];
  materials: string[];
  steps: string[];
  main_image: string;
  created_on: string;
  updated_on: string;
  is_published: boolean;
  likes: number[];
  images: TechniqueImage[];
}

export default function TechniquesPage() {
  const { darkMode } = useTheme();
  const { user, loading: isLoadingAuth } = useAuth();
  const router = useRouter();

  // Make techniques data stateful
  const [techniques, setTechniques] = useState<Technique[]>(initialTechniquesData as Technique[]);
  const [isDataLoading, setIsDataLoading] = useState(false); // Renamed from isLoading to avoid conflict
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedImpacts, setSelectedImpacts] = useState<string[]>([]);

  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 6;

  useEffect(() => {
    if (isLoadingAuth) {
      return;
    }
    if (!user) {
      // console.log("TechniquesPage: No user found, redirecting to /auth"); // Removed for cleaner console
      router.push("/auth");
    }
  }, [user, isLoadingAuth, router]);

  // Derive filter options from the current techniques state
  const filterableRegions = Array.from(new Set(techniques.flatMap((t) => t.region.map((r) => r.name))));
  const filterableCategories = Array.from(new Set(techniques.flatMap((t) => t.categories.map((c) => c.name))));
  const impactLevels: ImpactLevel[] = ["low", "moderate", "high"];

  // Derive existing categories and regions for the modal props
  const modalExistingCategories: Category[] = techniques.reduce((acc: Category[], tech) => {
    tech.categories.forEach(cat => {
      if (!acc.find(existingCat => existingCat.id === cat.id)) {
        acc.push(cat);
      }
    });
    return acc;
  }, []);

  const modalExistingRegions: Region[] = techniques.reduce((acc: Region[], tech) => {
    tech.region.forEach(reg => {
      if (!acc.find(existingReg => existingReg.id === reg.id)) {
        acc.push(reg);
      }
    });
    return acc;
  }, []);

  const filteredTechniques = techniques.filter((technique) => {
    const matchesSearch =
      searchQuery === "" ||
      technique.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      technique.region.some((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      technique.categories.some((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      technique.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegionFilter = selectedRegions.length === 0 || technique.region.some((r) => selectedRegions.includes(r.name));
    const matchesCategoryFilter = selectedCategories.length === 0 || technique.categories.some((c) => selectedCategories.includes(c.name));
    const matchesImpactFilter = selectedImpacts.length === 0 || selectedImpacts.includes(technique.impact);

    return matchesSearch && matchesRegionFilter && matchesCategoryFilter && matchesImpactFilter;
  });

  const totalPages = Math.ceil(filteredTechniques.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTechniques = filteredTechniques.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsDataLoading(true);
    setTimeout(() => { setCurrentPage(1); setIsDataLoading(false); }, 300);
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegions((prev) => (prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]));
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]));
    setCurrentPage(1);
  };

  const handleImpactChange = (impact: string) => {
    setSelectedImpacts((prev) => (prev.includes(impact) ? prev.filter((i) => i !== impact) : [...prev, impact as ImpactLevel]));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedRegions([]); setSelectedCategories([]); setSelectedImpacts([]);
    setSearchQuery(""); setCurrentPage(1);
  };

  // Modal control functions
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Function to handle adding a new technique
  const handleAddTechnique = async (formData: TechniqueFormData) => {
    if (!user || !user.id) {
      console.error("User not authenticated or user ID missing.");
      // Optionally, show an error message to the user via a toast or alert
      return;
    }

    // Simulate API call and optimistic update
    const newId = techniques.length > 0 ? Math.max(...techniques.map(t => t.id)) + 1 : 1;

    // Map categories and regions from formData.
    // In a real app, new categories/regions without IDs would be created on the backend,
    // and the backend would return the new objects with IDs.
    // For this simulation, we assign temporary high IDs.
    let nextTempCategoryId = 2000 + modalExistingCategories.length; // Start IDs high to avoid collision
    const mappedCategories: Category[] = formData.categories.map(cat => ({
        id: cat.id || nextTempCategoryId++,
        name: cat.name,
        description: cat.description || ""
    }));

    let nextTempRegionId = 3000 + modalExistingRegions.length; // Start IDs high
    const mappedRegions: Region[] = formData.regions.map(reg => ({
        id: reg.id || nextTempRegionId++,
        name: reg.name
    }));

    const newTechnique: Technique = {
      id: newId,
      title: formData.title,
      slug: formData.title.toLowerCase().replace(/\s+/g, '-') + `-${newId}`, // Simple unique slug
      added_by: parseInt(user.id, 10), // Assuming user.id is a string
      impact: formData.impact as ImpactLevel, // Ensure formData.impact is not empty
      region: mappedRegions,
      categories: mappedCategories,
      summary: formData.summary,
      detailed_content: formData.detailed_content,
      benefits: formData.benefits.filter(b => b.trim() !== ""),
      materials: formData.materials.filter(m => m.trim() !== ""),
      steps: formData.steps.filter(s => s.trim() !== ""),
      main_image: formData.main_image_preview || "/placeholder.svg", // Use preview or placeholder
      created_on: new Date().toISOString(),
      updated_on: new Date().toISOString(),
      is_published: formData.is_published,
      likes: [],
      images: formData.gallery_images.map((img, index) => ({
        id: 10000 + index, // Temporary ID for gallery images
        image: img.previewUrl || "/placeholder.svg",
        caption: img.caption,
        order: index,
        type: img.type, // Assuming img.type from TechniqueFormData is already correctly typed
      })),
    };

    setTechniques(prevTechniques => [newTechnique, ...prevTechniques]); // Add to the beginning of the list
    handleCloseModal();
    // Optionally, scroll to the top or show a success message
  };

  if (isLoadingAuth) {
    return (
      <div className={cn("flex min-h-screen items-center justify-center p-4", darkMode ? "bg-gray-950" : "bg-gray-100")}>
        <Loader2 className="h-16 w-16 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!user) {
     return null;
  }

  return (
    <div className={cn(
      "flex flex-col min-h-screen transition-colors duration-300",
      darkMode ? "bg-gray-950 text-gray-200" : "bg-gray-50 text-gray-900"
    )}>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className={cn(
            "text-3xl font-bold mb-6",
            darkMode ? "text-purple-400" : "text-purple-700"
          )}>Water Techniques</h1>
          <div className="max-w-md mx-auto">
            <GlobalSearchBar 
              onSearch={handleSearch}
              placeholder="Search water conservation techniques..."
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:items-start">
          <div className={cn("w-full md:w-64 flex-shrink-0 space-y-6 md:sticky md:top-8")}>
            <Button
              onClick={handleOpenModal}
              className={cn(
                "w-full flex items-center justify-center px-4 py-3 rounded-lg text-base font-medium text-white transition-all duration-300",
                darkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-600 hover:bg-purple-700",
                "hover:shadow-lg hover:shadow-purple-500/40 transform hover:-translate-y-0.5"
              )}
            >
              <Plus size={20} className="mr-2" />
              Add New Technique
            </Button>

            <div className={cn(
              "w-full p-5 rounded-lg border shadow-sm transition-colors duration-300",
              darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
            )}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Filters</h2>
                {(selectedRegions.length > 0 || selectedCategories.length > 0 || selectedImpacts.length > 0) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className={cn(
                    "h-8 text-xs",
                    darkMode ? "text-purple-400 hover:bg-purple-900/50" : "text-purple-600 hover:bg-purple-50"
                  )}>
                    Clear all
                  </Button>
                )}
              </div>

              <Accordion type="single" collapsible className="w-full" defaultValue="impact">
                <AccordionItem value="impact" className={cn(darkMode ? "border-gray-700" : "")}>
                  <AccordionTrigger className={cn("py-3 text-base font-medium hover:no-underline", darkMode ? "hover:text-purple-400" : "hover:text-purple-700")}>Impact Level</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pl-1">
                      {impactLevels.map((impact) => (
                        <div key={impact} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`impact-${impact}`}
                            checked={selectedImpacts.includes(impact)}
                            onChange={() => handleImpactChange(impact)}
                            className={cn("rounded focus:ring-purple-500", darkMode ? "bg-gray-700 border-gray-600 text-purple-500" : "text-purple-600")}
                          />
                          <label htmlFor={`impact-${impact}`} className="text-sm capitalize select-none cursor-pointer">
                            {impact}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="region" className={cn(darkMode ? "border-gray-700" : "")}>
                  <AccordionTrigger className={cn("py-3 text-base font-medium hover:no-underline", darkMode ? "hover:text-purple-400" : "hover:text-purple-700")}>Region</AccordionTrigger>
                  <AccordionContent>
                    <div className={cn(
                      "space-y-2 pl-1 max-h-48 overflow-y-auto",
                      "scrollbar-thin",
                      darkMode
                        ? "scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500"
                        : "scrollbar-track-gray-100 scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500"
                    )}>
                      {filterableRegions.map((region) => ( // Use filterableRegions
                        <div key={region} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`region-${region}`}
                            checked={selectedRegions.includes(region)}
                            onChange={() => handleRegionChange(region)}
                            className={cn("rounded focus:ring-purple-500", darkMode ? "bg-gray-700 border-gray-600 text-purple-500" : "text-purple-600")}
                          />
                          <label htmlFor={`region-${region}`} className="text-sm select-none cursor-pointer">
                            {region}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="category" className={cn("border-b-0", darkMode ? "border-gray-700" : "")}>
                  <AccordionTrigger className={cn("py-3 text-base font-medium hover:no-underline", darkMode ? "hover:text-purple-400" : "hover:text-purple-700")}>Category</AccordionTrigger>
                  <AccordionContent>
                    <div className={cn(
                      "space-y-2 pl-1 max-h-48 overflow-y-auto",
                      "scrollbar-thin",
                      darkMode
                        ? "scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500"
                        : "scrollbar-track-gray-100 scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500"
                    )}>
                      {filterableCategories.map((category) => ( // Use filterableCategories
                        <div key={category} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCategoryChange(category)}
                            className={cn("rounded focus:ring-purple-500", darkMode ? "bg-gray-700 border-gray-600 text-purple-500" : "text-purple-600")}
                          />
                          <label htmlFor={`category-${category}`} className="text-sm select-none cursor-pointer">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {(selectedRegions.length > 0 || selectedCategories.length > 0 || selectedImpacts.length > 0) && (
                <div className={cn("mt-4 pt-4", darkMode ? "border-t border-gray-700" : "border-t")}>
                  <h3 className="text-sm font-medium mb-2">Applied Filters</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedImpacts.map((impact) => (
                      <Badge key={impact} variant="outline" className={cn(
                        "flex items-center gap-1 text-xs",
                        darkMode ? "bg-purple-900/50 border-purple-700/50 text-purple-300" : "bg-purple-50 border-purple-200 text-purple-700"
                      )}>
                        {impact}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => handleImpactChange(impact)} />
                      </Badge>
                    ))}
                    {selectedRegions.map((region) => (
                      <Badge key={region} variant="outline" className={cn(
                        "flex items-center gap-1 text-xs",
                        darkMode ? "bg-purple-900/50 border-purple-700/50 text-purple-300" : "bg-purple-50 border-purple-200 text-purple-700"
                      )}>
                        {region}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => handleRegionChange(region)} />
                      </Badge>
                    ))}
                    {selectedCategories.map((category) => (
                      <Badge key={category} variant="outline" className={cn(
                        "flex items-center gap-1 text-xs",
                        darkMode ? "bg-purple-900/50 border-purple-700/50 text-purple-300" : "bg-purple-50 border-purple-200 text-purple-700"
                      )}>
                        {category}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => handleCategoryChange(category)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Techniques List */}
          <div className="flex-1">
            <div className="flex flex-col space-y-6">
              <div className="flex justify-between items-center">
                <p className={cn("text-sm", darkMode ? "text-gray-400" : "text-gray-500")}>
                  Showing {filteredTechniques.length > 0 ? startIndex + 1 : 0}-
                  {Math.min(startIndex + itemsPerPage, filteredTechniques.length)} of {filteredTechniques.length}{" "}
                  techniques
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      viewMode === "grid"
                        ? (darkMode ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-purple-700 hover:bg-purple-800 text-white")
                        : (darkMode ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100")
                    )}
                  >
                    <Grid3x3 className="h-4 w-4" />
                    <span className="sr-only">Grid view</span>
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className={cn(
                      viewMode === "list"
                        ? (darkMode ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-purple-700 hover:bg-purple-800 text-white")
                        : (darkMode ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100")
                    )}
                  >
                    <List className="h-4 w-4" />
                    <span className="sr-only">List view</span>
                  </Button>
                </div>
              </div>

              <div>
                {isDataLoading ? (
                  viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array(6).fill(0).map((_, i) => (
                        <Card key={i} className={cn("overflow-hidden", darkMode ? "bg-gray-900 border-gray-700" : "bg-white")}>
                          <Skeleton className={cn("h-48 w-full", darkMode ? "bg-gray-700" : "bg-gray-200")} />
                          <div className="p-4 space-y-2">
                            <Skeleton className={cn("h-6 w-3/4", darkMode ? "bg-gray-700" : "bg-gray-200")} />
                            <Skeleton className={cn("h-4 w-full", darkMode ? "bg-gray-700" : "bg-gray-200")} />
                            <Skeleton className={cn("h-4 w-2/3", darkMode ? "bg-gray-700" : "bg-gray-200")} />
                            <div className="flex gap-2 mt-3">
                              <Skeleton className={cn("h-5 w-16 rounded-full", darkMode ? "bg-gray-700" : "bg-gray-200")} />
                              <Skeleton className={cn("h-5 w-16 rounded-full", darkMode ? "bg-gray-700" : "bg-gray-200")} />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      {Array(6).fill(0).map((_, i) => (
                        <Card key={i} className={cn("overflow-hidden", darkMode ? "bg-gray-900 border-gray-700" : "bg-white")}>
                          <div className="p-4 flex gap-4">
                            <Skeleton className={cn("h-24 w-24 rounded-md flex-shrink-0", darkMode ? "bg-gray-700" : "bg-gray-200")} />
                            <div className="flex-1 space-y-2">
                              <Skeleton className={cn("h-6 w-3/4", darkMode ? "bg-gray-700" : "bg-gray-200")} />
                              <Skeleton className={cn("h-4 w-full", darkMode ? "bg-gray-700" : "bg-gray-200")} />
                              <div className="flex gap-2 mt-2">
                                <Skeleton className={cn("h-5 w-16 rounded-full", darkMode ? "bg-gray-700" : "bg-gray-200")} />
                                <Skeleton className={cn("h-5 w-16 rounded-full", darkMode ? "bg-gray-700" : "bg-gray-200")} />
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )
                ) : (
                  <>
                    {filteredTechniques.length === 0 ? (
                      <div className={cn(
                        "text-center py-12 rounded-lg border",
                        darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
                      )}>
                        <div className={cn(
                          "mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4",
                          darkMode ? "bg-purple-900/50" : "bg-purple-100"
                        )}>
                          <WaterIcon className={cn("h-8 w-8", darkMode ? "text-purple-400" : "text-purple-700")} />
                        </div>
                        <h3 className="text-lg font-medium">No techniques found</h3>
                        <p className={cn("mt-2", darkMode ? "text-gray-400" : "text-gray-500")}>Try changing your search or filters.</p>
                        <Button variant="outline" className={cn("mt-4", darkMode ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100")} onClick={clearFilters}>
                          Clear all filters
                        </Button>
                      </div>
                    ) : (
                      <>
                        {viewMode === "grid" ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedTechniques.map((technique: Technique) => (
                              <Link href={`/techniques/${technique.slug}`} key={technique.id} className="group">
                                <Card className={cn(
                                  "overflow-hidden h-full transition-all duration-200 border hover:shadow-md",
                                  darkMode ? "bg-gray-900 border-gray-700 hover:border-purple-700/50" : "bg-white border-gray-200 hover:border-purple-200"
                                )}>
                                  <div className="relative h-48 overflow-hidden">
                                    <Image
                                      src={technique.main_image || "/placeholder.svg"}
                                      alt={technique.title}
                                      fill
                                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                    <div className="absolute top-2 right-2">
                                      <Badge className={cn("capitalize", darkMode ? "bg-purple-600 text-white" : "bg-purple-700 text-white")}>{technique.impact}</Badge>
                                    </div>
                                  </div>
                                  <CardContent className="p-4">
                                    <h3 className={cn("font-semibold text-lg mb-2 transition-colors", darkMode ? "group-hover:text-purple-400" : "group-hover:text-purple-700")}>
                                      {technique.title}
                                    </h3>
                                    <p className={cn("text-sm line-clamp-2 mb-3", darkMode ? "text-gray-400" : "text-gray-600")}>{technique.summary}</p>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                      {technique.categories.slice(0, 2).map((category: Category) => (
                                        <Badge key={category.id} variant="outline" className={cn(darkMode ? "bg-gray-800 border-gray-600" : "bg-gray-50 border-gray-200")}>
                                          {category.name}
                                        </Badge>
                                      ))}
                                      {technique.categories.length > 2 && (
                                        <Badge variant="outline" className={cn(darkMode ? "bg-gray-800 border-gray-600" : "bg-gray-50 border-gray-200")}>
                                          +{technique.categories.length - 2}
                                        </Badge>
                                      )}
                                    </div>
                                  </CardContent>
                                  <CardFooter className={cn("px-4 py-3 flex justify-between items-center", darkMode ? "border-t border-gray-700" : "border-t")}>
                                    <div className={cn("flex items-center gap-1 text-sm", darkMode ? "text-gray-400" : "text-gray-500")}>
                                      <span className="line-clamp-1">{technique.region.map((r: Region) => r.name).join(", ")}</span>
                                    </div>
                                    <Button size="sm" variant="ghost" className={cn("hover:bg-opacity-50 -mr-2", darkMode ? "text-purple-400 hover:bg-purple-900" : "text-purple-700 hover:bg-purple-50")}>
                                      Read more
                                    </Button>
                                  </CardFooter>
                                </Card>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            {paginatedTechniques.map((technique: Technique) => (
                              <Link href={`/techniques/${technique.slug}`} key={technique.id} className="group block">
                                <Card className={cn(
                                  "overflow-hidden transition-all duration-200 border hover:shadow-md",
                                  darkMode ? "bg-gray-900 border-gray-700 hover:border-purple-700/50" : "bg-white border-gray-200 hover:border-purple-200"
                                )}>
                                  <div className="p-4 flex flex-col sm:flex-row gap-4">
                                    <div className="relative h-32 sm:h-24 w-full sm:w-32 rounded-md overflow-hidden flex-shrink-0">
                                      <Image
                                        src={technique.main_image || "/placeholder.svg"}
                                        alt={technique.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        sizes="(max-width: 640px) 100vw, 128px"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex justify-between items-start mb-1 gap-2">
                                        <h3 className={cn("font-semibold text-lg transition-colors", darkMode ? "group-hover:text-purple-400" : "group-hover:text-purple-700")}>
                                          {technique.title}
                                        </h3>
                                        <Badge className={cn("capitalize ml-2 flex-shrink-0", darkMode ? "bg-purple-600 text-white" : "bg-purple-700 text-white")}>
                                          {technique.impact}
                                        </Badge>
                                      </div>
                                      <p className={cn("text-sm line-clamp-2 mb-2", darkMode ? "text-gray-400" : "text-gray-600")}>{technique.summary}</p>
                                      <div className="flex flex-wrap items-center justify-between mt-2 gap-2">
                                        <div className="flex flex-wrap gap-2">
                                          {technique.categories.slice(0, 2).map((category: Category) => (
                                            <Badge key={category.id} variant="outline" className={cn(darkMode ? "bg-gray-800 border-gray-600" : "bg-gray-50 border-gray-200")}>
                                              {category.name}
                                            </Badge>
                                          ))}
                                          {technique.categories.length > 2 && (
                                            <Badge variant="outline" className={cn(darkMode ? "bg-gray-800 border-gray-600" : "bg-gray-50 border-gray-200")}>
                                              +{technique.categories.length - 2}
                                            </Badge>
                                          )}
                                        </div>
                                        <div className={cn("text-sm", darkMode ? "text-gray-400" : "text-gray-500")}>
                                          {technique.region.map((r: Region) => r.name).join(", ")}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Card>
                              </Link>
                            ))}
                          </div>
                        )}

                        {totalPages > 1 && (
                          <div className="flex items-center justify-between mt-8">
                            <Button
                              variant="outline"
                              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                              className={cn("flex items-center gap-1", darkMode ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100")}
                            >
                              <ChevronLeft className="h-4 w-4" />
                              Previous
                            </Button>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <Button
                                  key={page}
                                  variant={currentPage === page ? "default" : "outline"}
                                  size="icon"
                                  className={cn(
                                    "w-8 h-8",
                                    currentPage === page
                                      ? (darkMode ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-purple-700 hover:bg-purple-800 text-white")
                                      : (darkMode ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100")
                                  )}
                                  onClick={() => setCurrentPage(page)}
                                >
                                  {page}
                                </Button>
                              ))}
                            </div>
                            <Button
                              variant="outline"
                              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                              disabled={currentPage === totalPages}
                              className={cn("flex items-center gap-1", darkMode ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100")}
                            >
                              Next
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Render the AddTechniqueModal */}
      <AddTechniqueModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddTechnique}
        existingCategories={modalExistingCategories}
        existingRegions={modalExistingRegions}
      />
    </div>
  )
}
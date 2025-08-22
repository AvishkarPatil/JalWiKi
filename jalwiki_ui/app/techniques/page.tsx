"use client"

import React, { useState, useEffect } from "react"
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
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
      <div className="flex min-h-screen items-center justify-center p-4 bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
     return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-6 text-primary">Water Techniques</h1>
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search techniques..."
                className="pl-10 pr-4 py-2 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:items-start">
          <div className={cn("w-full md:w-64 flex-shrink-0 space-y-6 md:sticky md:top-8")}>
            <Button
              onClick={handleOpenModal}
              className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/40 transform hover:-translate-y-0.5"
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
                            className="rounded text-primary focus:ring-primary border-border"
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
                      "scrollbar-track-muted scrollbar-thumb-border hover:scrollbar-thumb-foreground/50"
                    )}>
                      {filterableRegions.map((region) => ( // Use filterableRegions
                        <div key={region} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`region-${region}`}
                            checked={selectedRegions.includes(region)}
                            onChange={() => handleRegionChange(region)}
                            className="rounded text-primary focus:ring-primary border-border"
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
                      "scrollbar-track-muted scrollbar-thumb-border hover:scrollbar-thumb-foreground/50"
                    )}>
                      {filterableCategories.map((category) => ( // Use filterableCategories
                        <div key={category} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCategoryChange(category)}
                            className="rounded text-primary focus:ring-primary border-border"
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
                <div className="mt-4 pt-4 border-t border-border">
                  <h3 className="text-sm font-medium mb-2">Applied Filters</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedImpacts.map((impact) => (
                      <Badge key={impact} variant="outline" className={cn(
                        "flex items-center gap-1 text-xs",
                        "bg-primary/10 border-primary/30 text-primary"
                      )}>
                        {impact}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => handleImpactChange(impact)} />
                      </Badge>
                    ))}
                    {selectedRegions.map((region) => (
                      <Badge key={region} variant="outline" className={cn(
                        "flex items-center gap-1 text-xs",
                        "bg-primary/10 border-primary/30 text-primary"
                      )}>
                        {region}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => handleRegionChange(region)} />
                      </Badge>
                    ))}
                    {selectedCategories.map((category) => (
                      <Badge key={category} variant="outline" className={cn(
                        "flex items-center gap-1 text-xs",
                        "bg-primary/10 border-primary/30 text-primary"
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
                <p className="text-sm text-muted-foreground">
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
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "hover:bg-accent hover:text-accent-foreground"
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
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "hover:bg-accent hover:text-accent-foreground"
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
                        <Card key={i} className="overflow-hidden">
                          <Skeleton className="h-48 w-full bg-muted" />
                          <div className="p-4 space-y-2">
                            <Skeleton className="h-6 w-3/4 bg-muted" />
                            <Skeleton className="h-4 w-full bg-muted" />
                            <Skeleton className="h-4 w-2/3 bg-muted" />
                            <div className="flex gap-2 mt-3">
                              <Skeleton className="h-5 w-16 rounded-full bg-muted" />
                              <Skeleton className="h-5 w-16 rounded-full bg-muted" />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      {Array(6).fill(0).map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                          <div className="p-4 flex gap-4">
                            <Skeleton className="h-24 w-24 rounded-md flex-shrink-0 bg-muted" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-6 w-3/4 bg-muted" />
                              <Skeleton className="h-4 w-full bg-muted" />
                              <div className="flex gap-2 mt-2">
                                <Skeleton className="h-5 w-16 rounded-full bg-muted" />
                                <Skeleton className="h-5 w-16 rounded-full bg-muted" />
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
                      <div className="text-center py-12 rounded-lg border border-border bg-card">
                        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-primary/10">
                          <WaterIcon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium">No techniques found</h3>
                        <p className="mt-2 text-muted-foreground">Try changing your search or filters.</p>
                        <Button variant="outline" className="mt-4" onClick={clearFilters}>
                          Clear all filters
                        </Button>
                      </div>
                    ) : (
                      <>
                        {viewMode === "grid" ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedTechniques.map((technique: Technique) => (
                              <Link href={`/techniques/${technique.slug}`} key={technique.id} className="group">
                                <Card className="overflow-hidden h-full transition-all duration-200 border border-border hover:shadow-md hover:border-primary/50">
                                  <div className="relative h-48 overflow-hidden">
                                    <Image
                                      src={technique.main_image || "/placeholder.svg"}
                                      alt={technique.title}
                                      fill
                                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                    <div className="absolute top-2 right-2">
                                      <Badge className="capitalize bg-primary text-primary-foreground">{technique.impact}</Badge>
                                    </div>
                                  </div>
                                  <CardContent className="p-4">
                                    <h3 className="font-semibold text-lg mb-2 transition-colors group-hover:text-primary">
                                      {technique.title}
                                    </h3>
                                    <p className="text-sm line-clamp-2 mb-3 text-muted-foreground">{technique.summary}</p>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                      {technique.categories.slice(0, 2).map((category: Category) => (
                                        <Badge key={category.id} variant="outline" className="bg-muted text-foreground">
                                          {category.name}
                                        </Badge>
                                      ))}
                                      {technique.categories.length > 2 && (
                                        <Badge variant="outline" className="bg-muted text-foreground">
                                          +{technique.categories.length - 2}
                                        </Badge>
                                      )}
                                    </div>
                                  </CardContent>
                                  <CardFooter className="px-4 py-3 flex justify-between items-center border-t border-border">
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <span className="line-clamp-1">{technique.region.map((r: Region) => r.name).join(", ")}</span>
                                    </div>
                                    <Button size="sm" variant="ghost" className="hover:bg-opacity-50 -mr-2 text-primary hover:bg-primary/10">
                                      Read more
                                    </Button>
                                  </CardFooter>
                                </Card>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col gap-6">
                            {paginatedTechniques.map((technique: Technique) => (
                              <Link href={`/techniques/${technique.slug}`} key={technique.id} className="group block">
                                <Card className="overflow-hidden transition-all duration-200 border border-border hover:shadow-md hover:border-primary/50">
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
                                        <h3 className="font-semibold text-lg transition-colors group-hover:text-primary">
                                          {technique.title}
                                        </h3>
                                        <Badge className="capitalize ml-2 flex-shrink-0 bg-primary text-primary-foreground">
                                          {technique.impact}
                                        </Badge>
                                      </div>
                                      <p className="text-sm line-clamp-2 mb-2 text-muted-foreground">{technique.summary}</p>
                                      <div className="flex flex-wrap items-center justify-between mt-2 gap-2">
                                        <div className="flex flex-wrap gap-2">
                                          {technique.categories.slice(0, 2).map((category: Category) => (
                                            <Badge key={category.id} variant="outline" className="bg-muted text-foreground">
                                              {category.name}
                                            </Badge>
                                          ))}
                                          {technique.categories.length > 2 && (
                                            <Badge variant="outline" className="bg-muted text-foreground">
                                              +{technique.categories.length - 2}
                                            </Badge>
                                          )}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
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
                              className="flex items-center gap-1"
                            >
                              <ChevronLeft className="h-4 w-4" />
                              Previous
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                              disabled={currentPage === totalPages}
                              className="flex items-center gap-1"
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
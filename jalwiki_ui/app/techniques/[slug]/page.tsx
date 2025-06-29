"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  GlassWaterIcon as WaterIcon,
  Calendar,
  MapPin,
  User,
  ArrowLeft,
  ArrowRight,
  Heart,
  Share2,
  Bookmark,
  Loader2, // Added
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { techniques as allTechniquesData } from "@/lib/data";
import { useTheme } from "@/context/theme-context";
import { useAuth } from "@/context/auth-context"; // Added
import { cn } from "@/lib/utils";

interface Region { id: number; name: string; }
interface Category { id: number; name: string; description: string; }
interface TechniqueImage { id: number; image: string; caption: string; order: number; type: string; }
type ImpactLevel = "low" | "moderate" | "high";
interface Technique {
  id: number; title: string; slug: string; added_by: number; impact: ImpactLevel;
  region: Region[]; categories: Category[]; summary: string; detailed_content: string;
  benefits: string[]; materials: string[]; steps: string[]; main_image: string;
  created_on: string; updated_on: string; is_published: boolean; likes: number[];
  images: TechniqueImage[];
}

export default function TechniqueDetailPage() {
  const { darkMode } = useTheme();
  const params = useParams();
  const router = useRouter();
  const { user, loading: isLoadingAuth } = useAuth(); // Added

  const [isLoadingData, setIsLoadingData] = useState(true); // Renamed for clarity
  const [technique, setTechnique] = useState<Technique | null>(null);
  const [relatedTechniques, setRelatedTechniques] = useState<Technique[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const slug = params.slug as string;
  const techniques: Technique[] = allTechniquesData as Technique[];

  // --- Auth Redirect Effect --- Added
  useEffect(() => {
    if (isLoadingAuth) {
      return;
    }
    if (!user) {
      console.log("TechniqueDetailPage: No user found, redirecting to /auth");
      router.push("/auth");
    }
  }, [user, isLoadingAuth, router]);

  // --- Data Loading Effect ---
  useEffect(() => {
    // Only load data if auth check is done and user exists
    if (!isLoadingAuth && user && slug) {
      const loadData = async () => {
        setIsLoadingData(true);
        await new Promise((resolve) => setTimeout(resolve, 500)); // Shorter delay now

        const foundTechnique = techniques.find((t: Technique) => t.slug === slug);

        if (foundTechnique) {
          setTechnique(foundTechnique);
          const related = techniques
            .filter(
              (t: Technique) =>
                t.slug !== slug &&
                (t.region.some((r1: Region) => foundTechnique.region.some((r2: Region) => r1.name === r2.name)) ||
                  t.categories.some((c1: Category) => foundTechnique.categories.some((c2: Category) => c1.name === c2.name))),
            )
            .slice(0, 3);
          setRelatedTechniques(related);
        }
        setIsLoadingData(false);
      };
      loadData();
    } else if (!isLoadingAuth && !user) {
      // Don't attempt to load data if user is not authenticated (redirect is happening)
      setIsLoadingData(false); // Ensure data loading stops if redirecting
    } else if (!slug) {
      setIsLoadingData(false);
      console.error("Technique slug is missing.");
    }
  }, [slug, techniques, isLoadingAuth, user]); // Added isLoadingAuth, user dependencies

  const currentIndex = techniques.findIndex((t: Technique) => t.slug === slug);
  const prevTechnique = currentIndex > 0 ? techniques[currentIndex - 1] : null;
  const nextTechnique = currentIndex < techniques.length - 1 ? techniques[currentIndex + 1] : null;

  // --- Auth Loading State --- Added
  if (isLoadingAuth) {
    return (
      <div className={cn("flex min-h-screen items-center justify-center p-4", darkMode ? "bg-gray-950" : "bg-gray-100")}>
        <Loader2 className="h-16 w-16 animate-spin text-purple-500" />
      </div>
    );
  }

  // --- Render null or redirecting message if user is not logged in --- Added
  if (!user) {
     return null;
  }

  // --- Data Loading State ---
  if (isLoadingData) {
    return (
      <div className={cn(
        "flex flex-col min-h-screen transition-colors duration-300",
        darkMode ? "bg-gray-950" : "bg-gray-50"
      )}>
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center mb-8">
              <Button variant="ghost" size="sm" className="flex items-center gap-1 opacity-50 cursor-default">
                <ArrowLeft className="h-4 w-4" />
                Back to Techniques
              </Button>
            </div>
            <div className={cn(
              "rounded-lg shadow-sm border p-6 space-y-6",
              darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
            )}>
              <Skeleton className={cn("h-10 w-3/4", darkMode ? "bg-gray-700" : "bg-gray-200")} />
              <div className="flex flex-wrap items-center gap-4">
                <Skeleton className={cn("h-6 w-24 rounded-full", darkMode ? "bg-gray-700" : "bg-gray-200")} />
                <Skeleton className={cn("h-6 w-32 rounded-full", darkMode ? "bg-gray-700" : "bg-gray-200")} />
                <Skeleton className={cn("h-6 w-28 rounded-full", darkMode ? "bg-gray-700" : "bg-gray-200")} />
              </div>
              <Skeleton className={cn("h-[400px] w-full rounded-lg", darkMode ? "bg-gray-700" : "bg-gray-200")} />
              <div className={cn("flex space-x-1 mb-6", darkMode ? "border-b border-gray-700" : "border-b")}>
                <Skeleton className={cn("h-10 w-24 rounded-t-md", darkMode ? "bg-gray-700" : "bg-gray-200")} />
                <Skeleton className={cn("h-10 w-32 rounded-t-md opacity-70", darkMode ? "bg-gray-700" : "bg-gray-200")} />
                <Skeleton className={cn("h-10 w-28 rounded-t-md opacity-70", darkMode ? "bg-gray-700" : "bg-gray-200")} />
                <Skeleton className={cn("h-10 w-24 rounded-t-md opacity-70", darkMode ? "bg-gray-700" : "bg-gray-200")} />
                <Skeleton className={cn("h-10 w-24 rounded-t-md opacity-70", darkMode ? "bg-gray-700" : "bg-gray-200")} />
              </div>
              <div className="space-y-3">
                <Skeleton className={cn("h-5 w-full", darkMode ? "bg-gray-700" : "bg-gray-200")} />
                <Skeleton className={cn("h-5 w-full", darkMode ? "bg-gray-700" : "bg-gray-200")} />
                <Skeleton className={cn("h-5 w-5/6", darkMode ? "bg-gray-700" : "bg-gray-200")} />
                <Skeleton className={cn("h-5 w-3/4", darkMode ? "bg-gray-700" : "bg-gray-200")} />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --- Not Found State ---
  if (!technique) {
    return (
      <div className={cn(
        "flex flex-col min-h-screen transition-colors duration-300",
        darkMode ? "bg-gray-950 text-gray-200" : "bg-gray-50 text-gray-900"
      )}>
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto text-center py-12">
            <div className={cn(
              "mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4",
              darkMode ? "bg-purple-900/50" : "bg-purple-100"
            )}>
              <WaterIcon className={cn("h-8 w-8", darkMode ? "text-purple-400" : "text-purple-700")} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Technique Not Found</h2>
            <p className={cn("mb-6", darkMode ? "text-gray-400" : "text-gray-600")}>
              The technique you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild className={cn(darkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-700 hover:bg-purple-800")}>
              <Link href="/techniques">Browse All Techniques</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // --- Render Technique Detail Page (Only if authenticated and data loaded) ---
  return (
    <div className={cn(
      "flex flex-col min-h-screen transition-colors duration-300",
      darkMode ? "bg-gray-950 text-gray-200" : "bg-gray-50 text-gray-900"
    )}>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" className={cn(
              "flex items-center gap-1",
              darkMode ? "text-gray-400 hover:text-gray-100 hover:bg-gray-800" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            )} asChild>
              <Link href="/techniques">
                <ArrowLeft className="h-4 w-4" />
                Back to Techniques
              </Link>
            </Button>
          </div>

          <article className={cn(
            "rounded-lg shadow-sm border overflow-hidden transition-colors duration-300",
            darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
          )}>
            <div className="relative h-[300px] md:h-[400px] w-full">
              <Image
                src={technique.main_image || "/placeholder.svg"}
                alt={technique.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
                <div className="p-6 text-white w-full">
                  <h1 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-md">{technique.title}</h1>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge className="bg-purple-600 hover:bg-purple-700 capitalize">{technique.impact} impact</Badge>
                    {technique.categories.slice(0, 3).map((category: Category) => (
                      <Badge key={category.id} variant="outline" className="bg-white/20 text-white border-white/40 backdrop-blur-sm">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className={cn(
                "flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center mb-6 pb-4 gap-y-3",
                darkMode ? "border-b border-gray-700" : "border-b"
              )}>
                <div className={cn(
                  "flex flex-wrap items-center gap-x-4 gap-y-1 text-sm",
                  darkMode ? "text-gray-400" : "text-gray-500"
                )}>
                  <div className="flex items-center gap-1" title={`Added by User ID ${technique.added_by}`}>
                    <User className="h-4 w-4" />
                    <span>Added by User #{technique.added_by}</span>
                  </div>
                  <div className="flex items-center gap-1" title={`Created on ${new Date(technique.created_on).toLocaleString()}`}>
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(technique.created_on).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{technique.region.map((r: Region) => r.name).join(", ")}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "flex items-center gap-1",
                      isLiked
                        ? (darkMode ? "text-red-400 border-red-700/50 hover:bg-red-900/30" : "text-red-500 border-red-300 hover:bg-red-50")
                        : (darkMode ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100")
                    )}
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                    <span>{isLiked ? "Liked" : "Like"}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "flex items-center gap-1",
                      isBookmarked
                        ? (darkMode ? "text-purple-400 border-purple-700/50 hover:bg-purple-900/30" : "text-purple-700 border-purple-300 hover:bg-purple-50")
                        : (darkMode ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100")
                    )}
                    onClick={() => setIsBookmarked(!isBookmarked)}
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                    <span>{isBookmarked ? "Saved" : "Save"}</span>
                  </Button>
                  <Button variant="outline" size="sm" className={cn(
                    "flex items-center gap-1",
                    darkMode ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100"
                  )}>
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="description" className="w-full">
                <TabsList className={cn(
                  "mb-6 grid w-full grid-cols-3 sm:grid-cols-5",
                  darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
                )}>
                  <TabsTrigger value="description" className={cn(darkMode ? "data-[state=active]:bg-gray-700 data-[state=active]:text-gray-100" : "")}>Description</TabsTrigger>
                  <TabsTrigger value="steps" className={cn(darkMode ? "data-[state=active]:bg-gray-700 data-[state=active]:text-gray-100" : "")}>Implementation</TabsTrigger>
                  <TabsTrigger value="materials" className={cn(darkMode ? "data-[state=active]:bg-gray-700 data-[state=active]:text-gray-100" : "")}>Materials</TabsTrigger>
                  <TabsTrigger value="benefits" className={cn(darkMode ? "data-[state=active]:bg-gray-700 data-[state=active]:text-gray-100" : "")}>Benefits</TabsTrigger>
                  <TabsTrigger value="gallery" className={cn(darkMode ? "data-[state=active]:bg-gray-700 data-[state=active]:text-gray-100" : "")}>Gallery</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-0">
                  <div className={cn(
                    "prose prose-sm sm:prose-base max-w-none",
                    darkMode ? "prose-invert text-gray-300" : "text-gray-700"
                  )}>
                    <p className="text-lg leading-relaxed mb-4">{technique.summary}</p>
                    <p>{technique.detailed_content}</p>
                  </div>
                </TabsContent>

                <TabsContent value="steps" className="mt-0">
                  <div className={cn(
                    "prose prose-sm sm:prose-base max-w-none",
                    darkMode ? "prose-invert text-gray-300" : "text-gray-700"
                  )}>
                    <h2 className={cn("text-xl font-semibold mb-4", darkMode ? "text-purple-400" : "text-purple-700")}>Implementation Steps</h2>
                    {technique.steps && technique.steps.length > 0 ? (
                      <ol className="list-decimal pl-5 space-y-3">
                        {technique.steps.map((step: string, index: number) => (
                          <li key={index} className="pl-2">
                            {step}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className={cn("italic", darkMode ? "text-gray-500" : "text-gray-500")}>No implementation steps provided.</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="materials" className="mt-0">
                  <div className={cn(
                    "prose prose-sm sm:prose-base max-w-none",
                    darkMode ? "prose-invert text-gray-300" : "text-gray-700"
                  )}>
                    <h2 className={cn("text-xl font-semibold mb-4", darkMode ? "text-purple-400" : "text-purple-700")}>Materials Required</h2>
                    {technique.materials && technique.materials.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-2">
                        {technique.materials.map((material: string, index: number) => (
                          <li key={index} className="pl-2">
                            {material}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={cn("italic", darkMode ? "text-gray-500" : "text-gray-500")}>No materials list provided.</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="benefits" className="mt-0">
                  <div className={cn(
                    "prose prose-sm sm:prose-base max-w-none",
                    darkMode ? "prose-invert text-gray-300" : "text-gray-700"
                  )}>
                    <h2 className={cn("text-xl font-semibold mb-4", darkMode ? "text-purple-400" : "text-purple-700")}>Benefits</h2>
                    {technique.benefits && technique.benefits.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-2">
                        {technique.benefits.map((benefit: string, index: number) => (
                          <li key={index} className="pl-2">
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={cn("italic", darkMode ? "text-gray-500" : "text-gray-500")}>No benefits listed.</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="gallery" className="mt-0">
                  {technique.images && technique.images.length > 0 ? (
                    <Carousel
                      opts={{ loop: technique.images.length > 1 }}
                      className="w-full max-w-xl mx-auto"
                    >
                      <CarouselContent>
                        {technique.images.map((img: TechniqueImage) => (
                          <CarouselItem key={img.id}>
                            <div className="p-1">
                              <div className={cn(
                                "relative aspect-video rounded-lg overflow-hidden",
                                darkMode ? "border border-gray-700" : "border"
                              )}>
                                <Image
                                  src={img.image || "/placeholder.svg"}
                                  alt={img.caption || technique.title}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                              </div>
                              {img.caption && <p className={cn("text-sm text-center mt-2", darkMode ? "text-gray-400" : "text-gray-600")}>{img.caption}</p>}
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {technique.images.length > 1 && (
                        <>
                          <CarouselPrevious className={cn("left-[-10px] sm:left-[-50px]", darkMode ? "bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-300" : "")} />
                          <CarouselNext className={cn("right-[-10px] sm:right-[-50px]", darkMode ? "bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-300" : "")} />
                        </>
                      )}
                    </Carousel>
                  ) : (
                    <p className={cn("italic text-center", darkMode ? "text-gray-500" : "text-gray-500")}>No additional images available.</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </article>

          {relatedTechniques.length > 0 && (
            <div className="mt-12">
              <h2 className={cn("text-2xl font-bold mb-6", darkMode ? "text-purple-400" : "text-purple-700")}>Related Techniques</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedTechniques.map((relatedTechnique: Technique) => (
                  <Link href={`/techniques/${relatedTechnique.slug}`} key={relatedTechnique.id} className="group">
                    <div className={cn(
                      "rounded-lg overflow-hidden border shadow-sm transition-all duration-200 hover:shadow-md h-full flex flex-col",
                      darkMode ? "bg-gray-900 border-gray-700 hover:border-purple-700/50" : "bg-white border-gray-200 hover:border-purple-200"
                    )}>
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={relatedTechnique.main_image || "/placeholder.svg"}
                          alt={relatedTechnique.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className={cn("capitalize", darkMode ? "bg-purple-600 text-white" : "bg-purple-700 text-white")}>{relatedTechnique.impact}</Badge>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className={cn("font-semibold text-lg mb-2 transition-colors", darkMode ? "group-hover:text-purple-400" : "group-hover:text-purple-700")}>
                          {relatedTechnique.title}
                        </h3>
                        <p className={cn("text-sm line-clamp-2 flex-1", darkMode ? "text-gray-400" : "text-gray-600")}>{relatedTechnique.summary}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {relatedTechnique.categories.slice(0, 2).map((category: Category) => (
                            <Badge key={category.id} variant="outline" className={cn(darkMode ? "bg-gray-800 border-gray-600" : "bg-gray-50 border-gray-200")}>
                              {category.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className={cn("flex items-center justify-between mt-12 pt-6", darkMode ? "border-t border-gray-700" : "border-t")}>
            {prevTechnique ? (
              <Button variant="outline" className={cn("flex items-center gap-2", darkMode ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100")} asChild>
                <Link href={`/techniques/${prevTechnique.slug}`}>
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Link>
              </Button>
            ) : (
              <div aria-hidden="true"></div>
            )}

            {nextTechnique ? (
              <Button variant="outline" className={cn("flex items-center gap-2", darkMode ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100")} asChild>
                <Link href={`/techniques/${nextTechnique.slug}`}>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <div aria-hidden="true"></div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
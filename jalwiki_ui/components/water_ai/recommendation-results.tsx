// E:/Project/miniProject/JalWiKi/jalwiki_ui/components/water_ai/recommendation-results.tsx
"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Printer, Share2, Edit, ShieldCheck, Zap, Leaf, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { GeminiRecommendation } from "@/lib/gemini-api"
import { useTheme } from "@/context/theme-context" // Import useTheme
import { cn } from "@/lib/utils" // Import cn

import jsPDF from "jspdf"

interface RecommendationResultsProps {
  results: GeminiRecommendation
  onStartNew: () => void
  onEdit: () => void
}

const getImpactBadgeStyle = (impact: "low" | "medium" | "high" | undefined) => {
  switch (impact) {
    case "high":
      return {
        className: `bg-red-100 text-red-700 border-red-200 hover:bg-red-200
                    dark:bg-red-900/60 dark:text-red-300 dark:border-red-700/70 dark:hover:bg-red-800/70`,
        icon: <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />,
        text: "High Impact",
      }
    case "medium":
      return {
        className: `bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200
                    dark:bg-yellow-900/60 dark:text-yellow-300 dark:border-yellow-700/70 dark:hover:bg-yellow-800/70`,
        icon: <Zap className="h-3.5 w-3.5 mr-1.5" />,
        text: "Medium Impact",
      }
    case "low":
      return {
        className: `bg-green-100 text-green-700 border-green-200 hover:bg-green-200
                    dark:bg-green-900/60 dark:text-green-300 dark:border-green-700/70 dark:hover:bg-green-800/70`,
        icon: <Leaf className="h-3.5 w-3.5 mr-1.5" />,
        text: "Low Impact",
      }
    default:
      return {
        className: `bg-gray-100 text-gray-700 border-gray-200
                    dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600`, // Adjusted for better contrast
        icon: null,
        text: "Impact N/A",
      }
  }
}

export function RecommendationResults({ results, onStartNew, onEdit }: RecommendationResultsProps) {
  const { darkMode } = useTheme(); // Use theme context
  const [activeTab, setActiveTab] = useState("description")
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)

  // No need for the separate isDarkMode state and useEffect if useTheme provides darkMode directly
  // and the component re-renders when the theme changes.

  const impactStyle = getImpactBadgeStyle(results.impact)

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true)
    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 40;
      const maxLineWidth = pageWidth - margin * 2;
      let currentY = margin;
      const lineHeight = 14;
      const headingLineHeight = 18;

      const checkAndAddPage = (spaceNeeded: number) => {
        if (currentY + spaceNeeded > pageHeight - margin) {
          doc.addPage();
          currentY = margin;
        }
      };

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      const titleLines = doc.splitTextToSize(results.title || "Water Saving Recommendation", maxLineWidth);
      checkAndAddPage(titleLines.length * (headingLineHeight * 1.2));
      doc.text(titleLines, margin, currentY);
      currentY += titleLines.length * (headingLineHeight * 1.2) + 10;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      if (results.summary) {
        doc.setFont("helvetica", "italic");
        const summaryLines = doc.splitTextToSize(results.summary, maxLineWidth);
        checkAndAddPage(summaryLines.length * lineHeight + 10);
        doc.text(summaryLines, margin, currentY);
        currentY += summaryLines.length * lineHeight + 15;
        doc.setFont("helvetica", "normal");
      }

      let metaInfo = [];
      if (results.impact) {
        metaInfo.push(`Impact: ${results.impact.charAt(0).toUpperCase() + results.impact.slice(1)}`);
      }
      if (results.categories && results.categories.length > 0) {
        metaInfo.push(`Categories: ${results.categories.map(c => c.name).join(', ')}`);
      }
      if (metaInfo.length > 0) {
        const metaLines = doc.splitTextToSize(metaInfo.join(' | '), maxLineWidth);
        checkAndAddPage(metaLines.length * lineHeight + 10);
        doc.text(metaLines, margin, currentY);
        currentY += metaLines.length * lineHeight + 15;
      }

      const addSection = (title: string, content: string | string[] | undefined, isList: 'ordered' | 'bulleted' | 'paragraph' = 'paragraph') => {
        if (!content || (Array.isArray(content) && content.length === 0)) return;
        checkAndAddPage(headingLineHeight + 10);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(title, margin, currentY);
        currentY += headingLineHeight + 5;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        if (isList === 'paragraph' && typeof content === 'string') {
          const lines = doc.splitTextToSize(content, maxLineWidth);
          checkAndAddPage(lines.length * lineHeight + 10);
          doc.text(lines, margin, currentY);
          currentY += lines.length * lineHeight + 10;
        } else if (Array.isArray(content)) {
          content.forEach((item, index) => {
            const itemPrefix = isList === 'ordered' ? `${index + 1}. ` : `- `;
            const itemLines = doc.splitTextToSize(itemPrefix + item, maxLineWidth - (isList !== 'paragraph' ? 15 : 0));
            checkAndAddPage(itemLines.length * lineHeight);
            doc.text(itemLines, margin + (isList !== 'paragraph' ? 15 : 0), currentY);
            currentY += itemLines.length * lineHeight;
          });
          currentY += 10;
        }
      };

      addSection("Overview", results.detailed_content, 'paragraph');
      addSection("Implementation Steps", results.steps, 'ordered');
      addSection("Required Materials", results.materials, 'bulleted');
      addSection("Benefits", results.benefits, 'bulleted');

      const fileName = results.title ? `${results.title.replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_').toLowerCase()}.pdf` : "water_recommendation.pdf";
      doc.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className={cn(
        "shadow-xl overflow-hidden w-full",
        darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      )}>
        <div className={cn(
          "p-6 border-b",
          darkMode ? "bg-gray-800/70 border-gray-700" : "bg-gray-50 border-gray-200" // Header section slightly lighter
        )}>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-2">
              <h2 className={cn("text-2xl font-bold", darkMode ? "text-purple-400" : "text-purple-700")}>{results.title}</h2>
              <p className={cn("text-sm", darkMode ? "text-gray-400" : "text-gray-600")}>{results.summary}</p>
              <div className="flex flex-wrap gap-2 pt-2 items-center">
                <Badge variant="outline" className={`text-xs px-2.5 py-1 ${impactStyle.className}`}>
                  {impactStyle.icon}
                  {impactStyle.text}
                </Badge>
                {results.categories && results.categories.length > 0 && (
                  results.categories.map((category, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        darkMode
                          ? "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                      )}
                    >
                      {category.name}
                    </Badge>
                  ))
                )}
              </div>
            </div>
            <div className="flex space-x-2 shrink-0 mt-4 md:mt-0">
              <Button variant="outline" size="sm" onClick={() => window.print()}
                      className={cn(darkMode ? "text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-gray-100" : "")}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadPdf} disabled={isDownloadingPdf}
                      className={cn(darkMode ? "text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-gray-100" : "")}>
                {isDownloadingPdf ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Save PDF
              </Button>
              <Button variant="outline" size="sm"
                      className={cn(darkMode ? "text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-gray-100" : "")}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={cn(
              "w-full grid grid-cols-2 md:grid-cols-5 h-auto rounded-none border-b",
              darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200" // Tab list background
            )}>
              {["Description", "Steps", "Materials", "Benefits", "Gallery"].map((tabName) => (
                <TabsTrigger
                  key={tabName.toLowerCase()}
                  value={tabName.toLowerCase()}
                  className={cn(
                    "py-3 data-[state=active]:shadow-none data-[state=active]:font-semibold", // common active styles
                    darkMode
                      ? "text-gray-400 data-[state=active]:bg-gray-900 data-[state=active]:text-purple-400" // dark mode specific
                      : "text-gray-600 data-[state=active]:bg-white data-[state=active]:text-purple-700" // light mode specific
                  )}
                >
                  {tabName === "Steps" ? "Implementation" : tabName}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Content area within card, ensuring its background matches active tab / card bg */}
            <div className={cn("p-6", darkMode ? "bg-gray-900" : "bg-white")}>
              <TabsContent value="description" className={cn("mt-0 prose prose-sm max-w-none", darkMode && "dark:prose-invert")}>
                <h3 className={cn("text-lg font-medium mb-3", darkMode ? "text-purple-400" : "text-purple-700")}>Overview</h3>
                <p className={cn("leading-relaxed", darkMode ? "text-gray-300" : "text-gray-700")}>{results.detailed_content}</p>
              </TabsContent>

              <TabsContent value="steps" className={cn("mt-0 prose prose-sm max-w-none", darkMode && "dark:prose-invert")}>
                <h3 className={cn("text-lg font-medium mb-3", darkMode ? "text-purple-400" : "text-purple-700")}>Implementation Steps</h3>
                {results.steps && results.steps.length > 0 ? (
                  <ol className={cn("list-decimal list-inside space-y-2 leading-relaxed", darkMode ? "text-gray-300" : "text-gray-700")}>
                    {results.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                ) : (
                  <p className={cn(darkMode ? "text-gray-500" : "text-gray-500")}>No implementation steps provided.</p>
                )}
              </TabsContent>

              <TabsContent value="materials" className={cn("mt-0 prose prose-sm max-w-none", darkMode && "dark:prose-invert")}>
                <h3 className={cn("text-lg font-medium mb-3", darkMode ? "text-purple-400" : "text-purple-700")}>Required Materials</h3>
                {results.materials && results.materials.length > 0 ? (
                  <ul className={cn("list-disc list-inside space-y-1 leading-relaxed", darkMode ? "text-gray-300" : "text-gray-700")}>
                    {results.materials.map((material, index) => (
                      <li key={index}>{material}</li>
                    ))}
                  </ul>
                ) : (
                  <p className={cn(darkMode ? "text-gray-500" : "text-gray-500")}>No materials listed.</p>
                )}
              </TabsContent>

              <TabsContent value="benefits" className={cn("mt-0 prose prose-sm max-w-none", darkMode && "dark:prose-invert")}>
                <h3 className={cn("text-lg font-medium mb-3", darkMode ? "text-purple-400" : "text-purple-700")}>Benefits</h3>
                {results.benefits && results.benefits.length > 0 ? (
                  <ul className={cn("list-disc list-inside space-y-1 leading-relaxed", darkMode ? "text-gray-300" : "text-gray-700")}>
                    {results.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                ) : (
                  <p className={cn(darkMode ? "text-gray-500" : "text-gray-500")}>No benefits listed.</p>
                )}
              </TabsContent>

              <TabsContent value="gallery" className="mt-0">
                <h3 className={cn("text-lg font-medium mb-3", darkMode ? "text-purple-400" : "text-purple-700")}>Visual References</h3>
                {results.images && results.images.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {results.images.map((img, index) => (
                      <div
                        key={img.id || index}
                        className={cn(
                          "border rounded-lg overflow-hidden shadow-sm aspect-video flex flex-col items-center justify-center",
                          darkMode ? "border-gray-700 bg-gray-800/40" : "bg-gray-50 border-gray-200" // Gallery item bg
                        )}
                      >
                        {img.image_url ? (
                          <img
                            src={img.image_url}
                            alt={img.caption || `Gallery image ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        ) : (
                          <p className={cn("text-sm p-4 text-center", darkMode ? "text-gray-400" : "text-gray-500")}>
                            {img.caption || "Image not available"}
                          </p>
                        )}
                        {img.image_url && img.caption && (
                           <p className={cn("text-xs text-center p-1.5 w-full truncate", darkMode ? "bg-black/70 text-gray-200" : "bg-black/60 text-white")} title={img.caption}>
                             {img.caption}
                           </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={cn(darkMode ? "text-gray-500" : "text-gray-500")}>No gallery images available.</p>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
        <Button variant="outline" onClick={onEdit}
                className={cn("flex items-center w-full sm:w-auto", darkMode ? "text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-gray-100" : "")}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Inputs
        </Button>
        <Button variant="default" onClick={onStartNew}
                className={cn("w-full sm:w-auto", darkMode ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-purple-700 hover:bg-purple-800 text-white")}>
          Start New Recommendation
        </Button>
      </div>
    </div>
  )
}
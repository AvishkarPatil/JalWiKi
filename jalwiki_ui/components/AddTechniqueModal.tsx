"use client";

import { useState, ChangeEvent, FormEvent, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {X, PlusCircle, Trash2, UploadCloud, Image as ImageIcon, ChevronDown, ChevronUp, Loader2} from "lucide-react";
import { useTheme } from "@/context/theme-context"; // Adjust path if needed
import { cn } from "@/lib/utils"; // Adjust path if needed

// Assuming types based on your data.ts - you might want to define these more globally
interface Category {
  id?: number; // Optional for new categories
  name: string;
  description?: string;
}

interface Region {
  id?: number; // Optional for new regions
  name: string;
}

interface GalleryImage {
  file?: File; // For new uploads
  previewUrl?: string; // For new uploads
  image?: string; // For existing images (if editing)
  caption: string;
  type: "diagram" | "photo" | "illustration" | "other";
  order?: number;
}

export interface TechniqueFormData {
  title: string;
  impact: "low" | "moderate" | "high" | "";
  categories: Category[]; // Store selected/new categories
  regions: Region[]; // Store selected/new regions
  summary: string;
  detailed_content: string;
  benefits: string[];
  materials: string[];
  steps: string[];
  main_image_file?: File | null;
  main_image_preview?: string | null;
  gallery_images: GalleryImage[];
  is_published: boolean;
}

interface AddTechniqueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: TechniqueFormData) => Promise<void>; // Make it async for potential API calls
  // Mock data for dropdowns - in a real app, this would come from an API
  existingCategories: Category[];
  existingRegions: Region[];
}

// Mock data (replace with API calls in a real app)
const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Agriculture", description: "Techniques and methods for agricultural water conservation." },
  { id: 2, name: "Irrigation", description: "Methods to efficiently deliver water to plants and crops." },
  { id: 3, name: "Household", description: "Water conservation techniques for residential use." },
];
const MOCK_REGIONS: Region[] = [
  { id: 5, name: "Maharashtra" },
  { id: 7, name: "Gujarat" },
  { id: 8, name: "Rajasthan" },
];


export function AddTechniqueModal({
  isOpen,
  onClose,
  onSubmit,
  existingCategories = MOCK_CATEGORIES, // Provide default mock data
  existingRegions = MOCK_REGIONS,     // Provide default mock data
}: AddTechniqueModalProps) {
  const { darkMode } = useTheme();
  const initialFormData: TechniqueFormData = {
    title: "",
    impact: "",
    categories: [],
    regions: [],
    summary: "",
    detailed_content: "",
    benefits: [""],
    materials: [""],
    steps: [""],
    main_image_file: null,
    main_image_preview: null,
    gallery_images: [],
    is_published: true,
  };
  const [formData, setFormData] = useState<TechniqueFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // State for managing multi-select dropdowns and "add new" functionality
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [newRegionName, setNewRegionName] = useState("");
  const [addingNewCategory, setAddingNewCategory] = useState(false);
  const [addingNewRegion, setAddingNewRegion] = useState(false);


  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDynamicListChange = (
    listName: "benefits" | "materials" | "steps",
    index: number,
    value: string
  ) => {
    setFormData((prev) => {
      const newList = [...prev[listName]];
      newList[index] = value;
      return { ...prev, [listName]: newList };
    });
  };

  const addDynamicListItem = (listName: "benefits" | "materials" | "steps") => {
    setFormData((prev) => ({
      ...prev,
      [listName]: [...prev[listName], ""],
    }));
  };

  const removeDynamicListItem = (
    listName: "benefits" | "materials" | "steps",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [listName]: prev[listName].filter((_, i) => i !== index),
    }));
  };

  const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        main_image_file: file,
        main_image_preview: URL.createObjectURL(file),
      }));
    }
  };

  const handleGalleryImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newGalleryImages: GalleryImage[] = filesArray.map(file => ({
        file,
        previewUrl: URL.createObjectURL(file),
        caption: "",
        type: "photo", // Default type
      }));
      setFormData(prev => ({
        ...prev,
        gallery_images: [...prev.gallery_images, ...newGalleryImages]
      }));
    }
  };

  const updateGalleryItem = (index: number, field: keyof GalleryImage, value: string | File) => {
    setFormData(prev => {
      const updatedGallery = [...prev.gallery_images];
      if (field === 'caption' || field === 'type') {
        updatedGallery[index] = { ...updatedGallery[index], [field]: value as string };
      }
      // Add more specific handling if needed for other fields
      return { ...prev, gallery_images: updatedGallery };
    });
  };

  const removeGalleryItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index)
    }));
  };

  // --- Category and Region Selection Logic ---
  const toggleCategory = (category: Category) => {
    setFormData(prev => {
      const isSelected = prev.categories.find(c => (c.id && c.id === category.id) || c.name === category.name);
      if (isSelected) {
        return { ...prev, categories: prev.categories.filter(c => (c.id ? c.id !== category.id : c.name !== category.name)) };
      } else {
        return { ...prev, categories: [...prev.categories, category] };
      }
    });
  };

  const handleAddNewCategory = () => {
    if (newCategoryName.trim() === "") return;
    const newCat: Category = { name: newCategoryName.trim(), description: newCategoryDesc.trim() };
    // In a real app, you'd likely save this to the backend and get an ID
    // For now, just add it to the form data and the mock list for the dropdown
    setFormData(prev => ({ ...prev, categories: [...prev.categories, newCat] }));
    // This part is tricky without a real backend. For UI demo:
    // existingCategories.push(newCat); // This would mutate prop, not ideal.
    // Better to have a local copy of categories if adding new ones dynamically updates the dropdown.
    setNewCategoryName("");
    setNewCategoryDesc("");
    setAddingNewCategory(false);
    // setShowCategoryDropdown(false); // Optionally close dropdown
  };

  const toggleRegion = (region: Region) => {
    setFormData(prev => {
      const isSelected = prev.regions.find(r => (r.id && r.id === region.id) || r.name === region.name);
      if (isSelected) {
        return { ...prev, regions: prev.regions.filter(r => (r.id ? r.id !== region.id : r.name !== region.name)) };
      } else {
        return { ...prev, regions: [...prev.regions, region] };
      }
    });
  };

   const handleAddNewRegion = () => {
    if (newRegionName.trim() === "") return;
    const newReg: Region = { name: newRegionName.trim() };
    setFormData(prev => ({ ...prev, regions: [...prev.regions, newReg] }));
    setNewRegionName("");
    setAddingNewRegion(false);
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    try {
      // Basic validation example
      if (!formData.title || !formData.summary || !formData.impact) {
        setFormError("Please fill in all required fields (Title, Summary, Impact).");
        setIsSubmitting(false);
        return;
      }
      await onSubmit(formData);
      setFormData(initialFormData); // Reset form on successful submit
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
      setFormError("Failed to add technique. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
  };

  const inputClass = cn(
    "w-full p-2.5 rounded-md border text-sm focus:ring-1 outline-none transition-colors",
    darkMode
      ? "bg-gray-700 border-gray-600 focus:border-purple-500 focus:ring-purple-500 placeholder-gray-400"
      : "bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-purple-500 placeholder-gray-400"
  );
  const labelClass = "block text-sm font-medium mb-1";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "relative w-full max-w-3xl rounded-xl shadow-2xl",
              darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={cn("flex items-center justify-between p-6 border-b", darkMode ? "border-gray-700" : "border-gray-200")}>
              <h2 className="text-xl font-semibold">Add New Water Saving Technique</h2>
              <button
                onClick={onClose}
                className={cn("p-1 rounded-full transition-colors", darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200")}
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(100vh-160px)]">
              <div className="p-6 space-y-6">
                {formError && <p className="text-sm text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-md">{formError}</p>}

                {/* Section 1: Basic Info */}
                <section>
                  <h3 className={cn("text-lg font-semibold mb-3 border-b pb-2", darkMode ? "border-gray-700" : "border-gray-200")}>Basic Information</h3>
                  <div>
                    <label htmlFor="title" className={labelClass}>Title <span className="text-red-500">*</span></label>
                    <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} className={inputClass} required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label htmlFor="impact" className={labelClass}>Impact <span className="text-red-500">*</span></label>
                      <select name="impact" id="impact" value={formData.impact} onChange={handleInputChange} className={inputClass} required>
                        <option value="" disabled>Select impact level</option>
                        <option value="low">Low</option>
                        <option value="moderate">Moderate</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    {/* Categories Dropdown */}
                    <div className="relative">
                        <label className={labelClass}>Categories</label>
                        <button type="button" onClick={() => {setShowCategoryDropdown(!showCategoryDropdown); setShowRegionDropdown(false);}}
                            className={cn(inputClass, "flex justify-between items-center text-left")}>
                            <span>{formData.categories.length > 0 ? formData.categories.map(c=>c.name).join(', ') : "Select categories"}</span>
                            {showCategoryDropdown ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                        </button>
                        {showCategoryDropdown && (
                            <div className={cn("absolute z-10 w-full mt-1 rounded-md shadow-lg max-h-60 overflow-auto border", darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300")}>
                                {existingCategories.map(cat => (
                                    <div key={cat.id || cat.name} onClick={() => toggleCategory(cat)}
                                        className={cn("px-3 py-2 cursor-pointer text-sm", darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100", formData.categories.find(c=>(c.id && c.id === cat.id) || c.name === cat.name) && (darkMode ? "bg-purple-600/30" : "bg-purple-100"))}>
                                        {cat.name}
                                    </div>
                                ))}
                                <div className={cn("p-2 border-t", darkMode ? "border-gray-600" : "border-gray-200")}>
                                    {addingNewCategory ? (
                                        <div className="space-y-2">
                                            <input type="text" placeholder="New category name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className={cn(inputClass, "text-xs p-1.5")} />
                                            <textarea placeholder="Description (optional)" value={newCategoryDesc} onChange={(e) => setNewCategoryDesc(e.target.value)} className={cn(inputClass, "text-xs p-1.5 h-16 resize-none")} />
                                            <div className="flex gap-2">
                                                <button type="button" onClick={handleAddNewCategory} className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded">Add</button>
                                                <button type="button" onClick={() => setAddingNewCategory(false)} className="text-xs bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded">Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button type="button" onClick={() => setAddingNewCategory(true)} className="w-full text-xs flex items-center justify-center text-purple-500 hover:text-purple-400">
                                            <PlusCircle size={14} className="mr-1"/> Add New Category
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Regions Dropdown - Similar structure to Categories */}
                    <div className="relative">
                        <label className={labelClass}>Regions</label>
                        <button type="button" onClick={() => {setShowRegionDropdown(!showRegionDropdown); setShowCategoryDropdown(false);}}
                            className={cn(inputClass, "flex justify-between items-center text-left")}>
                            <span>{formData.regions.length > 0 ? formData.regions.map(r=>r.name).join(', ') : "Select regions"}</span>
                            {showRegionDropdown ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                        </button>
                        {showRegionDropdown && (
                             <div className={cn("absolute z-10 w-full mt-1 rounded-md shadow-lg max-h-60 overflow-auto border", darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300")}>
                                {existingRegions.map(reg => (
                                    <div key={reg.id || reg.name} onClick={() => toggleRegion(reg)}
                                        className={cn("px-3 py-2 cursor-pointer text-sm", darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100", formData.regions.find(r=>(r.id && r.id === reg.id) || r.name === reg.name) && (darkMode ? "bg-purple-600/30" : "bg-purple-100"))}>
                                        {reg.name}
                                    </div>
                                ))}
                                <div className={cn("p-2 border-t", darkMode ? "border-gray-600" : "border-gray-200")}>
                                     {addingNewRegion ? (
                                        <div className="flex gap-2 items-center">
                                            <input type="text" placeholder="New region name" value={newRegionName} onChange={(e) => setNewRegionName(e.target.value)} className={cn(inputClass, "text-xs p-1.5 flex-grow")} />
                                            <button type="button" onClick={handleAddNewRegion} className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded">Add</button>
                                            <button type="button" onClick={() => setAddingNewRegion(false)} className="text-xs bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded">X</button>
                                        </div>
                                    ) : (
                                        <button type="button" onClick={() => setAddingNewRegion(true)} className="w-full text-xs flex items-center justify-center text-purple-500 hover:text-purple-400">
                                            <PlusCircle size={14} className="mr-1"/> Add New Region
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                  </div>
                </section>

                {/* Section 2: Details */}
                <section>
                  <h3 className={cn("text-lg font-semibold mb-3 border-b pb-2", darkMode ? "border-gray-700" : "border-gray-200")}>Technique Details</h3>
                  <div>
                    <label htmlFor="summary" className={labelClass}>Summary <span className="text-red-500">*</span></label>
                    <textarea name="summary" id="summary" value={formData.summary} onChange={handleInputChange} rows={3} className={cn(inputClass, "resize-none")} required />
                  </div>
                  <div className="mt-4">
                    <label htmlFor="detailed_content" className={labelClass}>Detailed Content</label>
                    <textarea name="detailed_content" id="detailed_content" value={formData.detailed_content} onChange={handleInputChange} rows={6} className={cn(inputClass, "resize-none")} />
                  </div>
                </section>

                {/* Section 3: Dynamic Lists (Benefits, Materials, Steps) */}
                {(["benefits", "materials", "steps"] as const).map((listName) => (
                  <section key={listName}>
                    <h3 className={cn("text-lg font-semibold mb-3 border-b pb-2 capitalize", darkMode ? "border-gray-700" : "border-gray-200")}>{listName.replace("_", " ")}</h3>
                    {formData[listName].map((item, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleDynamicListChange(listName, index, e.target.value)}
                          className={cn(inputClass, "flex-grow")}
                          placeholder={`${listName.slice(0, -1)} #${index + 1}`}
                        />
                        {formData[listName].length > 1 && (
                          <button type="button" onClick={() => removeDynamicListItem(listName, index)} className={cn("p-1.5 rounded text-red-500 hover:bg-red-500/10", darkMode ? "hover:text-red-400" : "")}>
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addDynamicListItem(listName)}
                      className={cn("mt-1 text-sm flex items-center text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300")}
                    >
                      <PlusCircle size={16} className="mr-1" /> Add {listName.slice(0, -1)}
                    </button>
                  </section>
                ))}

                {/* Section 4: Media */}
                <section>
                  <h3 className={cn("text-lg font-semibold mb-3 border-b pb-2", darkMode ? "border-gray-700" : "border-gray-200")}>Media</h3>
                  {/* Main Image Upload */}
                  <div>
                    <label htmlFor="main_image_file" className={labelClass}>Main Image</label>
                    <div className={cn("mt-1 flex justify-center px-6 pt-5 pb-6 border-2 rounded-md transition-colors",
                        darkMode ? "border-gray-600 border-dashed hover:border-purple-500" : "border-gray-300 border-dashed hover:border-purple-400"
                    )}>
                      <div className="space-y-1 text-center">
                        {formData.main_image_preview ? (
                          <div className="relative w-48 h-32 mx-auto">
                            <img src={formData.main_image_preview} alt="Main preview" className="object-contain w-full h-full rounded-md" />
                            <button type="button" onClick={() => setFormData(prev => ({...prev, main_image_file: null, main_image_preview: null}))}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600">
                                <X size={14}/>
                            </button>
                          </div>
                        ) : (
                          <UploadCloud className={cn("mx-auto h-12 w-12", darkMode ? "text-gray-500" : "text-gray-400")} />
                        )}
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label
                            htmlFor="main_image_file_input"
                            className="relative cursor-pointer rounded-md font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                          >
                            <span>Upload a file</span>
                            <input id="main_image_file_input" name="main_image_file" type="file" className="sr-only" accept="image/*" onChange={handleMainImageChange} />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Gallery Images Upload */}
                  <div className="mt-6">
                    <label className={labelClass}>Gallery Images</label>
                    <div className={cn("mt-1 flex justify-center px-6 pt-5 pb-6 border-2 rounded-md transition-colors",
                        darkMode ? "border-gray-600 border-dashed hover:border-purple-500" : "border-gray-300 border-dashed hover:border-purple-400"
                    )}>
                       <div className="space-y-1 text-center w-full">
                         <ImageIcon className={cn("mx-auto h-12 w-12", darkMode ? "text-gray-500" : "text-gray-400")} />
                         <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                            <label
                                htmlFor="gallery_images_input"
                                className="relative cursor-pointer rounded-md font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                            >
                                <span>Upload gallery images</span>
                                <input id="gallery_images_input" name="gallery_images" type="file" multiple className="sr-only" accept="image/*" onChange={handleGalleryImageChange} />
                            </label>
                         </div>
                         <p className="text-xs text-gray-500 dark:text-gray-500">Select multiple images</p>
                       </div>
                    </div>
                    {formData.gallery_images.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {formData.gallery_images.map((item, index) => (
                                <div key={index} className={cn("p-2 border rounded-md relative", darkMode ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200")}>
                                    {item.previewUrl && <img src={item.previewUrl} alt={`Gallery item ${index + 1}`} className="w-full h-24 object-cover rounded-md mb-2"/>}
                                    <input type="text" placeholder="Caption" value={item.caption} onChange={(e) => updateGalleryItem(index, 'caption', e.target.value)} className={cn(inputClass, "text-xs p-1 mb-1")} />
                                    <select value={item.type} onChange={(e) => updateGalleryItem(index, 'type', e.target.value)} className={cn(inputClass, "text-xs p-1")}>
                                        <option value="photo">Photo</option>
                                        <option value="diagram">Diagram</option>
                                        <option value="illustration">Illustration</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <button type="button" onClick={() => removeGalleryItem(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600">
                                        <X size={14}/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                  </div>
                </section>

                {/* Publish Toggle */}
                 <div className="flex items-center justify-between pt-4">
                    <span className={labelClass}>Publish this technique?</span>
                    <label htmlFor="is_published" className="flex items-center cursor-pointer">
                        <div className="relative">
                        <input type="checkbox" id="is_published" className="sr-only" checked={formData.is_published} onChange={(e) => setFormData(prev => ({...prev, is_published: e.target.checked}))} />
                        <div className={cn("block w-10 h-6 rounded-full", formData.is_published ? (darkMode ? "bg-purple-500" : "bg-purple-600") : (darkMode ? "bg-gray-600" : "bg-gray-300"))}></div>
                        <div className={cn("dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform", formData.is_published && "translate-x-full")}></div>
                        </div>
                    </label>
                </div>

              </div>

              {/* Sticky Footer for Actions */}
              <div className={cn("flex items-center justify-end p-6 border-t sticky bottom-0 z-10", darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white")}>
                <button
                  type="button"
                  onClick={onClose}
                  className={cn("px-4 py-2 rounded-md text-sm font-medium mr-3 transition-colors",
                    darkMode ? "bg-gray-600 hover:bg-gray-500 text-gray-200" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  )}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={cn("px-6 py-2 rounded-md text-sm font-medium text-white flex items-center transition-colors",
                    darkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-600 hover:bg-purple-700",
                    isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:shadow-md hover:shadow-purple-500/30"
                  )}
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Saving..." : "Add Technique"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Helper Loader2 component if not imported from lucide-react or similar
// const Loader2 = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
// );
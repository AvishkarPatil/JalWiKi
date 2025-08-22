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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg p-6 bg-card text-foreground"
            style={{ boxShadow: 'var(--shadow-xl)' }}
            onClick={(e) => e.stopPropagation()}
          >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Add New Water Conservation Technique</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-accent/50 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground/80 mb-1">
                Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none focus:border-transparent transition-colors"
                placeholder="Enter technique title"
              />
            </div>

            {/* Impact */}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                Impact Level <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {['low', 'moderate', 'high'].map((level) => (
                  <label
                    key={level}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.impact === level
                        ? 'border-primary bg-primary/10 text-primary-foreground'
                        : 'border-input hover:border-primary/50 bg-card hover:bg-accent/10'
                    }`}
                  >
                    <input
                      type="radio"
                      name="impact"
                      value={level}
                      checked={formData.impact === level}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary focus:ring-primary focus:ring-offset-2"
                      required
                    />
                    <span className="ml-3 capitalize">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-foreground/80 mb-1">
                Summary <span className="text-destructive">*</span>
              </label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none focus:border-transparent transition-colors"
                placeholder="Enter summary"
              />
            </div>

            {/* Detailed Content */}
            <div>
              <label htmlFor="detailed_content" className="block text-sm font-medium text-foreground/80 mb-1">
                Detailed Content
              </label>
              <textarea
                id="detailed_content"
                name="detailed_content"
                value={formData.detailed_content}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none focus:border-transparent transition-colors"
                placeholder="Enter detailed content"
              />
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                Categories
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {existingCategories.map((category) => (
                  <label
                    key={category.id || category.name}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.categories.some((c) => (c.id && c.id === category.id) || c.name === category.name)
                        ? 'border-primary bg-primary/10 text-primary-foreground'
                        : 'border-input hover:border-primary/50 bg-card hover:bg-accent/10'
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="categories"
                      value={category.name}
                      checked={formData.categories.some((c) => (c.id && c.id === category.id) || c.name === category.name)}
                      onChange={(e) => toggleCategory(category)}
                      className="h-4 w-4 text-primary focus:ring-primary focus:ring-offset-2"
                    />
                    <span className="ml-3">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Regions */}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                Regions
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {existingRegions.map((region) => (
                  <label
                    key={region.id || region.name}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.regions.some((r) => (r.id && r.id === region.id) || r.name === region.name)
                        ? 'border-primary bg-primary/10 text-primary-foreground'
                        : 'border-input hover:border-primary/50 bg-card hover:bg-accent/10'
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="regions"
                      value={region.name}
                      checked={formData.regions.some((r) => (r.id && r.id === region.id) || r.name === region.name)}
                      onChange={(e) => toggleRegion(region)}
                      className="h-4 w-4 text-primary focus:ring-primary focus:ring-offset-2"
                    />
                    <span className="ml-3">{region.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                Benefits
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => handleDynamicListChange('benefits', index, e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none focus:border-transparent transition-colors"
                      placeholder={`Benefit #${index + 1}`}
                    />
                    {formData.benefits.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDynamicListItem('benefits', index)}
                        className="ml-2 p-1.5 rounded-full hover:bg-accent/50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-foreground" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addDynamicListItem('benefits')}
                  className="mt-2 text-sm flex items-center text-accent-foreground hover:text-accent-foreground/80 transition-colors"
                >
                  <PlusCircle className="mr-1 w-4 h-4" /> Add Benefit
                </button>
              </div>
            </div>

            {/* Materials */}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                Materials
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {formData.materials.map((material, index) => (
                  <div key={index} className="flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors">
                    <input
                      type="text"
                      value={material}
                      onChange={(e) => handleDynamicListChange('materials', index, e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none focus:border-transparent transition-colors"
                      placeholder={`Material #${index + 1}`}
                    />
                    {formData.materials.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDynamicListItem('materials', index)}
                        className="ml-2 p-1.5 rounded-full hover:bg-accent/50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-foreground" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addDynamicListItem('materials')}
                  className="mt-2 text-sm flex items-center text-accent-foreground hover:text-accent-foreground/80 transition-colors"
                >
                  <PlusCircle className="mr-1 w-4 h-4" /> Add Material
                </button>
              </div>
            </div>

            {/* Steps */}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                Steps
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {formData.steps.map((step, index) => (
                  <div key={index} className="flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors">
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => handleDynamicListChange('steps', index, e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none focus:border-transparent transition-colors"
                      placeholder={`Step #${index + 1}`}
                    />
                    {formData.steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDynamicListItem('steps', index)}
                        className="ml-2 p-1.5 rounded-full hover:bg-accent/50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-foreground" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addDynamicListItem('steps')}
                  className="mt-2 text-sm flex items-center text-accent-foreground hover:text-accent-foreground/80 transition-colors"
                >
                  <PlusCircle className="mr-1 w-4 h-4" /> Add Step
                </button>
              </div>
            </div>

            {/* Main Image */}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                Main Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 rounded-md transition-colors border-input">
                <div className="space-y-1 text-center w-full">
                  {formData.main_image_preview ? (
                    <div className="relative w-48 h-32 mx-auto">
                      <img src={formData.main_image_preview} alt="Main preview" className="object-contain w-full h-full rounded-md" />
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, main_image_file: null, main_image_preview: null }))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <UploadCloud className="mx-auto h-12 w-12 text-foreground/80" />
                  )}
                  <div className="flex text-sm text-foreground/80 justify-center">
                    <label
                      htmlFor="main_image_file_input"
                      className="relative cursor-pointer rounded-md font-medium text-accent-foreground hover:text-accent-foreground/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                    >
                      <span>Upload a file</span>
                      <input
                        id="main_image_file_input"
                        name="main_image_file"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleMainImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-foreground/80">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            {/* Gallery Images */}
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                Gallery Images
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 rounded-md transition-colors border-input">
                <div className="space-y-1 text-center w-full">
                  <ImageIcon className="mx-auto h-12 w-12 text-foreground/80" />
                  <div className="flex text-sm text-foreground/80 justify-center">
                    <label
                      htmlFor="gallery_images_input"
                      className="relative cursor-pointer rounded-md font-medium text-accent-foreground hover:text-accent-foreground/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                    >
                      <span>Upload gallery images</span>
                      <input
                        id="gallery_images_input"
                        name="gallery_images"
                        type="file"
                        multiple
                        className="sr-only"
                        accept="image/*"
                        onChange={handleGalleryImageChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-foreground/80">Select multiple images</p>
                </div>
              </div>
              {formData.gallery_images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {formData.gallery_images.map((item, index) => (
                    <div key={index} className="p-2 border rounded-md relative bg-card">
                      {item.previewUrl && (
                        <img src={item.previewUrl} alt={`Gallery item ${index + 1}`} className="w-full h-24 object-cover rounded-md mb-2" />
                      )}
                      <input
                        type="text"
                        placeholder="Caption"
                        value={item.caption}
                        onChange={(e) => updateGalleryItem(index, 'caption', e.target.value)}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none focus:border-transparent transition-colors"
                      />
                      <select
                        value={item.type}
                        onChange={(e) => updateGalleryItem(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none focus:border-transparent transition-colors"
                      >
                        <option value="photo">Photo</option>
                        <option value="diagram">Diagram</option>
                        <option value="illustration">Illustration</option>
                        <option value="other">Other</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeGalleryItem(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Publish */}
            <div className="flex items-center justify-between pt-4">
              <span className="block text-sm font-medium text-foreground/80">
                Publish this technique?
              </span>
              <label htmlFor="is_published" className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="is_published"
                    className="sr-only"
                    checked={formData.is_published}
                    onChange={(e) => setFormData((prev) => ({ ...prev, is_published: e.target.checked }))}
                  />
                  <div
                    className={`block w-10 h-6 rounded-full ${
                      formData.is_published ? 'bg-primary' : 'bg-input'
                    }`}
                  ></div>
                  <div
                    className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      formData.is_published && 'translate-x-full'
                    }`}
                  ></div>
                </div>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Saving...
                  </span>
                ) : (
                  'Save Technique'
                )}
              </button>
            </div>
          </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AddTechniqueModal;
"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X as XIcon, ChevronsUpDown } from "lucide-react";

import { RichTextEditor } from "@/components/forum_comp/rich-text-editor";
import { createForumThread, fetchForumTags, createForumTag } from "@/lib/forumService";
import type { NewThreadData, ApiThread, ApiForumTag, ThreadType } from "@/types/forum";
import { useTheme } from "@/context/theme-context"; // Import useTheme
import { cn } from "@/lib/utils"; // Import cn

interface NewThreadFormProps {
  onSubmitSuccess: (newlyCreatedThread: ApiThread) => void;
  onCancel: () => void;
}

const threadTypeOptions: { value: ThreadType; label: string }[] = [
  { value: "discussion", label: "Discussion" },
  { value: "resource", label: "Resource" },
  { value: "announcement", label: "Announcement" },
];

export function NewThreadForm({ onSubmitSuccess, onCancel }: NewThreadFormProps) {
  const { darkMode } = useTheme(); // Get darkMode state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedType, setSelectedType] = useState<ThreadType>("discussion");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [tagInputValue, setTagInputValue] = useState("");
  const [availableTags, setAvailableTags] = useState<ApiForumTag[]>([]);
  const [selectedTags, setSelectedTags] = useState<ApiForumTag[]>([]);
  const [isTagPopoverOpen, setIsTagPopoverOpen] = useState(false);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  useEffect(() => {
    async function loadTags() {
      setIsLoadingTags(true);
      try {
        const tags = await fetchForumTags();
        setAvailableTags(tags);
      } catch (err) {
        console.error("Failed to load tags", err);
      } finally {
        setIsLoadingTags(false);
      }
    }
    loadTags();
  }, []);

  const handleTagSelect = (tag: ApiForumTag) => {
    if (!selectedTags.find(st => st.id === tag.id)) {
      setSelectedTags(prev => [...prev, tag]);
    }
    setTagInputValue("");
    setIsTagPopoverOpen(false);
  };

  const handleCreateAndSelectTag = async (tagName: string) => {
    if (!tagName.trim()) return;
    const existingSelected = selectedTags.find(st => st.name.toLowerCase() === tagName.trim().toLowerCase());
    if (existingSelected) {
        setTagInputValue("");
        setIsTagPopoverOpen(false);
        return;
    }
    const existingAvailable = availableTags.find(at => at.name.toLowerCase() === tagName.trim().toLowerCase());
    if (existingAvailable) {
        handleTagSelect(existingAvailable);
        return;
    }
    try {
      const newTag = await createForumTag(tagName.trim());
      setAvailableTags(prev => [...prev, newTag]);
      handleTagSelect(newTag);
    } catch (err: any) {
      console.error("Failed to create tag:", err);
      setError(err.message || "Could not create tag.");
    }
  };

  const handleRemoveTag = (tagIdToRemove: number) => {
    setSelectedTags(prev => prev.filter(tag => tag.id !== tagIdToRemove));
  };

  const filteredSuggestions = availableTags.filter(tag =>
    tag.name.toLowerCase().includes(tagInputValue.toLowerCase()) &&
    !selectedTags.find(st => st.id === tag.id)
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const plainTextContent = content.replace(/<[^>]*>/g, '').trim();
    if (!title.trim() || !plainTextContent) {
      setError("Title and content cannot be empty.");
      return;
    }
    if (!selectedType) {
        setError("Please select a thread type.");
        return;
    }
    setError(null);
    setIsSubmitting(true);

    const newThreadData: NewThreadData = {
      title,
      content,
      type: selectedType,
      tag_ids: selectedTags.map(tag => tag.id),
    };

    try {
      const createdThread = await createForumThread(newThreadData);
      onSubmitSuccess(createdThread);
    } catch (err: any) {
      setError(err.detail || err.message || "Failed to create thread. Please try again.");
      console.error("Create thread error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn(
      "p-4 md:p-6 rounded-lg shadow-md",
      darkMode ? "bg-gray-800 border border-gray-700" : "bg-white" // Main container
    )}>
      <h2 className={cn(
        "text-xl font-semibold mb-6",
        darkMode ? "text-purple-400" : "text-purple-700" // Heading
      )}>Create New Thread</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="thread-title" className={cn("text-sm font-medium", darkMode ? "text-gray-300" : "text-gray-700")}>Title</Label>
          <Input
            id="thread-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a clear and concise title"
            required
            className={cn(
              "mt-1",
              darkMode ? "bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400 focus:border-purple-500" : "border-gray-300 focus:border-purple-500"
            )}
          />
        </div>

        <div>
          <Label htmlFor="thread-type" className={cn("text-sm font-medium", darkMode ? "text-gray-300" : "text-gray-700")}>Type</Label>
          <Select
            value={selectedType}
            onValueChange={(value: ThreadType) => setSelectedType(value)}
          >
            <SelectTrigger
              id="thread-type"
              className={cn(
                "w-full mt-1",
                darkMode ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-purple-500" : "border-gray-300 focus:ring-purple-500"
              )}
            >
              <SelectValue placeholder="Select thread type" />
            </SelectTrigger>
            <SelectContent className={cn(darkMode ? "bg-gray-800 text-gray-200 border-gray-700" : "")}>
              {threadTypeOptions.map(option => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={cn(darkMode ? "focus:bg-gray-700" : "")}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="thread-content" className={cn("text-sm font-medium", darkMode ? "text-gray-300" : "text-gray-700")}>Content</Label>
          <div className={cn(
            "mt-1 rounded-md overflow-hidden", // Container for RichTextEditor
            darkMode ? "border border-gray-600" : "border border-gray-300"
          )}>
            {/* RichTextEditor needs its own internal dark theme handling */}
            {/* Pass darkMode prop if RichTextEditor supports it */}
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Share your thoughts, questions, or resources..."
              minHeight="200px"
              // darkMode={darkMode} // Example: if RichTextEditor accepts a darkMode prop
            />
          </div>
        </div>

        <div>
          <Label htmlFor="thread-tags" className={cn("text-sm font-medium", darkMode ? "text-gray-300" : "text-gray-700")}>Tags</Label>
          <div className="mt-1">
            <Popover open={isTagPopoverOpen} onOpenChange={setIsTagPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isTagPopoverOpen}
                  className={cn(
                    "w-full justify-between",
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-gray-100"
                      : "text-gray-500 hover:text-gray-700 border-gray-300"
                  )}
                >
                  {selectedTags.length > 0 ? `${selectedTags.length} tag(s) selected` : "Select or create tags..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className={cn(
                  "w-[--radix-popover-trigger-width] p-0",
                  darkMode ? "bg-gray-800 border-gray-700 text-gray-200" : ""
                )}
                align="start"
              >
                <Command
                  shouldFilter={false}
                  className={cn(darkMode ? "[&_[cmdk-input]]:bg-gray-700 [&_[cmdk-input]]:border-gray-600 [&_[cmdk-input]]:text-gray-100 [&_[cmdk-list]]:max-h-[200px]" : "[&_[cmdk-list]]:max-h-[200px]")}
                >
                  <CommandInput
                    placeholder="Search or create tag..."
                    value={tagInputValue}
                    onValueChange={setTagInputValue}
                    // className applied via Command's className prop for specificity
                  />
                  <CommandList>
                    {isLoadingTags && <CommandEmpty className={cn(darkMode ? "text-gray-400" : "")}>Loading tags...</CommandEmpty>}
                    {!isLoadingTags && filteredSuggestions.length === 0 && tagInputValue.trim() === "" && (
                        <CommandEmpty className={cn(darkMode ? "text-gray-400" : "")}>Type to search or create a tag.</CommandEmpty>
                    )}
                    {!isLoadingTags && filteredSuggestions.length === 0 && tagInputValue.trim() !== "" && (
                        <CommandItem
                            key="create-new"
                            value={`__create__${tagInputValue.trim()}`}
                            onSelect={() => handleCreateAndSelectTag(tagInputValue.trim())}
                            className={cn("cursor-pointer", darkMode ? "hover:bg-gray-700 aria-selected:bg-gray-600" : "")}
                        >
                        Create "{tagInputValue.trim()}"
                        </CommandItem>
                    )}
                    <CommandGroup heading={cn(darkMode && filteredSuggestions.length > 0 ? "text-gray-400" : "")}>
                      {filteredSuggestions.map((tag) => (
                        <CommandItem
                          key={tag.id}
                          value={tag.name}
                          onSelect={() => handleTagSelect(tag)}
                          className={cn("cursor-pointer", darkMode ? "hover:bg-gray-700 aria-selected:bg-gray-600" : "")}
                        >
                          {tag.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    {!isLoadingTags && tagInputValue.trim() !== "" && !filteredSuggestions.some(s => s.name.toLowerCase() === tagInputValue.trim().toLowerCase()) && (
                         <CommandItem
                            key="create-new-explicit"
                            value={`__create__${tagInputValue.trim()}`}
                            onSelect={() => handleCreateAndSelectTag(tagInputValue.trim())}
                            className={cn("cursor-pointer", darkMode ? "hover:bg-gray-700 aria-selected:bg-gray-600" : "")}
                        >
                        Create "{tagInputValue.trim()}"
                        </CommandItem>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          {selectedTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedTags.map(tag => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className={cn(
                    "flex items-center",
                    darkMode ? "bg-gray-600 text-gray-100 border-gray-500" : ""
                  )}
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag.id)}
                    className={cn(
                      "ml-1.5",
                      darkMode ? "text-purple-400 hover:text-purple-300" : "text-purple-500 hover:text-purple-700"
                    )}
                    aria-label={`Remove ${tag.name} tag`}
                  >
                    <XIcon className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {error && <p className={cn("text-sm", darkMode ? "text-red-400" : "text-red-600")}>{error}</p>}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className={cn(darkMode ? "text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-gray-100" : "")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "text-white",
              darkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-600 hover:bg-purple-700"
            )}
          >
            {isSubmitting ? "Submitting..." : "Create Thread"}
          </Button>
        </div>
      </form>
    </div>
  );
}
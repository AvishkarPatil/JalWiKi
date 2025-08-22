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
    <div className="p-4 md:p-6 rounded-lg shadow-md bg-card border border-border">
      <h2 className="text-xl font-semibold mb-6 text-foreground">Create New Thread</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="thread-title" className="text-sm font-medium text-foreground">Title</Label>
          <Input
            id="thread-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a clear and concise title"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="thread-type" className="text-sm font-medium text-foreground">Type</Label>
          <Select
            value={selectedType}
            onValueChange={(value: ThreadType) => setSelectedType(value)}
          >
            <SelectTrigger id="thread-type" className="w-full mt-1">
              <SelectValue placeholder="Select thread type" />
            </SelectTrigger>
            <SelectContent>
              {threadTypeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="thread-content" className="text-sm font-medium text-foreground">Content</Label>
          <div className="mt-1 rounded-md overflow-hidden border border-border">
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Share your thoughts, questions, or resources..."
              minHeight="200px"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="thread-tags" className="text-sm font-medium text-foreground">Tags</Label>
          <div className="mt-1">
            <Popover open={isTagPopoverOpen} onOpenChange={setIsTagPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isTagPopoverOpen}
                  className="w-full justify-between"
                >
                  {selectedTags.length > 0 ? `${selectedTags.length} tag(s) selected` : "Select or create tags..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[--radix-popover-trigger-width] p-0"
                align="start"
              >
                <Command shouldFilter={false} className="[&_[cmdk-list]]:max-h-[200px]">
                  <CommandInput
                    placeholder="Search or create tag..."
                    value={tagInputValue}
                    onValueChange={setTagInputValue}
                    // className applied via Command's className prop for specificity
                  />
                  <CommandList>
                    {isLoadingTags && <CommandEmpty>Loading tags...</CommandEmpty>}
                    {!isLoadingTags && filteredSuggestions.length === 0 && tagInputValue.trim() === "" && (
                        <CommandEmpty>Type to search or create a tag.</CommandEmpty>
                    )}
                    {!isLoadingTags && filteredSuggestions.length === 0 && tagInputValue.trim() !== "" && (
                        <CommandItem
                            key="create-new"
                            value={`__create__${tagInputValue.trim()}`}
                            onSelect={() => handleCreateAndSelectTag(tagInputValue.trim())}
                            className="cursor-pointer"
                        >
                        Create "{tagInputValue.trim()}"
                        </CommandItem>
                    )}
                    <CommandGroup heading={filteredSuggestions.length > 0 ? "Available Tags" : undefined}>
                      {filteredSuggestions.map((tag) => (
                        <CommandItem
                          key={tag.id}
                          value={tag.name}
                          onSelect={() => handleTagSelect(tag)}
                          className="cursor-pointer"
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
                            className="cursor-pointer"
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
                  className="flex items-center"
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag.id)}
                    className="ml-1.5 text-muted-foreground hover:text-foreground"
                    aria-label={`Remove ${tag.name}`}
                  >
                    <XIcon className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end space-x-3 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? 'Creating...' : 'Create Thread'}
          </Button>
        </div>
      </form>
    </div>
  );
}
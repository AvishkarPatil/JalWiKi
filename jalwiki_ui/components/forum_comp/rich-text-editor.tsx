"use client"

import type React from "react"
import { useRef, useEffect } from "react" // Added useEffect
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  ImageIcon,
  Link as LinkIcon, // Renamed to avoid conflict with Next.js Link
  Smile,
  Paperclip,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/context/theme-context" // Import useTheme
import { cn } from "@/lib/utils" // Import cn

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
  // darkMode?: boolean; // Optional: if you prefer to pass darkMode as a prop
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write something...", // Placeholder is not visually implemented in current structure
  minHeight = "100px",
}: RichTextEditorProps) {
  const { darkMode } = useTheme(); // Get darkMode state
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Set initial content and update if 'value' prop changes externally
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value]) // Rerun only if the 'value' prop from parent changes

  const execCommand = (command: string, commandValue = "") => { // Renamed 'value' to 'commandValue'
    document.execCommand(command, false, commandValue)
    if (editorRef.current) {
      editorRef.current.focus(); // Keep focus
      onChange(editorRef.current.innerHTML); // Update parent state immediately after command
    }
  }

  // Handle input from the contentEditable div
  const handleInput = () => {
    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML;
      if (currentHtml !== value) { // Only call onChange if content actually changed
        onChange(currentHtml);
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text/plain")
    document.execCommand("insertText", false, text)
    // handleInput will be triggered by the paste, so onChange will be called
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      // In a real app, you would upload the file to a server and get a URL
      // For this demo, we'll just use a placeholder
      const imageUrl = "/placeholder.svg?height=200&width=300" // Replace with actual upload logic
      execCommand("insertImage", imageUrl)
    }
  }

  const handleEmojiClick = () => {
    // In a real app, you would show an emoji picker
    // For this demo, we'll just insert a smiley face
    execCommand("insertText", "😊")
  }

  const toolbarButtonClass = cn(
    "h-8 w-8 rounded-[var(--radius)] transition-colors",
    darkMode
      ? "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
  );

  const toolbarSeparatorClass = cn(
    "w-px h-6 mx-1 self-center",
    darkMode ? "bg-border" : "bg-border"
  );

  return (
    <div className={cn(
      "rounded-[var(--radius)] overflow-hidden border border-border",
      "bg-background text-foreground"
    )}>
      <div className={cn(
        "p-2 flex flex-wrap gap-1 border-b border-border",
        darkMode ? "bg-card" : "bg-card"
      )}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={toolbarButtonClass}
          onClick={() => execCommand("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={toolbarButtonClass}
          onClick={() => execCommand("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={toolbarButtonClass}
          onClick={() => execCommand("underline")}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <span className={toolbarSeparatorClass}></span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={toolbarButtonClass}
          onClick={() => execCommand("justifyLeft")}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={toolbarButtonClass}
          onClick={() => execCommand("justifyCenter")}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={toolbarButtonClass}
          onClick={() => execCommand("justifyRight")}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <span className={toolbarSeparatorClass}></span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={toolbarButtonClass}
          onClick={() => execCommand("insertUnorderedList")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={toolbarButtonClass}
          onClick={() => execCommand("insertOrderedList")}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <span className={toolbarSeparatorClass}></span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={toolbarButtonClass}
          onClick={handleFileUpload}
          title="Insert Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={toolbarButtonClass}
          onClick={() => {
            const url = prompt("Enter link URL")
            if (url) execCommand("createLink", url)
          }}
          title="Insert Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={toolbarButtonClass}
          onClick={handleEmojiClick}
          title="Insert Emoji"
        >
          <Smile className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={toolbarButtonClass}
          onClick={handleFileUpload} // Assuming this is for general file attachments
          title="Attach File"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className={cn(
            "p-3 focus:outline-none prose prose-sm max-w-none",
            darkMode ? "text-gray-100 prose-invert" : "text-gray-900",
            // Basic placeholder styling (won't work if editor has any content, even <p><br></p>)
            // For a real placeholder, you'd need more complex JS or CSS :empty/:before logic
            // value === '' || value === '<p><br></p>' ? (darkMode ? 'placeholder-dark' : 'placeholder-light') : ''
        )}
        style={{ minHeight }}
        onInput={handleInput} // Changed from onKeyUp
        onPaste={handlePaste}
        // Removed dangerouslySetInnerHTML, content is managed by useEffect and user input
        // data-placeholder={placeholder} // For CSS :before placeholder if you implement it
      />
    </div>
  )
}
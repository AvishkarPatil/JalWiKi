"use client"

import { useState } from 'react'
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'

interface PDFViewerProps {
  pdfUrl: string
  title: string
  onClose: () => void
}

export default function PDFViewer({ pdfUrl, title, onClose }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true)

  const handleDownload = () => {
    // Create a link element to download the PDF
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-card text-card-foreground rounded-lg w-full max-w-4xl h-[90vh] flex flex-col shadow-lg border">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-foreground truncate">
            {title}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={handleDownload}
              className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              aria-label="Download PDF"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Close PDF viewer"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
          
          <iframe
            src={pdfUrl}
            title={title}
            className="w-full h-full rounded-b-lg"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  )
}
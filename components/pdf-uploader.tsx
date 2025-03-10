"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Upload } from "lucide-react"

interface PDFUploaderProps {
  onFileChange: (file: File) => void
}

export function PDFUploader({ onFileChange }: PDFUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type === "application/pdf") {
        onFileChange(file)
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0])
    }
  }

  return (
    <div
      className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 transition-colors ${
        isDragging ? "border-primary bg-primary/10" : "border-slate-300 dark:border-slate-700"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <FileText className="h-16 w-16 text-slate-400 mb-4" />
      <h3 className="text-xl font-medium mb-2">Upload a PDF</h3>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-4">
        Drag and drop your PDF file here, or click the button below
      </p>
      <Button onClick={() => fileInputRef.current?.click()}>
        <Upload className="h-4 w-4 mr-2" />
        Select PDF
      </Button>
      <input type="file" ref={fileInputRef} onChange={handleFileInput} accept="application/pdf" className="hidden" />
    </div>
  )
}


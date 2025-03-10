"use client"

import type React from "react"

import { forwardRef, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight } from "lucide-react"
import * as pdfjs from "pdfjs-dist"

// Ensure the worker is loaded
if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`
}

interface PDFViewerProps {
  pdfData: Uint8Array | null
  currentPage: number
  onPageChange: (page: number) => void
  onTotalPagesChange: (totalPages: number) => void
}

export const PDFViewer = forwardRef<any, PDFViewerProps>(
  ({ pdfData, currentPage, onPageChange, onTotalPagesChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [pdfDocument, setPdfDocument] = useState<pdfjs.PDFDocumentProxy | null>(null)
    const [pageInputValue, setPageInputValue] = useState(currentPage.toString())
    const [scale, setScale] = useState(1.5)

    useEffect(() => {
      if (!pdfData) return

      const loadPdf = async () => {
        try {
          const loadingTask = pdfjs.getDocument({ data: pdfData })
          const pdf = await loadingTask.promise
          setPdfDocument(pdf)
          onTotalPagesChange(pdf.numPages)
        } catch (error) {
          console.error("Error loading PDF:", error)
        }
      }

      loadPdf()

      return () => {
        if (pdfDocument) {
          pdfDocument.destroy()
        }
      }
    }, [pdfData, onTotalPagesChange])

    useEffect(() => {
      if (!pdfDocument || !canvasRef.current) return

      const renderPage = async () => {
        try {
          const page = await pdfDocument.getPage(currentPage)
          const viewport = page.getViewport({ scale })

          const canvas = canvasRef.current
          if (!canvas) return
          
          const context = canvas.getContext("2d")
          if (!context) return

          canvas.height = viewport.height
          canvas.width = viewport.width

          await page.render({
            canvasContext: context,
            viewport,
          }).promise
        } catch (error) {
          console.error("Error rendering PDF page:", error)
        }
      }

      renderPage()
    }, [pdfDocument, currentPage, scale])

    useEffect(() => {
      setPageInputValue(currentPage.toString())
    }, [currentPage])

    const handlePreviousPage = () => {
      if (currentPage > 1) {
        onPageChange(currentPage - 1)
      }
    }

    const handleNextPage = () => {
      if (pdfDocument && currentPage < pdfDocument.numPages) {
        onPageChange(currentPage + 1)
      }
    }

    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPageInputValue(e.target.value)
    }

    const handlePageInputBlur = () => {
      const pageNumber = Number.parseInt(pageInputValue)
      if (!isNaN(pageNumber) && pdfDocument && pageNumber >= 1 && pageNumber <= pdfDocument.numPages) {
        onPageChange(pageNumber)
      } else {
        setPageInputValue(currentPage.toString())
      }
    }

    const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handlePageInputBlur()
      }
    }

    const handleZoomIn = () => {
      setScale((prev) => Math.min(prev + 0.25, 3))
    }

    const handleZoomOut = () => {
      setScale((prev) => Math.max(prev - 0.25, 0.5))
    }

    if (!pdfData) {
      return <div>No PDF loaded</div>
    }

    return (
      <div className="flex flex-col h-full" ref={ref}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handlePreviousPage} disabled={currentPage <= 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center">
              <Input
                className="w-16 text-center"
                value={pageInputValue}
                onChange={handlePageInputChange}
                onBlur={handlePageInputBlur}
                onKeyDown={handlePageInputKeyDown}
              />
              <span className="mx-2 text-slate-500">/ {pdfDocument?.numPages || "?"}</span>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNextPage}
              disabled={!pdfDocument || currentPage >= pdfDocument.numPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={scale <= 0.5}>
              -
            </Button>
            <span className="text-sm">{Math.round(scale * 100)}%</span>
            <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={scale >= 3}>
              +
            </Button>
          </div>
        </div>

        <div className="flex-grow overflow-auto flex justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
          <canvas ref={canvasRef} className="shadow-lg" />
        </div>
      </div>
    )
  },
)

PDFViewer.displayName = "PDFViewer"


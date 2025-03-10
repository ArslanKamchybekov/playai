import * as pdfjs from "pdfjs-dist"

// Set worker source (update path if needed)
if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`
}

export async function extractTextFromPDFPage(pdfData: Uint8Array, pageNumber: number): Promise<string> {
  try {
    if (!(pdfData instanceof Uint8Array)) {
      throw new Error("Invalid PDF data. Expected Uint8Array.")
    }

    // Clone the buffer before passing it to pdf.js
    const clonedData = pdfData.slice() // Ensure a fresh copy

    const loadingTask = pdfjs.getDocument({ data: clonedData })
    const pdf = await loadingTask.promise

    if (pageNumber < 1 || pageNumber > pdf.numPages) {
      throw new Error(`Page number ${pageNumber} is out of bounds. (Total pages: ${pdf.numPages})`)
    }

    const page = await pdf.getPage(pageNumber)
    const textContent = await page.getTextContent()

    return textContent.items.map((item: any) => ("str" in item ? item.str : "")).join(" ").trim()
  } catch (error) {
    console.error("Error extracting text from PDF:", error)
    return "Error extracting text from this page."
  }
}

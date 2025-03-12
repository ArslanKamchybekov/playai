import * as pdfjs from "pdfjs-dist"

if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`
}

export async function extractTextFromPDFPage(pdfFile: File, pageNumber: number): Promise<string> {
  try {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdfData = new Uint8Array(arrayBuffer);
    
    const loadingTask = pdfjs.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;

    if (pageNumber < 1 || pageNumber > pdf.numPages) {
      throw new Error(`Page number ${pageNumber} is out of bounds. (Total pages: ${pdf.numPages})`);
    }

    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    
    const text = textContent.items
      .map((item: any) => ("str" in item ? item.str : ""))
      .join(" ")
      .trim();
    
    page.cleanup();
    pdf.destroy();
    
    return text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw error;
  }
}
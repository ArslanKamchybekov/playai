"use client"

import { useState, useRef, useEffect } from "react"
import { PDFUploader } from "./pdf-uploader"
import { PDFViewer } from "./pdf-viewer"
import { AudioPlayer } from "./audio-player"
import { VoiceSelector } from "./voice-selector"
import { PlaySettings } from "./play-settings"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatWidget } from "./chat-widget"
import { extractTextFromPDFPage } from "@/lib/pdf-utils"
import { voices } from "@/lib/voices"
import { Loader2, Upload } from "lucide-react"

export function BookReader() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [pageText, setPageText] = useState("")
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState(voices[0])
  const [speed, setSpeed] = useState(1.0)
  const [temperature, setTemperature] = useState(0.5)
  const pdfRef = useRef<any>(null)

  useEffect(() => {
    if (file && currentPage === 1) {
      setTimeout(() => {
        extractPageText();
      }, 100);
    }
  }, [file]);
  
  useEffect(() => {
    if (file && pdfRef.current) {
      extractPageText();
    }
  }, [currentPage, file]);
  
  const handleFileChange = async (file: File) => {
    setFile(file);
    const arrayBuffer = await file.arrayBuffer();
    setPdfData(new Uint8Array(arrayBuffer));
    setCurrentPage(1);
    setAudioUrl(null);
    setPageText(""); 
    setTimeout(() => {
      extractPageText();
    }, 200);
  };
  
  const extractPageText = async () => {
      if (!file) return;
      
      try {
        const text = await extractTextFromPDFPage(file, currentPage);
        setPageText(text);
      } catch (error) {
        console.error("Error extracting text:", error);
        setPageText("Error extracting text from this page.");
      }
    };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    setAudioUrl(null)
  }

  const handleGenerateAudio = async () => {
    if (!pageText) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: pageText,
          voice: selectedVoice.value,
          speed,
          temperature,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate audio")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
    } catch (error) {
      console.error("Error generating audio:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {!file ? (
        <Card className="p-8 flex flex-col items-center justify-center">
          <PDFUploader onFileChange={handleFileChange} />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-4 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{file.name}</h2>
                <Button variant="outline" size="sm" onClick={() => setFile(null)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Change PDF
                </Button>
              </div>
              <div className="flex-grow overflow-auto">
                <PDFViewer
                  pdfData={pdfData}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  onTotalPagesChange={setTotalPages}
                  ref={pdfRef}
                />
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Audio Controls</h3>
              <div className="space-y-4">
                <VoiceSelector selectedVoice={selectedVoice} onVoiceChange={setSelectedVoice} />

                <PlaySettings
                  speed={speed}
                  onSpeedChange={setSpeed}
                  temperature={temperature}
                  onTemperatureChange={setTemperature}
                />

                <Button className="w-full" onClick={handleGenerateAudio} disabled={isGenerating || !pageText}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Audio...
                    </>
                  ) : (
                    "Generate Audio"
                  )}
                </Button>

                {audioUrl && <AudioPlayer audioUrl={audioUrl} speed={speed} />}
              </div>
            </Card>

            <Card className="p-4 flex-grow">
              <Tabs defaultValue="text">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="text" className="flex-1">
                    Page Text
                  </TabsTrigger>
                  <TabsTrigger value="chat" className="flex-1">
                    Chat with Book
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="h-[300px] overflow-auto">
                  <div className="prose dark:prose-invert max-w-none">
                    {pageText ? (
                      <p>{pageText}</p>
                    ) : (
                      <p className="text-slate-500 italic">No text extracted from this page.</p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="chat" className="h-[300px]">
                  <ChatWidget pageText={pageText} />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}


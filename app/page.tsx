import { BookReader } from "@/components/book-reader"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">PlayAI Book Reader</h1>
          <p className="text-slate-600 dark:text-slate-300">
            Upload a PDF and listen to it with PlayAI's Text-to-Speech
          </p>
        </header>
        <BookReader />
      </div>
    </main>
  )
}


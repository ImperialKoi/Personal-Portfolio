"use client"

import { useState, useEffect } from "react"
import { CodeBlock } from "@/components/ui/codeblock"

interface EditorProps {
  content: string
  fileName: string
  projectUrl?: string
  onOpenRandomFile?: () => void
}

// Track which files have been seen before
const seenFiles = new Set<string>()

export const Editor = ({ content, fileName, projectUrl, onOpenRandomFile }: EditorProps) => {
  const [displayedContent, setDisplayedContent] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const isProjectFile = fileName.includes(".js") || fileName.includes(".tsx") || fileName.includes(".py")
  const shouldShowPreview = isProjectFile && projectUrl

  useEffect(() => {
    const hasBeenSeen = seenFiles.has(fileName)
    if (hasBeenSeen) {
      setDisplayedContent(content)
      setIsTyping(false)
      return
    }

    seenFiles.add(fileName)
    setDisplayedContent("")
    setIsTyping(true)

    let index = 0
    let timeoutId: NodeJS.Timeout
    let isCancelled = false

    const typeContent = () => {
      if (isCancelled) return
      if (index < content.length) {
        setDisplayedContent(content.substring(0, index + 1))
        index++
        timeoutId = setTimeout(typeContent, Math.random() * 20 + 5)
      } else {
        setIsTyping(false)
      }
    }

    const timer = setTimeout(typeContent, 100)

    return () => {
      isCancelled = true
      clearTimeout(timer)
      clearTimeout(timeoutId)
    }
  }, [content, fileName])

  const getLanguageFromExtension = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "js":
      case "jsx":
        return "javascript"
      case "ts":
      case "tsx":
        return "typescript"
      case "py":
        return "python"
      case "json":
        return "json"
      case "md":
        return "markdown"
      case "css":
        return "css"
      case "html":
        return "html"
      case "sql":
        return "sql"
      case "yaml":
      case "yml":
        return "yaml"
      case "xml":
        return "xml"
      case "sh":
      case "bash":
        return "bash"
      default:
        return "text"
    }
  }

  const language = getLanguageFromExtension(fileName)

  const handleOpenRandom = () => {
    if (typeof onOpenRandomFile === 'function') {
      onOpenRandomFile()
      return
    }

    try {
      const ev = new CustomEvent('ide:open-random-file')
      window.dispatchEvent(ev)
      return
    } catch (e) {
      // fallback to projects page
      window.location.href = '/projects'
    }
  }

  // Show placeholder when there's no content (no open tabs)
  if (!content) {
    return (
      <div className="h-full bg-[#1e1e1e] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center justify-center">
            {/* simple code glyph */}
            <img src="/background-diamond.png" alt="diamond-background" className="w-full h-full" />
          </div>

          <h2 className="text-lg text-[#d6e6eb] mb-4">Daniel-Xu IDE</h2>
          <p className="text-sm text-[#7f8b90] mb-2">Open a file to start editing</p>
          <p className="text-sm text-[#7f8b90] mb-6">Type "help" in the terminal to show the list of commands</p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleOpenRandom}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-800 text-white text-sm rounded"
            >
              Open Random File
            </button>

            <a
              href="/projects"
              className="px-3 py-2 border border-[#263238] text-[#cfe9f5] text-sm rounded hover:bg-[#0f171a]"
            >
              Browse Projects
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-[#1e1e1e] overflow-auto">
      <div className="p-4">
        <div className="flex items-center mb-4 text-xs text-[#858585]">
          <div className="flex items-center space-x-4">
            <span>Ln 1, Col 1</span>
            <span>{language.toUpperCase()}</span>
            <span>UTF-8</span>
            <span>CRLF</span>
          </div>
        </div>

        <div className="relative">
          <CodeBlock language={language} filename={fileName} code={displayedContent} />

          {isTyping && (
            <div className="absolute bottom-4 right-4">
              <span className="inline-block w-2 h-5 bg-white animate-pulse"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

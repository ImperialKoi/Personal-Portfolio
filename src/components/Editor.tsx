"use client"

import { useState, useEffect } from "react"
import { CodeBlock } from "@/components/ui/codeblock"

interface EditorProps {
  content: string
  fileName: string
  projectUrl?: string
}

// Track which files have been seen before
const seenFiles = new Set<string>()

export const Editor = ({ content, fileName, projectUrl }: EditorProps) => {
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

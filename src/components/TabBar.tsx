"use client"

import { X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export interface TabType {
  id: string
  name: string
  isDirty?: boolean
}

interface TabBarProps {
  tabs: TabType[]
  activeTab: string
  onTabSelect: (tabId: string) => void
  onTabClose: (tabId: string) => void
}

const getFileIcon = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase()

  const iconColors = {
    js: "text-[#f7df1e]",
    jsx: "text-[#61dafb]",
    ts: "text-[#3178c6]",
    tsx: "text-[#3178c6]",
    py: "text-[#3776ab]",
    json: "text-[#f7df1e]",
    md: "text-[#519aba]",
    pdf: "text-[#dc3545]",
    css: "text-[#1572b6]",
  }

  const iconSymbols = {
    js: "{}",
    jsx: "⚛",
    ts: "TS",
    tsx: "⚛",
    py: "🐍",
    json: "JS",
    md: "📝",
    pdf: "📄",
    css: "🎨",
  }

  const color = iconColors[ext as keyof typeof iconColors] || "text-[#cccccc]"
  const symbol = iconSymbols[ext as keyof typeof iconSymbols] || "📄"

  return <span className={`text-xs ${color} mr-2 flex-shrink-0`}>{symbol}</span>
}

export const TabBar = ({ tabs, activeTab, onTabSelect, onTabClose }: TabBarProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [tabWidth, setTabWidth] = useState(200)

  useEffect(() => {
    const updateTabWidth = () => {
      if (containerRef.current && tabs.length > 0) {
        const containerWidth = containerRef.current.offsetWidth
        const availableWidth = containerWidth - tabs.length * 2 // Account for borders
        const idealWidth = Math.max(70, Math.min(200, availableWidth / tabs.length))

        console.log("[v0] Tab compression debug:", {
          containerWidth,
          tabCount: tabs.length,
          availableWidth,
          idealWidth,
        })

        setTabWidth(idealWidth)
      }
    }

    updateTabWidth()

    const resizeObserver = new ResizeObserver(updateTabWidth)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [tabs.length])

  return (
    <div ref={containerRef} className="flex bg-[#2d2d30] border-b border-[#2d2d30] overflow-hidden min-w-0">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          style={{
            width: `${tabWidth}px`,
            minWidth: "70px",
            maxWidth: "200px",
            flexShrink: 1,
          }}
          className={`flex items-center px-3 py-2 text-sm cursor-pointer border-r border-[#2d2d30] ${
            activeTab === tab.id
              ? "bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc]"
              : "bg-[#2d2d30] text-[#969696] hover:bg-[#323233]"
          }`}
          onClick={() => onTabSelect(tab.id)}
        >
          {getFileIcon(tab.name)}
          <span className="truncate mr-2 flex-1 min-w-0">{tab.name}</span>
          {tab.isDirty && <div className="w-2 h-2 bg-white rounded-full mr-2 flex-shrink-0"></div>}
          <button
            className="flex-shrink-0 hover:bg-white/10 rounded p-0.5 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onTabClose(tab.id)
            }}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  )
}

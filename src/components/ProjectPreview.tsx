"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Github, Globe, Star, Code, Zap } from "lucide-react"

interface ProjectInfo {
  name: string
  description: string
  summary: string
  technologies: string[]
  websiteUrl: string
  githubUrl: string
  category: string
  status: string
  highlights: string[]
}

interface ProjectShowcaseProps {
  projectInfo: ProjectInfo
}

export const ProjectShowcase = ({ projectInfo }: ProjectShowcaseProps) => {
  const { name, description, summary, technologies, websiteUrl, githubUrl, category, status, highlights } = projectInfo

  // Parse summary to extract key features
  const summaryParts = summary.split("Key Features:")
  const mainSummary = summaryParts[0].trim()
  const keyFeatures = summaryParts[1]
    ? summaryParts[1]
        .split("•")
        .filter((feature) => feature.trim())
        .map((feature) => feature.trim())
    : []

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <h1 className="text-4xl font-bold text-gray-900">{name}</h1>
          <Badge variant={status === "Live" ? "default" : "secondary"} className="text-sm">
            {status}
          </Badge>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">{description}</p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button asChild size="lg">
            <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
              <Globe className="w-4 h-4 mr-2" />
              Live Demo
            </a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4 mr-2" />
              View Code
            </a>
          </Button>
        </div>
      </div>

      <Separator />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Project Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{mainSummary}</p>
            </CardContent>
          </Card>

          {/* Key Features */}
          {keyFeatures.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Highlights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Project Highlights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    <span className="text-gray-800 font-medium">{highlight}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Category</h4>
                <Badge variant="outline" className="text-sm">
                  {category}
                </Badge>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
                <Badge variant={status === "Live" ? "default" : "secondary"}>{status}</Badge>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Links</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" asChild>
                    <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" asChild>
                    <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                      <Code className="w-4 h-4 mr-2" />
                      Source Code
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technologies */}
          <Card>
            <CardHeader>
              <CardTitle>Technologies Used</CardTitle>
              <CardDescription>Tech stack and tools used in this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// LogoScan - AI-Powered Brand Sustainability Scanner
// Camera-based AI system for detecting logos and providing sustainability ratings

import React, { useState, useRef } from 'react';

interface SustainabilityReport {
  id: string;
  brandName: string;
  logoDetected: boolean;
  confidence: number;
  sustainabilityScore: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  categories: {
    environmental: number;
    social: number;
    governance: number;
    transparency: number;
  };
  certifications: string[];
  improvements: string[];
  alternatives: Brand[];
}

interface Brand {
  name: string;
  score: number;
  reason: string;
}

const LogoScan = () => {
  const [scanResult, setScanResult] = useState<SustainabilityReport | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const features = [
    "📸 Real-time logo detection & recognition",
    "🌱 Comprehensive sustainability scoring",
    "🏆 ESG (Environmental, Social, Governance) analysis",
    "📊 Transparency & ethics evaluation",
    "🔄 Alternative brand suggestions",
    "📱 Mobile-optimized scanning",
    "🌍 Global brand database (10,000+ companies)",
    "📈 Historical sustainability trends",
    "🎯 Custom scoring algorithms",
    "📋 Detailed impact reports"
  ];

  const techStack = {
    ai: ["TensorFlow.js", "YOLO v8", "Custom logo CNN", "OCR technology"],
    vision: ["OpenCV.js", "Image preprocessing", "Feature extraction"],
    data: ["Sustainability APIs", "ESG databases", "Brand intelligence"],
    camera: ["WebRTC", "Canvas API", "Real-time processing"],
    frontend: ["React", "TypeScript", "Tailwind CSS", "Chart.js"]
  };

  const scoringCategories = [
    "🌍 Environmental Impact (30%)",
    "👥 Social Responsibility (25%)",
    "🏛️ Corporate Governance (20%)",
    "📖 Transparency & Reporting (15%)",
    "🔄 Circular Economy Practices (10%)"
  ];

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'environment'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Camera access failed:', error);
    }
  };

  const scanLogo = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsScanning(true);
    
    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        // Simulate AI logo detection and sustainability analysis
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const mockResult: SustainabilityReport = {
          id: `scan_${Date.now()}`,
          brandName: 'Nike',
          logoDetected: true,
          confidence: 0.94,
          sustainabilityScore: 72,
          grade: 'B+',
          categories: {
            environmental: 68,
            social: 75,
            governance: 78,
            transparency: 70
          },
          certifications: [
            'B Corp Certified',
            'Fair Trade Approved',
            'Sustainable Apparel Coalition'
          ],
          improvements: [
            'Increase renewable energy usage in manufacturing',
            'Improve supply chain transparency',
            'Expand circular economy initiatives',
            'Reduce carbon footprint by 30% by 2030'
          ],
          alternatives: [
            { name: 'Patagonia', score: 91, reason: 'Leading environmental practices' },
            { name: 'Allbirds', score: 88, reason: 'Sustainable materials focus' },
            { name: 'Veja', score: 85, reason: 'Ethical sourcing & transparency' }
          ]
        };
        
        setScanResult(mockResult);
      }
    } catch (error) {
      console.error('Logo scan failed:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A': return 'text-green-600 bg-green-100';
      case 'B+':
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'C+':
      case 'C': return 'text-yellow-600 bg-yellow-100';
      case 'D':
      case 'F': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const CameraInterface = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Logo Scanner</h3>
      
      {!cameraActive ? (
        <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
          <div className="text-center">
            <div className="text-4xl mb-2">📸</div>
            <p className="text-gray-600 mb-4">Point camera at a logo to analyze</p>
            <button 
              onClick={startCamera}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Start Scanning
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="relative mb-4">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              className="w-full rounded-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 border-4 border-green-400 rounded-lg bg-green-400/10">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-green-600 font-medium">Center logo here</span>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={scanLogo}
            disabled={isScanning}
            className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {isScanning ? '🔍 Analyzing Logo...' : '🌱 Scan Sustainability'}
          </button>
        </>
      )}
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );

  const SustainabilityReport = ({ report }: { report: SustainabilityReport }) => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Sustainability Report</h3>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="text-lg font-bold">{report.brandName}</h4>
            <p className="text-sm text-gray-600">
              Detected with {Math.round(report.confidence * 100)}% confidence
            </p>
          </div>
          <div className="text-center">
            <div className={`inline-block px-4 py-2 rounded-full text-lg font-bold ${getGradeColor(report.grade)}`}>
              {report.grade}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Score: {report.sustainabilityScore}/100
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {Object.entries(report.categories).map(([category, score]) => (
            <div key={category} className="text-center">
              <div className="text-lg font-semibold">{score}/100</div>
              <div className="text-sm text-gray-600 capitalize">{category}</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h5 className="font-semibold mb-2">Certifications:</h5>
        <div className="flex flex-wrap gap-2">
          {report.certifications.map((cert, index) => (
            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
              {cert}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h5 className="font-semibold mb-2">Areas for Improvement:</h5>
        <ul className="space-y-1">
          {report.improvements.slice(0, 3).map((improvement, index) => (
            <li key={index} className="text-sm text-gray-700">
              • {improvement}
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h5 className="font-semibold mb-2">Sustainable Alternatives:</h5>
        <div className="space-y-2">
          {report.alternatives.map((brand, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <div>
                <span className="font-medium text-sm">{brand.name}</span>
                <p className="text-xs text-gray-600">{brand.reason}</p>
              </div>
              <span className="text-sm font-semibold text-green-600">
                {brand.score}/100
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">LogoScan - Brand Sustainability Scanner</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <CameraInterface />
          {scanResult ? (
            <SustainabilityReport report={scanResult} />
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-4">🌱</div>
                <p>Scan a logo to see sustainability analysis</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Scoring Categories</h3>
            <ul className="space-y-2">
              {scoringCategories.map((category, index) => (
                <li key={index} className="flex items-center text-sm">
                  {category}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Tech Stack</h3>
            <div className="space-y-3">
              {Object.entries(techStack).map(([category, items]) => (
                <div key={category}>
                  <strong className="capitalize text-sm">{category}:</strong>
                  <p className="text-xs text-gray-600">{items.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoScan;
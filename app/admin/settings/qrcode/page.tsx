"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { QrCode, Download, Link as LinkIcon, RefreshCw, Loader2 } from 'lucide-react'
import PrivateRoute from "@/components/auth/PrivateRoute"
import { toast } from 'sonner'

export default function QRCodePage() {
  const [targetUrl, setTargetUrl] = useState('')
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    if (!targetUrl) {
      toast.error('Please enter a valid URL or text')
      return
    }

    setIsGenerating(true)
    // Simulate a small delay for better UX
    setTimeout(() => {
      setGeneratedUrl(targetUrl)
      setIsGenerating(false)
      toast.success('QR Code generated successfully!')
    }, 600)
  }

  const qrImageUrl = generatedUrl 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&format=jpg&data=${encodeURIComponent(generatedUrl)}`
    : ''

  const handleDownload = () => {
    if (!qrImageUrl) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      
      if (ctx) {
        // Fill white background for JPG (as JPG doesn't support transparency)
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        
        try {
          const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
          const link = document.createElement("a")
          link.href = dataUrl
          link.download = `qrcode-${Date.now()}.jpg`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          toast.success("Download started!")
        } catch (err) {
          console.error("Canvas export failed:", err)
          toast.error("Failed to process image for download")
        }
      }
    }
    img.onerror = () => {
      toast.error("Failed to load QR code for download")
    }
    img.src = qrImageUrl
  }

  return (
    <PrivateRoute modulePath="admin/settings/qrcode" action="view">
      <div className="p-8 max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">QR Code Generator</h1>
          <p className="text-lg text-slate-500">Create high-quality QR codes for your clinic links or patient resources.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Configuration Card */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                <LinkIcon className="w-6 h-6 text-primary" />
                Configure Link
              </CardTitle>
              <CardDescription>Enter the URL or text you want to encode</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="url" className="text-sm font-semibold text-slate-700">Target URL</Label>
                <div className="relative">
                  <Input
                    id="url"
                    placeholder="https://example.com"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="pl-10 h-12 focus-visible:ring-primary h-12"
                  />
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>
              <Button 
                onClick={handleGenerate} 
                className="w-full h-12 text-lg font-bold shadow-md hover:shadow-lg transition-all"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Generate QR Code
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card className="shadow-lg border-slate-200 bg-slate-50/50">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <QrCode className="w-6 h-6 text-primary" />
                QR Preview
              </CardTitle>
              <CardDescription>Your generated code will appear below</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-6 min-h-[300px]">
              {generatedUrl ? (
                <div className="group relative bg-white p-6 rounded-3xl shadow-xl border border-slate-100 transition-all hover:scale-105 duration-300">
                  <img 
                    src={qrImageUrl} 
                    alt="Generated QR Code" 
                    className="w-64 h-64 md:w-72 md:h-72 object-contain"
                  />
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 py-12">
                  <QrCode className="w-32 h-32 mb-4 opacity-10" />
                  <p className="text-sm font-medium italic">Generate a code to see it here</p>
                </div>
              )}

              {generatedUrl && (
                <Button 
                  variant="outline" 
                  onClick={handleDownload}
                  className="w-full h-12 gap-2 font-bold border-2 hover:bg-slate-100"
                >
                  <Download className="w-5 h-5" />
                  Download JPG
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Box */}
        <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
          <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            Quick Tip
          </h4>
          <p className="text-slate-600 text-sm leading-relaxed">
            You can use this to generate QR codes for clinical prescriptions, patient self-check-in forms, or promotional materials. 
            Once generated, you can download the image and use it in your documents or print materials.
          </p>
        </div>
      </div>
    </PrivateRoute>
  )
}

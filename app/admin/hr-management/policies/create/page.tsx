"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Bold,
    Italic,
    Strikethrough,
    Underline,
    List,
    ListOrdered,
    Quote,
    Link2,
    Image as ImageIcon,
    Table as TableIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    HelpCircle,
    Undo2,
    Redo2,
    Scissors,
    Copy,
    ArrowLeft,
    ChevronDown,
} from "lucide-react"
import Link from "next/link"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { cn } from "@/lib/utils"
import settingsApi from "@/lib/settingsApi"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function CreateHRPolicyPage() {
    const [policyNumber, setPolicyNumber] = useState("")
    const [policyTitle, setPolicyTitle] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const editorRef = useRef<HTMLDivElement>(null)

    const execCommand = (command: string, value: string = "") => {
        document.execCommand(command, false, value)
        editorRef.current?.focus()
    }

    const handleSubmit = async () => {
        const description = editorRef.current?.innerHTML || ""

        if (!policyNumber || !policyTitle || !description || description === "<br>") {
            toast.error("Please fill in all required fields")
            return
        }

        setIsLoading(true)
        try {
            await settingsApi.createHRPolicy({
                policyNumber,
                title: policyTitle,
                description
            })
            toast.success("HR Policy created successfully")
            router.push("/admin/hr-management/policies")
        } catch (error) {
            console.error("Error creating policy:", error)
            toast.error("Failed to create HR Policy")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <PrivateRoute modulePath="admin/hr-management/policies" action="add">
            <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/hr-management/policies">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create New HR Policy</h1>
                        <p className="text-sm text-gray-500">Enter policy details and documentation</p>
                    </div>
                </div>

                <Card className="border shadow-sm bg-white rounded-xl overflow-hidden">
                    <CardContent className="p-6 space-y-6">
                        {/* Policy Number and Title */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="policyNumber" className="text-sm font-semibold text-gray-700">Policy Number *</Label>
                                <Input
                                    id="policyNumber"
                                    placeholder="e.g. HR-2024-001"
                                    value={policyNumber}
                                    onChange={(e) => setPolicyNumber(e.target.value)}
                                    className="h-10 border-gray-200 focus:ring-primary/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="policyTitle" className="text-sm font-semibold text-gray-700">Policy Title *</Label>
                                <Input
                                    id="policyTitle"
                                    placeholder="e.g. Leave Policy"
                                    value={policyTitle}
                                    onChange={(e) => setPolicyTitle(e.target.value)}
                                    className="h-10 border-gray-200 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        {/* Description with Functional Rich Text Editor */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Description *</Label>
                            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col">
                                {/* Editor Toolbar */}
                                <div className="flex flex-wrap items-center gap-0.5 p-1.5 bg-gray-50 border-b border-gray-200">
                                    <div className="flex items-center border-r border-gray-300 pr-1.5 mr-1.5 gap-0.5">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand('cut')} title="Cut"><Scissors className="h-3.5 w-3.5" /></Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand('copy')} title="Copy"><Copy className="h-3.5 w-3.5" /></Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand('undo')} title="Undo"><Undo2 className="h-3.5 w-3.5" /></Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand('redo')} title="Redo"><Redo2 className="h-3.5 w-3.5" /></Button>
                                    </div>

                                    <div className="flex items-center border-r border-gray-300 pr-1.5 mr-1.5 gap-0.5">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 font-bold" onClick={() => execCommand('bold')} title="Bold">B</Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 italic" onClick={() => execCommand('italic')} title="Italic">I</Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 line-through" onClick={() => execCommand('strikeThrough')} title="Strikethrough">S</Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 underline" onClick={() => execCommand('underline')} title="Underline">U</Button>
                                    </div>

                                    <div className="flex items-center border-r border-gray-300 pr-1.5 mr-1.5 gap-0.5">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand('insertOrderedList')} title="Ordered List"><ListOrdered className="h-3.5 w-3.5" /></Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand('insertUnorderedList')} title="Unordered List"><List className="h-3.5 w-3.5" /></Button>
                                    </div>

                                    <div className="flex items-center border-r border-gray-300 pr-1.5 mr-1.5 gap-0.5">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand('justifyLeft')} title="Align Left"><AlignLeft className="h-3.5 w-3.5" /></Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand('justifyCenter')} title="Align Center"><AlignCenter className="h-3.5 w-3.5" /></Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand('justifyRight')} title="Align Right"><AlignRight className="h-3.5 w-3.5" /></Button>
                                    </div>

                                    <div className="flex items-center gap-0.5">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => {
                                            const url = prompt("Enter URL:");
                                            if (url) execCommand('createLink', url);
                                        }} title="Insert Link"><Link2 className="h-3.5 w-3.5" /></Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand('formatBlock', 'blockquote')} title="Blockquote"><Quote className="h-3.5 w-3.5" /></Button>
                                    </div>
                                </div>

                                {/* Content Editable Area */}
                                <div
                                    ref={editorRef}
                                    contentEditable
                                    className="min-h-[350px] p-4 focus:outline-none text-base leading-relaxed bg-white prose prose-sm max-w-none"
                                    onInput={(e) => {
                                        // Optional: Handle auto-save or state updates if needed
                                    }}
                                />

                                <div className="bg-gray-50 px-4 py-1.5 border-t border-gray-100 text-[10px] text-gray-400 font-medium flex items-center justify-between">
                                    <span>TEXT EDITOR ACTIVE</span>
                                    <HelpCircle className="h-3 w-3 cursor-help" />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 flex items-center justify-between border-t border-gray-50">
                            <p className="text-xs text-gray-400">* All fields are required to publish the policy.</p>
                            <div className="flex gap-3">
                                <Link href="/admin/hr-management/policies">
                                    <Button variant="outline" className="px-6 border-gray-200 text-gray-600 hover:bg-gray-50">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    className="bg-gray-900 hover:bg-black text-white px-8 font-semibold transition-all shadow-md shadow-gray-900/10"
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Submitting..." : "Submit Policy"}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PrivateRoute>
    )
}

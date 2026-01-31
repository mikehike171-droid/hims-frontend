"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Save, FileText, Copy } from "lucide-react"

interface PrescriptionTemplate {
  id: string
  name: string
  diagnosis: string
  medicines: Array<{
    name: string
    dose: string
    frequency: string
    duration: string
  }>
  labTests: string[]
  advice: string
  usageCount: number
}

export default function PrescriptionTemplates() {
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([
    {
      id: "1",
      name: "Common Cold",
      diagnosis: "Upper Respiratory Tract Infection",
      medicines: [
        { name: "Paracetamol 500mg", dose: "1 tablet", frequency: "TID", duration: "5 days" },
        { name: "Cetirizine 10mg", dose: "1 tablet", frequency: "OD", duration: "5 days" },
      ],
      labTests: [],
      advice: "Rest, plenty of fluids, avoid cold foods",
      usageCount: 45,
    },
    {
      id: "2",
      name: "Hypertension Follow-up",
      diagnosis: "Essential Hypertension",
      medicines: [
        { name: "Amlodipine 5mg", dose: "1 tablet", frequency: "OD", duration: "30 days" },
        { name: "Metoprolol 50mg", dose: "1 tablet", frequency: "BD", duration: "30 days" },
      ],
      labTests: ["Lipid Profile", "Kidney Function Test"],
      advice: "Low salt diet, regular exercise, monitor BP daily",
      usageCount: 32,
    },
    {
      id: "3",
      name: "Diabetes Management",
      diagnosis: "Diabetes Mellitus Type 2",
      medicines: [
        { name: "Metformin 500mg", dose: "1 tablet", frequency: "BD", duration: "30 days" },
        { name: "Glimepiride 2mg", dose: "1 tablet", frequency: "OD", duration: "30 days" },
      ],
      labTests: ["HbA1c", "Fasting Blood Sugar", "Post Prandial Sugar"],
      advice: "Diabetic diet, regular exercise, foot care",
      usageCount: 28,
    },
  ])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<PrescriptionTemplate | null>(null)
  const [newTemplate, setNewTemplate] = useState<Partial<PrescriptionTemplate>>({
    name: "",
    diagnosis: "",
    medicines: [],
    labTests: [],
    advice: "",
  })

  const createTemplate = () => {
    if (newTemplate.name && newTemplate.diagnosis) {
      const template: PrescriptionTemplate = {
        id: Date.now().toString(),
        name: newTemplate.name,
        diagnosis: newTemplate.diagnosis,
        medicines: newTemplate.medicines || [],
        labTests: newTemplate.labTests || [],
        advice: newTemplate.advice || "",
        usageCount: 0,
      }
      setTemplates([...templates, template])
      setNewTemplate({ name: "", diagnosis: "", medicines: [], labTests: [], advice: "" })
      setIsCreateDialogOpen(false)
    }
  }

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id))
  }

  const useTemplate = (template: PrescriptionTemplate) => {
    // This would integrate with the main prescription form
    alert(`Template "${template.name}" applied to prescription form!`)
    setTemplates(templates.map((t) => (t.id === template.id ? { ...t, usageCount: t.usageCount + 1 } : t)))
  }

  const handleUseTemplate = (template: PrescriptionTemplate) => {
    useTemplate(template)
  }

  const handleEditTemplate = (template: PrescriptionTemplate) => {
    setEditingTemplate(template)
  }

  const handleDeleteTemplate = (id: string) => {
    deleteTemplate(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Prescription Templates</h2>
          <p className="text-gray-600">Quick templates for common prescriptions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Template Name</Label>
                  <Input
                    value={newTemplate.name || ""}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    placeholder="e.g., Common Cold"
                  />
                </div>
                <div>
                  <Label>Diagnosis</Label>
                  <Input
                    value={newTemplate.diagnosis || ""}
                    onChange={(e) => setNewTemplate({ ...newTemplate, diagnosis: e.target.value })}
                    placeholder="e.g., Upper Respiratory Infection"
                  />
                </div>
              </div>
              <div>
                <Label>Clinical Advice</Label>
                <Textarea
                  value={newTemplate.advice || ""}
                  onChange={(e) => setNewTemplate({ ...newTemplate, advice: e.target.value })}
                  placeholder="General advice for this condition..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createTemplate}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{template.diagnosis}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Used {template.usageCount}x
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Medicines */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Medicines:</p>
                  <div className="space-y-1">
                    {template.medicines.slice(0, 2).map((medicine, index) => (
                      <p key={index} className="text-xs text-gray-600">
                        • {medicine.name} - {medicine.frequency} × {medicine.duration}
                      </p>
                    ))}
                    {template.medicines.length > 2 && (
                      <p className="text-xs text-gray-500">+{template.medicines.length - 2} more</p>
                    )}
                  </div>
                </div>

                {/* Lab Tests */}
                {template.labTests.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Lab Tests:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.labTests.slice(0, 2).map((test, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {test}
                        </Badge>
                      ))}
                      {template.labTests.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.labTests.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Advice */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Advice:</p>
                  <p className="text-xs text-gray-600 line-clamp-2">{template.advice}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t">
                  <Button size="sm" onClick={() => handleUseTemplate(template)} className="flex-1">
                    <Copy className="h-3 w-3 mr-1" />
                    Use
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEditTemplate(template)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No templates created yet</p>
            <p className="text-sm text-gray-400">Create your first template to get started</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

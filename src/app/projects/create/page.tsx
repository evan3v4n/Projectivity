'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { ChevronRight, ChevronLeft, Search, Upload, Plus, Users, Clock, Calendar, Sparkles, Zap, Target, Globe } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const categories = [
  "Web Development", "Mobile App Development", "Data Science", "Machine Learning",
  "Game Development", "Blockchain", "IoT", "Cybersecurity", "Cloud Computing",
]

const categoryTechnologies = {
  "Web Development": ["React", "Angular", "Vue.js", "Node.js", "Express", "Django", "Ruby on Rails", "ASP.NET", "TypeScript", "GraphQL"],
  "Mobile App Development": ["React Native", "Flutter", "Swift", "Kotlin", "Xamarin"],
  "Data Science": ["Python", "R", "SQL", "Tableau", "Power BI", "Pandas", "NumPy"],
  "Machine Learning": ["TensorFlow", "PyTorch", "Scikit-learn", "Keras"],
  "Game Development": ["Unity", "Unreal Engine", "Godot"],
  "Blockchain": ["Solidity", "Ethereum", "Hyperledger"],
  "IoT": ["Arduino", "Raspberry Pi", "MQTT"],
  "Cybersecurity": ["Wireshark", "Metasploit", "Nmap", "Kali Linux"],
  "Cloud Computing": ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes"]
}

export default function CreateProjectPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const { register, control, handleSubmit, watch, setValue, formState: { errors, isValid } } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      category: '',
      technologies: [],
      openPositions: 1,
      timeCommitment: 10,
      timeline: 30,
      learningObjectives: [''],
      isPublic: true,
      projectImage: null
    }
  })

  const watchedFields = watch()

  const onSubmit = async (data) => {
    console.log(data)
    // Handle form submission
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="title" className="text-lg font-semibold text-purple-700 dark:text-purple-300">Project Title</Label>
              <Input
                id="title"
                {...register('title', { required: 'Title is required' })}
                placeholder="Enter an inspiring title for your project"
                className="text-xl font-bold placeholder:text-gray-400 border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 dark:border-purple-700 dark:focus:border-purple-500"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-lg font-semibold text-purple-700 dark:text-purple-300">Project Vision</Label>
              <Textarea
                id="description"
                {...register('description', { required: 'Description is required' })}
                placeholder="Describe your project's goals and the problem it aims to solve"
                rows={4}
                className="text-base placeholder:text-gray-400 border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 dark:border-purple-700 dark:focus:border-purple-500"
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-lg font-semibold text-purple-700 dark:text-purple-300">Project Category</Label>
              <Controller
                name="category"
                control={control}
                rules={{ required: 'Category is required' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 dark:border-purple-700 dark:focus:border-purple-500">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
            </div>
          </motion.div>
        )
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="technologies" className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                Technologies & Skills
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                <Input
                  type="text"
                  placeholder="Search technologies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 dark:border-purple-700 dark:focus:border-purple-500"
                />
              </div>
              <Controller
                name="technologies"
                control={control}
                rules={{ required: 'At least one technology is required' }}
                render={({ field }) => (
                  <>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <AnimatePresence>
                        {field.value.map((tech) => (
                          <motion.div
                            key={tech}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Badge
                              variant="secondary"
                              className="px-3 py-1 bg-purple-100 text-purple-700 flex items-center gap-1 dark:bg-purple-900 dark:text-purple-300"
                            >
                              {tech}
                              <button
                                onClick={() => field.onChange(field.value.filter(t => t !== tech))}
                                className="ml-1 text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-200"
                              >
                                ×
                              </button>
                            </Badge>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                    <Card className="border-2 border-purple-200 dark:border-purple-700">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Suggested Technologies</h3>
                        <div className="flex flex-wrap gap-2">
                          {(categoryTechnologies[watchedFields.category] || [])
                            .filter(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((tech) => (
                              <Button
                                key={tech}
                                variant="outline"
                                size="sm"
                                className={`transition-colors ${field.value.includes(tech)
                                  ? 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700'
                                  : 'text-purple-700 hover:bg-purple-50 dark:text-purple-300 dark:hover:bg-purple-900'
                                  }`}
                                onClick={() => {
                                  if (field.value.includes(tech)) {
                                    field.onChange(field.value.filter(t => t !== tech))
                                  } else {
                                    field.onChange([...field.value, tech])
                                  }
                                }}
                              >
                                {tech}
                              </Button>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              />
              {errors.technologies && <p className="text-red-500 text-sm">{errors.technologies.message}</p>}
            </div>
          </motion.div>
        )
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-purple-700 dark:text-purple-300">Team & Timeline</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-2 border-purple-200 dark:border-purple-700">
                  <CardContent className="p-4 flex flex-col items-center">
                    <Users className="w-8 h-8 text-purple-500 mb-2" />
                    <Label htmlFor="openPositions" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team Size</Label>
                    <Controller
                      name="openPositions"
                      control={control}
                      rules={{ required: 'Team size is required' }}
                      render={({ field }) => (
                        <div className="w-full">
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="text-purple-600"
                          />
                          <span className="text-sm text-purple-600 dark:text-purple-400 mt-2 block text-center">{field.value} member(s)</span>
                        </div>
                      )}
                    />
                  </CardContent>
                </Card>
                <Card className="border-2 border-purple-200 dark:border-purple-700">
                  <CardContent className="p-4 flex flex-col items-center">
                    <Clock className="w-8 h-8 text-purple-500 mb-2" />
                    <Label htmlFor="timeCommitment" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Commitment</Label>
                    <Controller
                      name="timeCommitment"
                      control={control}
                      rules={{ required: 'Time commitment is required' }}
                      render={({ field }) => (
                        <div className="w-full">
                          <Slider
                            min={1}
                            max={40}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="text-purple-600"
                          />
                          <span className="text-sm text-purple-600 dark:text-purple-400 mt-2 block text-center">{field.value} hours/week</span>
                        </div>
                      )}
                    />
                  </CardContent>
                </Card>
                <Card className="border-2 border-purple-200 dark:border-purple-700">
                  <CardContent className="p-4 flex flex-col items-center">
                    <Calendar className="w-8 h-8 text-purple-500 mb-2" />
                    <Label htmlFor="timeline" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project Duration</Label>
                    <Controller
                      name="timeline"
                      control={control}
                      rules={{ required: 'Timeline is required' }}
                      render={({ field }) => (
                        <div className="w-full">
                          <Slider
                            min={7}
                            max={90}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="text-purple-600"
                          />
                          <span className="text-sm text-purple-600 dark:text-purple-400 mt-2 block text-center">{field.value} days</span>
                        </div>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-lg font-semibold text-purple-700 dark:text-purple-300">Learning  Objectives</Label>
              <Controller
                name="learningObjectives"
                control={control}
                rules={{ required: 'At least one learning objective is required' }}
                render={({ field }) => (
                  <div className="space-y-2">
                    {field.value.map((_, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          placeholder={`Learning Objective ${index + 1}`}
                          value={field.value[index]}
                          onChange={(e) => {
                            const newObjectives = [...field.value]
                            newObjectives[index] = e.target.value
                            field.onChange(newObjectives)
                          }}
                          className="border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 dark:border-purple-700 dark:focus:border-purple-500"
                        />
                        {index === field.value.length - 1 && (
                          <Button
                            type="button"
                            onClick={() => field.onChange([...field.value, ''])}
                            variant="outline"
                            size="icon"
                            className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              />
              {errors.learningObjectives && <p className="text-red-500 text-sm">{errors.learningObjectives.message}</p>}
            </div>
          </motion.div>
        )
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-purple-700 dark:text-purple-300">Project Visibility</Label>
              <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Globe className="w-6 h-6 text-purple-500" />
                  <span className="text-purple-700 dark:text-purple-300">Make project public</span>
                </div>
                <Switch
                  id="isPublic"
                  {...register('isPublic')}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectImage" className="text-lg font-semibold text-purple-700 dark:text-purple-300">Project Image</Label>
              <div className="mt-1 flex items-center justify-center w-full">
                <label htmlFor="projectImage" className="flex flex-col items-center justify-center w-full h-64 border-2 border-purple-300 border-dashed rounded-lg cursor-pointer bg-purple-50 dark:hover:bg-purple-800 dark:bg-purple-900 hover:bg-purple-100 dark:border-purple-600 dark:hover:border-purple-500">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-purple-500 dark:text-purple-400" />
                    <p className="mb-2 text-sm text-purple-700 dark:text-purple-300"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-purple-500 dark:text-purple-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                  <Input
                    id="projectImage"
                    type="file"
                    className="hidden"
                    {...register('projectImage')}
                  />
                </label>
              </div>
            </div>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-8 text-purple-800 dark:text-purple-200"
        >
          Create Your Dream Project
        </motion.h1>
        <Card className="border-2 border-purple-200 dark:border-purple-700 shadow-lg">
          <CardContent className="p-6">
            <Tabs value={currentStep.toString()} onValueChange={(value) => setCurrentStep(parseInt(value))}>
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="0" disabled={currentStep < 0} className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-800 dark:data-[state=active]:text-purple-200">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Concept
                </TabsTrigger>
                <TabsTrigger value="1" disabled={currentStep < 1} className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-800 dark:data-[state=active]:text-purple-200">
                  <Zap className="w-5 h-5 mr-2" />
                  Tech Stack
                </TabsTrigger>
                <TabsTrigger value="2" disabled={currentStep < 2} className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-800 dark:data-[state=active]:text-purple-200">
                  <Users className="w-5 h-5 mr-2" />
                  Team
                </TabsTrigger>
                <TabsTrigger value="3" disabled={currentStep < 3} className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-800 dark:data-[state=active]:text-purple-200">
                  <Target className="w-5 h-5 mr-2" />
                  Launch
                </TabsTrigger>
              </TabsList>
              <form onSubmit={handleSubmit(onSubmit)}>
                <TabsContent value={currentStep.toString()}>
                  {renderStep()}
                </TabsContent>
                <div className="mt-8 flex justify-between">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                      className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                  )}
                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!isValid}
                      className="ml-auto bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!isValid}
                      className="ml-auto bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Launch Project 🚀
                    </Button>
                  )}
                </div>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
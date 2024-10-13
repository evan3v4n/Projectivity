'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { ChevronRight, ChevronLeft, Check, X, Search, Upload, Plus, Users, Clock, Calendar } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"

const categories = [
  "Web Development",
  "Mobile App Development",
  "Data Science",
  "Machine Learning",
  "UI/UX Design",
  "Game Development",
  "Blockchain",
  "IoT",
  "Cybersecurity",
  "Cloud Computing"
]

const categoryTechnologies = {
  "Web Development": ["React", "Angular", "Vue.js", "Node.js", "Express", "Django", "Ruby on Rails"],
  "Mobile App Development": ["React Native", "Flutter", "Swift", "Kotlin", "Xamarin"],
  "Data Science": ["Python", "R", "SQL", "Tableau", "Power BI"],
  "Machine Learning": ["TensorFlow", "PyTorch", "Scikit-learn", "Keras", "NLTK"],
  "UI/UX Design": ["Figma", "Adobe XD", "Sketch", "InVision", "Zeplin"],
  "Game Development": ["Unity", "Unreal Engine", "Godot", "Phaser", "Cocos2d"],
  "Blockchain": ["Solidity", "Ethereum", "Hyperledger", "Corda", "Bitcoin Core"],
  "IoT": ["Arduino", "Raspberry Pi", "MQTT", "Zigbee", "LoRaWAN"],
  "Cybersecurity": ["Wireshark", "Metasploit", "Nmap", "Burp Suite", "Kali Linux"],
  "Cloud Computing": ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes"]
}

const steps = ['Basic Info', 'Technologies', 'Team & Timeline', 'Finalize']

export default function CreateProjectPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [customTech, setCustomTech] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
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

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))

  const filteredTechnologies = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase()
    const categoryTechs = categoryTechnologies[watchedFields.category] || []
    return categoryTechs.filter(tech => tech.toLowerCase().includes(lowercasedTerm))
  }, [searchTerm, watchedFields.category])

  const addCustomTechnology = () => {
    if (customTech && !watchedFields.technologies.includes(customTech)) {
      setValue('technologies', [...watchedFields.technologies, customTech])
      setCustomTech('')
    }
  }

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the invitation
    console.log(`Invitation sent to ${inviteEmail}`)
    setInviteEmail('')
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="title" className="text-base font-semibold text-gray-700 dark:text-gray-300">Project Title</Label>
              <Input
                id="title"
                {...register('title', { required: 'Title is required' })}
                placeholder="Enter project title"
                className="mt-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <Label htmlFor="description" className="text-base font-semibold text-gray-700 dark:text-gray-300">Description</Label>
              <Textarea
                id="description"
                {...register('description', { required: 'Description is required' })}
                placeholder="Describe your project"
                rows={4}
                className="mt-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>
            <div>
              <Label htmlFor="category" className="text-base font-semibold text-gray-700 dark:text-gray-300">Category</Label>
              <Controller
                name="category"
                control={control}
                rules={{ required: 'Category is required' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500">
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
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>
          </motion.div>
        )
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Label htmlFor="technologies" className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              Technologies
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
              <Input
                type="text"
                placeholder="Search technologies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
                            <X
                              className="h-4 w-4 cursor-pointer"
                              onClick={() => field.onChange(field.value.filter(t => t !== tech))}
                            />
                          </Badge>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  <Card className="border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-700 dark:text-gray-300">Suggested Technologies</h3>
                      <div className="flex flex-wrap gap-2">
                        {filteredTechnologies.map((tech) => (
                          <Button
                            key={tech}
                            variant="outline"
                            size="sm"
                            className={`transition-colors ${
                              field.value.includes(tech)
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
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Add custom technology"
                value={customTech}
                onChange={(e) => setCustomTech(e.target.value)}
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
              <Button onClick={addCustomTechnology} variant="outline" size="icon" className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {errors.technologies && <p className="text-red-500 text-sm mt-1">{errors.technologies.message}</p>}
          </motion.div>
        )
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="openPositions" className="text-base font-semibold text-gray-700 dark:text-gray-300">Open Positions</Label>
              <Controller
                name="openPositions"
                control={control}
                rules={{ required: 'Number of open positions is required' }}
                render={({ field }) => (
                  <div className="mt-1">
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="text-purple-600"
                    />
                    <span className="text-sm text-purple-600 dark:text-purple-400 mt-2 block">{field.value} position(s)</span>
                  </div>
                )}
              />
            </div>
            <div>
              <Label htmlFor="timeCommitment" className="text-base font-semibold text-gray-700 dark:text-gray-300">Time Commitment (hours/week)</Label>
              <Controller
                name="timeCommitment"
                control={control}
                rules={{ required: 'Time commitment is required' }}
                render={({ field }) => (
                  <div className="mt-1">
                    <Slider
                      min={1}
                      max={40}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="text-purple-600"
                    />
                    <span className="text-sm text-purple-600 dark:text-purple-400 mt-2 block">{field.value} hours/week</span>
                  </div>
                )}
              />
            </div>
            <div>
              <Label htmlFor="timeline" className="text-base font-semibold text-gray-700 dark:text-gray-300">Project Timeline (days)</Label>
              <Controller
                name="timeline"
                control={control}
                rules={{ required: 'Timeline is required' }}
                render={({ field }) => (
                  <div className="mt-1">
                    <Slider
                      min={7}
                      max={90}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="text-purple-600"
                    />
                    <span className="text-sm text-purple-600 dark:text-purple-400 mt-2 block">{field.value} days</span>
                  </div>
                )}
              />
            </div>
            <div>
              <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">Learning Objectives</Label>
              <Controller
                name="learningObjectives"
                control={control}
                rules={{ required: 'At least one learning objective is required' }}
                render={({ field }) => (
                  <div className="space-y-2 mt-1">
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
                          className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        />
                        
                        {index === field.value.length - 1 && (
                          <Button
                            type="button"
                            onClick={() => field.onChange([...field.value, ''])}
                            variant="outline"
                            size="icon"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              />
              {errors.learningObjectives && <p className="text-red-500 text-sm mt-1">{errors.learningObjectives.message}</p>}
            </div>
          </motion.div>
        )
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <Label htmlFor="isPublic" className="text-base font-semibold text-gray-700 dark:text-gray-300">Make project public</Label>
              <Switch
                id="isPublic"
                {...register('isPublic')}
              />
            </div>
            <div>
              <Label htmlFor="projectImage" className="text-base font-semibold text-gray-700 dark:text-gray-300">Project Image</Label>
              <div className="mt-1 flex items-center justify-center w-full">
                <label htmlFor="projectImage" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-purple-500 dark:text-purple-400" />
                    <p className="mb-2 text-sm text-gray-700 dark:text-gray-300"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
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
            <div className="mt-6">
              <Label htmlFor="inviteEmail" className="text-base font-semibold text-gray-700 dark:text-gray-300">Invite Team Members</Label>
              <form onSubmit={handleInvite} className="mt-2 flex">
                <Input
                  id="inviteEmail"
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-grow border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
                <Button type="submit" className="ml-2 bg-purple-600 hover:bg-purple-700 text-white">
                  Invite
                </Button>
              </form>
            </div>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">Create a New Project</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <Progress value={(currentStep + 1) * 25} className="mb-8" />
            <div className="flex justify-between mb-8">
              {steps.map((step, index) => (
                <div key={step} className={`text-sm ${index <= currentStep ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-gray-500'}`}>
                  {step}
                </div>
              ))}
            </div>
            <Card className="border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)}>
                  {renderStep()}
                  <div className="mt-8 flex justify-between">
                    {currentStep > 0 && (
                      <Button 
                        type="button" 
                        onClick={prevStep}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                      </Button>
                    )}
                    {currentStep < steps.length - 1 ? (
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
                        Create Project
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          <div className="w-full lg:w-1/3">
            <Card className="border-gray-200 dark:border-gray-700 sticky top-4">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">Project Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">Title</h3>
                    <p className="text-gray-900 dark:text-gray-100">
                      {watchedFields.title ? watchedFields.title : 'Not set yet'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">Category</h3>
                    <p className="text-gray-900 dark:text-gray-100">
                      {watchedFields.category ? watchedFields.category : 'Not set yet'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">Technologies</h3>
                    {watchedFields.technologies.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {watchedFields.technologies.map((tech, index) => (
                          <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-900 dark:text-gray-100">Not set yet</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">Team</h3>
                    <div className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                      <Users className="h-5 w-5" />
                      <span>{watchedFields.openPositions} open position(s)</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">Time Commitment</h3>
                    <div className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                      <Clock className="h-5 w-5" />
                      <span>{watchedFields.timeCommitment} hours/week</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">Timeline</h3>
                    <div className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                      <Calendar className="h-5 w-5" />
                      <span>{watchedFields.timeline} days</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
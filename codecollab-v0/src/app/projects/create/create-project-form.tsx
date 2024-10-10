'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import ProjectBasics from './steps/project-basics'
import TechnologiesAndStatus from './steps/technologies-and-status'
import TeamAndPositions from './steps/team-and-positions'
import TimeCommitmentAndTimeline from './steps/time-commitment-and-timeline'
import LearningObjectives from './steps/learning-objectives'
import CommunicationAndTools from './steps/communication-and-tools'
import ReviewAndSubmit from './steps/review-and-submit'
import { Button } from '@/components/ui/button'
import { projectSchema } from './project-schema'
import { createProject } from './actions'

const steps = [
  { id: 'basics', title: 'Project Basics' },
  { id: 'technologies', title: 'Technologies and Status' },
  { id: 'team', title: 'Team and Positions' },
  { id: 'timeline', title: 'Time Commitment and Timeline' },
  { id: 'objectives', title: 'Learning Objectives' },
  { id: 'communication', title: 'Communication and Tools' },
  { id: 'review', title: 'Review and Submit' },
]

export default function CreateProjectForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      status: 'Not Started',
      technologies: [],
      owner: '',
      teamSize: 1,
      openRoles: [],
      timeCommitment: '',
      startDate: '',
      endDate: '',
      learningObjectives: [],
      skillLevel: '',
      communicationPreferences: [],
      collaborationTools: [],
    },
  })

  const { handleSubmit, trigger, formState: { errors } } = form

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isValid = await trigger(fieldsToValidate)
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    } else {
      console.error('Form validation failed:', errors)
    }
  }

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  const onSubmit = async (data: z.infer<typeof projectSchema>) => {
    setIsSubmitting(true)
    try {
      await createProject(data)
      // Handle successful submission (e.g., show success message, redirect)
    } catch (error) {
      console.error('Project creation failed:', error)
      // Handle error (e.g., show error message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFieldsForStep = (step: number): (keyof z.infer<typeof projectSchema>)[] => {
    switch (step) {
      case 0:
        return ['title', 'description', 'category', 'owner', 'skillLevel']
      case 1:
        return ['technologies', 'status']
      case 2:
        return ['teamSize', 'openRoles']
      case 3:
        return ['timeCommitment', 'startDate', 'endDate']
      case 4:
        return ['learningObjectives']
      case 5:
        return ['communicationPreferences', 'collaborationTools']
      default:
        return []
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {index + 1}
              </div>
              <span className="text-sm mt-2">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2" />
          <motion.div
            className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 0 && <ProjectBasics form={form} />}
            {currentStep === 1 && <TechnologiesAndStatus form={form} />}
            {currentStep === 2 && <TeamAndPositions form={form} />}
            {currentStep === 3 && <TimeCommitmentAndTimeline form={form} />}
            {currentStep === 4 && <LearningObjectives form={form} />}
            {currentStep === 5 && <CommunicationAndTools form={form} />}
            {currentStep === 6 && <ReviewAndSubmit form={form} />}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-between">
          {currentStep > 0 && (
            <Button type="button" variant="outline" onClick={prevStep}>
              Previous
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button type="button" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Project
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
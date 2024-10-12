'use client'

import { motion } from 'framer-motion'
import { UseFormReturn } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type ReviewAndSubmitProps = {
  form: UseFormReturn<any>
}

export default function ReviewAndSubmit({ form }: ReviewAndSubmitProps) {
  const { watch } = form
  const formData = watch()

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Project Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Title</h3>
              <p>{formData.title}</p>
            </div>
            <div>
              <h3 className="font-semibold">Description</h3>
              <p>{formData.description}</p>
            </div>
            <div>
              <h3 className="font-semibold">Category</h3>
              <p>{formData.category}</p>
            </div>
            <div>
              <h3 className="font-semibold">Status</h3>
              <p>{formData.status}</p>
            </div>
            <div>
              <h3 className="font-semibold">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech: string) => (
                  <Badge key={tech} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Team Members</h3>
              <ul className="list-disc list-inside">
                {formData.teamMembers.map((member: { name: string; role: string }, index: number) => (
                  <li key={index}>{member.name} - {member.role}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Open Positions</h3>
              <p>{formData.openPositions}</p>
            </div>
            <div>
              <h3 className="font-semibold">Time Commitment</h3>
              <p>{formData.timeCommitment}</p>
            </div>
            <div>
              <h3 className="font-semibold">Timeline</h3>
              <p>{formData.timeline}</p>
            </div>
            <div>
              <h3 className="font-semibold">Learning Objectives</h3>
              <div className="flex flex-wrap gap-2">
                {formData.learningObjectives.map((objective: string) => (
                  <Badge key={objective} variant="secondary">{objective}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
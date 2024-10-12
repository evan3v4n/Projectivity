'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

type LearningObjectivesProps = {
  form: UseFormReturn<any>
}

export default function LearningObjectives({ form }: LearningObjectivesProps) {
  const { control, watch, setValue } = form
  const [newObjective, setNewObjective] = useState('')

  const learningObjectives = watch('learningObjectives')

  const addObjective = () => {
    if (newObjective && !learningObjectives.includes(newObjective)) {
      setValue('learningObjectives', [...learningObjectives, newObjective])
      setNewObjective('')
    }
  }

  const removeObjective = (objective: string) => {
    setValue('learningObjectives', learningObjectives.filter((o: string) => o !== objective))
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <FormField
          control={control}
          name="learningObjectives"
          render={() => (
            <FormItem>
              <FormLabel>Learning Objectives</FormLabel>
              <FormControl>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a learning objective"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addObjective()}
                  />
                  <Button type="button" onClick={addObjective}>Add</Button>
                </div>
              </FormControl>
              <div className="flex flex-wrap gap-2 mt-2">
                {learningObjectives.map((objective: string) => (
                  <Badge key={objective} variant="secondary" className="flex items-center gap-1">
                    {objective}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeObjective(objective)} />
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>
    </div>
  )
}
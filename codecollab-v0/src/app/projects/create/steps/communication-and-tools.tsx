'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

type CommunicationAndToolsProps = {
  form: UseFormReturn<any>
}

export default function CommunicationAndTools({ form }: CommunicationAndToolsProps) {
  const { control, watch, setValue } = form
  const [newPreference, setNewPreference] = useState('')
  const [newTool, setNewTool] = useState('')

  const communicationPreferences = watch('communicationPreferences')
  const collaborationTools = watch('collaborationTools')

  const addPreference = () => {
    if (newPreference && !communicationPreferences.includes(newPreference)) {
      setValue('communicationPreferences', [...communicationPreferences, newPreference])
      setNewPreference('')
    }
  }

  const removePreference = (preference: string) => {
    setValue('communicationPreferences', communicationPreferences.filter((p: string) => p !== preference))
  }

  const addTool = () => {
    if (newTool && !collaborationTools.includes(newTool)) {
      setValue('collaborationTools', [...collaborationTools, newTool])
      setNewTool('')
    }
  }

  const removeTool = (tool: string) => {
    setValue('collaborationTools', collaborationTools.filter((t: string) => t !== tool))
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
          name="communicationPreferences"
          render={() => (
            <FormItem>
              <FormLabel>Communication Preferences</FormLabel>
              <FormControl>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a communication preference"
                    value={newPreference}
                    onChange={(e) => setNewPreference(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addPreference()}
                  />
                  <Button type="button" onClick={addPreference}>Add</Button>
                </div>
              </FormControl>
              <div className="flex flex-wrap gap-2 mt-2">
                {communicationPreferences.map((preference: string) => (
                  <Badge key={preference} variant="secondary" className="flex items-center gap-1">
                    {preference}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removePreference(preference)} />
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <FormField
          control={control}
          name="collaborationTools"
          render={() => (
            <FormItem>
              <FormLabel>Collaboration Tools</FormLabel>
              <FormControl>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a collaboration tool"
                    value={newTool}
                    onChange={(e) => setNewTool(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTool()}
                  />
                  <Button type="button" onClick={addTool}>Add</Button>
                </div>
              </FormControl>
              <div className="flex flex-wrap gap-2 mt-2">
                {collaborationTools.map((tool: string) => (
                  <Badge key={tool} variant="secondary" className="flex items-center gap-1">
                    {tool}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTool(tool)} />
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
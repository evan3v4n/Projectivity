'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

type TechnologiesAndStatusProps = {
  form: UseFormReturn<any>
}

export default function TechnologiesAndStatus({ form }: TechnologiesAndStatusProps) {
  const { control, watch, setValue } = form
  const [newTech, setNewTech] = useState('')

  const technologies = watch('technologies')

  const addTechnology = () => {
    if (newTech && !technologies.includes(newTech)) {
      setValue('technologies', [...technologies, newTech])
      setNewTech('')
    }
  }

  const removeTechnology = (tech: string) => {
    setValue('technologies', technologies.filter((t: string) => t !== tech))
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
          name="technologies"
          render={() => (
            <FormItem>
              <FormLabel>Technologies</FormLabel>
              <FormControl>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a technology"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                  />
                  <Button type="button" onClick={addTechnology}>Add</Button>
                </div>
              </FormControl>
              <div className="flex flex-wrap gap-2 mt-2">
                {technologies.map((tech: string) => (
                  <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                    {tech}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTechnology(tech)} />
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>
    </div>
  )
}
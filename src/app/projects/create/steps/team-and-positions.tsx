'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

type TeamAndPositionsProps = {
  form: UseFormReturn<any>
}

export default function TeamAndPositions({ form }: TeamAndPositionsProps) {
  const { control, watch, setValue } = form
  const [newRole, setNewRole] = useState('')

  const openRoles = watch('openRoles')

  const addRole = () => {
    if (newRole && !openRoles.includes(newRole)) {
      setValue('openRoles', [...openRoles, newRole])
      setNewRole('')
    }
  }

  const removeRole = (role: string) => {
    setValue('openRoles', openRoles.filter((r: string) => r !== role))
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
          name="teamSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Size</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
              </FormControl>
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
          name="openRoles"
          render={() => (
            <FormItem>
              <FormLabel>Open Roles</FormLabel>
              <FormControl>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add an open role"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addRole()}
                  />
                  <Button type="button" onClick={addRole}>Add</Button>
                </div>
              </FormControl>
              <div className="flex flex-wrap gap-2 mt-2">
                {openRoles.map((role: string) => (
                  <Badge key={role} variant="secondary" className="flex items-center gap-1">
                    {role}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeRole(role)} />
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
'use server'

import { revalidatePath } from 'next/cache'
import { projectSchema } from './project-schema'
import { z } from 'zod';

export async function createProject(data: z.infer<typeof projectSchema>) {
  const validatedData = projectSchema.parse(data)
  
  // Here you would typically save the project to your database
  // For this example, we'll just log the data
  console.log('Creating project:', validatedData)

  // Revalidate the projects page to show the new project
  revalidatePath('/projects')

  return { success: true }
}
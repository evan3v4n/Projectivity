import * as z from 'zod'

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be 1000 characters or less'),
  category: z.string().min(1, 'Category is required'),
  status: z.string().min(1, 'Status is required'),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  owner: z.string().min(1, 'Owner is required'),
  teamSize: z.number().min(1, 'Team size must be at least 1'),
  openRoles: z.array(z.string()).min(1, 'At least one open role is required'),
  timeCommitment: z.string().min(1, 'Time commitment is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  learningObjectives: z.array(z.string()).min(1, 'At least one learning objective is required'),
  skillLevel: z.string().min(1, 'Skill level is required'),
  communicationPreferences: z.array(z.string()).min(1, 'At least one communication preference is required'),
  collaborationTools: z.array(z.string()).min(1, 'At least one collaboration tool is required'),
})
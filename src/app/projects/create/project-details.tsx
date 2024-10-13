
import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function ProjectDetails() {
  const { register, formState: { errors } } = useFormContext()

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="openPositions">Open Positions</Label>
        <Input
          id="openPositions"
          type="number"
          {...register('openPositions', { required: 'Open positions is required', min: 1 })}
          placeholder="Number of open positions"
          className="mt-1"
        />
        {errors.openPositions && <p className="text-red-500 text-sm mt-1">{errors.openPositions.message}</p>}
      </div>
      <div>
        <Label htmlFor="timeCommitment">Time Commitment</Label>
        <Input
          id="timeCommitment"
          {...register('timeCommitment', { required: 'Time commitment is required' })}
          placeholder="e.g., 10 hours per week"
          className="mt-1"
        />
        {errors.timeCommitment && <p className="text-red-500 text-sm mt-1">{errors.timeCommitment.message}</p>}
      </div>
      <div>
        <Label htmlFor="timeline">Project Timeline</Label>
        <Input
          id="timeline"
          {...register('timeline', { required: 'Timeline is required' })}
          placeholder="e.g., 3 months"
          className="mt-1"
        />
        {errors.timeline && <p className="text-red-500 text-sm mt-1">{errors.timeline.message}</p>}
      </div>
      <div>
        <Label htmlFor="learningObjectives">Learning Objectives</Label>
        <Textarea
          id="learningObjectives"
          {...register('learningObjectives', { required: 'Learning objectives are required' })}
          placeholder="What will team members learn from this project?"
          className="mt-1"
          rows={4}
        />
        {errors.learningObjectives && <p className="text-red-500 text-sm mt-1">{errors.learningObjectives.message}</p>}
      </div>
    </div>
  )
}
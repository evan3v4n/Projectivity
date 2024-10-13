import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Select from 'react-select'
import { Tooltip } from 'react-tooltip'

export default function ProjectBasics() {
  const { register, formState: { errors } } = useFormContext()

  const categoryOptions = [
    { value: 'web', label: 'Web Development' },
    { value: 'mobile', label: 'Mobile App' },
    { value: 'data', label: 'Data Science' },
    { value: 'ai', label: 'Artificial Intelligence' },
    { value: 'other', label: 'Other' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title">Project Title</Label>
        <Input
          id="title"
          {...register('title', { required: 'Title is required' })}
          placeholder="Enter your project title"
          className="mt-1"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message as string}</p>}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description', { required: 'Description is required' })}
          placeholder="Describe your project"
          className="mt-1"
          rows={4}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message as string}</p>}
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          id="category"
          options={categoryOptions}
          placeholder="Select a category"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="technologies">Technologies</Label>
        <Select
          id="technologies"
          isMulti
          options={[
            { value: 'react', label: 'React' },
            { value: 'node', label: 'Node.js' },
            { value: 'python', label: 'Python' },
            { value: 'java', label: 'Java' },
            { value: 'csharp', label: 'C#' },
          ]}
          placeholder="Select technologies"
          className="mt-1"
        />
      </div>
      <Tooltip id="tech-tooltip" />
      <p className="text-sm text-gray-500 mt-2">
        Select the main technologies you'll be using in this project.
        <span
          data-tooltip-id="tech-tooltip"
          data-tooltip-content="Choose technologies that best represent your project's tech stack."
          className="ml-1 cursor-help underline"
        >
          (?
        </span>
      </p>
    </div>
  )
}

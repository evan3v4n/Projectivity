import { useFormContext } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export default function ProjectSubmit() {
  const { register } = useFormContext()
  const [imagePreview, setImagePreview] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="projectImage">Project Image</Label>
        <Input
          id="projectImage"
          type="file"
          accept="image/*"
          {...register('projectImage')}
          onChange={handleImageChange}
          className="mt-1"
        />
        {imagePreview && (
          <div className="mt-4">
            <img src={imagePreview} alt="Project preview" className="max-w-full h-auto rounded-lg" />
          </div>
        )}
      </div>
      <div>
        <Label htmlFor="inviteEmails">Invite Team Members (Optional)</Label>
        <Input
          id="inviteEmails"
          type="text"
          placeholder="Enter email addresses separated by commas"
          className="mt-1"
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Review your project details and make any final adjustments before submitting.
      </p>
    </div>
  )
}
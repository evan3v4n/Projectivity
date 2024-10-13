import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProjectPreview() {
  const { watch } = useFormContext()
  const formData = watch()

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-purple-100 dark:bg-purple-900">
        <CardTitle className="text-2xl font-bold text-purple-800 dark:text-purple-200">{formData.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">{formData.description}</p>
          <div>
            <h3 className="font-semibold text-purple-600 dark:text-purple-300">Category:</h3>
            <p>{formData.category?.label}</p>
          </div>
          <div>
            <h3 className="font-semibold text-purple-600 dark:text-purple-300">Technologies:</h3>
            <div className="flex flex-wrap gap-2">
              {formData.technologies?.map((tech) => (
                <span key={tech.value} className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full text-sm">
                  {tech.label}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-purple-600 dark:text-purple-300">Open Positions:</h3>
            <p>{formData.openPositions}</p>
          </div>
          <div>
            <h3 className="font-semibold text-purple-600 dark:text-purple-300">Time Commitment:</h3>
            <p>{formData.timeCommitment}</p>
          </div>
          <div>
            <h3 className="font-semibold text-purple-600 dark:text-purple-300">Project Timeline:</h3>
            <p>{formData.timeline}</p>
          </div>
          <div>
            <h3 className="font-semibold text-purple-600 dark:text-purple-300">Learning Objectives:</h3>
            <p>{formData.learningObjectives}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
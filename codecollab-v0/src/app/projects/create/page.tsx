import CreateProjectForm from './create-project-form'; // Ensure the path is correct

export default function CreateProjectPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Create New Project</h1>
      <CreateProjectForm />
    </div>
  )
}
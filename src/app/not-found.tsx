import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Puzzle, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-indigo-500">
      <div className="text-center px-4 sm:px-6 lg:px-8">
        <Puzzle className="mx-auto h-24 w-24 text-white animate-spin-slow" />
        <h1 className="mt-6 text-3xl font-extrabold text-white sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 text-lg text-purple-100">
          Oops! It seems this project doesn't exist... yet.
        </p>
        <p className="mt-2 text-base text-purple-100">
          Why not start a new one or join an existing project?
        </p>
        <div className="mt-10 flex justify-center space-x-4">
          <Button asChild variant="secondary">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild>
            <Link href="/projects/explore">
              <Search className="mr-2 h-4 w-4" />
              Explore Projects
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
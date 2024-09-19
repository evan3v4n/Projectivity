import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GithubIcon, BookOpenIcon, UsersIcon, CodeIcon } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Learn, Collaborate, Create with Whiteboard
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Empower your STEM journey through project-based learning and collaboration.
                </p>
              </div>
              <div className="space-x-4">
                <Button>Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 items-center">
              <div className="flex flex-col justify-center space-y-8 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Key Features</h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 mx-auto">
                    Discover how Whiteboard enhances your learning experience
                  </p>
                </div>
                <div className="w-full max-w-full space-y-4 mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                      <GithubIcon className="h-10 w-10 text-primary" />
                      <h3 className="text-xl font-bold">Project Analysis</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Analyze GitHub repositories to understand project structure and technologies.
                      </p>
                    </div>
                    <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                      <UsersIcon className="h-10 w-10 text-primary" />
                      <h3 className="text-xl font-bold">Collaboration Hub</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Connect with peers and work on exciting projects together.
                      </p>
                    </div>
                    <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                      <BookOpenIcon className="h-10 w-10 text-primary" />
                      <h3 className="text-xl font-bold">Learning Paths</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Personalized learning journeys based on your projects and goals.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Join Whiteboard Today</h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Start your journey in project-based learning and collaboration.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input className="max-w-lg flex-1" placeholder="Enter your email" type="email" />
                  <Button type="submit">Sign Up</Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  By signing up, you agree to our{" "}
                  <Link className="underline underline-offset-2" href="#">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 Whiteboard. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

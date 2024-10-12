import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {CodeIcon, FileIcon } from "lucide-react"
import Link from "next/link"

export default function ProjectAnalysis() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <CodeIcon className="h-6 w-6" />
          <span className="sr-only">CodeCollab</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Dashboard
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Projects
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Collaborate
          </Link>
          <Button size="sm" variant="ghost">
            <img
              alt="Avatar"
              className="rounded-full"
              height="32"
              src="/placeholder-user.jpg"
              style={{
                aspectRatio: "32/32",
                objectFit: "cover",
              }}
              width="32"
            />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </nav>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-4 md:gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Project Analysis</h1>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Analyze GitHub Repository</CardTitle>
              <CardDescription>Enter a GitHub repository URL to analyze its structure and technologies</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4">
                <Input placeholder="https://github.com/username/repository" />
                <Button>Analyze Repository</Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>Project: Example Repository</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="tech-stack">Tech Stack</TabsTrigger>
                  <TabsTrigger value="components">Components</TabsTrigger>
                  <TabsTrigger value="learning-path">Learning Path</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                          <CardTitle className="text-sm font-medium">Total Files</CardTitle>
                          <FileIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">156</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                          <CardTitle className="text-sm font-medium">Main Language</CardTitle>
                          <CodeIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">JavaScript</div>
                        </CardContent>
                      </Card>
                    </div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Project Description</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>
                          This project is a web application built with React and Node.js. It includes features such as
                          user authentication, data visualization, and API integration.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="tech-stack">
                  <Card>
                    <CardHeader>
                      <CardTitle>Technology Stack</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="grid gap-2">
                        <li className="flex items-center gap-2">
                          <CodeIcon className="w-4 h-4" />
                          React.js
                        </li>
                        <li className="flex items-center gap-2">
                          <CodeIcon className="w-4 h-4" />
                          Node.js
                        </li>
                        <li className="flex items-center gap-2">
                          <CodeIcon className="w-4 h-4" />
                          Express.js
                        </li>
                        <li className="flex items-center gap-2">
                          <CodeIcon className="w-4 h-4" />
                          MongoDB
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="components">
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Components</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="grid gap-2">
                        <li>User Authentication System</li>
                        <li>Dashboard Component</li>
                        <li>Data Visualization Charts</li>
                        <li>API Integration Layer</li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="learning-path">
                  <Card>
                    <CardHeader>
                      <CardTitle>Suggested Learning Path</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="grid gap-2 list-decimal list-inside">
                        <li>Introduction to React.js</li>
                        <li>Node.js Fundamentals</li>
                        <li>Express.js for Backend Development</li>
                        <li>MongoDB and Database Design</li>
                        <li>Advanced React Patterns</li>
                        <li>API Design and Integration</li>
                      </ol>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

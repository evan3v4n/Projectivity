"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpenIcon, GithubIcon, UsersIcon, Briefcase, PlusCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">Welcome back, John</h1>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <PlusCircle className="mr-2 h-4 w-4" /> New Project
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <Briefcase className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Active Collaborations</CardTitle>
                <UsersIcon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">+1 from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
                <BookOpenIcon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <Progress value={68} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">+5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">GitHub Commits</CardTitle>
                <GithubIcon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">132</div>
                <p className="text-xs text-muted-foreground">+28 from last week</p>
              </CardContent>
            </Card>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="learning">Learning</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {[
                        { name: "E-commerce Platform", updatedAt: "2 days ago", progress: 75 },
                        { name: "Blog API", updatedAt: "1 week ago", progress: 40 },
                        { name: "Mobile Game", updatedAt: "3 days ago", progress: 90 },
                      ].map((project, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={`/project-${index + 1}.png`} alt={project.name} />
                            <AvatarFallback>{project.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{project.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Last updated {project.updatedAt}
                            </p>
                          </div>
                          <div className="ml-auto font-medium">{project.progress}%</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Upcoming Deadlines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {[
                        { name: "Project Proposal", date: "2023-07-15" },
                        { name: "Code Review", date: "2023-07-20" },
                        { name: "Team Presentation", date: "2023-07-25" },
                      ].map((deadline, index) => (
                        <div key={index} className="flex items-center">
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{deadline.name}</p>
                            <p className="text-sm text-muted-foreground">{deadline.date}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>Your Projects</CardTitle>
                  <CardDescription>A list of your current projects and their status.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {[
                      { name: "E-commerce Platform", status: "In Progress", team: 4 },
                      { name: "Blog API", status: "Planning", team: 2 },
                      { name: "Mobile Game", status: "Testing", team: 3 },
                      { name: "Data Visualization Tool", status: "Completed", team: 5 },
                    ].map((project, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={`/project-${index + 1}.png`} alt={project.name} />
                          <AvatarFallback>{project.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{project.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {project.status} • {project.team} team members
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="learning">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Progress</CardTitle>
                  <CardDescription>Track your learning journey and skills development.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {[
                      { name: "React", progress: 80 },
                      { name: "Node.js", progress: 65 },
                      { name: "TypeScript", progress: 50 },
                      { name: "GraphQL", progress: 30 },
                    ].map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{skill.name}</div>
                          <div className="text-sm text-muted-foreground">{skill.progress}%</div>
                        </div>
                        <Progress value={skill.progress} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analysis">
              <Card>
                <CardHeader>
                  <CardTitle>Project Analysis</CardTitle>
                  <CardDescription>Analyze a GitHub repository to understand its structure and technologies.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="repo-url" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        GitHub Repository URL
                      </label>
                      <Input id="repo-url" placeholder="https://github.com/username/repository" />
                    </div>
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                      <GithubIcon className="mr-2 h-4 w-4" /> Analyze Repository
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
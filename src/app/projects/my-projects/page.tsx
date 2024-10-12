'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PlusCircle, Search, Filter, MoreVertical, Edit, Trash, Share, Clock, Users, GitBranch, MessageSquare, Trello, Github } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data for projects
const mockProjects = [
  { 
    id: 1, 
    title: "AI Chatbot", 
    description: "A machine learning powered chatbot", 
    status: "In Progress", 
    progress: 65,
    techStack: ["Python", "TensorFlow", "NLP"],
    teamMembers: [
      { name: "Alice", avatar: "/avatars/alice.jpg" },
      { name: "Bob", avatar: "/avatars/bob.jpg" },
      { name: "Charlie", avatar: "/avatars/charlie.jpg" },
    ],
    lastUpdated: "2023-07-10",
    totalTasks: 20,
    completedTasks: 13,
    type: 'Web Application'
  },
  { 
    id: 2, 
    title: "IoT Smart Home", 
    description: "Home automation using IoT devices", 
    status: "Completed", 
    progress: 100,
    techStack: ["Raspberry Pi", "Node.js", "MQTT"],
    teamMembers: [
      { name: "David", avatar: "/avatars/david.jpg" },
      { name: "Eve", avatar: "/avatars/eve.jpg" },
    ],
    lastUpdated: "2023-07-08",
    totalTasks: 15,
    completedTasks: 15,
    type: 'Desktop Application',
  },
  { 
    id: 3, 
    title: "Blockchain Voting System", 
    description: "Secure voting system using blockchain", 
    status: "Planning", 
    progress: 20,
    techStack: ["Solidity", "Ethereum", "Web3.js"],
    teamMembers: [
      { name: "Frank", avatar: "/avatars/frank.jpg" },
      { name: "Grace", avatar: "/avatars/grace.jpg" },
      { name: "Henry", avatar: "/avatars/henry.jpg" },
      { name: "Ivy", avatar: "/avatars/ivy.jpg" },
    ],
    lastUpdated: "2023-07-12",
    totalTasks: 25,
    completedTasks: 5,
    type: 'Web Application',
  },
]

const categories = ["Web Development", "Mobile Development", "Data Science"]
const statuses = ["In Progress", "Completed", "Planning"]

export default function MyProjects() {
  const [projects, setProjects] = useState(mockProjects)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("lastUpdated")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [page, setPage] = useState(1)
  const projectsPerPage = 6

  useEffect(() => {
    // Simulating data fetching
    const fetchProjects = async () => {
      // In a real application, you would fetch data from an API here
      setProjects(mockProjects)
    }
    fetchProjects()
  }, [])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setPage(1)
  }

  const handleSort = (value: string) => {
    setSortBy(value)
    const sortedProjects = [...projects].sort((a, b) => {
      if (value === "title") return a.title.localeCompare(b.title)
      if (value === "status") return a.status.localeCompare(b.status)
      if (value === "lastUpdated") return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      return 0
    })
    setProjects(sortedProjects)
  }

  const filteredProjects = projects.filter(project =>
    (project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (selectedCategory === "all" || project.type === selectedCategory) &&
    (selectedStatus === "all" || project.status === selectedStatus)
  )

  const paginatedProjects = filteredProjects.slice((page - 1) * projectsPerPage, page * projectsPerPage)

  const totalProjects = projects.length
  const activeProjects = projects.filter(p => p.status === "In Progress").length
  const completedProjects = projects.filter(p => p.status === "Completed").length

  const mostUsedSkills = projects
    .flatMap(p => p.techStack)
    .reduce((acc, skill) => {
      acc[skill] = (acc[skill] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  const topSkills = Object.entries(mostUsedSkills)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([skill]) => skill)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">My Projects</h1>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> Create Project
        </Button>
      </div>

      <div className="grid gap-6 mb-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topSkills.join(", ")}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search projects"
            value={searchTerm}
            onChange={handleSearch}
            className="pl-8"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Select onValueChange={handleSort} value={sortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="lastUpdated">Last Updated</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedCategory} value={selectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedStatus} value={selectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {paginatedProjects.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No projects</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
          <div className="mt-6">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Project
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedProjects.map(project => (
            <Card key={project.id} className="flex flex-col hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className="truncate text-gray-800 dark:text-gray-100 leading-relaxed py-1">{project.title}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share className="mr-2 h-4 w-4" /> Share
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                <div className="flex justify-between items-center mb-2">
                  <Badge 
                    variant={project.status === "Completed" ? "secondary" : project.status === "In Progress" ? "default" : "outline"}
                    className={project.status === "In Progress" ? "bg-purple-100 text-purple-700" : ""}
                  >
                    {project.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    <Clock className="inline mr-1 h-4 w-4" />
                    {project.lastUpdated}
                  </span>
                </div>
                <Progress 
                  value={project.progress} 
                  className="mb-2" 
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-4">
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, index) => (
                    <Badge key={index} variant="secondary">{tech}</Badge>
                  ))}
                </div>
                <div className="flex justify-between items-center w-full">
                  <div className="flex -space-x-2">
                    {project.teamMembers.slice(0, 3).map((member, index) => (
                      <TooltipProvider key={index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Avatar className="border-2 border-background">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name[0]}</AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{member.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                    {project.teamMembers.length > 3 && (
                      <Avatar className="border-2 border-background">
                        <AvatarFallback>+{project.teamMembers.length - 3}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{project.teamMembers.length}</span>
                    <GitBranch className="h-4 w-4 ml-2" />
                    <span>{project.completedTasks}/{project.totalTasks}</span>
                  </div>
                </div>
                <div className="flex justify-between w-full">
                  <Button variant="outline" size="sm">
                    <Trello className="mr-2 h-4 w-4" /> Kanban
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" /> Chat
                  </Button>
                  <Button variant="outline" size="sm">
                    <Github className="mr-2 h-4 w-4" /> Repo
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center space-x-2">
        <Button
          variant="outline"
          onClick={() => setPage(prevPage => Math.max(prevPage - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => setPage(prevPage => prevPage + 1)}
          disabled={page * projectsPerPage >= filteredProjects.length}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
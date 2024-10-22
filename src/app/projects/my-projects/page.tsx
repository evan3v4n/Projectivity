'use client'

import React, { useState, useMemo } from 'react'
import { useQuery, gql } from '@apollo/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PlusCircle, Search, MoreVertical, Edit, Trash, Share, Clock, Users, GitBranch, MessageSquare, Trello, Github } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PROJECT_CATEGORIES, PROJECT_STATUSES} from '@/constants/project'
import { useAuth } from '@/contexts/AuthContext'

const categories = [...PROJECT_CATEGORIES]
const statuses = [...PROJECT_STATUSES]

// Define the GET_PROJECTS query
const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      title
      description
      category
      status
      technologies
      openPositions
      timeCommitment
      learningObjectives
      popularity
      timeline
      createdAt
      updatedAt
      owner {
        id
        username
      }
      teamMembers {
        id
        user {
          id
          username
        }
        role
      }
    }
  }
`;

export default function MyProjects() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("lastUpdated")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [page, setPage] = useState(1)
  const projectsPerPage = 6

  const { user } = useAuth()
  const router = useRouter()

  const { loading, error, data } = useQuery(GET_PROJECTS)

  const myProjects = useMemo(() => {
    if (!data || !user) return []
    return data.projects.filter(project => 
      project.owner.id === user.id || 
      project.teamMembers.some(member => member.user.id === user.id)
    )
  }, [data, user])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const filteredProjects = myProjects.filter(project =>
    (project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.technologies.some((tech: string) => tech.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (selectedCategory === "all" || project.category === selectedCategory) &&
    (selectedStatus === "all" || project.status === selectedStatus)
  )

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title)
    if (sortBy === "status") return a.status.localeCompare(b.status)
    if (sortBy === "lastUpdated") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    return 0
  })

  const paginatedProjects = sortedProjects.slice((page - 1) * projectsPerPage, page * projectsPerPage)

  const totalProjects = myProjects.length
  const activeProjects = myProjects.filter(p => p.status === "In Progress").length
  const completedProjects = myProjects.filter(p => p.status === "Completed").length

  const mostUsedSkills = myProjects
    .flatMap(p => p.technologies)
    .reduce((acc, skill) => {
      acc[skill] = (acc[skill] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  const topSkills = Object.entries(mostUsedSkills)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([skill]) => skill)

  return (
    <div className="container mx-auto px-4 py-20">
      
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
            onChange={setSearchTerm}
            className="pl-8"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Select onValueChange={setSortBy} value={sortBy}>
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

      {myProjects.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No projects yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
          <div className="mt-6">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => router.push('/projects/create')}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Create Project
            </Button>
          </div>
        </div>
      ) : paginatedProjects.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No matching projects</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedProjects.map(project => (
            <Link href={`/projects/${project.id}`} key={project.id} className="cursor-pointer">
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{project.title}</span>
                    <Badge variant={
                      project.status === 'PLANNING' ? 'default' :
                      project.status === 'IN_PROGRESS' ? 'secondary' :
                      'outline'
                    }>{project.status}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech: string) => (
                      <Badge key={tech} variant="outline">{tech}</Badge>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {project.openPositions} open position{project.openPositions !== 1 && 's'}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between mt-auto">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{project.timeCommitment}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{project.teamMembers.length} member{project.teamMembers.length !== 1 && 's'}</span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
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

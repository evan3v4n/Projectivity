'use client'

import { useState, useEffect, useRef, RefObject } from 'react'
import { useQuery } from '@apollo/client'
import Link from 'next/link'
import { GET_PROJECTS } from '@/graphql/queries'
import { Project } from '@/constants/project'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Grid, List, Share, BookmarkPlus, Filter, X, Clock, Users } from 'lucide-react'
import { cn } from "@/lib/utils"
import { PROJECT_CATEGORIES, TECHNOLOGIES } from '@/constants/project'

const categories = [...PROJECT_CATEGORIES]
const skills = [...TECHNOLOGIES]

type Skill = string;

export default function ExploreProjects() {
  const { loading, error, data } = useQuery(GET_PROJECTS);
  const [projects, setProjects] = useState<Project[]>([])
  const [sortedProjects, setSortedProjects] = useState<Project[]>([])
  const [view, setView] = useState('grid')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [timeCommitment, setTimeCommitment] = useState([0, 40])
  const [sortBy, setSortBy] = useState("recent")
  const [openDialog, setOpenDialog] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [projectsPerPage, setProjectsPerPage] = useState(6)
  const [isSkillsOpen, setIsSkillsOpen] = useState(false)
  const skillsRef: RefObject<HTMLDivElement> = useRef(null)

  useEffect(() => {
    if (data && data.projects) {
      setProjects(data.projects);
      setSortedProjects(data.projects); // Initialize sortedProjects with all projects
    }
  }, [data]);

  useEffect(() => {
    const filtered = projects.filter(project =>
      (!selectedCategory || project.category === selectedCategory) &&
      (!selectedStatus || project.status === selectedStatus) &&
      selectedSkills.every(skill => project.technologies.includes(skill)) &&
      parseInt(project.timeCommitment) >= timeCommitment[0] &&
      parseInt(project.timeCommitment) <= timeCommitment[1]
    )

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === 'popular') {
        return b.popularity - a.popularity
      } else {
        return 0
      }
    })

    setSortedProjects(sorted)
    setPage(1)
  }, [projects, selectedCategory, selectedStatus, selectedSkills, timeCommitment, sortBy])

  useEffect(() => {
    console.log("Filtered projects:", sortedProjects);
  }, [sortedProjects]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (skillsRef.current && !skillsRef.current.contains(event.target as Node)) {
        setIsSkillsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const paginatedProjects = sortedProjects.slice((page - 1) * projectsPerPage, page * projectsPerPage)

  const handleSkillSelect = (skill: Skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    )
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
        {/* Filters Sidebar */}
        <aside className={cn(
          "md:w-64 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out",
          isFilterOpen ? "block" : "hidden md:block"
        )}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Filters</h2>
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsFilterOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select onValueChange={(value) => setSelectedCategory(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select onValueChange={(value) => setSelectedStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PLANNING">Planning</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Skills</Label>
              <div className="relative" ref={skillsRef}>
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => setIsSkillsOpen(!isSkillsOpen)}
                >
                  {selectedSkills.length > 0 ? `${selectedSkills.length} selected` : "Select skills"}
                  <Filter className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
                {isSkillsOpen && (
                  <Card className="absolute z-10 w-full mt-2">
                    <CardContent className="p-0">
                      <ScrollArea className="h-[200px]">
                        {skills.map((skill) => (
                          <div
                            key={skill}
                            className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            onClick={() => handleSkillSelect(skill)}
                          >
                            <Checkbox checked={selectedSkills.includes(skill)} />
                            <span>{skill}</span>
                          </div>
                        ))}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Time Commitment (hours/week)</Label>
              <Slider
                min={0}
                max={40}
                step={5}
                value={timeCommitment}
                onValueChange={setTimeCommitment}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{timeCommitment[0]}h</span>
                <span>{timeCommitment[1]}h</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-0">Explore Projects</h1>
            <div className="flex items-center space-x-4">
              <Button className="md:hidden" variant="outline" onClick={() => setIsFilterOpen(true)}>
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Select onValueChange={(value) => setSortBy(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Button
                  variant={view === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setView('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setView('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-6">
            <label htmlFor="projectsPerPage" className="text-sm text-gray-700 dark:text-gray-300">Show:</label>
            <Select
              onValueChange={(value) => setProjectsPerPage(Number(value))}
              value={projectsPerPage.toString()}
            >
              <SelectTrigger className="h-8 w-20 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="9">9</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="15">15</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-700 dark:text-gray-300">per page</span>
          </div>

          <div className={cn(
            "grid gap-6",
            view === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
          )}>
            {paginatedProjects.map((project) => (
              <Link href={`/projects/${project.id}`} key={project.id} className="cursor-pointer">
                <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
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
                  <CardContent className="flex-grow">
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
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
                      <span className="text-sm text-gray-500">{project.teamMembers?.length || 0} member{(project.teamMembers?.length || 0) !== 1 && 's'}</span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>

          {paginatedProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500 dark:text-gray-400">No projects found matching your criteria.</p>
            </div>
          )}

          {paginatedProjects.length > 0 && (
            <div className="mt-8 flex justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page * projectsPerPage >= sortedProjects.length}
              >
                Next
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

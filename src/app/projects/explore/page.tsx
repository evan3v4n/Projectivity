'use client'

import { useState, useEffect, useRef, RefObject } from 'react'
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
import { Grid, List, Share, BookmarkPlus, Filter, X } from 'lucide-react'
import { cn } from "@/lib/utils"
import { validateHeaderValue } from 'http'
import { allTechnologies } from '../../../utils/technologies'

// Add this type definition
type Project = {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  technologies: string[];
  owner: string;
  openPositions: number;
  timeCommitment: string;
  popularity: number;
  teamMembers: { name: string; role: string }[];
  timeline: string;
  learningObjectives: string[];
};

// Mock data for projects
const mockProjects: Project[] = [
  {
    id: 1,
    title: "AI Chatbot",
    description: "Develop an AI-powered chatbot for customer support",
    category: "Artificial Intelligence",
    status: "Recruiting",
    technologies: ["Python", "TensorFlow", "NLP"],
    owner: "Alice Johnson",
    openPositions: 3,
    timeCommitment: "10-15",
    popularity: 95,
    teamMembers: [
      { name: "Alice Johnson", role: "Project Lead" },
      { name: "Bob Smith", role: "AI Engineer" }
    ],
    timeline: "3 months",
    learningObjectives: [
      "Gain hands-on experience with NLP",
      "Learn to deploy ML models in production",
      "Understand chatbot design principles"
    ]
  },
  {
    id: 2,
    title: "Mobile Fitness App",
    description: "Create a cross-platform mobile app for fitness tracking",
    category: "Mobile Development",
    status: "In Progress",
    technologies: ["React Native", "Firebase", "Redux"],
    owner: "Charlie Brown",
    openPositions: 2,
    timeCommitment: "15-20",
    popularity: 88,
    teamMembers: [
      { name: "Charlie Brown", role: "Mobile Developer" },
      { name: "Diana Prince", role: "UI/UX Designer" }
    ],
    timeline: "4 months",
    learningObjectives: [
      "Master React Native development",
      "Learn state management with Redux",
      "Implement real-time data sync with Firebase"
    ]
  },
  {
    id: 3,
    title: "Blockchain Voting System",
    description: "Build a secure voting system using blockchain technology",
    category: "Blockchain",
    status: "Recruiting",
    technologies: ["Solidity", "Ethereum", "Web3.js"],
    owner: "Eva Green",
    openPositions: 4,
    timeCommitment: "20-25",
    popularity: 92,
    teamMembers: [
      { name: "Eva Green", role: "Blockchain Developer" }
    ],
    timeline: "6 months",
    learningObjectives: [
      "Understand blockchain fundamentals",
      "Develop smart contracts with Solidity",
      "Implement decentralized applications (DApps)"
    ]
  },
  {
    id: 4,
    title: "E-commerce Platform",
    description: "Develop a scalable e-commerce platform with microservices",
    category: "Web Development",
    status: "In Progress",
    technologies: ["Node.js", "React", "Docker", "Kubernetes"],
    owner: "Frank Castle",
    openPositions: 1,
    timeCommitment: "25-30",
    popularity: 85,
    teamMembers: [
      { name: "Frank Castle", role: "Full-stack Developer" },
      { name: "Grace Hopper", role: "DevOps Engineer" },
      { name: "Harry Potter", role: "Frontend Developer" }
    ],
    timeline: "5 months",
    learningObjectives: [
      "Build scalable microservices architecture",
      "Implement containerization with Docker",
      "Learn Kubernetes for orchestration"
    ]
  },
  {
    id: 5,
    title: "AR Navigation App",
    description: "Create an augmented reality app for indoor navigation",
    category: "Augmented Reality",
    status: "Completed",
    technologies: ["Unity", "ARKit", "C#"],
    owner: "Iris West",
    openPositions: 0,
    timeCommitment: "15-20",
    popularity: 78,
    teamMembers: [
      { name: "Iris West", role: "AR Developer" },
      { name: "John Doe", role: "3D Modeler" },
      { name: "Kate Bishop", role: "UI/UX Designer" }
    ],
    timeline: "4 months",
    learningObjectives: [
      "Develop AR applications with Unity",
      "Implement indoor positioning algorithms",
      "Create intuitive AR user interfaces"
    ]
  },
  {
    id: 6,
    title: "IoT Smart Home",
    description: "Build an IoT system for home automation and energy management",
    category: "Internet of Things",
    status: "Recruiting",
    technologies: ["Raspberry Pi", "MQTT", "Python", "Node-RED"],
    owner: "Liam Neeson",
    openPositions: 3,
    timeCommitment: "10-15",
    popularity: 90,
    teamMembers: [
      { name: "Liam Neeson", role: "IoT Specialist" }
    ],
    timeline: "3 months",
    learningObjectives: [
      "Learn IoT protocols and communication",
      "Develop with Raspberry Pi and sensors",
      "Implement real-time data processing and visualization"
    ]
  },
  {
    id: 7,
    title: "Data Visualization Dashboard",
    description: "Create an interactive dashboard for big data visualization",
    category: "Data Science",
    status: "In Progress",
    technologies: ["D3.js", "React", "Python", "Apache Spark"],
    owner: "Mia Wallace",
    openPositions: 2,
    timeCommitment: "20-25",
    popularity: 87,
    teamMembers: [
      { name: "Mia Wallace", role: "Data Scientist" },
      { name: "Neil Armstrong", role: "Frontend Developer" }
    ],
    timeline: "4 months",
    learningObjectives: [
      "Master D3.js for data visualization",
      "Learn big data processing with Apache Spark",
      "Develop interactive and responsive dashboards"
    ]
  },
  {
    id: 8,
    title: "Cybersecurity Threat Detection",
    description: "Develop an AI-based system for detecting cybersecurity threats",
    category: "Cybersecurity",
    status: "Recruiting",
    technologies: ["Python", "Machine Learning", "Network Protocols"],
    owner: "Oliver Queen",
    openPositions: 4,
    timeCommitment: "25-30",
    popularity: 94,
    teamMembers: [
      { name: "Oliver Queen", role: "Security Specialist" }
    ],
    timeline: "6 months",
    learningObjectives: [
      "Understand common cybersecurity threats and attacks",
      "Implement machine learning for anomaly detection",
      "Develop real-time monitoring and alert systems"
    ]
  },
  {
    id: 9,
    title: "Virtual Reality Education Platform",
    description: "Create a VR platform for immersive educational experiences",
    category: "Virtual Reality",
    status: "In Progress",
    technologies: ["Unity", "C#", "Oculus SDK"],
    owner: "Peter Parker",
    openPositions: 1,
    timeCommitment: "20-25",
    popularity: 89,
    teamMembers: [
      { name: "Peter Parker", role: "VR Developer" },
      { name: "Quinn Fabray", role: "3D Artist" },
      { name: "Rachel Green", role: "Educational Content Creator" }
    ],
    timeline: "5 months",
    learningObjectives: [
      "Develop immersive VR experiences with Unity",
      "Learn 3D modeling and animation for VR",
      "Implement interactive educational content in VR"
    ]
  },
  {
    id: 10,
    title: "Quantum Computing Simulator",
    description: "Build a quantum computing simulator for educational purposes",
    category: "Quantum Computing",
    status: "Recruiting",
    technologies: ["Python", "NumPy", "Qiskit"],
    owner: "Samantha Carter",
    openPositions: 3,
    timeCommitment: "15-20",
    popularity: 91,
    teamMembers: [
      { name: "Samantha Carter", role: "Quantum Computing Researcher" }
    ],
    timeline: "4 months",
    learningObjectives: [
      "Understand quantum computing principles",
      "Implement quantum algorithms",
      "Develop user-friendly interfaces for quantum simulations"
    ]
  }
];


const categories = [
  "Artificial Intelligence",
  "Blockchain",
  "Web Development",
  "Mobile Development",
  "Data Science",
  "IoT",
  "Cybersecurity",
  "Game Development"
]

const skills = [
  ...allTechnologies
]

// Add this type definition
type Skill = string;

export default function ExploreProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [sortedProjects, setSortedProjects] = useState<Project[]>([])
  const [view, setView] = useState('grid')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [timeCommitment, setTimeCommitment] = useState([0, 40])
  const [sortBy, setSortBy] = useState("recent")
  const [openDialog, setOpenDialog] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [projectsPerPage, setProjectsPerPage] = useState(6)
  const [isSkillsOpen, setIsSkillsOpen] = useState(false)
  const skillsRef: RefObject<HTMLDivElement> = useRef(null)

  useEffect(() => {
    setProjects(mockProjects)
  }, [])

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

  useEffect(() => {
    const filtered = projects.filter(project =>
      (!selectedCategory || project.category === selectedCategory) &&
      (!selectedStatus || project.status === selectedStatus) &&
      selectedSkills.every(skill => project.technologies.includes(skill)) &&
      parseInt(project.timeCommitment.split('-')[0]) >= timeCommitment[0] &&
      parseInt(project.timeCommitment.split('-')[1]) <= timeCommitment[1]
    )

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'recent') {
        return b.id - a.id
      } else if (sortBy === 'popular') {
        return b.popularity - a.popularity
      } else {
        return 0
      }
    })

    setSortedProjects(sorted)
    setPage(1) // Reset to first page when sorting or filtering changes
  }, [projects, selectedCategory, selectedStatus, selectedSkills, timeCommitment, sortBy])

  const paginatedProjects = sortedProjects.slice((page - 1) * projectsPerPage, page * projectsPerPage)

  const handleSkillSelect = (skill: Skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    )
  }

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
              <Select onValueChange={(value) => setSelectedCategory(value as string)}>
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
                  <SelectItem value="Recruiting">Recruiting</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
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
              <Card key={project.id} className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{project.title}</span>
                    <Badge variant={
                      project.status === 'Recruiting' ? 'default' :
                        project.status === 'In Progress' ? 'secondary' :
                          'outline'
                    }>{project.status}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="outline">{tech}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${project.owner}`} />
                      <AvatarFallback>{project.owner[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{project.owner}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {project.openPositions} open position{project.openPositions !== 1 && 's'}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Dialog open={openDialog === project.id} onOpenChange={(isOpen) => setOpenDialog(isOpen ? project.id : null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Learn More</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[800px] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">{project.title}</DialogTitle>
                        <DialogDescription>{project.description}</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Team Members</h4>
                            {project.teamMembers.map((member, index) => (
                              <div key={index} className="flex items-center space-x-2 mb-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${member.name}`} />
                                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-gray-600 dark:text-gray-300">{member.name} - {member.role}</span>
                              </div>
                            ))}
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Project Details</h4>
                            <p className="text-sm mb-1 text-gray-600 dark:text-gray-300">Category: {project.category}</p>
                            <p className="text-sm mb-1 text-gray-600 dark:text-gray-300">Time Commitment: {project.timeCommitment} hours/week</p>
                            <p className="text-sm mb-1 text-gray-600 dark:text-gray-300">Timeline: {project.timeline}</p>
                            <p className="text-sm mb-1 text-gray-600 dark:text-gray-300">Open Positions: {project.openPositions}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Required Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech) => (
                              <Badge key={tech}>{tech}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Learning Objectives</h4>
                          <ul className="list-disc list-inside">
                            {project.learningObjectives.map((objective, index) => (
                              <li key={index} className="text-sm text-gray-600 dark:text-gray-300">{objective}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <DialogFooter>
                        {project.status === 'Recruiting' && (
                          <Button onClick={() => alert('Application submitted!')} className="bg-purple-600 hover:bg-purple-700 text-white">Apply Now</Button>
                        )}
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => alert('Project bookmarked!')}>
                      <BookmarkPlus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => alert('Share link copied!')}>
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
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

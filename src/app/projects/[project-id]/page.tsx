'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Clock, Users, ChevronLeft, Share2, Edit, Trash, Plus, X, Calendar, Search } from 'lucide-react'
import { GET_PROJECT, UPDATE_PROJECT, DELETE_PROJECT, JOIN_PROJECT, REQUEST_TO_JOIN_PROJECT, GET_JOIN_REQUESTS } from '@/graphql/queries'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PROJECT_CATEGORIES } from '@/constants/project';
import {JoinRequestsManager} from '@/components/JoinRequestsManager';



const categories = [...PROJECT_CATEGORIES];
// Add this at the top of your file
const categoryTechnologies = {
  "Web Development": [
    "React", "Angular", "Vue.js", "Node.js", "Express", "Django", "Ruby on Rails",
    "ASP.NET", "TypeScript", "GraphQL", "JavaScript", "PHP", "Ruby"
  ],
  "Mobile App Development": [
    "React Native", "Flutter", "Swift", "Kotlin", "Xamarin", "Java", "Objective-C", "Dart"
  ],
  "Data Science": [
    "Python", "R", "SQL", "Tableau", "Power BI", "Pandas", "NumPy", "Julia"
  ],
  "Machine Learning": [
    "TensorFlow", "PyTorch", "Scikit-learn", "Keras", "Python", "R", "Java"
  ],
  "Game Development": [
    "Unity", "Unreal Engine", "Godot", "C++", "C#", "Lua"
  ],
  "Blockchain": [
    "Solidity", "Ethereum", "Hyperledger", "JavaScript", "Go", "Rust"
  ],
  "IoT": [
    "Arduino", "Raspberry Pi", "MQTT", "Python", "C++", "Java"
  ],
  "Cybersecurity": [
    "Wireshark", "Metasploit", "Nmap", "Kali Linux", "Python", "Bash", "Ruby"
  ],
  "Cloud Computing": [
    "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Python", "Go", "Java"
  ],
  "Systems Programming": [
    "C", "C++", "Rust", "Go", "Assembly"
  ],
  "Functional Programming": [
    "Haskell", "Scala", "Erlang", "F#", "Clojure"
  ]
};

export default function ProjectShowcase() {
  const { 'project-id': projectId } = useParams()
  const { user } = useAuth()
  const router = useRouter()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editedProject, setEditedProject] = useState({
    title: '',
    description: '',
    category: '',
    status: '',
    technologies: [],
    openPositions: 1,
    timeCommitment: 10,
    timeline: 30,
    learningObjectives: [],
  })
  const [customTech, setCustomTech] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [joinRequests, setJoinRequests] = useState([])

  const { loading, error, data, refetch } = useQuery(GET_PROJECT, {
    variables: { id: projectId },
  })

  const hasOpenPositions = useMemo(() => {
    return data?.project?.openPositions > 0
  }, [data])

  const isOwner = useMemo(() => {
    if (data?.project && user) {
      return data.project.owner.id === user.id
    }
    return false
  }, [data, user])

  const isUserMember = useMemo(() => {
    return data?.project?.teamMembers.some(member => member.user.id === user?.id) || false
  }, [data, user])

  const [updateProject] = useMutation(UPDATE_PROJECT, {
    onCompleted: () => {
      refetch()
      setIsEditDialogOpen(false)
      toast({
        title: "Project updated",
        description: "Your project has been successfully updated.",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update project: ${error.message}`,
        variant: "destructive",
      })
    }
  })

  const [deleteProject] = useMutation(DELETE_PROJECT, {
    onCompleted: () => {
      toast({
        title: "Project deleted",
        description: "Your project has been successfully deleted.",
      })
      router.push('/projects')
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete project: ${error.message}`,
        variant: "destructive",
      })
    }
  })

  const [joinProject] = useMutation(REQUEST_TO_JOIN_PROJECT, {
    onCompleted: () => {
      refetch()
      toast({
        title: "Joined project",
        description: "You have successfully joined the project.",
      })
    },
    onError: (error) => {
      console.error("Error joining project:", error)
      toast({
        title: "Error",
        description: `Failed to join project: ${error.message}`,
        variant: "destructive",
      })
    }
  })

  const [requestToJoinProject] = useMutation(REQUEST_TO_JOIN_PROJECT, {
    onCompleted: () => {
      toast({
        title: "Request sent",
        description: "Your request to join the project has been sent.",
      })
      refetch()
    },
    onError: (error) => {
      console.error("Error sending join request:", error)
      toast({
        title: "Error",
        description: `Failed to send join request: ${error.message}`,
        variant: "destructive",
      })
    }
  })

  const { data: joinRequestsData, refetch: refetchJoinRequests } = useQuery(GET_JOIN_REQUESTS, {
    variables: { projectId },
    skip: !isOwner, // Now this is safe to use
  })

  useEffect(() => {
    if (joinRequestsData) {
      setJoinRequests(joinRequestsData.joinRequests)
    }
  }, [joinRequestsData])

  const handleEditClick = useCallback(() => {
    if (data && data.project) {
      setEditedProject({
        title: data.project.title,
        description: data.project.description,
        category: data.project.category,
        status: data.project.status,
        technologies: data.project.technologies,
        openPositions: data.project.openPositions,
        timeCommitment: parseInt(data.project.timeCommitment),
        timeline: parseInt(data.project.timeline),
        learningObjectives: data.project.learningObjectives,
      });
      setIsEditDialogOpen(true);
    }
  }, [data]);

  const handleEditInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProject(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((name: string) => (value: string) => {
    setEditedProject(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleTechnologiesChange = useCallback((tech: string) => {
    setEditedProject(prev => {
      const technologies = prev.technologies || [];
      if (technologies.includes(tech)) {
        return { ...prev, technologies: technologies.filter(t => t !== tech) };
      } else {
        return { ...prev, technologies: [...technologies, tech] };
      }
    });
  }, []);

  const addCustomTechnology = useCallback(() => {
    if (customTech && !editedProject.technologies.includes(customTech)) {
      setEditedProject(prev => ({
        ...prev,
        technologies: [...prev.technologies, customTech]
      }));
      setCustomTech('');
    }
  }, [customTech, editedProject.technologies]);

  const filteredTechnologies = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase()
    const categoryTechs = categoryTechnologies[editedProject.category] || []
    return categoryTechs.filter(tech => tech.toLowerCase().includes(lowercasedTerm))
  }, [searchTerm, editedProject.category])

  const handleEditProject = useCallback(async () => {
    try {
      await updateProject({
        variables: {
          id: projectId,
          input: editedProject
        }
      });
    } catch (error) {
      console.error("Error updating project:", error);
    }
  }, [projectId, editedProject, updateProject]);

  const handleDeleteProject = useCallback(async () => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await deleteProject({
          variables: { id: projectId }
        });
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  }, [projectId, deleteProject]);

  const handleShareProject = useCallback(() => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({
        title: "Link Copied",
        description: "Project link has been copied to clipboard.",
      });
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      });
    });
  }, []);

  const handleJoinOrRequestToJoin = useCallback(async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to join or request to join a project.",
        variant: "destructive",
      })
      return
    }

    try {
      if (hasOpenPositions) {
        await joinProject({
          variables: { projectId }
        })
        toast({
          title: "Success",
          description: "You have joined the project.",
        })
      } else {
        await requestToJoinProject({
          variables: { projectId }
        })
        toast({
          title: "Request sent",
          description: "Your request to join the project has been sent.",
        })
      }
      refetch()
    } catch (error) {
      console.error("Error joining or requesting to join project:", error)
      toast({
        title: "Error",
        description: "Failed to join or request to join the project. Please try again.",
        variant: "destructive",
      })
    }
  }, [user, hasOpenPositions, projectId, joinProject, requestToJoinProject, refetch])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const project = data.project

  return (
    <main className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900">
      <Link href="/projects" className="flex items-center text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 mb-4">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Projects
      </Link>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">{project.title}</h1>
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">{project.category}</Badge>
            <Badge variant="outline" className="border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300">{project.status}</Badge>
          </div>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="technologies">Technologies</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">Project Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">{project.description}</p>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">Learning Objectives</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                    {project.learningObjectives.map((objective: string, index: number) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {project.teamMembers.map((member: any, index: number) => (
                      <div key={index} className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={`https://i.pravatar.cc/150?u=${member.user.username}`} alt={member.user.username} />
                          <AvatarFallback className="bg-purple-200 text-purple-800">{member.user.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{member.user.username}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="technologies">
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">Technology Stack</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200">{tech}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Owner</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{project.owner.username}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Open Positions</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">{project.openPositions}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Time Commitment</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{project.timeCommitment}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Timeline</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{project.timeline}</span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Popularity</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{project.popularity}</span>
                  </div>
                  <Progress 
                    value={project.popularity * 10} 
                    className="w-full bg-gray-200 dark:bg-gray-700 [&>div]:bg-purple-600 [&>div]:dark:bg-purple-400" 
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Users className="mr-1 h-4 w-4" />
                    <span>{project.teamMembers.length} members</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              {isOwner ? (
                <>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" onClick={handleEditClick}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Project
                  </Button>
                  <Button variant="outline" className="w-full border-red-300 text-red-700 hover:bg-red-100 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900" onClick={handleDeleteProject}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Project
                  </Button>
                  {joinRequests.length > 0 && (
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowJoinRequests(true)}>
                      View Join Requests ({joinRequests.length})
                    </Button>
                  )}
                </>
              ) : isUserMember ? (
                <Button disabled className="w-full bg-gray-400 text-white cursor-not-allowed">
                  Already a Member
                </Button>
              ) : hasOpenPositions ? (
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" onClick={handleJoinOrRequestToJoin}>
                  Join Project
                </Button>
              ) : (
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleJoinOrRequestToJoin}>
                  Request to Join
                </Button>
              )}
              <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800" onClick={handleShareProject}>
                <Share2 className="mr-2 h-4 w-4" />
                Share Project
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={editedProject.title}
                onChange={handleEditInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={editedProject.description}
                onChange={handleEditInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                onValueChange={handleSelectChange('category')}
                value={editedProject.category}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                onValueChange={handleSelectChange('status')}
                value={editedProject.status}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  {['PLANNING', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Technologies</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {editedProject.technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="px-2 py-1 bg-purple-100 text-purple-800"
                    >
                      {tech}
                      <X
                        className="ml-1 h-3 w-3 cursor-pointer"
                        onClick={() => handleTechnologiesChange(tech)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search technologies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="max-h-32 overflow-y-auto">
                  {filteredTechnologies.map((tech) => (
                    <Button
                      key={tech}
                      type="button"
                      variant="outline"
                      size="sm"
                      className={`m-1 ${
                        editedProject.technologies.includes(tech)
                          ? 'bg-purple-100 text-purple-800'
                          : ''
                      }`}
                      onClick={() => handleTechnologiesChange(tech)}
                    >
                      {tech}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom technology"
                    value={customTech}
                    onChange={(e) => setCustomTech(e.target.value)}
                  />
                  <Button onClick={addCustomTechnology} type="button">Add</Button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="openPositions" className="text-right">
                Open Positions
              </Label>
              <Input
                id="openPositions"
                name="openPositions"
                type="number"
                value={editedProject.openPositions}
                onChange={handleEditInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="timeCommitment" className="text-right">
                Time Commitment
              </Label>
              <Input
                id="timeCommitment"
                name="timeCommitment"
                type="number"
                value={editedProject.timeCommitment}
                onChange={handleEditInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="timeline" className="text-right">
                Timeline (days)
              </Label>
              <Input
                id="timeline"
                name="timeline"
                type="number"
                value={editedProject.timeline}
                onChange={handleEditInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Learning Objectives</Label>
              <div className="col-span-3 space-y-2">
                {editedProject.learningObjectives.map((objective, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={objective}
                      onChange={(e) => {
                        const newObjectives = [...editedProject.learningObjectives];
                        newObjectives[index] = e.target.value;
                        setEditedProject(prev => ({ ...prev, learningObjectives: newObjectives }));
                      }}
                    />
                    <Button
                      onClick={() => {
                        const newObjectives = editedProject.learningObjectives.filter((_, i) => i !== index);
                        setEditedProject(prev => ({ ...prev, learningObjectives: newObjectives }));
                      }}
                      variant="outline"
                      size="icon"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={() => {
                    setEditedProject(prev => ({
                      ...prev,
                      learningObjectives: [...prev.learningObjectives, '']
                    }));
                  }}
                  type="button"
                  variant="outline"
                >
                  Add Learning Objective
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditProject}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isOwner && (
        <JoinRequestsManager
          projectId={projectId}
          joinRequests={joinRequests}
          refetchJoinRequests={refetchJoinRequests}
        />
      )}
    </main>
  )
}

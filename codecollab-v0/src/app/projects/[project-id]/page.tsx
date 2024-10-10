import Image from 'next/image'
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Clock, Users, ChevronLeft, Share2 } from 'lucide-react'

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

// This would typically come from your API or database
const project: Project = {
  id: 1,
  title: "AI-Powered Smart City Dashboard",
  description: "Develop a comprehensive dashboard for city administrators to monitor and manage various aspects of a smart city, including traffic flow, energy consumption, waste management, and public safety.",
  category: "Web Development",
  status: "In Progress",
  technologies: ["React", "Node.js", "TensorFlow", "MongoDB", "Docker"],
  owner: "Jane Doe",
  openPositions: 3,
  timeCommitment: "10-15 hours/week",
  popularity: 4.7,
  teamMembers: [
    { name: "Jane Doe", role: "Project Lead" },
    { name: "John Smith", role: "Full Stack Developer" },
    { name: "Alice Johnson", role: "UI/UX Designer" },
  ],
  timeline: "3 months",
  learningObjectives: [
    "Gain hands-on experience with React and Node.js in a large-scale application",
    "Learn to integrate machine learning models for predictive analytics",
    "Understand the challenges and solutions in smart city management",
    "Develop skills in data visualization and real-time data processing",
  ],
}

export default function ProjectShowcase() {
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
              <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400">Overview</TabsTrigger>
              <TabsTrigger value="team" className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400">Team</TabsTrigger>
              <TabsTrigger value="resources" className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400">Resources</TabsTrigger>
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
                    {project.learningObjectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">Technology Stack</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200">{tech}</Badge>
                    ))}
                  </div>
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
                    {project.teamMembers.map((member, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={`https://i.pravatar.cc/150?u=${member.name}`} alt={member.name} />
                          <AvatarFallback className="bg-purple-200 text-purple-800">{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{member.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="resources">
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">Learning Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>
                      <Link href="#" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">React Official Documentation</Link>
                    </li>
                    <li>
                      <Link href="#" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">Node.js Crash Course</Link>
                    </li>
                    <li>
                      <Link href="#" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">Introduction to TensorFlow</Link>
                    </li>
                    <li>
                      <Link href="#" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">MongoDB Basics</Link>
                    </li>
                  </ul>
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
                  <span className="font-medium text-gray-900 dark:text-gray-100">{project.owner}</span>
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
                    <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">60%</span>
                  </div>
                  <Progress 
                    value={60} 
                    className="w-full bg-gray-200 dark:bg-gray-700 [&>div]:bg-purple-600 [&>div]:dark:bg-purple-400" 
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    <Star className="text-yellow-400 mr-1" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">{project.popularity}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Users className="mr-1 h-4 w-4" />
                    <span>{project.teamMembers.length} members</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>2 weeks ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Join Project</Button>
              <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                <Share2 className="mr-2 h-4 w-4" />
                Share Project
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Related Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">Smart Traffic Management System</Link>
                </li>
                <li>
                  <Link href="#" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">IoT-based Waste Management</Link>
                </li>
                <li>
                  <Link href="#" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">Urban Energy Optimization Platform</Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
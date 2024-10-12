"use client"

import React, { useState } from 'react'
import { 
  User, 
  MapPin, 
  GithubIcon, 
  Linkedin, 
  Edit, 
  Plus, 
  Users, 
  BookOpen, 
  Settings, 
  Bell
} from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Github } from 'lucide-react'

const ProfileDashboard = () => {
  const [skills, setSkills] = useState([
    { name: 'React', level: 80 },
    { name: 'JavaScript', level: 90 },
    { name: 'Node.js', level: 75 },
    { name: 'Python', level: 70 },
    { name: 'SQL', level: 85 },
  ])

  const [projects, setProjects] = useState([
    { 
      name: 'E-commerce Platform', 
      description: 'A full-stack e-commerce solution', 
      technologies: ['React', 'Node.js', 'MongoDB'],
      role: 'Full Stack Developer',
      featured: true
    },
    { 
      name: 'Weather App', 
      description: 'Real-time weather forecasting application', 
      technologies: ['React Native', 'OpenWeatherMap API'],
      role: 'Frontend Developer',
      featured: false
    },
    { 
      name: 'Task Management System', 
      description: 'Collaborative task management tool', 
      technologies: ['Vue.js', 'Express', 'PostgreSQL'],
      role: 'Backend Developer',
      featured: true
    },
  ])

  const [courses, setCourses] = useState([
    { name: 'Advanced React Patterns', progress: 75 },
    { name: 'Data Structures and Algorithms', progress: 60 },
    { name: 'Machine Learning Fundamentals', progress: 30 },
  ])

  const [activities, setActivities] = useState([
    { type: 'project', description: 'Contributed to E-commerce Platform', date: '2 days ago' },
    { type: 'course', description: 'Completed module in Advanced React Patterns', date: '1 week ago' },
    { type: 'achievement', description: 'Earned "JavaScript Ninja" badge', date: '2 weeks ago' },
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center mb-8">
        <Avatar className="w-24 h-24 md:w-32 md:h-32 mb-4 md:mb-0 md:mr-6">
          <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2">Jane Doe</h1>
          <p className="text-muted-foreground mb-2">Full Stack Developer | AI Enthusiast</p>
          <div className="flex items-center justify-center md:justify-start mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            <span>San Francisco, CA</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="w-9 h-9 p-0">
              <GithubIcon className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="w-9 h-9 p-0">
              <Linkedin className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="mt-4 md:mt-0 md:ml-auto">
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2">
          {/* Skills and Expertise */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Skills and Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              {skills.map((skill, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-sm font-medium">{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="w-full" />
                </div>
              ))}
              <Button variant="outline" className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </CardContent>
          </Card>

          {/* Projects Showcase */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Projects Showcase</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="secondary">{tech}</Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">Role: {project.role}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="link">View Project</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              <Button variant="outline" className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div>
          {/* Quick Actions Panel */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Find Team
                </Button>
                <Button variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  New Course
                </Button>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Learning Progress */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.map((course, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{course.name}</span>
                      <span className="text-sm font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="w-full" />
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-4 w-full">View All Courses</Button>
            </CardContent>
          </Card>

          {/* Collaboration Stats */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Collaboration Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Projects</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">48</p>
                  <p className="text-sm text-muted-foreground">Team Members</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">4.8</p>
                  <p className="text-sm text-muted-foreground">Avg. Rating</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">95%</p>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activity Feed and Settings */}
      <div className="mt-8">
        <Tabs defaultValue="activity">
          <TabsList>
            <TabsTrigger value="activity">Activity Feed</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {activities.map((activity, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-4">
                        {activity.type === 'project' && <Users className="w-5 h-5" />}
                        {activity.type === 'course' && <BookOpen className="w-5 h-5" />}
                        {activity.type === 'achievement' && <Badge className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Email Notifications</span>
                    <Button variant="outline" size="sm">
                      <Bell className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Privacy Controls</span>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Connected Accounts</span>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ProfileDashboard
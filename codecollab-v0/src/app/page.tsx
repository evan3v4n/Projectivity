'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, BookOpen, Users, Kanban, Lightbulb, ChevronRight, Github, Twitter, Linkedin, Moon, Sun } from 'lucide-react'
import HeroIllustration from '@/components/heroIllustration'

const featuredProjects = [
  { name: "EcoTrack", team: "Green Innovators", tech: "React, Node.js, MongoDB" },
  { name: "MindfulAI", team: "Tech for Good", tech: "Python, TensorFlow, Flask" },
  { name: "VirtualClassroom", team: "EdTech Pioneers", tech: "Vue.js, Firebase, WebRTC" },
  { name: "HealthHub", team: "MedTech Solutions", tech: "React Native, GraphQL, AWS" },
  { name: "SmartCity", team: "Urban Planners", tech: "Angular, Spring Boot, PostgreSQL" },
]

const testimonials = [
  {
    name: "Sarah",
    title: "Computer Science Major",
    quote: "Projectivity helped me find an amazing team and build a project that landed me my dream internship!",
    image: "/placeholder.svg?height=80&width=80"
  },
  {
    name: "Michael",
    title: "Design Student",
    quote: "The collaborative tools on Projectivity made working with developers so much easier. I learned a ton!",
    image: "/placeholder.svg?height=80&width=80"
  },
  {
    name: "Emily",
    title: "Data Science Enthusiast",
    quote: "I love how Projectivity connects me with peers who share my passion for AI and machine learning projects.",
    image: "/placeholder.svg?height=80&width=80"
  }
];

export default function HomePage() {
  // const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [projectCount, setProjectCount] = useState(0)
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)

  // useEffect(() => {
  //   setMounted(true)
  //   const interval = setInterval(() => {
  //     setProjectCount(prev => (prev + 1) % 1000)
  //   }, 100)
  //   return () => clearInterval(interval)
  // }, [])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentProjectIndex(prev => (prev + 1) % featuredProjects.length)
  //   }, 5000)
  //   return () => clearInterval(interval)
  // }, [])

  // if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-900 dark:to-indigo-900 text-white py-20"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Collaborate, Learn, and Build Amazing Projects</h1>
              <p className="text-xl mb-6">Join a community of students turning ideas into reality</p>
              <Link href="/projects/create">
                <Button size="lg" className="inline-flex items-center justify-center bg-white text-purple-600 hover:bg-gray-100 dark:bg-purple-300 dark:text-purple-900 dark:hover:bg-purple-200">
                  Start Your Project <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
            <div className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center">
              <HeroIllustration/>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Live Project Counter */}
      {/* <div className="bg-purple-100 dark:bg-purple-800 py-4 text-center">
        <p className="text-2xl font-bold text-purple-800 dark:text-purple-100">
          Live Projects: <span className="text-3xl">{projectCount}</span>
        </p>
      </div> */}

      {/* Key Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Lightbulb, title: "Project Creation", description: "Easily upload and manage your project ideas" },
              { icon: Users, title: "Team Formation", description: "Find the perfect teammates based on skills and interests" },
              { icon: Kanban, title: "Project Management", description: "Streamline your workflow with intuitive tools" },
              { icon: BookOpen, title: "Learning Resources", description: "Access a wealth of educational materials" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="dark:bg-gray-800 dark:text-white">
                  <CardHeader>
                    <feature.icon className="w-10 h-10 text-purple-600 dark:text-purple-400 mb-2" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-100 dark:bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            {[
              { step: 1, title: "Create or Join a Project" },
              { step: 2, title: "Form Your Team" },
              { step: 3, title: "Collaborate and Learn" },
              { step: 4, title: "Showcase Your Work" },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="flex items-center mb-6 md:mb-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                  {step.step}
                </div>
                <p className="font-semibold dark:text-white">{step.title}</p>
                {index < 3 && <ChevronRight className="hidden md:block w-6 h-6 text-gray-400 dark:text-gray-500 mx-4" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
<section className="py-20 bg-gray-50 dark:bg-gray-900">
  <div className="container mx-auto px-4">
    <h2 className="text-4xl font-bold text-center mb-12 text-purple-800 dark:text-purple-200">Featured Projects</h2>
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProjectIndex}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
        >
          <div className="md:flex">
            {/* <div className="md:w-1/2">
              <Image
                src={featuredProjects[currentProjectIndex].image}
                alt={featuredProjects[currentProjectIndex].name}
                width={300}
                height={200}
                className="w-full h-64 object-cover"
              />
            </div> */}
            <div className="md:w-1/2 p-6">
              <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-2">
                {featuredProjects[currentProjectIndex].name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                by {featuredProjects[currentProjectIndex].team}
              </p>
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Technologies:</h4>
                <div className="flex flex-wrap gap-2">
                  {featuredProjects[currentProjectIndex].tech.split(', ').map((tech, index) => (
                    <span key={index} className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <Button className="w-full">View Project</Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-center mt-8 space-x-2">
        {featuredProjects.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentProjectIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === currentProjectIndex ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            aria-label={`View project ${index + 1}`}
          />
        ))}
      </div>
    </div>
  </div>
</section>

      {/* Testimonials */}
      <section className="bg-purple-50 dark:bg-purple-900 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-purple-800 dark:text-purple-100">What Students Say</h2>
          <div className="max-w-3xl mx-auto">
            <Tabs defaultValue="tab0" className="w-full">
              <TabsList className="flex justify-center mb-8 bg-transparent">
                {testimonials.map((testimonial, index) => (
                  <TabsTrigger
                    key={index}
                    value={`tab${index}`}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-colors data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                  >
                    {testimonial.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {testimonials.map((testimonial, index) => (
                <TabsContent key={index} value={`tab${index}`}>
                  <Card className="border-0 shadow-lg overflow-hidden bg-white dark:bg-gray-800">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div>
                          <CardTitle className="text-xl font-semibold text-purple-700 dark:text-purple-300">
                            {testimonial.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.title}</p>
                        </div>
                      </div>
                      <blockquote className="text-lg italic text-gray-700 dark:text-gray-300 border-l-4 border-purple-300 dark:border-purple-500 pl-4">
                        "{testimonial.quote}"
                      </blockquote>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-purple-600 dark:bg-purple-800 text-white py-20"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to bring your ideas to life?</h2>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 dark:bg-purple-300 dark:text-purple-900 dark:hover:bg-purple-200">
            Sign Up Now <ArrowRight className="ml-2" />
          </Button>
        </div>
      </motion.section>      
    </div>
  )
}
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Filter } from 'lucide-react'
import Link from 'next/link'
import { TECHNOLOGIES } from '@/constants/project'
import { useMutation } from '@apollo/client';
import { CREATE_USER, LOGIN_USER } from '@/graphql/queries';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    skills: [],
    bio: '',
    educationLevel: '',
    yearsExperience: 0,
    githubUrl: '',
    linkedInUrl: '',
    portfolioUrl: '',
    timeZone: '',
    availableHours: '',
    certifications: [],
    languages: [],
    projectPreferences: []
  })
  const [isSkillsOpen, setIsSkillsOpen] = useState(false)
  const skillsRef = useRef(null)
  const router = useRouter();
  const { login } = useAuth();
  const [createUser, { loading: createUserLoading, error: createUserError }] = useMutation(CREATE_USER);
  const [loginUser, { loading: loginUserLoading, error: loginUserError }] = useMutation(LOGIN_USER);

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSignupChange = (e) => {
    const { name, value, type } = e.target
    setSignupData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) : value
    }))
  }

  const handleSkillSelect = useCallback((skill) => {
    setSignupData(prev => {
      const updatedSkills = prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
      return { ...prev, skills: updatedSkills }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLogin) {
      try {
        await login(loginData.email, loginData.password);
        // The router.push is now handled in the login function
      } catch (error) {
        console.error('Error logging in:', error);
      }
    } else {
      try {
        const { data } = await createUser({
          variables: {
            input: {
              username: signupData.username,
              email: signupData.email,
              password: signupData.password,
              firstName: signupData.firstName,
              lastName: signupData.lastName,
              skills: signupData.skills,
              bio: signupData.bio,
              educationLevel: signupData.educationLevel,
              yearsExperience: signupData.yearsExperience,
              preferredRole: signupData.preferredRole,
              githubUrl: signupData.githubUrl,
              linkedInUrl: signupData.linkedInUrl,
              portfolioUrl: signupData.portfolioUrl,
              timeZone: signupData.timeZone,
              availableHours: signupData.availableHours,
              certifications: signupData.certifications,
              languages: signupData.languages,
              projectPreferences: signupData.projectPreferences,
            },
          },
        });

        if (data && data.createUser) {
          console.log('User created successfully:', data.createUser);
          // Automatically log in the user after successful signup
          await login(signupData.email, signupData.password);
          // Redirect to dashboard
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error creating user:', error);
      }
    }
  }

  const toggleAuthMode = () => {
    setIsLogin(!isLogin)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (skillsRef.current && !skillsRef.current.contains(event.target)) {
        setIsSkillsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            {isLogin ? 'Welcome Back!' : 'Create an Account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin 
              ? "We're excited to see you again. Let's continue building amazing projects together!"
              : "Join our community and start collaborating on exciting projects."}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {isLogin ? (
            <>
              <div className="rounded-md space-y-4">
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-1 block w-full"
                    value={loginData.email}
                    onChange={handleLoginChange}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="mt-1 block w-full"
                    value={loginData.password}
                    onChange={handleLoginChange}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox
                    id="remember-me"
                    name="rememberMe"
                    checked={loginData.rememberMe}
                    onCheckedChange={(checked) => setLoginData(prev => ({ ...prev, rememberMe: checked }))}
                  />
                  <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </Label>
                </div>

                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-purple-600 hover:text-purple-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="signup-username">Username</Label>
                <Input
                  id="signup-username"
                  name="username"
                  type="text"
                  required
                  className="mt-1 block w-full"
                  value={signupData.username}
                  onChange={handleSignupChange}
                />
              </div>
              <div>
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full"
                  value={signupData.email}
                  onChange={handleSignupChange}
                />
              </div>
              <div>
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full"
                  value={signupData.password}
                  onChange={handleSignupChange}
                />
              </div>
              <div>
                <Label htmlFor="signup-firstName">First Name</Label>
                <Input
                  id="signup-firstName"
                  name="firstName"
                  type="text"
                  required
                  className="mt-1 block w-full"
                  value={signupData.firstName}
                  onChange={handleSignupChange}
                />
              </div>
              <div>
                <Label htmlFor="signup-lastName">Last Name</Label>
                <Input
                  id="signup-lastName"
                  name="lastName"
                  type="text"
                  required
                  className="mt-1 block w-full"
                  value={signupData.lastName}
                  onChange={handleSignupChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="relative" ref={skillsRef}>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => setIsSkillsOpen(!isSkillsOpen)}
                  >
                    {signupData.skills.length > 0 ? `${signupData.skills.length} selected` : "Select skills"}
                    <Filter className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                  {isSkillsOpen && (
                    <Card className="absolute z-10 w-full mt-2">
                      <CardContent className="p-0">
                        <ScrollArea className="h-[200px]">
                          {TECHNOLOGIES.map((skill) => (
                            <div
                              key={skill}
                              className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            >
                              <Checkbox 
                                checked={signupData.skills.includes(skill)}
                                onCheckedChange={() => handleSkillSelect(skill)}
                                id={`skill-${skill}`}
                              />
                              <Label 
                                htmlFor={`skill-${skill}`}
                                className="flex-grow cursor-pointer"
                              >
                                {skill}
                              </Label>
                            </div>
                          ))}
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="signup-bio">Bio</Label>
                <Textarea
                  id="signup-bio"
                  name="bio"
                  className="mt-1 block w-full"
                  value={signupData.bio}
                  onChange={handleSignupChange}
                />
              </div>
              <div>
                <Label htmlFor="signup-educationLevel">Education Level</Label>
                <Select 
                  name="educationLevel"
                  value={signupData.educationLevel} 
                  onValueChange={(value) => setSignupData(prev => ({ ...prev, educationLevel: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="highschool">High School</SelectItem>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="master">Master's Degree</SelectItem>
                    <SelectItem value="phd">Ph.D.</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="signup-yearsExperience">Years of Experience</Label>
                <Input
                  id="signup-yearsExperience"
                  name="yearsExperience"
                  type="number"
                  required
                  className="mt-1 block w-full"
                  value={signupData.yearsExperience}
                  onChange={handleSignupChange}
                />
              </div>
            </div>
          )}

          <div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLogin ? loginUserLoading : createUserLoading}
            >
              {isLogin 
                ? (loginUserLoading ? 'Signing in...' : 'Sign in')
                : (createUserLoading ? 'Signing up...' : 'Sign up')
              }
            </Button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button type="button" onClick={toggleAuthMode} className="font-medium text-purple-600 hover:text-purple-500">
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
        {loginUserError && (
          <p className="text-red-500 text-sm mt-2">Error: {loginUserError.message}</p>
        )}
        {createUserError && (
          <p className="text-red-500 text-sm mt-2">Error: {createUserError.message}</p>
        )}
      </div>
    </div>
  )
}

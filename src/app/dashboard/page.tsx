'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './../../contexts/AuthContext'
import { useMutation, useQuery } from '@apollo/client'
import { GET_USER, UPDATE_USER } from '@/graphql/queries'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpenIcon, GithubIcon, UsersIcon, Briefcase, PlusCircle, LogOut, Mail, MapPin, Clock, Globe, Award } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const roles = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer", "UI/UX Designer",
  "Data Scientist", "DevOps Engineer", "Product Manager", "QA Engineer"
]

const timezones = [
  "GMT-12:00", "GMT-11:00", "GMT-10:00", "GMT-09:00", "GMT-08:00", "GMT-07:00",
  "GMT-06:00", "GMT-05:00", "GMT-04:00", "GMT-03:00", "GMT-02:00", "GMT-01:00",
  "GMT+00:00", "GMT+01:00", "GMT+02:00", "GMT+03:00", "GMT+04:00", "GMT+05:00",
  "GMT+06:00", "GMT+07:00", "GMT+08:00", "GMT+09:00", "GMT+10:00", "GMT+11:00",
  "GMT+12:00"
]

export default function ProfileDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [userData, setUserData] = useState(null)

  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: user?.id },
    skip: !user
  })

  const [updateUser, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_USER)

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        router.push('/auth');
      }
    }
  }, [user, router]);

  useEffect(() => {
    if (data && data.user) {
      setUserData(data.user)
    }
  }, [data])

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await updateUser({
        variables: {
          id: user.id,
          input: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            preferredRole: userData.preferredRole,
            bio: userData.bio,
            profileImageUrl: userData.profileImageUrl,
            skills: userData.skills,
            educationLevel: userData.educationLevel,
            yearsExperience: parseInt(userData.yearsExperience),
            githubUrl: userData.githubUrl,
            linkedInUrl: userData.linkedInUrl,
            portfolioUrl: userData.portfolioUrl,
            timeZone: userData.timeZone,
            availableHours: userData.availableHours,
            certifications: userData.certifications,
            languages: userData.languages,
            projectPreferences: userData.projectPreferences,
          }
        }
      })
      if (data && data.updateUser) {
        console.log('Profile updated successfully')
      }
    } catch (err) {
      console.error('Error updating profile:', err)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
  if (error) return <div className="flex items-center justify-center h-screen">Error: {error.message}</div>

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-9">
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={userData?.profileImageUrl} alt={`${userData?.firstName} ${userData?.lastName}`} />
                      <AvatarFallback>{userData?.firstName?.[0]}{userData?.lastName?.[0]}</AvatarFallback>
                    </Avatar>
                    <h2 className="mt-4 text-2xl font-bold">{userData?.firstName} {userData?.lastName}</h2>
                    <p className="text-muted-foreground">{userData?.preferredRole}</p>
                    <div className="mt-4 flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{userData?.timeZone}</span>
                    </div>
                    <div className="mt-2 flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{userData?.email}</span>
                    </div>
                    <div className="mt-6 w-full">
                      <h3 className="font-semibold mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {userData?.skills?.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="md:w-2/3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="edit">Edit Profile</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <Card>
                    <CardHeader>
                      <CardTitle>About Me</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{userData?.bio}</p>
                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold">Experience</h3>
                          <p className="flex items-center mt-1">
                            <BookOpenIcon className="w-4 h-4 mr-2" />
                            {userData?.yearsExperience} years
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Education</h3>
                          <p className="flex items-center mt-1">
                            <Award className="w-4 h-4 mr-2" />
                            {userData?.educationLevel}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Languages</h3>
                          <p className="flex items-center mt-1">
                            <Globe className="w-4 h-4 mr-2" />
                            {userData?.languages}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Availability</h3>
                          <p className="flex items-center mt-1">
                            <Clock className="w-4 h-4 mr-2" />
                            {userData?.availableHours}
                          </p>
                        </div>
                      </div>
                      <div className="mt-6">
                        <h3 className="font-semibold mb-2">Certifications</h3>
                        <p>{userData?.certifications}</p>
                      </div>
                      <div className="mt-6">
                        <h3 className="font-semibold mb-2">Project Preferences</h3>
                        <p>{userData?.projectPreferences}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="projects">
                  <Card>
                    <CardHeader>
                      <CardTitle>Projects</CardTitle>
                      <CardDescription>Projects you're currently working on or have completed.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {userData?.projects && userData.projects.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                          {userData.projects.map((project, index) => (
                            <Card key={index}>
                              <CardHeader>
                                <CardTitle>{project.title}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground">{project.description}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p>No projects yet.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="edit">
                  <Card>
                    <CardHeader>
                      <CardTitle>Edit Profile</CardTitle>
                      <CardDescription>Update your profile information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="profileImageUrl">Profile Picture</Label>
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-20 h-20">
                              <AvatarImage src={userData?.profileImageUrl} alt={`${userData?.firstName} ${userData?.lastName}`} />
                              <AvatarFallback>{userData?.firstName?.[0]}{userData?.lastName?.[0]}</AvatarFallback>
                            </Avatar>
                            <Input
                              id="profileImageUrl"
                              name="profileImageUrl"
                              type="url"
                              placeholder="https://example.com/your-profile-picture.jpg"
                              value={userData?.profileImageUrl || ''}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              value={userData?.firstName || ''}
                              onChange={handleChange}
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              name="lastName"
                              value={userData?.lastName || ''}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={userData?.email || ''}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="preferredRole">Preferred Role</Label>
                          <Select 
                            name="preferredRole"
                            value={userData?.preferredRole || ''} 
                            onValueChange={(value) => setUserData(prev => ({ ...prev, preferredRole: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your preferred role" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role} value={role}>{role}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            name="bio"
                            value={userData?.bio || ''}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="skills">Skills (comma-separated)</Label>
                          <Input
                            id="skills"
                            name="skills"
                            value={userData?.skills?.join(', ') || ''}
                            onChange={(e) => setUserData(prev => ({ ...prev, skills: e.target.value.split(',').map(skill => skill.trim()) }))}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="educationLevel">Education Level</Label>
                            <Input
                              id="educationLevel"
                              name="educationLevel"
                              value={userData?.educationLevel || ''}
                              onChange={handleChange}
                            />
                          </div>
                          <div>
                            <Label htmlFor="yearsExperience">Years of Experience</Label>
                            <Input
                              id="yearsExperience"
                              name="yearsExperience"
                              type="number"
                              value={userData?.yearsExperience || ''}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="githubUrl">GitHub URL</Label>
                          <Input
                            id="githubUrl"
                            name="githubUrl"
                            type="url"
                            placeholder="https://github.com/yourusername"
                            value={userData?.githubUrl || ''}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="linkedInUrl">LinkedIn URL</Label>
                          <Input
                            id="linkedInUrl"
                            name="linkedInUrl"
                            type="url"
                            placeholder="https://www.linkedin.com/in/yourusername"
                            value={userData?.linkedInUrl || ''}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <Label  htmlFor="portfolioUrl">Portfolio URL</Label>
                          <Input
                            id="portfolioUrl"
                            name="portfolioUrl"
                            type="url"
                            placeholder="https://yourportfolio.com"
                            value={userData?.portfolioUrl || ''}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="timeZone">Time Zone</Label>
                            <Select 
                              name="timeZone"
                              value={userData?.timeZone || ''} 
                              onValueChange={(value) => setUserData(prev => ({ ...prev, timeZone: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select your time zone" />
                              </SelectTrigger>
                              <SelectContent>
                                {timezones.map((tz) => (
                                  <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="availableHours">Available Hours</Label>
                            <Input
                              id="availableHours"
                              name="availableHours"
                              placeholder="e.g., Weekdays 6PM-10PM, Weekends 10AM-6PM"
                              value={userData?.availableHours || ''}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="certifications">Certifications</Label>
                          <Textarea
                            id="certifications"
                            name="certifications"
                            placeholder="List your certifications, separated by commas"
                            value={userData?.certifications || ''}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="languages">Languages</Label>
                          <Input
                            id="languages"
                            name="languages"
                            placeholder="e.g., English, Spanish, Mandarin"
                            value={userData?.languages || ''}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="projectPreferences">Project Preferences</Label>
                          <Textarea
                            id="projectPreferences"
                            name="projectPreferences"
                            placeholder="Describe the types of projects you're interested in"
                            value={userData?.projectPreferences || ''}
                            onChange={handleChange}
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={updateLoading}>
                          {updateLoading ? 'Updating...' : 'Update Profile'}
                        </Button>
                      </form>
                      {updateError && (
                        <p className="text-red-500 mt-2">Error updating profile: {updateError.message}</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

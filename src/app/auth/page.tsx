'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeIcon, GithubIcon } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GithubAuthProvider } from "firebase/auth"
import { auth } from "@/app/firebase"
import Link from "next/link"

export default function AuthForms() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      // Handle error (e.g., show error message to user)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      // TODO: Save additional user info (name) to Firestore
      router.push("/dashboard")
    } catch (error) {
      console.error("Signup error:", error)
      // Handle error (e.g., show error message to user)
    }
  }

  const handleGithubLogin = async () => {
    const provider = new GithubAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      router.push("/dashboard")
    } catch (error) {
      console.error("GitHub login error:", error)
      // Handle error (e.g., show error message to user)
    }
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Link href="/" className="absolute top-8 left-8 flex items-center space-x-2">
        <CodeIcon className="h-6 w-6" />
        <span className="font-bold">CodeCollab</span>
      </Link>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Welcome to CodeCollab</CardTitle>
          <CardDescription>Sign up or log in to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      placeholder="Enter your email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      placeholder="Enter your password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full mt-4">Login</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignup}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="signup-name">Name</Label>
                    <Input
                      id="signup-name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      placeholder="Enter your email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      placeholder="Create a password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full mt-4">Sign Up</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="mt-4 flex items-center space-x-2 w-full">
            <hr className="flex-grow border-gray-300" />
            <span className="text-sm text-gray-500">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          <Button onClick={handleGithubLogin} variant="outline" className="w-full mt-4">
            <GithubIcon className="mr-2 h-4 w-4" />
            Continue with GitHub
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

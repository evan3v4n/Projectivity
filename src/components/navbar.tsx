"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Bell, 
  MessageSquare, 
  Plus, 
  HelpCircle, 
  ChevronDown, 
  Search,
  Menu,
  X,
  Home,
  Briefcase,
  BookOpen,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Logo from './logo'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path

  const NavItem = ({ href, children, icon: Icon }: { href: string; children: React.ReactNode; icon?: React.ElementType }) => (
    <Link href={href} passHref>
      <span className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
        isActive(href) ? 'text-primary' : 'text-muted-foreground'
      }`}>
        {Icon && <Icon className="h-4 w-4" />}
        <span>{children}</span>
      </span>
    </Link>
  )

  const NavDropdown = ({ trigger, children }: { trigger: string; children: React.ReactNode }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-0">
          <span className="text-sm font-medium">{trigger}</span>
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center space-x-4 mr-8">
          <Link href="/" className="flex items-center space-x-2">
            <Logo/>
            <span className="hidden font-bold sm:inline-block">Projectivity</span>
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <NavDropdown trigger="Projects">
            <DropdownMenuItem>
              <NavItem href="/projects/my-projects" icon={Briefcase}>My Projects</NavItem>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <NavItem href="/projects/explore" icon={Search}>Explore Projects</NavItem>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <NavItem href="/projects/create" icon={Plus}>Create Project</NavItem>
            </DropdownMenuItem>
          </NavDropdown>
          <NavDropdown trigger="Learn">
            <DropdownMenuItem>
              <NavItem href="/learn/courses" icon={BookOpen}>Courses</NavItem>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <NavItem href="/learn/tutorials" icon={BookOpen}>Tutorials</NavItem>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <NavItem href="/learn/resources" icon={BookOpen}>Resources</NavItem>
            </DropdownMenuItem>
          </NavDropdown>
          <NavDropdown trigger="Collaborate">
            <DropdownMenuItem>
              <NavItem href="/collaborate/find-team" icon={Users}>Find Team</NavItem>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <NavItem href="/collaborate/forums" icon={MessageSquare}>Discussion Forums</NavItem>
            </DropdownMenuItem>
          </NavDropdown>
        </div>
        <div className="flex items-center ml-auto space-x-4">
          <form onSubmit={(e) => e.preventDefault()} className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search projects, users, resources..."
                className="pl-8 w-[300px] lg:w-[400px]"
              />
            </div>
          </form>
          <Button
            size="icon"
            variant="ghost"
            className="relative hidden md:inline-flex"
            aria-label="Create new content"
          >
            <Plus className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="relative hidden md:inline-flex"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="relative hidden md:inline-flex"
            aria-label="Messages"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="hidden md:inline-flex"
            aria-label="Help and Support"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="User avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/placeholder-user.jpg" alt="User avatar" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">John Doe</span>
                    <span className="text-xs text-muted-foreground">john.doe@example.com</span>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">My Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Account Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/learning-path">My Learning Path</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/saved-projects">Saved Projects</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-9 px-0 py-2 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background md:hidden">
          <div className="container grid gap-6 p-6">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search projects, users, resources..."
                  className="pl-8 w-full"
                />
              </div>
            </form>
            <nav className="grid gap-4">
              <NavItem href="/dashboard" icon={Home}>Dashboard</NavItem>
              <NavItem href="/projects" icon={Briefcase}>Projects</NavItem>
              <NavItem href="/learn" icon={BookOpen}>Learn</NavItem>
              <NavItem href="/collaborate" icon={Users}>Collaborate</NavItem>
            </nav>
            <div className="flex justify-between">
              <Button size="sm" variant="ghost" aria-label="Create new content">
                <Plus className="h-5 w-5 mr-2" />
                Create
              </Button>
              <Button size="sm" variant="ghost" aria-label="Notifications">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </Button>
              <Button size="sm" variant="ghost" aria-label="Messages">
                <MessageSquare className="h-5 w-5 mr-2" />
                Messages
              </Button>
              <Button size="sm" variant="ghost" aria-label="Help and Support">
                <HelpCircle className="h-5 w-5 mr-2" />
                Help
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar 
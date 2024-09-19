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
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path

  const NavItem = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} passHref>
      <span className={`text-sm font-medium transition-colors hover:text-primary ${
        isActive(href) ? 'text-primary' : 'text-muted-foreground'
      }`}>
        {children}
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
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">CodeCollab</span>
          </Link>
          <div className="flex items-center space-x-6 text-sm font-medium">
            <NavItem href="/dashboard">Dashboard</NavItem>
            <NavDropdown trigger="Projects">
              <DropdownMenuItem>
                <Link href="/projects/my-projects">My Projects</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/projects/explore">Explore Projects</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/projects/create">Create Project</Link>
              </DropdownMenuItem>
            </NavDropdown>
            <NavDropdown trigger="Learn">
              <DropdownMenuItem>
                <Link href="/learn/courses">Courses</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/learn/tutorials">Tutorials</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/learn/resources">Resources</Link>
              </DropdownMenuItem>
            </NavDropdown>
            <NavDropdown trigger="Collaborate">
              <DropdownMenuItem>
                <Link href="/collaborate/find-team">Find Team</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/collaborate/forums">Discussion Forums</Link>
              </DropdownMenuItem>
            </NavDropdown>
          </div>
        </div>
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
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search projects, users, resources..."
                  className="pl-8 md:w-[300px] lg:w-[400px]"
                />
              </div>
            </form>
          </div>
          <nav className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              className="relative"
              aria-label="Create new content"
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="relative"
              aria-label="Messages"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
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
                  <img
                    src="/placeholder-user.jpg"
                    alt="User avatar"
                    className="rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings">Account Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/learning-path">My Learning Path</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/saved-projects">Saved Projects</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Log Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
      {isMenuOpen && (
        <div className="fixed inset-0 top-14 z-50 bg-background md:hidden">
          <div className="container grid gap-6 p-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold">CodeCollab</span>
            </Link>
            <nav className="grid gap-4">
              <NavItem href="/dashboard">Dashboard</NavItem>
              <NavItem href="/projects">Projects</NavItem>
              <NavItem href="/learn">Learn</NavItem>
              <NavItem href="/collaborate">Collaborate</NavItem>
            </nav>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
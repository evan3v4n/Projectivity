"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Search,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Logo from './logo'
import { useQuery } from '@apollo/client';
import { GET_USER } from '@/graphql/queries';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { data: userData } = useQuery(GET_USER, {
    variables: { id: user?.id },
    skip: !user,
  });

  const isActive = (path: string) => pathname === path

  const NavItem = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} passHref>
      <Button 
        variant={isActive(href) ? "default" : "ghost"} 
        className="text-base"
      >
        {children}
      </Button>
    </Link>
  )

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2 text-xl">
            <Logo/>
            <span className="hidden font-bold sm:inline-block">Projectivity</span>
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <NavItem href="/dashboard">Dashboard</NavItem>
          <NavItem href="/projects/my-projects">My Projects</NavItem>
          <NavItem href="/projects/explore">Explore</NavItem>
          <NavItem href="/projects/create">Create Project</NavItem>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
                onClick={() => {/* Add profile action */}}
              >
                <Avatar>
                  <AvatarImage src={userData?.user?.profileImageUrl} alt={userData?.user?.username} />
                  <AvatarFallback>{userData?.user?.firstName?.[0]}{userData?.user?.lastName?.[0]}</AvatarFallback>
                </Avatar>
              </Button>
              <Button variant="outline" onClick={logout}>Log Out</Button>
            </>
          ) : (
            <Button asChild>
              <Link href="/auth">Log In / Sign Up</Link>
            </Button>
          )}
          <Link href="/dashboard">
            <Button
              className="md:hidden"
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </Link>
        </div>
      </div>
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background md:hidden">
          <div className="container grid gap-6 p-6">
            <nav className="grid gap-4">
              <NavItem href="/dashboard">Dashboard</NavItem>
              <NavItem href="/projects/my-projects">My Projects</NavItem>
              <NavItem href="/projects/explore">Explore Projects</NavItem>
              <NavItem href="/projects/create">Create Project</NavItem>
              {user ? (
                <>
                  <NavItem href="/profile">Profile</NavItem>
                  <Button onClick={logout}>Log Out</Button>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost">
                    <Link href="/login">Log In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

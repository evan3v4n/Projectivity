import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, Twitter, Linkedin } from 'lucide-react'
export default function() {
  return (
    <div>
        <footer className="bg-gray-800 dark:bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-purple-400">Our Story</Link></li>
                <li><Link href="/team" className="hover:text-purple-400">Team</Link></li>
                <li><Link href="/careers" className="hover:text-purple-400">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:text-purple-400">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-purple-400">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><Link href="/contact" className="hover:text-purple-400">Contact Us</Link></li>
                <li><Link href="/support" className="hover:text-purple-400">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
              <form className="flex">
                <Input type="email" placeholder="Your email" className="rounded-r-none dark:bg-gray-700" />
                <Button type="submit" className="rounded-l-none">Subscribe</Button>
              </form>
              <div className="flex space-x-4 mt-4">
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Github className="w-6 h-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="w-6 h-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Linkedin className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p>&copy; 2024 Projectivity. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

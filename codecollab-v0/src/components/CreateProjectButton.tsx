import React from 'react'
import { Button } from './ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'

export default function CreateProjectButton() {
  return (
    <Link href='/projects/create'>
      <Button className="w-full">
        <PlusCircle className="mr-2 h-4 w-4" /> 
        Create New Project
      </Button>
    </Link>
  )
}

'use client'

import Link from 'next/link'
import React from 'react'

interface NavbarProps { }

export const Navbar: React.FC = ({ }: NavbarProps) => {
  return (
    <nav className="p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link href="/" className="text-xl font-bold p-2"> /home </Link>
        </div>
        <div className="md:flex md:items-center">
          <ul className="flex space-x-4 md:space-x-8">
            <li> <Link href="/export" className="p-2"> /export </Link> </li>
            <li> <Link href="/import" className="p-2"> /import </Link> </li>
          </ul>
        </div>
      </div>
    </nav >
  )
}

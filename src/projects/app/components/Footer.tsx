'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface FooterProps { }

export const Footer: React.FC = ({ }: FooterProps) => {
  /* Request permission to send notifications to the user */
  useEffect(() => { Notification.requestPermission() }, [])
  return (
    <footer className="mb-4 mt-auto">
      <div className="container mx-auto">
        <p className="text-center">
          Project available in{' '}
          <Link
            href="https://github.com/andersonbosa/brx_test-github-repo-management"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            GitHub
          </Link>
        </p>
      </div>
    </footer>
  )
}

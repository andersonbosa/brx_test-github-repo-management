import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import "./globals.css"

import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { Providers } from './provders'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Github Repository Management",
  description: "Platform that allows users to easily research and manage Github repositories.",
  authors: {
    name: 'Anderson Bosa',
    url: 'https://github.com/andersonbosa'
  },
  applicationName: "Github Repository Management",
}

export default function RootLayout ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen max-w-screen">
            <Navbar />
            <main className="flex-grow container mx-auto text-center">
              <div className="mt-4">
                {children}
              </div>
            </main>
            <Footer />
          </div>
          <ToastContainer />
        </Providers>
      </body>
    </html>
  )
}

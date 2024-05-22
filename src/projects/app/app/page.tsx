import { EnvConfig } from '@/env.config'
import Link from 'next/link'


export default function Home () {
  return (
    <>
      <h1> # GitHub Repo.Management </h1>
      <div className="feature-cards-container">
        <Link href="/export" className="feature-card">
          Search & Export
        </Link>
        <Link href="/import" className="feature-card">
          Import & View
        </Link>
      </div>
    </>
  )
}

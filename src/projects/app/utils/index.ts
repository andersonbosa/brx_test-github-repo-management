import { NextRequest } from 'next/server'
import { toast, TypeOptions } from 'react-toastify'
import { GithubUserItem, GithubUserRepositoryItem } from '../types'


export function parseGithubLinkHeader (content: string): Record<string, number> {
  const links: Record<string, number> = {}
  const parts = content.split(',')

  parts.forEach(part => {
    const section = part.split(';')
    if (section.length !== 2) return

    const url = section[0].trim().slice(1, -1) // Remove os '<' e '>'
    const rel = section[1].trim().split('=')[1].slice(1, -1) // Pega o valor entre aspas

    const params = new URLSearchParams(url.split('?')[1])
    const page = parseInt(params.get('page') || '0')

    if (!isNaN(page)) {
      links[rel] = page
    }
  })

  return links
}

export function createResponseMetadata (request: NextRequest) {
  const metadata: any = {}
  if (request.headers.has('link')) {
    metadata['pagination'] = parseGithubLinkHeader(request.headers.get('link') as any)
  }
  return metadata
}

export function mapGithubUserItems (items: any[]): GithubUserItem[] {
  return items.map(
    i => ({
      username: i.login,
      url: i.html_url,
      imageURL: i.avatar_url,
    })
  )
}

export function mapGithubUserRepositoryItems (items: any[]): GithubUserRepositoryItem[] {
  return items.map(
    i => ({
      title: i.name,
      description: i.description,
      owner: i.owner.login,
      stars: i.stargazers_count,
    })
  )
}

export function showNotification (
  title: string,
  options: NotificationOptions | undefined = undefined
) {
  if (!("Notification" in window)) {
    console.error("This browser does not support notifications.")
    return
  }

  if (Notification.permission === "granted") {
    new Notification(title, options)
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(title, options)
      }
    })
  }
}

export function toasty (msg: string, type: TypeOptions | undefined = 'info'): void {
  toast(msg, {
    pauseOnFocusLoss: false,
    autoClose: 2000,
    position: 'bottom-right',
    type
  })
}

interface SortableObject {
  [key: string]: string | number
}
export type SortOrder = 'asc' | 'desc'
export function sortByProperty<T extends SortableObject> (
  array: T[],
  prop: keyof T,
  order: SortOrder = 'asc'
): T[] {
  return array.sort((a, b) => {
    let comparison = 0
    if (a[prop] < b[prop]) {
      comparison = -1
    } else if (a[prop] > b[prop]) {
      comparison = 1
    }
    return order === 'desc' ? comparison * -1 : comparison
  })
}

type DownloadableContent = string | object | Array<string | object>

type DownloadFormat = 'json' | 'csv'

export function downloadContentAsFile (
  content: DownloadableContent, filename: string, format: DownloadFormat
): void {
  if (!content) {
    throw new Error('Content is null or undefined.')
  }

  if (format !== 'json' && format !== 'csv') {
    throw new Error('Invalid format. Format must be "json" or "csv".')
  }

  let blob: Blob | null = null
  let type: string | null = null
  if (!blob || !type) {
    throw new Error('Failed to create blob.')
  }

  if (format === 'json') {
    const contentStr = typeof content === 'string' ? content : JSON.stringify(content)
    blob = new Blob([contentStr], { type: 'application/json' })
    type = 'application/json'
  } else if (format === 'csv') {
    const contentStr = typeof content === 'string' ? content : (content as Array<string>).join('\n')
    blob = new Blob([contentStr], { type: 'text/csv' })
    type = 'text/csv'
  }

  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${filename}.${format}`) // Define o nome do arquivo com a extensão
  document.body.appendChild(link)

  link.click()
  window.URL.revokeObjectURL(url)
}


export function incrementSessionOrders (key: string, newOrder: any) {
  const rawSessionOrders = localStorage.getItem(key)
  const sessionOrders = JSON.parse(rawSessionOrders ?? '{}')
  sessionOrders[newOrder.id] = newOrder
  localStorage.setItem(key, JSON.stringify(sessionOrders))
}
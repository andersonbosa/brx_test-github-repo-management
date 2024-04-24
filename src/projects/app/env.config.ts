
export const EnvConfig = {
  NEXT_PUBLIC_BACKEND_API_BASE_URL: process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ?? 'http://localhost:3000',
  NEXT_PUBLIC_NEXT_API_BASE_URL: process.env.NEXT_PUBLIC_NEXT_API_BASE_URL ?? 'http://localhost:8080',
  PROMETHEUS_SERVER_URL: process.env.PROMETHEUS_SERVER_URL ?? 'http://localhost:9090',
}

export const createBackendAPIUrl = (endpoint: string): string => {
  endpoint = endpoint.startsWith('/')
    ? endpoint.replace('/', '')
    : endpoint
  return `${EnvConfig.NEXT_PUBLIC_BACKEND_API_BASE_URL}/${endpoint}`
}

export const createNextAPIUrl = (endpoint: string): string => {
  /* TODO melhoria: obter endereço e porta do próprio Next.js */
  endpoint = endpoint.startsWith('/')
    ? endpoint.replace('/', '')
    : endpoint
  return `${EnvConfig.NEXT_PUBLIC_NEXT_API_BASE_URL}/${endpoint}`
}
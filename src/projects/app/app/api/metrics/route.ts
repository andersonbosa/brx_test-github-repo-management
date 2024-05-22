import { EnvConfig } from '@/env.config'
import { collectDefaultMetrics, register } from 'prom-client'

collectDefaultMetrics({
})

export async function GET () {
  const metrics = await register.metrics()
  return new Response(metrics, {
    status: 200,
    headers: {
      'x-metrics': EnvConfig.PROMETHEUS_SERVER_URL,
      'Content-type': register.contentType,
      'Cache-Control': 'no-store',
    }
  })
}

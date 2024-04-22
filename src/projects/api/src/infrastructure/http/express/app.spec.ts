
import { AppConfig } from '../../../configs/app.config'
import { CreateExpressApp } from './app'

import request from "supertest"

describe('Express APP', () => {
  const app = CreateExpressApp(AppConfig)

  describe('HealthCheck Endpoint', () => {
    it('should return status 200 when the API is healthy', async () => {
      const response = await request(app)
        .get('/api/v1/healthcheck')
        .expect("Content-Type", /json/)
        .expect(200)

      expect(response.status).toBe(200)
      expect(response.body.status).toBeTruthy()
    })
  })

})

import { httpStatusCodes } from '../../../constants'
import { HealthCheckUsecase } from './healthcheck.usecase'

describe('HealthCheckUsecase', () => {
  it('should return a response with status code 200 and health status true', async () => {
    const usecase = new HealthCheckUsecase();

    const response = await usecase.execute();

    expect(response.statusCode).toBe(httpStatusCodes.OK);
    expect(response.body.status).toBe(true);
    expect(response.body.when).toBeInstanceOf(Date);
  });
});

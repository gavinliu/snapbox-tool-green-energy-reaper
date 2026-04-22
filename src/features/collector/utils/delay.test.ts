import { delay } from './delay';

describe('delay', () => {
  it('should delay for specified milliseconds', async () => {
    const start = Date.now();
    await delay(100);
    const end = Date.now();

    expect(end - start).toBeGreaterThanOrEqual(100);
    expect(end - start).toBeLessThan(150); // 允许一些误差
  });

  it('should handle zero delay', async () => {
    const start = Date.now();
    await delay(0);
    const end = Date.now();

    expect(end - start).toBeLessThan(50);
  });
});

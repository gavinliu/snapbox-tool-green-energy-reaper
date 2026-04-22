const sleep = jest.fn((ms: number) => Promise.resolve());

export default {
  sleep,
};

export { sleep };

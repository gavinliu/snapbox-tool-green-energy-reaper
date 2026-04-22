export type MatchResult = {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
};

const findImage = jest.fn();

export default {
  findImage,
};

export const compareImages = jest.fn();

const tap = jest.fn(() => Promise.resolve(true));
const swipe = jest.fn(() => Promise.resolve(true));
const keyPress = jest.fn(() => Promise.resolve(true));
const showEditor = jest.fn(() => Promise.resolve());
const hideEditor = jest.fn();
const useScreenClickerPermissions = jest.fn(() => [
  { granted: true },
  jest.fn(),
  jest.fn(),
]);
const useOverlayPermissions = jest.fn(() => [
  { granted: true },
  jest.fn(),
  jest.fn(),
]);

export default {
  tap,
  swipe,
  keyPress,
  showEditor,
  hideEditor,
  useScreenClickerPermissions,
  useOverlayPermissions,
};

export { tap, swipe, keyPress, showEditor, hideEditor, useScreenClickerPermissions, useOverlayPermissions };

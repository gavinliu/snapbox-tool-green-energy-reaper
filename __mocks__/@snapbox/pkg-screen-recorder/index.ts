const captureScreen = jest.fn(() => Promise.resolve('/mock/screen.png'));
const startRecording = jest.fn();
const stopRecording = jest.fn(() => Promise.resolve('/mock/video.mp4'));

export default {
  captureScreen,
  startRecording,
  stopRecording,
};

export { captureScreen, startRecording, stopRecording };

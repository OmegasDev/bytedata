const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.symbolicator = {
  customizeFrame: (frame) => {
    if (!frame.file || frame.file.includes('<anonymous>')) {
      return { ...frame, collapse: true }; // hide frames without real files
    }
    return frame;
  },
};

module.exports = config;

// Expo's Metro config auto-detects pnpm workspaces (watchFolders,
// nodeModulesPaths), so workspace packages like @leafy/shared resolve with
// no extra setup.
const { getDefaultConfig } = require('expo/metro-config');

module.exports = getDefaultConfig(__dirname);

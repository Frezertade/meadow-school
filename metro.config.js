const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Supertonic / Transformers.js assets
config.resolver.assetExts.push('onnx', 'wasm', 'bin');

module.exports = config;

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Force Metro to prefer CJS over ESM for packages that have dynamic imports
// incompatible with Metro's static bundler (e.g. @supabase/supabase-js imports
// @opentelemetry/api via a dynamic import() which Metro can't resolve at build time).
config.resolver.resolverMainFields = ['react-native', 'main', 'module'];

module.exports = config;

/**
 * @see {@link Learn more https://docs.expo.io/guides/customizing-metro}
 */
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

/** @param {import('expo/metro-config').MetroConfig} config */
function withMonoRepoSupport(config) {
  /**
   * Watch all files within the monorepo
   * We can optionally speed up build times by restricting this list to
   * just the monorepo packages we depend on.
   * @see {@link https://docs.expo.dev/guides/monorepos/#1-why-do-we-need-to-watch}
   */
  config.watchFolders = [monorepoRoot];

  // Let Metro know where to resolve packages and in what order
  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(monorepoRoot, 'node_modules'),
  ];
  return config;
}

const { withTamagui } = require('@tamagui/metro-plugin');

/**
 * @param {import('expo/metro-config').MetroConfig} config
 * Expo 49 issue: default metro config needs to include "mjs"
 * Required for Tamagui
 * @see {@link https://github.com/expo/expo/issues/23180}
 * @see {@link https://tamagui.dev/docs/guides/metro}
 */
function withMJSSupport(config) {
  config.resolver.sourceExts.push('mjs');
  return config;
}

module.exports = withMonoRepoSupport(
  withMJSSupport(
    withTamagui(
      getDefaultConfig(projectRoot, {
        // [Web-only]: Enables CSS support in Metro.
        isCSSEnabled: true,
      }),
      {
        components: ['tamagui'],
        config: './tamagui.config.ts',
        outputCSS: './css/tamagui-web.css',
      },
    ),
  ),
);

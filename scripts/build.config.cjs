/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  npmRebuild: false,
  buildDependenciesFromSource: true,
  directories: {
    output: "dist"
  },
  appId: "xmind.demo",
  productName: "XMind Demo",
  copyright: "Copyright © 2022 ${author}",
  publish: [
    {
      provider: "generic",
      url: `https://localhost`
    }
  ],
  win: {
    icon: "bin/assets/favicon.256.ico",
    requestedExecutionLevel: "asInvoker",
    target: [{ target: "nsis", arch: ["x64", "ia32"] }]
  },
  mac: {
    icon: "bin/assets/favicon.512.ico",
    target: [{ target: "dmg" }]
  },
  electronDownload: {
    mirror: "https://npmmirror.com/mirrors/electron/"
  },
  nsis: {
    artifactName: "medsetup-${version}-${arch}.${ext}",
    allowElevation: true,
    installerIcon: "bin/assets/favicon.256.ico",
    uninstallerIcon: "bin/assets/favicon.256.ico",
    installerHeaderIcon: "bin/assets/favicon.co.16.ico",
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    deleteAppDataOnUninstall: false,
    menuCategory: true,
    runAfterFinish: true,

    oneClick: false,
    allowToChangeInstallationDirectory: true,
    include: "bin/install.nsh"
  },
  dmg: {
    icon: "bin/assets/favicon.256.ico"
  },
  extraResources: [
    {
      from: "./resources/",
      to: ".resources",
      filter: "**/*"
    }
  ],
  files: ["dist.vue/**/*", "dist.electron/**/*", "bin/**/*"]
}

module.exports = config

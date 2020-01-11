module.exports={
  displayName:"KaytanJS Webpack Test",
  preset: "jest-puppeteer",
  globals: {
    PATH: "http://localhost:4444/simple/kaytan",
    __OPTIMIZED__:"YES"
  },
  testRegex:process.platform === "win32"?"\\test-web\\\\.+\.test\.js$":"/test-web/.+\.test\.js$"
};
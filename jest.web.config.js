module.exports={
  displayName:"KaytanJS Webpack Test",
  preset: "jest-puppeteer",
  globals: {
    PATH: "http://localhost:4444/simple/kaytan",
    __ENTRYPOINT__:"",
    __OPTIMIZED__:"NO"
  },
  testRegex:process.platform === "win32"?"\\test\\\\.+\.test\.js$":"/test/.+\.test\.js$"
};
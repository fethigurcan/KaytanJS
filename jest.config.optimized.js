module.exports={
  displayName:"KaytanJS Default Test",
  globals:{
    __ENTRYPOINT__:"../",
    __OPTIMIZED__:"YES"
  },
  //testMatch: [
  //  "**/test/**/*.test.js"
  //]
  testRegex:process.platform === "win32"?"\\test\\\\.+\.test\.js$":"/test/.+\.test\.js$"
};
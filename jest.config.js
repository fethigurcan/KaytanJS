module.exports={
  displayName:"KaytanJS Default Test",
  globals:{
    __ENTRYPOINT__:"../",
    __OPTIMIZED__:"NO"
  },
  //testMatch: [
  //  "**/test/**/*.test.js"
  //]
  testRegex:process.platform === "win32"?"\\test\\\\.+\.test\.js$":"/test/.+\.test\.js$"
};
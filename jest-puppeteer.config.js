module.exports = {
    server: {
      command: 'npm run test-server',
      port: 4444
    },
    browser:'chromium' //or firefox with puppeteer-firefox package. but it seems can't find firefox64 windows package to download. test later 
}
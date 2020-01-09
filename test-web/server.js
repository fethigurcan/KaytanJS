const path = require('path')
const express = require('express')

let port = 4444
const index = Math.max(process.argv.indexOf('--port'), process.argv.indexOf('-p'))
if (index !== -1) {
  port = +process.argv[index + 1] || port
}

const app = express()
  .use("/dist",express.static(path.resolve('dist')))
  .get("/:jslibrary",(req, res) => {
    res.send(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Test</title>
        </head>
        <body>
          <div id="root"></div>
          <script src="/dist/${req.params.jslibrary}.js"></script>
        </body>
      </html>`
    );
  })
  .listen(port, () => {
    console.log(`Server started at http://localhost:${port}/`)
  });
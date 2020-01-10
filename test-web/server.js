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
          <title>Test ${req.params.jslibrary}.js</title>
          <style>
            table { width:100%; }
            textarea { width:100%; resize:none; }
          </style>
        </head>
        <body>
          <h1>Test ${req.params.jslibrary}.js</h1>
          <table>
            <tr><td>
              Template:
              <div><textarea id="template" rows="10">Hello {{who}}!</textarea></div>
            </td></tr>
            <tr><td>
              JSON Data:
              <div><textarea id="data" rows="5">{ "who":"World" }</textarea></div>
            </td></tr>
            <tr><td>
              Output:
              <div id="output"></div>
            </td></tr>
            <tr><td style="text-align:center">
              <button id="execute" onclick="document.getElementById('output').innerText=(new Kaytan(document.getElementById('template').value)).execute(JSON.parse(document.getElementById('data').value))">Execute</button>
            </td></tr>
            </table>
            <div id="root"></div>
          <script src="/dist/${req.params.jslibrary}.js"></script>
        </body>
      </html>`
    );
  })
  .get("/",(req, res) => {
    res.send(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Test</title>
        </head>
        <body>
          <table>
            <tr><td>
              <a href="kaytan">Go to kaytan.js</a>
            </td></tr>
            <tr><td>
              <a href="kaytan-dev">Go to kaytan-dev.js</a>
            </td></tr>
            </table>
        </body>
      </html>`
    );    
  })
  .listen(port, () => {
    console.log(`Server started at http://localhost:${port}/`)
  });
# KaytanJS
Mustache like Template Engine with some logic extensions. Mustache templates also work.

## Build Info
   - npm install
   - npm run build
   - npm run test

## Simple Test Server
   - npm run test-server

## Run Tests
   - npm run test
   - npm run test-web

## Basic Usage Sample (Nodejs)
```javascript
require("KaytanJS")
var kaytan=new Kaytan("{{?a&b}}{{b}}{{:}}false{{/}}");
console.log(kaytan.execute({ "a":true, "b":"Test" }));
```

## Basic Usage Sample (Browser)
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Test</title>
  </head>
  <body>
    <script src="/dist/kaytan.js"></script>
    <script>
      var kaytan=new Kaytan("{{?a}}true{{:}}false{{/}}");
      document.write(kaytan.execute({ "a":true }));
    </script>
  </body>
</html>
```

## TODO List:
   - Add Delimiter Change
   - Remove escape char of { and use delimiter Change
   - Add importing external partials. (there is already internal partail suppor for plus)
   - Configure babel for older browser support
   - Add Usage info
   - Add Documentation
   - More test coverage
   - Add NPM package
   - Do Performance Tests against Mustache and HandleBars 

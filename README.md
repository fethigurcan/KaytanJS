# KaytanJS
Mustache like Template Engine with some logic extensions. Mustache templates also work.

## Build Info
   - npm install
   - npm run test

## Simple Test Server With An Interface
   - npm run build
   - npm run test-server

## Run Tests
   - npm run test
   - npm run test-optimized
   - npm run test-web
   - npm run test-web-optimized

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
   - Configure babel for older browser support
   - Add Usage info
   - Add Documentation
   - More test coverage
   - Add NPM package
   - Do Performance Tests against Mustache and HandleBars 

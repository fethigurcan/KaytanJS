const presets = [
    [
      "@babel/env",
      {
        //targets: "last 10 versions"
        targets: {
          edge: "17",
          firefox: "60",
          chrome: "67",
          safari: "11.1",
        },
      }
    ]
];
  
module.exports = { presets };
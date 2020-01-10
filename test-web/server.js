const path = require('path')
const express = require('express')
const fs = require("fs");
var testlist,testlisthtml;

let port = 4444
const index = Math.max(process.argv.indexOf('--port'), process.argv.indexOf('-p'))
if (index !== -1) {
  port = +process.argv[index + 1] || port
}

const app = express()
  .use("/dist",express.static(path.resolve('dist')))
  .get("/:jslibrary",(req, res) => {
    
    if (!testlist){
      const _escape=v=>v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/\//g, "&#x2F;");
      testlist = JSON.parse(fs.readFileSync(path.resolve("test/testlist.json")));
      testlisthtml='<select id="list" onchange="select()"><option></option>';

      for (let block in testlist){
        let blockItem=testlist[block];
        let lasttemplate,lastobj,lastexpectedResult;
        testlisthtml+=`<optgroup label="${_escape(block)}">`;
        for (let title in blockItem){
          let _title=_escape(title);
          let template,obj,expectedResult;
          let item=blockItem[title];
          
          template=item[0]===-1?lasttemplate:item[0];
          obj=item[1]===-1?lastobj:item[1];
          expectedResult=item[2]===-1?lastexpectedResult:item[2];
          
          //this approach prevents value changes in parallel processing
          lasttemplate=template;
          lastobj=obj;
          lastexpectedResult=expectedResult;

          //prepare simple data for to pass client side.
          item[0]=template;
          item[1]=obj;
          item[2]=expectedResult;

          testlisthtml+=`<option value="${_title}">${_title}</>`;
        }
        testlisthtml+="</optgroup>";
      }
      testlisthtml+=`</select><script>var testlist=${JSON.stringify(testlist)};</script>`;
    }
    
    res.send(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Test ${req.params.jslibrary}.js</title>
          <style>
            table { width:100%; }
            textarea { width:100%; resize:none;font-family:monospace; }
            pre:empty:before { content: '(Empty)'; }
            #expectedlabel { color:red; }
          </style>
        </head>
        <body>
          <h1>Test ${req.params.jslibrary}.js</h1>
          <table>
              <tr><td>
              Test:
              ${testlisthtml}
            </td></tr>
            <tr><td>
              Template:
              <div><textarea id="template" rows="10" onchange="userchange()">Hello {{who}}!</textarea></div>
            </td></tr>
            <tr><td>
              JSON Data:
              <div><textarea id="data" rows="5" onchange="userchange()">{ "who":"World" }</textarea></div>
            </td></tr>
            <tr><td>
              Output:
              <div><pre id="output"></pre></div>
            </td></tr>
            <tr style="display:none"><td>
              <span id="expectedlabel">Expected:</span>
              <div><pre id="expected"></pre></div>
            </td></tr>
            <tr><td style="text-align:center">
              <button id="execute" onclick="execute()">Execute</button>
            </td></tr>
            </table>
          <script src="/dist/${req.params.jslibrary}.js"></script>
          <script>
            const _escape=v=>v;//.replace(/</g, "&lt;").replace(/>/g, "&gt;");

            var selected,selectedGroup;
            function execute(){
              let outputel=document.getElementById('output');
              let templateel=document.getElementById('template');
              let datael=document.getElementById('data');
              try{
                let data=JSON.parse(datael.value);
                let kaytan=new Kaytan(template.value);
                let output=kaytan.execute(data);
                outputel.innerText=_escape(output);
                if (selected){
                  document.getElementById('expectedlabel').style.color=output==selected[2]?'green':null;
                }
              }catch(e){
                outputel.innerText=_escape(e.message);
              }
            }

            var selected,selectedGroup;
            function select(e){
              let outputel=document.getElementById('output');
              let expectedel=document.getElementById('expected');
              let templateel=document.getElementById('template');
              let datael=document.getElementById('data');
              
              if (event.target.value){
                selectedGroup=testlist[event.target.selectedOptions[0].parentElement.label];
                selected=selectedGroup[event.target.value];

                outputel.innerText="";
                templateel.value=selected[0];
                datael.value=JSON.stringify(selected[1]);
                expectedel.innerText=selected[2];
                expectedel.parentElement.parentElement.parentElement.style.display=null;
                execute();
              }else{
                selectedGroup=null;
                selected=null;
                expectedel.innerText="";
                expectedel.parentElement.parentElement.parentElement.style.display="none";
                document.getElementById('expectedlabel').style.color=null;
              }
            }

            function userchange(){
              document.getElementById('list').value="";
              document.getElementById('expectedlabel').style.color=null;
              document.getElementById('output').innerText="";
              let expectedel=document.getElementById('expected');
              expectedel.innerText="";
              expectedel.parentElement.parentElement.parentElement.style.display="none";
          }

          </script>
        </body>
      </html>`
    );
  })  
  .get("/simple/:jslibrary",(req, res) => {
    res.send(
      `<!DOCTYPE html>
      <html>
        <body>
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
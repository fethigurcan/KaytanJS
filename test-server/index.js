const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require("fs");
var testlist,testlisthtml;
const testsPath=path.resolve("test-data");

let port = 4444
const index = Math.max(process.argv.indexOf('--port'), process.argv.indexOf('-p'))
if (index !== -1) {
  port = +process.argv[index + 1] || port
}

const app = express()
  .use(bodyParser.urlencoded({ extended: true }))
  .use("/dist",express.static(path.resolve('dist')))
  .post("/test-case",(req, res) => {
      if (!fs.existsSync(testsPath)){
        fs.mkdirSync(testsPath);
      }
      if (!fs.existsSync(testsPath+"/"+req.body.groupname)){
        fs.mkdirSync(testsPath+"/"+req.body.groupname);
      }
      let testcase=JSON.stringify({ template:req.body.template, data:JSON.parse(req.body.data), expected:req.body.output },null,2);
      fs.writeFileSync(testsPath+"/"+req.body.groupname+"/"+req.body.testname+".json",testcase);
      //TODO: save to ${req.body.testname}.json file.
      res.send(`<!DOCTYPE html>
      <html>
        <head>
          <title>Test Save Info</title>
        </head>
        <body>
          <script>
            window.history.back();
          </script>
          Test case &quot;${req.body.testname}&quot; saved!.<br />
          <button onclick="window.history.back()">Back</button>
        </body>
      </html>`);
  })
  .get("/:jslibrary",(req, res) => {
    
    if (!testlist){
      const _escape=v=>v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/\//g, "&#x2F;");
      testlist = JSON.parse(fs.readFileSync(path.resolve("test/testlist.json")));
      testlisthtml='<select id="list" onchange="select()" autofocus><option></option>';

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

          testlisthtml+=`<option value="${_title}">${_title}</option>`;
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
          <script src="/dist/${req.params.jslibrary}.js"></script>
          <script>
            const _escape=v=>v;//.replace(/</g, "&lt;").replace(/>/g, "&gt;");

            var selected,selectedGroup;
            function onExecute(){
              let outputel=document.getElementById('output');
              let outputhiddenel=document.getElementById('output-hidden');
              let templateel=document.getElementById('template');
              let datael=document.getElementById('data');
              try{
                let data=JSON.parse(datael.value);
                let kaytan=new Kaytan(template.value);
                let output=kaytan.execute(data);
                outputhiddenel.value=output;
                outputel.innerText=_escape(output);
                if (selected){
                  document.getElementById('expectedlabel').style.color=output==selected[2]?'green':null;
                }
              }catch(e){
                debugger;
                outputhiddenel.value=JSON.stringify({ error:e.name,message:e.message });
                outputel.innerText=_escape(e.message);
              }
            }

            var selected,selectedGroup;
            function select(e){
              let outputel=document.getElementById('output');
              let outputhiddenel=document.getElementById('output-hidden');
              let expectedel=document.getElementById('expected');
              let templateel=document.getElementById('template');
              let testnameel=document.getElementById('testname');
              let groupnameel=document.getElementById('groupname');
              let datael=document.getElementById('data');
              
              if (event.target.value){
                selectedGroup=testlist[event.target.selectedOptions[0].parentElement.label];
                selected=selectedGroup[event.target.value];
                testnameel.value=event.target.value;
                groupnameel.value=event.target.selectedOptions[0].parentElement.label;

                outputel.innerText="";
                outputhiddenel.value="";
                templateel.value=selected[0]?selected[0]:"";
                datael.value=JSON.stringify(selected[1]);
                expectedel.innerText=selected[2];
                expectedel.parentElement.parentElement.parentElement.style.display=null;
                onExecute();
              }else{
                testnameel.value=event.target.value;
                groupnameel.value="";
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
              document.getElementById('output-hidden').value="";

              let expectedel=document.getElementById('expected');
              expectedel.innerText="";
              expectedel.parentElement.parentElement.parentElement.style.display="none";
            }

            function onSubmit(){
              onExecute();
              return true;
            }
          </script>
          <form id="form" action="/test-case" method="post" onsubmit="return onSubmit()">
            <table>
                <tr><td>
                Test:
                ${testlisthtml}
                <input type="text" id="groupname" name="groupname" required/>
                <input type="text" id="testname" name="testname" required/>
              </td></tr>
              <tr><td>
                Template:
                <div><textarea id="template" name="template" rows="10" onchange="userchange()">Hello {{who}}!</textarea></div>
              </td></tr>
              <tr><td>
                JSON Data:
                <div><textarea id="data" name="data" rows="5" onchange="userchange()">{ "who":"World" }</textarea></div>
              </td></tr>
              <tr><td>
                Output:
                <div><pre id="output"></pre><input type="hidden" id="output-hidden" name="output" required/></div>
              </td></tr>
              <tr style="display:none"><td>
                <span id="expectedlabel">Expected:</span>
                <div><pre id="expected"></pre></div>
              </td></tr>
              <tr><td style="text-align:center">
                <button id="execute" name="execute" type="button" accesskey="e" onclick="onExecute()">Execute</button> <input type="submit" accesskey="s" value="Save As Test Case">
              </td></tr>
              </table>
            </form>
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
  .listen(port,"0.0.0.0", () => {
    console.log(`Server started at http://localhost:${port}/`)
  });
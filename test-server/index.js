const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require("fs");
const testlist=require("../test-data");
const _escape=v=>v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/\//g, "&#x2F;");

let port = 4444
const index = Math.max(process.argv.indexOf('--port'), process.argv.indexOf('-p'))
if (index !== -1) {
  port = +process.argv[index + 1] || port
}

let list=testlist();

const app = express()
  .use(bodyParser.urlencoded({ extended: true }))
  .use("/dist",express.static(path.resolve('dist')))
  .post("/test-data",(req, res) => {
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
  .get("/test-data/:block/:test",(req, res) => {
    list=list||testlist();
    res.contentType="application/json";
    res.send(fs.readFileSync(list[req.params.block][req.params.test]));
  })
  .get("/:jslibrary",(req, res) => {
    
    list=testlist(); //update every page load or TODO: listen fs
    let testlisthtml='<select id="list" onchange="select()" autofocus><option></option>';
    for (let block in list){
      let blockItem=list[block];
      testlisthtml+=`<optgroup label="${_escape(block)}">`;
      for (let title in blockItem){
        let _title=_escape(title);
        let item=blockItem[title];
        testlisthtml+=`<option value="${_title}">${_title}</option>`;
      }
      testlisthtml+="</optgroup>";
    }
    testlisthtml+=`</select>`;
    
    res.send(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Test ${req.params.jslibrary}.js</title>
          <style>
            table { width:100%; }
            textarea { width:100%; resize:vertical;font-family:monospace; }
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
              let expectedhiddenel=document.getElementById('expectedhidden');

              try{
                let data=JSON.parse(datael.value);
                let kaytan=new Kaytan(template.value);
                let output=kaytan.execute(data);
                outputhiddenel.value=output;
                outputel.innerText=_escape(output);
                document.getElementById('expectedlabel').style.color=output==expectedhiddenel.value?'green':null;
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
              let expectedhiddenel=document.getElementById('expectedhidden');
              let templateel=document.getElementById('template');
              let testnameel=document.getElementById('testname');
              let groupnameel=document.getElementById('groupname');
              let submitel=document.getElementById('submit');
              let datael=document.getElementById('data');
              
              if (event.target.value){
                selectedGroup=event.target.selectedOptions[0].parentElement.label;
                selected=event.target.value;
                testnameel.value=selected;
                groupnameel.value=selectedGroup;

                let xhr=new XMLHttpRequest();
                xhr.open("GET",encodeURI("/test-data/"+selectedGroup+"/"+selected+""));
                xhr.onload = function() {
                  outputel.innerText="";
                  outputhiddenel.value="";
                  let test=JSON.parse(xhr.responseText);
                  templateel.value=test.template;
                  datael.value=JSON.stringify(test.data);
                  expectedel.innerText=test.expected;
                  expectedhiddenel.value=test.expected;
                  expectedel.parentElement.parentElement.style.display=null;
                  onExecute();
                  submitel.disabled=null;
                };
                submitel.disabled="disabled";
                xhr.send();
              }else{
                testnameel.value=event.target.value;
                groupnameel.value="";
                selectedGroup=null;
                selected=null;
                expectedel.innerText="";
                expectedhiddenel.value="";
                expectedel.parentElement.parentElement.style.display="none";
                document.getElementById('expectedlabel').style.color=null;
              }
            }

            function userchange(){
              document.getElementById('list').value="";
              document.getElementById('expectedlabel').style.color=null;
              document.getElementById('output').innerText="";
              document.getElementById('output-hidden').value="";

              let expectedel=document.getElementById('expected');
              let expectedhiddenel=document.getElementById('expectedhidden');
              expectedel.innerText="";
              expectedhiddenel.value="";
              expectedel.parentElement.parentElement.style.display="none";
            }

            function onSubmit(){
              onExecute();
              return true;
            }
          </script>
          <form id="form" action="/test-data" method="post" onsubmit="return onSubmit()">
            <table>
                <tr colspan="2"><td>
                Test:
                ${testlisthtml}
                <input type="text" id="groupname" name="groupname" required/>
                <input type="text" id="testname" name="testname" required/>
                <button id="execute" name="execute" type="button" accesskey="e" onclick="onExecute()">Execute</button> <input type="submit" id="submit" accesskey="s" value="Save As Test Case">
              </td></tr>
              <tr><td width="50%">
                Template:
                <div><textarea id="template" name="template" rows="10" onchange="userchange()">Hello {{who}}!</textarea></div>
              </td>
              <td width="50%">
                JSON Data:
                <div><textarea id="data" name="data" rows="10" onchange="userchange()">{ "who":"World" }</textarea></div>
              </td></tr>
              <tr><td valign="top">
                Output:
                <div><pre id="output"></pre><input type="hidden" id="output-hidden" name="output" required/></div>
              </td>
              <td style="display:none" valign="top">
                <span id="expectedlabel">Expected:</span>
                <div><pre id="expected"></pre></div>
              </td></tr>
              </table>
            </form>
            <input type="hidden" id="expectedhidden"/>
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
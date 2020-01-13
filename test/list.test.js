var Kaytan=require(__ENTRYPOINT__);
var fs = require("fs");
var path = require("path");
var testlist = require("../test-data")();

var options;
if (__OPTIMIZED__=="YES"){
    options={ optimized:true };
}


for (let block in testlist){
    let blockItem=testlist[block];
    describe(block,()=>{
        for (let title in blockItem){
            let item=JSON.parse(fs.readFileSync(blockItem[title]));
            test(title, () => {
                expect((new Kaytan(item.template,options)).execute(item.data)).toBe(item.expected);
            });
        }
    });
}
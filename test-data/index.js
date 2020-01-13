const fs=require("fs");
const path = require("path");
const rootPath=path.resolve("./test-data");
const jsonExtension=/\.json$/;

function testlist(){
    let rootFiles=fs.readdirSync(rootPath);
    let tree={};
    for(let f of rootFiles){
        let p=path.resolve(rootPath+"/"+f);
        if (fs.statSync(p).isDirectory()){
            let d={};
            tree[f]=d;
            let testFiles=fs.readdirSync(p);
            for(let t of testFiles){
                let tp=path.resolve(p+"/"+t);
                if (!fs.statSync(tp).isDirectory() && jsonExtension.test(t)){
                    d[t.replace(jsonExtension,"")]=tp;
                }
            } 
        }
    }
    return tree;
}

module.exports=testlist;
#!/usr/bin/env node
const fs=require('fs');
const path=require('path');
const modulePath=process.mainModule.path;
const Kaytan=require(path.resolve(process.mainModule.path+'/../index.js'));
if(!process.argv[2]){
    console.error("ERROR: expected template file to process");
}else{
    try{
        let templateFile=path.resolve(process.argv[2]);
        let templateData=fs.readFileSync(templateFile,{ encoding:'utf8' });
        let kaytan=new Kaytan(templateData,{ });

        let inputFile;
        if (process.argv[3])
            inputFile=path.resolve(process.argv[3]);
        else
            inputFile=process.stdin.fd;

        let jsonData=fs.readFileSync(inputFile,{ encoding:'utf8' });
        let data=JSON.parse(jsonData);

        let output=kaytan.execute(data);
        console.log(output);
    }catch(e){
        console.error(e.message);
    }
}
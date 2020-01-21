#!/usr/bin/env node
const fs=require('fs');
const path=require('path');
const modulePath=process.mainModule.path;
const Kaytan=require(path.resolve(process.mainModule.path+'/../index.js'));
const KaytanNodeStreamTextWriter=require(path.resolve(process.mainModule.path+'/../src/KaytanNodeStreamTextWriter.js'));
if(!process.argv[2]){
    console.error("ERROR: expected template file to process");
}else{
    let fileOptions={ encoding:'utf8' };
    try{
        let templateFile=path.resolve(process.argv[2]);
        let templateData=fs.readFileSync(templateFile,fileOptions);
        let kaytan=new Kaytan(templateData,{ });

        let inputFile;
        if (process.argv[3])
            inputFile=path.resolve(process.argv[3]);
        else
            inputFile=process.stdin.fd;

        let jsonData=fs.readFileSync(inputFile,fileOptions);
        let data=JSON.parse(jsonData);

        kaytan.execute(data,new KaytanNodeStreamTextWriter(process.stdout));
    }catch(e){
        console.error(e.message);
    }
}
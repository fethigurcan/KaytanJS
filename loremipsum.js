Kaytan=require('.');

dd=new Kaytan("{{ deneme }}den{{aaa}}eme\r\n{{bbb}}\nbu da aşağı gelmemeli  \n{{#ebele}}\nyihuu\n{{/}}rrr"
        ,{ optimized:true,defaultStartDelimiter:'{{',defaultEndDelimiter:'}}' });
console.log(dd);

console.log(dd.ast.toString());
console.log(dd.execute({ "TableName":"Empl\"oyees {aka} Friends",aaa:"ee",ebele:{} }));
console.log('end');

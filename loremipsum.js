Kaytan=require('.');

dd=new Kaytan("SELECT * FROM (TableName)"
        ,{ optimized:true,defaultStartDelimiter:'(',defaultEndDelimiter:')' });
console.log(dd);

console.log(dd.ast.toString());
console.log(dd.execute({ "TableName":"Employees {aka} Friends" }));
console.log('end');

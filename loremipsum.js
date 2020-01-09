Kaytan=require('.');

dd=new Kaytan("SELECT * FROM \"{{[TableName}}\"");
console.log(dd);
//dd.execute({ deneme: 'fethi' });

console.log(dd.ast.toString());
console.log(dd.execute({ "TableName":"Employees [aka] Friends" }));
console.log('end');
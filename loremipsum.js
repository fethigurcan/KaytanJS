Kaytan=require('.');

dd=new Kaytan("t{{#a}}{{#.a}}{{..b}},{{/}}{{/}} {{#a}}{{#a}}{{.a}},{{/}}{{/}} {{#.b}}{{#a}}{{.a}},{{/}}{{/}}m"
        ,{ optimized:true });
console.log(dd);

console.log(dd.ast.toString());
console.log(dd.execute({ "a":[
                {a:[{a:"a"},{a:"b"},{a:"c"}]},
                {a:[{a:"d"},{a:"e"},{a:"f"}]},
                {a:[{a:"g"},{a:"h"},{a:"i"}]},
                {a:[{a:"j"},{a:"k"},{a:"l"}]},
                {a:[{a:"m"},{a:"n"},{a:"o"}]}
        ],
        "b":[
            {a:[{a:"_a"},{a:"_b"},{a:"_c"}]},
            {a:[{a:"_d"},{a:"_e"},{a:"_f"}]},
            {a:[{a:"_g"},{a:"_h"},{a:"_i"}]},
            {a:[{a:"_j"},{a:"_k"},{a:"_l"}]},
            {a:[{a:"_m"},{a:"_n"},{a:"_o"}]}
    ]    }));
console.log('end');

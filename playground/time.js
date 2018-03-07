var moment=require('moment');


// var date=new Date();
//
// var months=['jan','feb']
// console.log(date.getMonth());

var date=moment();
var someTimestamp=moment().valueOf();
console.log(someTimestamp);

console.log(date.format('MMM Do YYYY'));

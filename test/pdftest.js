'use strict';
var should = require('should');
var pdf = require ('../src/pdf_analyse.js');
var pdflist = ['./pdfs/test2.pdf'];//,'./pdfs/test3.pdf','./pdfs/test4.pdf','./pdfs/test5.pdf','./pdfs/test6.pdf','./pdfs/test7.pdf','./pdfs/test8.pdf'];
var options = {
	type: 'text'
};

var LOG = false;

function doTest(i){//separate function because mocha closes on the 'i' variable

return it('should perform a correct analysis of pdf ' + i,function(done){

	var path =  pdflist[i];
	pdf.analysePdf(path,function(result){

		if(LOG){
			console.log('\n' + 'Pdf: ' + result[3]);
			console.log('Title: ' + result[0]);
			console.log('\n' + 'Authors: ' + result[1]);
			console.log('\n' + 'Number of pages: ' + result[2]);
		}

		result.should.be.an.Object;
		result.authors.should.not.be.empty;
		result.title.should.not.be.empty;
		result.numberofpages.should.be.a.Number;
		done();
		});

	});

}

describe ('PDF analyse test',function(){
	for (var i = 0; i < pdflist.length; i++) {
		doTest(i);
	}
});
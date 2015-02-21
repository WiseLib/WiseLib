var pdf = require ('../lib/pdf_analyse.js');
var pdflist = ['../pdfs/test2.pdf','../pdfs/test3.pdf','../pdfs/test4.pdf','../pdfs/test5.pdf','../pdfs/test6.pdf','../pdfs/test7.pdf','../pdfs/test8.pdf'];
var options = {
  type: 'text'  // extract the actual text in the pdf file
};

var LOG = false;

describe ('PDF analyse test',function(){
	it("should perform a correct analysis",function(){
		for (var i = 0; i < pdflist.length; i++) {
			var path =  pdflist[i];
			pdf.analysePdf(path,function(result){

				if(LOG){
					console.log('\n' + "Pdf: " + result[3]);
					console.log("Title: " + result[0]);
					console.log('\n' + "Authors: " + result[1]);
					console.log('\n' + "Number of pages: " + result[2]);}

				result.should.be.an.array;
				result[0];should.not.be.empty;
				result[1];should.not.be.empty;
				result[2].should.be.a.number;
				});
		};
	})

})
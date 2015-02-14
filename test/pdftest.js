var pdf = require ('../lib/pdf_analyse.js');
var pdflist = ['../pdfs/test2.pdf','../pdfs/test3.pdf','../pdfs/test4.pdf','../pdfs/test5.pdf','../pdfs/test6.pdf','../pdfs/test7.pdf','../pdfs/test8.pdf'];
var options = {
  type: 'text'  // extract the actual text in the pdf file
};


//for (var i = 0; i < pdflist.length; i++) {
for (var i = 0; i < 1; i++) {
	var path =  pdflist[i];
	pdf.analysePdf(path,options,function(result){
		console.log('\n' + "Pdf: " + result[3]);
		console.log("Title: " + result[0]);
		console.log('\n' + "Authors:" + result[1]);
		console.log('\n' + "References:" + result[2])
	});
};


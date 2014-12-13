var should = require('should');
var routes = require('../lib/routes.js');

describe('Validate email adress test',function(){
	describe ('Test correct email adresses',function(){
		var email1 = 'test@mail.com';
		var email2 = '123@test.com';
		var email3 = 'test@mail.server.com';
		var email4 = '"r@cer"@voorbeeld.be';
		var email5 = '"test man"@mail.com';

		var response = true;

		response = routes.validateEmail(email1);
		response = routes.validateEmail(email2);
		response = routes.validateEmail(email3);
		response = routes.validateEmail(email4);

		it('should validate the adresses correctly',function(){
			response.should.be.true;
		})

	});
	describe ('Test false email adresses',function(){

		var email1 = 'testmail.com';
		var email2 = '123@testcom';
		var email3 = 'test@mail.routes.com';
		var email4 = 'r@cer@voorbeeld.be';
		var email5 = 'test man@mail.com';

		var response = false;

		response = routes.validateEmail(email1);
		response = routes.validateEmail(email2);
		response = routes.validateEmail(email3);
		response = routes.validateEmail(email4)
		response = routes.validateEmail(email5)

		it('should validate the adresses correctly',function(){
			response.should.be.false;
		})

	})
})
var should = require('should');
var routes = require('../lib/validator.js');

/**
 * This test checks the validateEmail function. The function is tested by atempting to validate a number of correct and a number of incorrect e-mailadresses.
 * The test succeeds if all adressess are validated correctly.
 * 
 * @test
 */
describe('Validate email adress test',function(){
	describe ('Test correct email adresses',function(){

		var email = ['test@mail.com','123@test.com','test@mail.server.com','"r@cer"@voorbeeld.be','"test man"@mail.com']

		var response = true;

		email.forEach(function(email){
			response = routes.validateEmail(email);
		})

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

		var email = ['testmail.com','123@testcom','test@mail.routes.com','r@cer@voorbeeld.be','test man@mail.com']

		var response = false;

		email.forEach(function(email){
			response = routes.validateEmail(email);
		})

		it('should validate the adresses correctly',function(){
			response.should.be.false;
		})

	})
})

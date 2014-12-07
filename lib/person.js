'use strict';

function Person(data) {
	for (var x in data) {
		this[x] = data[x];
	}
}

module.exports = Person;
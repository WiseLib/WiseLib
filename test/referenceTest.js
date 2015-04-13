'use strict';
var should = require('should');
var references = require('../src/references.js');

describe('Validate references test', function(){
    describe('Validate unknown reference', function(){
        var reference = {references: [{ citationKey: 'sutto1998',
                        entryType: 'book',
                        entryTags:
                        { title: 'reinforcement learning: an introduction',
                          author: 'sutton, richard and barto, andrew',
                          publisher: 'a bradford book',
                          year: '1998',
                          owner: 'wout van riel' }}]};
        var result = references.link(reference);

        console.log(result.references);

        result.references.should.not.be.empty;

    });
})

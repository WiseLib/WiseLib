'use strict';
var should = require('should');
var references = require('../src/references.js');

function end(id){
    console.log("ID: " + id);
}

describe('Validate references test', function(){
    describe('Validate unknown reference', function(){
        var reference = {references: [{ citationKey: 'sutto1998',
                        entryType: 'book',
                        entryTags:
                        { title: 'reinforcement learning: an introduction',
                          author: 'sutton, richard and barto, andrew',
                          publisher: 'a bradford book',
                          year: '1998',
                          owner: 'wout van riel' }},
                          { citationKey: 'testero',
                          entryType: 'publication',
                          entryTags:
                          { title: 'test learning: an introduction',
                          author: 'bart, richard and eli, puns',
                          publisher: 'a bradford book',
                          year: '1994',
                          owner: 'wout van riel' }}]};


        references.link(reference, end);

    });
})

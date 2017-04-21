/*
�2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. 
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var chalk = require('chalk');
var chai = require('chai');
var expect = chai.expect;
var FEEL = require('../dist/feel');

describe(chalk.blue('Arithmetic expression ast parsing test'), function() {
    debugger;
    it('Successfully builds ast from simple arithmetic expression', function(done) {
        var text = 'a + b - c';
        var _context = {
            a: 10,
            b: 20,
            c: 5
        };
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build(_context).then(result => {
            expect(result).not.to.be.undefined;
            done();
        }).catch(err => done(err));
    });

    it('Successfully builds ast from arithmetic expression', function(done) {
        var text = '((a + b)/c - (d + e*2))**f';

        var _context = {
            a: 10,
            b: 20,
            c: 5,
            d: 6,
            e: 30,
            f: 3
        };

        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build(_context).then(result => {
            expect(result).not.to.be.undefined;
            done();
        }).catch(err => done(err));
    });

    it('Successfully builds ast from arithmetic expression', function(done) {
        var text = '1-(1+rate/12)**-term';
        var _context = {
            rate: 12,
            term: 5
        };
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build(_context).then(result => {
            expect(result).not.to.be.undefined;
            done();
        }).catch(err => done(err));
    });

    it('Successfully builds ast from arithmetic expression', function(done) {
        var text = '(a + b)**-c';
        _context = {
            a: 10,
            b: 20,
            c: 5
        };
        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build(_context).then(result => {
            expect(result).not.to.be.undefined;
            done();
        }).catch(err => done(err));
    });
});
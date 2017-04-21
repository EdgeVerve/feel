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

describe(chalk.blue('Quantified expression grammar test'), function () {

    it('Successfully creates ast from simple quantified expression', function (done) {
        var text = 'some ch in credit history satisfies ch.event = "bankruptcy"';

        try {
            var parsedGrammar = FEEL.parse(text);
            expect(parsedGrammar).not.to.be.undefined;
        } catch (e) {
            expect(parsedGrammar).not.to.be.undefined;
            expect(e).to.be.undefined;
        }
        done();
    });

    it('Fails to create ast from quantified expression', function (done) {
        var text = 'somech in credit history satisfies ch.event = "bankruptcy"';

        try {
            var parsedGrammar = FEEL.parse(text);
            expect(parsedGrammar).to.be.undefined;
        } catch (e) {
            expect(parsedGrammar).to.be.undefined;
            expect(e).not.to.be.undefined;
        }
        done();
    });
});
/*
�2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries. 
The Program may contain/reference third party or open source components, the rights to which continue to remain with the applicable third party licensors or the open source community as the case may be and nothing here transfers the rights to the third party and open source components, except as expressly permitted.
Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/
var chalk = require('chalk');
var chai = require('chai');
var expect = chai.expect;
var FEEL = require('../../dist/feel');

describe(chalk.blue('Builtin function grammar test'), function() {

    describe(chalk.blue('decimal function'), function() {

        it('Successfully creates nested expression', function(done) {
            var text = 'decimal(decimal(0.22 * a, 0) * 223.65, 0)';
            const context = {
                a: 10
            };
             
            var parsedGrammar = FEEL.parse(text);
            parsedGrammar.build(context).then(result => {
                expect(result).not.to.be.undefined;
                expect(result).to.be.equal(447);
                done();
            }).catch(err => done(err));
        });
    });
});
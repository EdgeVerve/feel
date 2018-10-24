/**
 *
 * ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 *
 */

var chai = require('chai');
var expect = chai.expect;
var fs = require('fs');
var { createDecisionGraphAST, executeDecisionService } = require('../../index')().decisionService;

var readJSON = (file) => JSON.parse(fs.readFileSync(file, { encoding: 'utf8' }));

describe('decision table exposed in a service...', function () {
    it('should properly execute a decision table with is exposed through a service and one of its input expression references something in the graph', done => {
        var decisionMap = readJSON('./test/data/sample2.json');
        var ast = createDecisionGraphAST(decisionMap);
        var payload = {
            "name": "Ram",
            "msg": "Hi"
        }

        executeDecisionService(ast, 'final dec', payload, 'foo')
            .then(result => {
                expect(result).to.be.object;
                expect(result).to.have.property('outstring');
                expect(result.outstring).to.equal('Hi ram');
                done();
            }).
            catch(done);
    });

    it('should error correctly when a decision table with a non-existent input expression is given', done => {
        var decisionMap = readJSON('./test/data/sample2.json');

        var feelString = decisionMap['final dec'];

        decisionMap['final dec'] = feelString.replace('test1', 'test2');
        expect(feelString.substr(feelString.indexOf('test'), 5)).to.equal('test1');
        var feelString2 = decisionMap['final dec'];
        expect(feelString2.substr(feelString2.indexOf('test'), 5)).to.equal('test2');
        var ast = createDecisionGraphAST(decisionMap);

        var payload = {
            "name": "Ram",
            "msg": "Hi"
        };

        executeDecisionService(ast, 'final dec', payload, 'foo2')
            
            .then(() => {
                done(new Error('should not execute'));
            })
            .catch(err => {
                expect(err.message).to.include('test2');
                done();
            });
    });
});

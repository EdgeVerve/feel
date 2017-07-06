/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/
const chalk = require('chalk');
const chai = require('chai');
const expect = chai.expect;
const FEEL = require('../../dist/feel');

describe(chalk.blue('External function definition and evaluation'), () => {

    before('setup test data, read excel file and get the decision table', (done) => {
        done();
    });

    it('External Function - Evaluation', (done) => {
        const context = '{ foo : function(a, b) external { js : {dependencies : [{ _ : "lodash"}], signature : "done(null, _.chunk(a, b))"}}}';
        const text = 'foo(a,b)'
        const parsedContext = FEEL.parse(context); 
        const parsedText = FEEL.parse(text);
        const payload = {a:[1,2,3,4], b: 2};

        parsedContext.build(payload).then((ctx) => {
            return parsedText.build(Object.assign({}, ctx, payload));
        }).then((result) => {
            expect(result).not.to.be.undefined;
            expect(result.length).to.equal(2);
            expect(result[0].length).to.equal(2);
            expect(result[1].length).to.equal(2);
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('External Function - Evaluation', (done) => {
        const context = '{ foo : function(a, b) external { js : {signature : "setTimeout(done, b, null, a)"}}}';
        const text = 'foo(a,b)'
        const parsedContext = FEEL.parse(context);
        const parsedText = FEEL.parse(text);
        const payload = {a: 5, b: 1000};

        parsedContext.build(payload).then((ctx) => {
            return parsedText.build(Object.assign({}, ctx, payload));
        }).then((result) => {
            expect(result).to.equal(payload.a);
            done();
        }).catch(err => {
            done(err);
        });
    });

});

/*  
*  
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),  
*  Bangalore, India. All Rights Reserved.  
*   
*/
const chalk = require('chalk');
const chai = require('chai');
const expect = chai.expect;
const FEEL = require('../dist/feel');

describe(chalk.blue('Random list of rules'), function () {

    it('Successfully parses and executes combination of built-in and user-defined functions', function (done) {
        const context = '{getAmount : function(a,b,c,d) if d > a then min([d - a, b - a])*c else 0}';
        const text = 'getAmount(0, b, 30, d)';
        const payload =  {"b":50 ,"d" : 300 };
        try{
            const parsedContext = FEEL.parse(context);
            const parsedText = FEEL.parse(text);

            parsedContext.build().then(ctx => {
                return Object.assign({}, ctx, payload);
            }).then((context) => {
                return parsedText.build(context);
            }).then((result) => {
                expect(result).to.equal(1500);
                done();
            }).catch(err => { 
                done(err);
            });
        }
        catch(e){
            done(e);
        }
    });

    it('Successfully parses and executes positive unary test with qualified name', function (done) {
        const text = '> b->c->d->e';
        const payload =  {"b":{"c":{"d":{"e":300}}}};
        try{
            const parsedText = FEEL.parse(text);
            parsedText.build(payload)
            .then((result) => {
                expect(result(500)).to.be.true;
                done();
            }).catch(err => { 
                done(err);
            });
        }
        catch(e){
            done(e);
        }
    });

    it('Successfully parses and executes open-ended interval', function (done) {
        const text = '[a..b)';
        const payload =  {"a":10,"b":20};
        try{
            const parsedText = FEEL.parse(text);
            parsedText.build(payload)
            .then((result) => {
                expect(result(20)).to.be.false;
                done();
            }).catch(err => { 
                done(err);
            });
        }
        catch(e){
            done(e);
        }
    });

    it('Successfully parses and executes combination of built-in and user-defined functions with named parameters', function (done) {
        const context = '{getAmount : function(a,b,c,d) if d > a then min([d - a, b - a])*c else 0}';
        const text = 'getAmount(a:10,b:20,d:30,c:40)';

        try{
            const parsedContext = FEEL.parse(context);
            const parsedText = FEEL.parse(text);

            parsedContext.build().then((context) => {
                return parsedText.build(context);
            }).then((result) => {
                expect(result).to.equal(400);
                done();
            }).catch(err => { 
                done(err);
            });
        }
        catch(e){
            done(e);
        }
    });

     it('Successfully parses and executes path expression', function (done) {
        const context = '{getAddress : function() address}';
        const text = 'getAddress().city';
        const payload =  {"address":{"city" : "Gotham" }};
        try{
            const parsedContext = FEEL.parse(context);
            const parsedText = FEEL.parse(text);

            parsedContext.build().then(ctx => {
                return Object.assign({}, ctx, payload);
            }).then((context) => {
                return parsedText.build(context);
            }).then((result) => {
                expect(result).to.equal("Gotham");
                done();
            }).catch(err => { 
                done(err);
            });
        }
        catch(e){
            done(e);
        }
    });

     it('Successfully parses and executes for expression', function (done) {
        const text = 'for a in [1,2,3] return a * b + c';
        const payload =  {"b":5,"c":5};
        try{
            const parsedText = FEEL.parse(text);
            parsedText.build(payload)
            .then((result) => {
                expect(result).to.eql([10,15,20]);
                done();
            }).catch(err => { 
                done(err);
            });
        }
        catch(e){
            done(e);
        }
    })

     it('Successfully parses and executes for quantified expression', function (done) {
        const text = 'some a in [1,2,5] , b in [2,3,4] satisfies a < b';
        try{
            const parsedText = FEEL.parse(text);
            parsedText.build()
            .then((result) => {
                expect(result).to.be.true;
                done();
            }).catch(err => { 
                done(err);
            });
        }
        catch(e){
            done(e);
        }
    })
});
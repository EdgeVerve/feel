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

     it('Successfully parses and executes interval unary test with date and time', function (done) {
        const text = '[date and time("2017-04-12T11:30:00Z")..date and time("2017-04-12T12:45:00Z")]';
        const context = '{dt : date and time("2017-04-12T11:45:00Z")}';
        try{
            const parsedContext = FEEL.parse(context);
            const parsedText = FEEL.parse(text);

            const callPromise = (parsedTxt, ctx) => {
              return parsedTxt.build(ctx)
              .then(result => result(ctx.dt));
            }

            parsedContext.build().then(ctx => {
              return callPromise(parsedText, ctx);
            }).then((result) => {
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

    it('Successfully parses and executes if expression using date and time with format and setTimezone functions', function (done) {
        const text = 'if dt in [date and time("2017-04-12T11:30:00Z")..date and time("2017-04-12T12:45:00Z")] then formatDateTime(setTimezone(dt, "America/Toronto")) else null';
        const context = '{dt : date and time("2017-04-12T11:45:00Z")}';
        try{
            const parsedContext = FEEL.parse(context);
            const parsedText = FEEL.parse(text);

            parsedContext.build().then(ctx => {
              return parsedText.build(ctx);
            }).then((result) => {
                expect(result).to.equal('2017-04-12T07:45:00-04:00');
                done();
            }).catch(err => {
                done(err);
            });
        }
        catch(e){
            done(e);
        }
    })

    it('Successfully parses and executes if expression using now, date string', function (done) {
        const payload = {dob : '1988-06-10'}
        const context = '{now: date(""), y: date(dob), age: (years and months duration(y, now)).years}'
        const text = 'if age > 25 then "Legal" else "Illegal"';
        try{
            const parsedContext = FEEL.parse(context);
            const parsedText = FEEL.parse(text);

            parsedContext.build(payload).then(ctx => {
              const c = Object.assign({}, payload, ctx);
              return parsedText.build(c);
            }).then((result) => {
                expect(result).to.equal('Legal');
                done();
            }).catch(err => {
                done(err);
            });
        }
        catch(e){
            done(e);
        }
    })

    it('Successfully parses and executes filter expression on a list', function (done) {
        const context = '{ list : [1,2,3,4,5]}'
        const text = 'list[item > 3]';
        try{
            const parsedContext = FEEL.parse(context);
            const parsedText = FEEL.parse(text);

            parsedContext.build().then(ctx => {
              return parsedText.build(ctx);
            }).then((result) => {
                expect(result).to.eql([4,5]);
                done();
            }).catch(err => {
                done(err);
            });
        }
        catch(e){
            done(e);
        }
    })

    it('Successfully parses and executes filter expression with list semantics to find an item at a particular index', function (done) {
        const context = '{ list : [1,2,3,4,5]}'
        const text = 'list[3]';
        try{
            const parsedContext = FEEL.parse(context);
            const parsedText = FEEL.parse(text);

            parsedContext.build().then(ctx => {
              return parsedText.build(ctx);
            }).then((result) => {
                expect(result).to.equal(4);
                done();
            }).catch(err => {
                done(err);
            });
        }
        catch(e){
            done(e);
        }
    })

    it('Successfully parses and executes time with offset specified as duration', function (done) {
        const text = 'time("T23:59:00z") = time(23, 59, 0, duration("PT0H"))';
        try{
            const parsedText = FEEL.parse(text);
            parsedText.build().then((result) => {
                expect(result).to.equal(true);
                done();
            }).catch(err => {
                done(err);
            });
        }
        catch(e){
            done(e);
        }
    })

    it('Successfully parses and executes time with offset specified as negative duration', function (done) {
        const text = 'time("T10:15:00-07:00") = time(10, 15, 0, -duration("PT7H"))';
        try{
            const parsedText = FEEL.parse(text);
            parsedText.build().then((result) => {
                expect(result).to.equal(true);
                done();
            }).catch(err => {
                done(err);
            });
        }
        catch(e){
            done(e);
        }
    })

    it ('Successfully parses and executes SimpleExpressions and usage of mutiple grammar entry points', function (done) {
       try{
            const text = '1,2,3,4'
            const parsedText = FEEL.parse(text,{startRule : "SimpleExpressions"}); // parsed with "SimpleExpressions" entry point
            parsedText.build().then((result) => {
                expect(result).to.eql([1,2,3,4]);
                done();
            }).catch(err => {
                done(err);
            });
        }
        catch(e){
            done(e);
        }
    })

    it ('Successfully parses and executes SimpleExpressions and usage of mutiple grammar entry points with context entry', function (done) {
       try{
            const context = '{a : 1, b:2, c:3, d:4}';
            const parsedContext = FEEL.parse(context); // parsed with default entry point

            const text = 'a,b,c,d'
            const parsedText = FEEL.parse(text,{startRule : "SimpleExpressions"}); // parsed with "SimpleExpressions" entry point
            parsedContext.build().then(ctx => {
              return parsedText.build(ctx);
            }).then((result) => {
                expect(result).to.eql([1,2,3,4]);
                done()
            }).catch(err => {
                done(err);
            });
        }
        catch(e){
            done(e);
        }
    })
});

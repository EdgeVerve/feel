/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/
var chalk = require('chalk');
var chai = require('chai');
var expect = chai.expect;
var FEEL = require('../../dist/feel');

describe(chalk.blue('Filter Expression Evaluation'), function() {
    it('Successfully builds filter expression to find item at a specific index in an array', function(done) {
        var text = 'a[1]';

        const _context = {
            a: [1,2,3,4]
        };

        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build(_context).then(result => {
            expect(result).to.equal(2);
            done();
        }).catch(err => done(err));
    });

    it('Successfully builds filter expression to get the sub-array from an array of values', function(done) {
        var text = 'a[item > 2]';

        const _context = {
            a: [1,2,3,4]
        };

        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build(_context).then(result => {
            expect(result).to.eql([3,4]);
            done();
        }).catch(err => done(err));
    });

    it('Successfully builds filter expression to get the sub-array from an array of objects', function(done) {
        var text = 'a[salary > 20000]';

        const _context = {
            a: [{name: 'Foo', salary: 30000}, {name: 'Bar', salary: 21000}, {name: 'Baz', salary: 20000}]
        };

        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build(_context).then(result => {
            expect(result).to.eql([{name: 'Foo', salary: 30000}, {name: 'Bar', salary: 21000}]);
            done();
        }).catch(err => done(err));
    });

    it('Successfully builds filter expression with path expression to get an array of values', function(done) {
        var text = 'a[salary > 20000].name';

        const _context = {
            a: [{name: 'Foo', salary: 30000}, {name: 'Bar', salary: 21000}, {name: 'Baz', salary: 20000}]
        };

        var parsedGrammar = FEEL.parse(text);
        parsedGrammar.build(_context).then(result => {
            expect(result).to.eql(['Foo', 'Bar']);
            done();
        }).catch(err => done(err));
    });

    it('Successfully builds chain of filter expressions to get value', function(done) {
        const payload= {
            a: [{name: 'Foo', salary: 30000}, {name: 'Bar', salary: 21000}, {name: 'Baz', salary: 20000}]
        };

        const context = '{namesWithSalaryGreaterThan20000 : a[salary > 20000].name}'
        const text = 'namesWithSalaryGreaterThan20000[1]';

        const parsedText = FEEL.parse(text);
        const parsedContext = FEEL.parse(context);

        parsedContext.build(payload).then(ctx => {
            return Object.assign({}, ctx, payload);
        }).then((context) => {
            return parsedText.build(context);
        }).then((result) => {
            expect(result).to.equal('Bar');
            done();
        }).catch(err => {
            done(err);
        });
    });

     it('Successfully builds chain of path expression and filter expression to get an array and find the sum', function(done) {
       debugger;
        const payload= {a : {
            b: [{name: 'Foo', salary: 30000}, {name: 'Bar', salary: 21000}, {name: 'Baz', salary: 20000}]
        }};

        const context = '{namesWithSalaryGreaterThan20000 : a.b[salary > 20000].name}'
        const text = 'sum(namesWithSalaryGreaterThan20000)';

        const parsedText = FEEL.parse(text);
        const parsedContext = FEEL.parse(context);

        parsedContext.build(payload).then(ctx => {
            return Object.assign({}, ctx, payload);
        }).then((context) => {
            return parsedText.build(context);
        }).then((result) => {
            expect(result).to.equal('FooBar');
            done();
        }).catch(err => {
            done(err);
        });
    });

});

// sum(a.b[c > d].e.f[g=h].i)

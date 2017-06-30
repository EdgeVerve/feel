/*
 *
 *  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 *  Bangalore, India. All Rights Reserved.
 *
 */


const _ = require('lodash');
const fnGen = require('../utils/helper/fn-generator');
const addKwargs = require('../utils/helper/add-kwargs');
const builtInFns = require('../utils/built-in-functions');

module.exports = function (ast) {
  ast.ProgramNode.prototype.build = function (context, type = 'output') {
    return new Promise((resolve, reject) => {
      const args = {
        context: Object.assign({}, context, builtInFns),
        kwargs: {},
      };
      // bodybuilding starts here...
      // let's pump some code ;)
      this.body.build(args)
        .then((result) => {
          if (type === 'input') {
            if (typeof result === 'function') {
              resolve(result);
            } else {
              const fnResult = function (x) {
                return x === result;
              };
              resolve(fnResult);
            }
          } else {
            resolve(result);
          }
        })
        .catch(err => reject(err));
    });
  };


  ast.IntervalStartLiteralNode.prototype.build = function () {
    return fnGen(this.intervalType);
  };

  ast.IntervalEndLiteralNode.prototype.build = function () {
    return fnGen(this.intervalType);
  };

  ast.IntervalNode.prototype.build = function (args) {
    return new Promise((resolve, reject) => {
      const processIntervalStartAndEnd = (startpoint, endpoint) => Promise.all([this.intervalstart.build(), this.intervalend.build()])
        .then(([intervalstart, intervalend]) => x => intervalstart(startpoint)(x) && intervalend(endpoint)(x));

      Promise.all([this.startpoint.build(args), this.endpoint.build(args)])
        .then(([startpoint, endpoint]) => processIntervalStartAndEnd(startpoint, endpoint))
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  };

  ast.SimplePositiveUnaryTestNode.prototype.build = function (args) {
    return new Promise((resolve, reject) => {
      this.operand.build(args)
        .then(result => resolve(fnGen(this.operator || '==')(_, result)))
        .catch(err => reject(err));
    });
  };

  ast.SimpleUnaryTestsNode.prototype.build = function (args) {
    return new Promise((resolve, reject) => {
      if (this.expr) {
        Promise.all(this.expr.map(d => d.build(args))).then((results) => {
          if (this.not) {
            const negResults = results.map(result => args.context.not(result));
            resolve(x => negResults.reduce((result, next) => result && next(x), true));
          } else {
            resolve(x => results.reduce((result, next) => result || next(x), false));
          }
        }).catch(err => reject(err));
      } else {
        resolve(() => true);
      }
    });
  };

  ast.UnaryTestsNode.prototype.build = function (args) {
    return new Promise((resolve, reject) => {
      if (this.expr) {
        Promise.all(this.expr.map(d => d.build(args))).then((results) => {
          if (this.not) {
            const negResults = results.map(result => args.context.not(result));
            resolve(x => negResults.reduce((result, next) => result && next(x), true));
          } else {
            resolve(x => results.reduce((result, next) => result || next(x), false));
          }
        }).catch(err => reject(err));
      } else {
        resolve(() => true);
      }
    });
  };

  /*
  Qualified name is used to define key in context
  It is assumed that if a context entry is defined as an object,
  Qualified Name (i.e. Name -> Name -> Name , e.g. b -> c -> d -> e)
  can be used to extract properties from that object */
  ast.QualifiedNameNode.prototype.build = function (args) {
    return new Promise((resolve, reject) => {
      const [first, ...remaining] = this.names;
      const processRemaining = firstResult => Promise.all(remaining.map(name => name.build(null, false)))
            .then(remResults => remResults.reduce((prev, next) => prev[next], firstResult));

      first.build(args).then((firstResult) => {
        if (remaining.length) {
          return processRemaining(firstResult);
        }
        return firstResult;
      })
      .then(result => resolve(result))
      .catch(err => reject(err));
    });
  };

  ast.ArithmeticExpressionNode.prototype.build = function (args) {
    return new Promise((resolve, reject) => {
      Promise.all([this.operand_1, this.operand_2].map((d) => {
        if (d === null) {
          return Promise.resolve(0);
        }

        return d.build(args);
      }))
        .then(([first, second]) => resolve(fnGen(this.operator)(first)(second)))
        .catch(err => reject(err));
    });
  };

  // _fetch is used to return the name string or
  // the value extracted from context or kwargs using the name string
  ast.NameNode.prototype.build = function (args, _fetch = true) {
    const name = this.nameChars;
    if (!_fetch) {
      return Promise.resolve(name);
    }
    try {
      const obj = (args.kwargs && typeof args.kwargs[name] !== 'undefined' && args.kwargs) || (args.context && typeof args.context[name] !== 'undefined' && args.context);
      return Promise.resolve(obj[name]);
    } catch (err) {
      return Promise.reject(err);
    }
  };

  ast.LiteralNode.prototype.build = function () {
    return Promise.resolve(this.value);
  };

  // Invoking function defined as boxed expression in the context entry
  // See ast.FunctionDefinitionNode for details on declaring function
  // Function supports positional as well as named parameters
  ast.FunctionInvocationNode.prototype.build = function (args) {
    return new Promise((resolve, reject) => {
      const processFormalParameters = (fn, formalParams) => this.params.build(args)
        .then((values) => {
          if (values && Array.isArray(values)) {
            const kwParams = values.reduce((recur, next, i) => {
              const obj = {};
              obj[formalParams[i]] = next;
              return Object.assign({}, recur, obj);
            }, {});
            return addKwargs(args, kwParams);
          }
          return addKwargs(args, values);
        });

      const processUserDefinedFunction = (fnMeta) => {
        const fn = fnMeta.fn;
        const formalParams = fnMeta.params;

        if (formalParams) {
          return processFormalParameters(fn, formalParams)
          .then(argsNew => fn.build(argsNew));
        }
        return fn.build(args);
      };

      const processInBuiltFunction = fnMeta => this.params.build(args).then(values => fnMeta(...values));

      const processFnMeta = (fnMeta) => {
        if (typeof fnMeta === 'function') {
          // for built-in functions like min,max,etc...
          return processInBuiltFunction(fnMeta);
        }

        return processUserDefinedFunction(fnMeta);
      };

      this.fnName.build(args)
      .then(processFnMeta)
      .then(result => resolve(result))
      .catch(err => reject(err));
    });
  };

  ast.NamedParametersNode.prototype.build = function (args) {
    return new Promise((resolve, reject) => {
      Promise.all(this.params.map(d => d.build(args))).then((results) => {
        resolve(Object.assign.apply({}, results));
      }).catch(err => reject(err));
    });
  };

  ast.NamedParameterNode.prototype.build = function (args) {
    return new Promise((resolve, reject) => {
      Promise.all([this.expr.build(args), this.paramName.build(null, false)])
      .then(([value, paramName]) => {
        const obj = {};
        obj[paramName] = value;
        resolve(obj);
      })
      .catch(err => reject(err));
    });
  };

  ast.PositionalParametersNode.prototype.build = function (args) {
    return new Promise((resolve, reject) => {
      Promise.all(this.params.map(d => d.build(args))).then(results => resolve(results)).catch(err => reject(err));
    });
  };

  ast.PathExpressionNode.prototype.build = function (args) {
    return new Promise((resolve, reject) => {
      const [expr, ...names] = this.exprs;
      Promise.all([].concat.call([expr.build(args)], names.map(d => d.build(null, false))))
      .then(([root, ...pathNames]) => pathNames.reduce((accu, next) => accu[next], root))
      .then(result => resolve(result))
      .catch(err => reject(err));
    });
  };

  ast.ForExpressionNode.prototype.build = function (args) {
    return new Promise((resolve, reject) => {
      const evalSatisfies = argsNew => this.expr.build(argsNew);

      const listArgsReduceCb = variables => (res, arg, i) => {
        const objectWithNewProperty = {};
        objectWithNewProperty[variables[i]] = arg;
        return Object.assign({}, res, objectWithNewProperty);
      };

      const zipListsCb = variables => (...listArgs) => {
        const obj = listArgs.reduce(listArgsReduceCb(variables), {});
        const argsNew = addKwargs(listArgs, obj);
        return evalSatisfies(Object.assign({}, args, argsNew));
      };

      const zipLists = (variables, lists) => _.zipWith(...lists, zipListsCb(variables));

      const processLists = (variables, lists) => Promise.all(zipLists(variables, lists));

      Promise.all(this.inExprs.map(d => d.build(args)))
      .then((exprs) => {
        const variables = exprs.map(expr => expr.variable);
        const lists = exprs.map(expr => expr.list);
        return processLists(variables, lists);
      })
      .then(result => resolve(result))
      .catch(err => reject(err));
    });
  };

  ast.InExpressionNode.prototype.build = function (args) {
    return new Promise((resolve, reject) => {
      Promise.all([this.name.build(null, false), this.expr.build(args)])
      .then(([variable, list]) => {
        if (!Array.isArray(list)) {
          reject("'In Expression' expects an array to operate on");
        } else {
          resolve({ list, variable });
        }
      })
      .catch(err => reject(err));
    });
  };

  ast.IfExpressionNode.prototype.build = function (args) {
    return new Promise((resolve, reject) => {
      this.condition.build(args)
      .then((condition) => {
        let returnPromise;
        if (condition) {
          returnPromise = this.thenExpr.build(args);
        } else {
          returnPromise = this.elseExpr.build(args);
        }
        return returnPromise;
      })
      .then(result => resolve(result))
      .catch(err => reject(err));
    });
  };

  ast.QuantifiedExpressionNode.prototype.build = function (args) {
    return new Promise((resolve, reject) => {
      const evalSatisfies = argsNew => this.expr.build(argsNew);

      const listArgsReduceCb = variables => (res, arg, i) => {
        const objectWithNewProperty = {};
        objectWithNewProperty[variables[i]] = arg;
        return Object.assign({}, res, objectWithNewProperty);
      };

      const zipListsCb = variables => (...listArgs) => {
        const obj = listArgs.reduce(listArgsReduceCb(variables), {});
        const argsNew = addKwargs(listArgs, obj);
        return evalSatisfies(Object.assign({}, args, argsNew));
      };

      const zipLists = (variables, lists) => _.zipWith(...lists, zipListsCb(variables));

      const processLists = (variables, lists) => Promise.all(zipLists(variables, lists));

      Promise.all(this.inExprs.map(d => d.build(args)))
      .then((exprs) => {
        const variables = exprs.map(expr => expr.variable);
        const lists = exprs.map(expr => expr.list);
        return processLists(variables, lists);
      })
      .then((results) => {
        const truthy = results.filter(d => Boolean(d) === true).length;
        if (this.quantity === 'some') {
          resolve(Boolean(truthy));
        } else {
          resolve(truthy === results.length);
        }
      })
      .catch(err => reject(err));
    });
  };

  ast.LogicalExpressionNode.prototype.build = function (args) {
    return new Promise((resolve, reject) => {
      Promise.all([this.expr_1.build(args), this.expr_2.build(args)]).then((results) => {
        const res = [];
        res[0] = results[0] || Boolean(results[0]); // to handle null and undefined
        res[1] = results[1] || Boolean(results[1]); // to handle null and undefined
        resolve(fnGen(this.operator)(res[0])(res[1]));
      }).catch(err => reject(err));
    });
  };

  ast.ComparisionExpressionNode.prototype.build = function (args) {
    return new Promise((resolve, reject) => {
      let operator = this.operator;
      if (operator === 'between') {
        Promise.all([this.expr_1, this.expr_2, this.expr_3].map(d => d.build(args)))
          .then((results) => {
            if ((results[0] >= results[1]) && (results[0] <= results[2])) {
              resolve(true);
            } else {
              resolve(false);
            }
          }).catch(err => reject(err));
      } else if (operator === 'in') {
        const processExpr = (operand) => {
          this.expr_2 = Array.isArray(this.expr_2) ? this.expr_2 : [this.expr_2];
          return Promise.all(this.expr_2.map(d => d.build()))
          .then(tests => tests.map(test => test(operand)).reduce((accu, next) => accu || next, false));
        };
        this.expr_1.build(args)
        .then(operand => processExpr(operand))
        .then(result => resolve(result))
        .catch(err => reject(err));
      } else {
        Promise.all([this.expr_1, this.expr_2].map(d => d.build(args)))
          .then((results) => {
            operator = operator !== '=' ? operator : '==';
            resolve(fnGen(operator)(results[0])(results[1]));
          }).catch(err => reject(err));
      }
    });
  };

  // TODO : implement item and object filter
  // TODO : see if the filter returns a function which can be applied on the list during execution
  ast.FilterExpressionNode.prototype.build = function (args) {
    return new Promise((resolve, reject) => {
      this.expr.build(args).then((result) => {
        let kwargsNew = {};
        if (Array.isArray(result)) {
          Promise.all(result.map((d) => {
            if (typeof d === 'object') {
              kwargsNew = addKwargs(args, d);
            } else {
              kwargsNew = addKwargs(args, {
                item: d,
              });
            }
            return this.filterExpr.build(kwargsNew);
          })).then((booleanValues) => {
            resolve(result.filter((d, i) => booleanValues[i]));
          }).catch(err => reject(err));
        } else {
          reject('filter can be applied only on a collection');
        }
      }).catch(err => reject(err));
    });
  };

  ast.InstanceOfNode.prototype.build = function () {
    return new Promise((resolve, reject) => {
      this.expr.build().then((result) => {
        resolve(result instanceof this.exprType.build());
      }).catch(err => reject(err));
    });
  };

  ast.ListNode.prototype.build = function (args) {
    return new Promise((resolve, reject) => {
      Promise.all(this.exprList.map(d => d.build(args))).then((result) => {
        resolve(result);
      }).catch(err => reject(err));
    });
  };

  ast.FunctionDefinitionNode.prototype.build = function () {
    return new Promise((resolve, reject) => {
      if (this.formalParams && this.formalParams.length) {
        Promise.all(this.formalParams.map(d => d.build(null, false))).then((results) => {
          resolve({
            fn: this.body,
            params: results,
          });
        }).catch(err => reject(err));
      } else {
        resolve({
          fn: this.body,
          params: null,
        });
      }
    });
  };

  ast.FunctionBodyNode.prototype.build = function (args) {
    return new Promise((resolve, reject) => {
      if (this.extern) {
        try {
          resolve(this.expr(args));
        } catch (err) {
          reject(err);
        }
      } else {
        this.expr.build(args).then((res) => {
          resolve(res);
        }).catch(err => reject(err));
      }
    });
  };

  ast.ContextNode.prototype.build = function (args) {
    return new Promise((resolve, reject) => {
      this.entries
        .reduce((p, entry) => p.then(argsNew => entry.build(argsNew)), Promise.resolve(args))
        .then(result => resolve(result.kwargs))
        .catch(err => reject(err));
    });
  };

  ast.ContextEntryNode.prototype.build = function (args) {
    return new Promise((resolve, reject) => {
      Promise.all([this.expr.build(args), this.key.build(null, false)])
      .then(([value, key]) => {
        const obj = {};
        obj[key] = value;
        const argsNew = addKwargs(args, obj);
        resolve(argsNew);
      })
      .catch(err => reject(err));
    });
  };
};

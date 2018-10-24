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
const externalFn = require('../utils/helper/external-function');
const resolveName = require('../utils/helper/name-resolution.js');
const { logger } = require('../logger');
const { enableExecutionLogging, logResult } = require('../settings');
const util = require('util');

const stringify = (obj) => {
  if (typeof obj === 'function') {
    return obj.toString();
  }
  return JSON.stringify(obj);
};

const $log = logger('feel-ast-parser');
const log = {};

const rlog = {};

Object.keys($log).forEach((k) => {
  let msg;
  log[k] = (...args) => {
    if (enableExecutionLogging) {
      $log[k](...args);
    }
  };

  const prefix = k === 'error' ? 'ERROR' : 'RESULT';

  if (logResult) {
    msg = `%s, RULE: %s, TEXT: %s, ${prefix}: %s`;
  } else {
    msg = '%s, RULE: %s, TEXT: %s';
  }

  rlog[k] = (...args) => {
    if (enableExecutionLogging) {
      // const options = args.shift();
      // if (!logResult) {
      //   args.pop();
      // }
      // $log[k].call($log, options, util.format(msg, ...args));
      const [options, message, rule, text, result] = args;
      if (logResult) {
        $log[k].call($log, options, util.format(msg, message, rule, text, result));
      } else {
        $log[k].call($log, options, util.format(msg, message, rule, text));
      }
    }
  };
});

module.exports = function (ast) {
  ast.ProgramNode.prototype.build = function (data = {}, env = {}, type = 'output') {
    // const self = this;
    return new Promise((resolve, reject) => {
      let args = {};
      if (!data.isContextBuilt) {
        const context = Object.assign({}, data, builtInFns);
        args = Object.assign({}, { context }, env);
        args.isContextBuilt = true;
      } else {
        args = data;
      }
      const options = (args && args.context && args.context.options) || {};
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
              // $log.info(options, `ProgramNode build success with result - ${stringify(result)}, text: ${this.text}`);
              rlog.info(options, 'ProgramNode build success', this.rule, this.text, stringify(result));
              resolve(fnResult);
            }
          } else {
            // $log.info(options, `ProgramNode build success with result - ${stringify(result)}, text: ${this.text}`);
            rlog.info(options, 'ProgramNode build success', this.rule, this.text, stringify(result));
            resolve(result);
          }
        })
        .catch((err) => {
          // $log.error(options, `ProgramNode build failed with error - ${err},text: ${this.text}`);
          rlog.error(options, 'ProgramNode build error', this.rule, this.text);
          reject(err);
        });
    });
  };


  ast.IntervalStartLiteralNode.prototype.build = function () {
    return fnGen(this.intervalType);
  };

  ast.IntervalEndLiteralNode.prototype.build = function () {
    return fnGen(this.intervalType);
  };

  ast.IntervalNode.prototype.build = function (args) {
    const options = (args && args.context && args.context.options) || {};
    return new Promise((resolve, reject) => {
      const processIntervalStartAndEnd = (startpoint, endpoint) => Promise.all([this.intervalstart.build(), this.intervalend.build()])
        .then(([intervalstart, intervalend]) => x => intervalstart(startpoint)(x) && intervalend(endpoint)(x));

      Promise.all([this.startpoint.build(args), this.endpoint.build(args)])
        .then(([startpoint, endpoint]) => processIntervalStartAndEnd(startpoint, endpoint))
        .then((result) => {
          // log.debug(options, `IntervalNode build success with result - ${stringify(result)}, text: ${this.text}`);
          rlog.debug(options, 'IntervalNode build success', this.rule, this.text, stringify(result));
          resolve(result);
        })
        .catch((err) => {
          // log.error(options, `IntervalNode build failed with error - ${err},text: ${this.text}`);
          rlog.error(options, 'IntervalNode build failed', this.rule, this.text);
          reject(err);
        });
    });
  };

  ast.SimplePositiveUnaryTestNode.prototype.build = function (args) {
    const options = (args && args.context && args.context.options) || {};
    return new Promise((resolve, reject) => {
      this.operand.build(args)
        .then((result) => {
          // log.debug(options, `SimplePositiveUnaryTestNode build success with result - ${this.operator} ${stringify(result)}, text: ${this.text}`);
          rlog.debug(options, `SimplePositiveUnaryTestNode build success (operator: ${this.operator})`, this.rule, this.text, stringify(result));
          resolve(fnGen(this.operator || '==')(_, result));
        })
        .catch((err) => {
          // log.error(options, `SimplePositiveUnaryTestNode build failed with error - ${err},text: ${this.text}`);
          rlog.error(options, `SimplePositiveUnaryTestNode build failed (operator: ${this.operator})`, this.rule, this.text);
          reject(err);
        });
    });
  };

  ast.SimpleUnaryTestsNode.prototype.build = function (data = {}) {
    const context = Object.assign({}, data, builtInFns);
    const args = { context };
    const options = (args && args.context && args.context.options) || {};
    return new Promise((resolve, reject) => {
      if (this.expr) {
        Promise.all(this.expr.map(d => d.build(args))).then((results) => {
          // log.debug(options, `SimpleUnaryTestsNode build success, text: ${stringify(this.text)}`);
          rlog.debug(options, 'SimpleUnaryTestsNode build success', this.rule, this.text, stringify(results));

          if (this.not) {
            const negResults = results.map(result => args.context.not(result));
            resolve(x => negResults.reduce((result, next) => result && next(x), true));
          } else {
            resolve(x => results.reduce((result, next) => result || next(x), false));
          }
        }).catch((err) => {
          // log.error(options, `SimpleUnaryTestsNode build failed with error - ${err},text: ${this.text}`);
          rlog.error(options, 'SimpleUnaryTestsNode build failed', this.rule, this.text);
          reject(err);
        });
      } else {
        // log.debug(options, `SimpleUnaryTestsNode encountered "-" - resolved to true, text: ${this.text}`);
        rlog.debug(options, 'SimpleUnaryTestsNode build success (encountered: -)', this.rule, this.text);
        resolve(() => true);
      }
    });
  };

  ast.UnaryTestsNode.prototype.build = function (args) {
    const options = (args && args.context && args.context.options) || {};
    return new Promise((resolve, reject) => {
      if (this.expr) {
        Promise.all(this.expr.map(d => d.build(args))).then((results) => {
          // log.debug(options, `UnaryTestsNode build success with result - ${stringify(results)}, text: ${this.text}`);
          rlog.debug(options, 'UnaryTestsNode build success', this.rule, this.text, stringify(results));
          if (this.not) {
            const negResults = results.map(result => args.context.not(result));
            resolve(x => negResults.reduce((result, next) => result && next(x), true));
          } else {
            resolve(x => results.reduce((result, next) => result || next(x), false));
          }
        }).catch((err) => {
          // log.error(options, `UnaryTestsNode build failed with error - ${err},text: ${this.text}`);
          rlog.error(options, 'UnaryTestsNode build failed', this.rule, this.text, err);
          reject(err);
        });
      } else {
        // log.debug(options, 'UnaryTestsNode encountered "-" - resolved to true');
        rlog.debug(options, 'UnaryTestsNode build success (encountered: -)', this.rule, this.text);
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
    const options = (args && args.context && args.context.options) || {};
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
      .then((result) => {
        // log.debug(options, `QualifiedNameNode build success with result - ${stringify(result)}, text: ${this.text}`);
        rlog.debug(options, 'QualifiedNameNode build success', this.rule, this.text, stringify(result));
        resolve(result);
      })
      .catch((err) => {
        // log.error(options, `QualifiedNameNode build failed with error - ${err},text: ${this.text}`);
        rlog.error(options, 'QualifiedNameNode build failed', this.rule, this.text, err);
        reject(err);
      });
    });
  };

  ast.ArithmeticExpressionNode.prototype.build = function (args) {
    const options = (args && args.context && args.context.options) || {};
    return new Promise((resolve, reject) => {
      Promise.all([this.operand_1, this.operand_2].map((d) => {
        if (d === null) {
          return Promise.resolve(0);
        }

        return d.build(args);
      }))
        .then(([first, second]) => {
          const result = fnGen(this.operator)(first, second);
          // log.debug(options, `ArithmeticExpressionNode build success with result - ${stringify(result)}, text: ${this.text}`);
          rlog.debug(options, 'ArithmeticExpressionNode build success', this.rule, this.text, stringify(result));
          resolve(result);
        })
        .catch((err) => {
          // log.error(options, `ArithmeticExpressionNode build failed with error - ${err},text: ${this.text}`);
          rlog.error(options, 'ArithmeticExpressionNode build failed', this.rule, this.text, err);
          reject(err);
        });
    });
  };

  ast.SimpleExpressionsNode.prototype.build = function (data = {}, env = {}) {
    let context = {};
    if (!data.isBuiltInFn) {
      context = Object.assign({}, data, builtInFns, { isBuiltInFn: true });
    } else {
      context = data;
    }
    const args = Object.assign({}, { context }, env);
    const options = (args && args.context && args.context.options) || {};
    return new Promise((resolve, reject) => {
      Promise.all(this.simpleExpressions.map(d => d.build(args)))
      .then((results) => {
        // log.debug(options, `SimpleExpressionsNode build success with result - ${stringify(results)}, text: ${this.text}`);
        rlog.debug(options, 'SimpleExpressionsNode build success', this.rule, this.text, stringify(results));
        resolve(results);
      })
      .catch((err) => {
        // log.error(options, `SimpleExpressionsNode build failed with error - ${err},text: ${this.text}`);
        rlog.error(options, 'SimpleExpressionsNode build failed', this.rule, this.text, err);
        reject(err);
      });
    });
  };

  // _fetch is used to return the name string or
  // the value extracted from context or kwargs using the name string
  ast.NameNode.prototype.build = function (args, _fetch = true) {
    const options = (args && args.context && args.context.options) || {};
    const name = this.nameChars;
    if (!_fetch) {
      // log.debug(options, `NameNode - fetch set to false - skipping build with result - ${name}`);
      rlog.debug(options, 'NameNode build success (no fetch)', this.rule, this.text, name);
      return Promise.resolve(name);
    }

    return new Promise((resolve, reject) => {
      resolveName(name, args, this.isResult)
      .then((result) => {
        // log.debug(options, `NameNode build success with result - ${stringify(result)}, text: ${this.text}`);
        rlog.debug(options, 'NameNode build success', this.rule, this.text, stringify(result));
        resolve(result);
      })
      .catch((err) => {
        // log.error(options, `NameNode build failed with error - ${err},text: ${this.text}`);
        rlog.error(options, 'NameNode build failed', this.rule, this.text, err);
        reject(err);
      });
    });
  };

  ast.LiteralNode.prototype.build = function (args) {
    const options = (args && args.context && args.context.options) || {};
    // log.debug(options, `LiteralNode build success with value - ${this.value}, text: ${this.text}`);
    rlog.debug(options, 'LiteralNode build success (with value)', this.rule, this.text, this.value);
    return Promise.resolve(this.value);
  };

  ast.DateTimeLiteralNode.prototype.build = function (args) {
    const options = (args && args.context && args.context.options) || {};
    const fn = args.context[this.symbol];
    return new Promise((resolve, reject) => {
      Promise.all(this.params.map(d => d.build(args))).then((params) => {
        const result = fn(...params);
        // log.debug(options, `DateTimeLiteralNode build success with result - ${stringify(result)}, text: ${this.text}`);
        rlog.debug(options, 'DateTimeLiteralNode build success', this.rule, this.text, stringify(result));
        resolve(result);
      }).catch((err) => {
        // log.error(options, `DateTimeLiteralNode build failed with error - ${err},text: ${this.text}`);
        rlog.error(options, 'DateTimeLiteralNode build failed', this.rule, this.text, err);
        reject(err);
      });
    });
  };

  // Invoking function defined as boxed expression in the context entry
  // See ast.FunctionDefinitionNode for details on declaring function
  // Function supports positional as well as named parameters
  ast.FunctionInvocationNode.prototype.build = function (args) {
    const options = (args && args.context && args.context.options) || {};
    return new Promise((resolve, reject) => {
      const processFormalParameters = formalParams => this.params.build(args)
        .then((values) => {
          if (formalParams && values && Array.isArray(values)) {
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
          return processFormalParameters(formalParams)
            .then(argsNew => fn.build(argsNew));
        }
        log.debug(options, 'FunctionInvocationNode - Processing user-defined function');
        return fn.build(args);
      };

      const processInBuiltFunction = fnMeta => this.params.build(args).then((values) => {
        if (Array.isArray(values)) {
          return fnMeta(...[...values, args.context]);
        }
        log.debug(options, 'FunctionInvocationNode - Processing in-built function');
        return fnMeta(Object.assign({}, args.context, args.kwargs, { graphName: args.graphName, decisionMap: args.decisionMap }), values);
      });

      const processDecision = (fnMeta) => {
        const expr = fnMeta.expr;
        log.debug(options, 'FunctionInvocationNode - Procesing decision');
        if (expr.body instanceof ast.FunctionDefinitionNode) {
          return expr.body.build(args)
            .then(fnMeta => processUserDefinedFunction(fnMeta));
        }
        return processFormalParameters()
            .then(argsNew => expr.build(argsNew));
      };

      const processFnMeta = (fnMeta) => {
        if (typeof fnMeta === 'function') {
          log.debug(options, 'FunctionInvocationNode - in-built function found');
          return processInBuiltFunction(fnMeta);
        } else if (typeof fnMeta === 'object' && fnMeta.isDecision) {
          log.debug(options, 'FunctionInvocationNode - decision found');
          return processDecision(fnMeta);
        }
        log.debug(options, 'FunctionInvocationNode - user-defined function found');
        return processUserDefinedFunction(fnMeta);
      };

      this.fnName.isResult = true;

      this.fnName.build(args)
      .then(processFnMeta)
      .then((result) => {
        // log.debug(options, `FunctionInvocationNode build success with result - ${stringify(result)}, text: ${this.text}`);
        rlog.debug(options, 'FunctionInvocationNode build success', this.rule, this.text, stringify(result));
        resolve(result);
      })
      .catch((err) => {
        // log.error(options, `FunctionInvocationNode build failed with error - ${err},text: ${this.text}`);
        rlog.error(options, 'FunctionInvocationNode build failed', this.rule, this.text, err);
        reject(err);
      });
    });
  };

  ast.NamedParametersNode.prototype.build = function (args) {
    const options = (args && args.context && args.context.options) || {};
    return new Promise((resolve, reject) => {
      Promise.all(this.params.map(d => d.build(args))).then((results) => {
        const result = Object.assign.apply({}, results);
        // log.debug(options, `NamedParametersNode build success with result - ${stringify(result)}, text: ${this.text}`);
        rlog.debug(options, 'NamedParametersNode build success', this.rule, this.text, stringify(result));
        resolve(result);
      }).catch((err) => {
        // log.error(options, `NamedParametersNode build failed with error - ${err},text: ${this.text}`);
        rlog.error(options, 'NamedParametersNode build failed', this.rule, this.text, err);
        reject(err);
      });
    });
  };

  ast.NamedParameterNode.prototype.build = function (args) {
    const options = (args && args.context && args.context.options) || {};
    return new Promise((resolve, reject) => {
      Promise.all([this.expr.build(args), this.paramName.build(null, false)])
      .then(([value, paramName]) => {
        const obj = {};
        obj[paramName] = value;
        // log.debug(options, `NamedParameterNode build success with result - ${stringify(obj)}, text: ${this.text}`);
        rlog.debug(options, 'NamedParameterNode build success', this.rule, this.text, stringify(obj));
        resolve(obj);
      })
      .catch((err) => {
        // log.error(options, `NamedParameterNode build failed with error - ${err},text: ${this.text}`);
        rlog.error(options, 'NamedParameterNode build failed', this.rule, this.text, err);
        reject(err);
      });
    });
  };

  ast.PositionalParametersNode.prototype.build = function (args) {
    const options = (args && args.context && args.context.options) || {};
    return new Promise((resolve, reject) => {
      Promise.all(this.params.map(d => d.build(args)))
      .then((results) => {
        // log.debug(options, `PositionalParametersNode build success with result - ${stringify(results)}, text: ${this.text}`);
        rlog.debug(options, 'PositionalParametersNode build success', this.rule, this.text, stringify(results));
        resolve(results);
      })
      .catch((err) => {
        // log.error(options, `PositionalParametersNode build failed with error - ${err},text: ${this.text}`);
        rlog.error(options, 'PositionalParametersNode build failed', this.rule, this.text, err);
        reject(err);
      });
    });
  };

  ast.PathExpressionNode.prototype.build = function (args) {
    const options = (args && args.context && args.context.options) || {};
    return new Promise((resolve, reject) => {
      this.exprs
        .reduce((p, expr) => { // eslint-disable-line arrow-body-style
          return p.then((argsNew) => {
            if (Array.isArray(argsNew)) {
              const pArray = (argsNew.context || argsNew.kwargs)
                                    ? argsNew.map(arg => expr.build(arg))
                                    : argsNew.map(arg => expr.build({ kwargs: arg }));
              return Promise.all(pArray);
            }
            return (argsNew.context || argsNew.kwargs) ? expr.build(argsNew) : expr.build({ kwargs: argsNew });
          });
        }, Promise.resolve(args))
        .then((result) => {
          const value = result.context ? result.context : result;
          // log.debug(options, `PathExpressionNode build success with result - ${value},text: ${this.text}`);
          rlog.debug(options, 'PathExpressionNode build success', this.rule, this.text, value);
          resolve(value);
        })
        .catch((err) => {
          // log.error(options, `PathExpressionNode build failed with error - ${err},text: ${this.text}`);
          rlog.error(options, 'PathExpressionNode build failed', this.rule, this.text, err);
          reject(err);
        });
    });
  };

  ast.ForExpressionNode.prototype.build = function (args) {
    const options = (args && args.context && args.context.options) || {};
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
        // log.debug(options, `ForExpressionNode: variables - ${variables}, lists - ${lists}`);
        rlog.debug(options, 'ForExpressionNode build success', this.rule, this.text, `variables: ${variables}, list: ${lists}`);
        return processLists(variables, lists);
      })
      .then((result) => {
        // log.debug(options, `ForExpressionNode build success with result - ${stringify(result)}, text: ${this.text}`);
        rlog.debug(options, 'ForExpressionNode build success', this.rule, this.text, stringify(result));
        resolve(result);
      })
      .catch((err) => {
        // log.error(options, `ForExpressionNode build failed with error - ${err},text: ${this.text}`);
        rlog.error(options, 'ForExpressionNode build failed', this.rule, this.text, err);
        reject(err);
      });
    });
  };

  ast.InExpressionNode.prototype.build = function (args) {
    const options = (args && args.context && args.context.options) || {};
    return new Promise((resolve, reject) => {
      Promise.all([this.name.build(null, false), this.expr.build(args)])
      .then(([variable, list]) => {
        if (!Array.isArray(list)) {
          // log.error(options, `InExpressionNode - expects an array - ${typeof list} found,text: ${this.text}`);
          rlog.error(options, 'InExpressionNode build failed', this.rule, this.text, `Expected array. Got type: ${typeof list}`);
          reject("'In Expression' expects an array to operate on");
        } else {
          const obj = { list, variable };
          // log.debug(options, `InExpressionNode build success with result - ${stringify(obj)},text: ${this.text}`);
          rlog.debug(options, 'InExpressionNode build success', this.rule, this.text, stringify(obj));
          resolve(obj);
        }
      })
      .catch((err) => {
        // log.error(options, `InExpressionNode build failed with error - ${err},text: ${this.text}`);
        rlog.error(options, 'InExpressionNode build failed', this.rule, this.text, err);
        reject(err);
      });
    });
  };

  ast.IfExpressionNode.prototype.build = function (args) {
    const options = (args && args.context && args.context.options) || {};
    return new Promise((resolve, reject) => {
      this.condition.build(args)
      .then((condition) => {
        log.debug(options, `IfExpressionNode - condition - ${condition}`);
        let returnPromise;
        if (condition) {
          returnPromise = this.thenExpr.build(args);
        } else {
          returnPromise = this.elseExpr.build(args);
        }
        return returnPromise;
      })
      .then((result) => {
        // log.debug(options, `IfExpressionNode build success with result - ${stringify(result)}, text: ${this.text}`);
        rlog.debug(options, 'IfExpressionNode build success', this.rule, this.text, stringify(result));
        resolve(result);
      })
      .catch((err) => {
        // log.error(options, `IfExpressionNode build failed with error - ${err},text: ${this.text}`);
        rlog.error(options, 'IfExpressionNode build failed', this.rule, this.text, err);
        reject(err);
      });
    });
  };

  ast.QuantifiedExpressionNode.prototype.build = function (args) {
    const options = (args && args.context && args.context.options) || {};
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
        // log.debug(options, `QuantifiedExpressionNode - truthy length - ${truthy}, results length - ${results.length}`);
        rlog.debug(options, 'QuantifiedExpressionNode build success', this.rule, this.text, `Truthy length: ${truthy}, Results length: ${results.length}`);
        if (this.quantity === 'some') {
          resolve(Boolean(truthy));
        } else {
          resolve(truthy === results.length);
        }
      })
      .catch((err) => {
        // log.error(options, `QuantifiedExpressionNode build failed with error - ${err},text: ${this.text}`);
        rlog.error(options, 'QuantifiedExpressionNode build failed', this.rule, this.text, err);
        reject(err);
      });
    });
  };

  ast.LogicalExpressionNode.prototype.build = function (args) {
    const options = (args && args.context && args.context.options) || {};
    return new Promise((resolve, reject) => {
      Promise.all([this.expr_1.build(args), this.expr_2.build(args)]).then((results) => {
        const res = [];
        res[0] = results[0] || Boolean(results[0]); // to handle null and undefined
        res[1] = results[1] || Boolean(results[1]); // to handle null and undefined
        const result = fnGen(this.operator)(res[0])(res[1]);
        // log.debug(options, `LogicalExpressionNode build success with result - ${stringify(result)}, text: ${this.text}`);
        rlog.debug(options, 'LogicalExpressionNode build success', this.rule, this.text, stringify(result));
        resolve(result);
      }).catch((err) => {
        // log.error(options, `LogicalExpressionNode build failed with error - ${err},text: ${this.text}`);
        rlog.error(options, 'LogicalExpressionNode build failed', this.rule, this.text, err);
        reject(err);
      });
    });
  };

  ast.ComparisionExpressionNode.prototype.build = function (args) {
    const options = (args && args.context && args.context.options) || {};
    return new Promise((resolve, reject) => {
      let operator = this.operator;
      if (operator === 'between') {
        Promise.all([this.expr_1, this.expr_2, this.expr_3].map(d => d.build(args)))
          .then((results) => {
            let result;
            if ((results[0] >= results[1]) && (results[0] <= results[2])) {
              result = true;
            } else {
              result = false;
            }
            // log.debug(options, `ComparisionExpressionNode - between - build success with result - ${stringify(result)}, text: ${this.text}`);
            rlog.debug(options, 'ComparisionExpressionNode build success (between)', this.rule, this.text, stringify(result));
            resolve(result);
          }).catch((err) => {
            // log.error(options, `ComparisionExpressionNode - between - build failed with error - ${err},text: ${this.text}`);
            rlog.error(options, 'ComparisionExpressionNode build failed (between)', this.rule, this.text, err);
            reject(err);
          });
      } else if (operator === 'in') {
        const processExpr = (operand) => {
          this.expr_2 = Array.isArray(this.expr_2) ? this.expr_2 : [this.expr_2];
          return Promise.all(this.expr_2.map(d => d.build(args)))
          .then(tests => tests.map(test => test(operand)).reduce((accu, next) => accu || next, false));
        };
        this.expr_1.build(args)
        .then(operand => processExpr(operand))
        .then((result) => {
          // log.debug(options, `ComparisionExpressionNode - in - build success with result - ${stringify(result)}, text: ${this.text}`);
          rlog.debug(options, 'ComparisionExpressionNode build success (in)', this.rule, this.text, stringify(result));
          resolve(result);
        })
        .catch((err) => {
          // log.error(options, `ComparisionExpressionNode - in - build failed with error - ${err},text: ${this.text}`);
          rlog.error(options, 'ComparisionExpressionNode build failed (in)', this.rule, this.text, err);
          reject(err);
        });
      } else {
        Promise.all([this.expr_1, this.expr_2].map(d => d.build(args)))
          .then((results) => {
            operator = operator !== '=' ? operator : '==';
            const result = fnGen(operator)(results[0])(results[1]);
            // log.debug(options, `ComparisionExpressionNode build success with result - ${stringify(result)}, text: ${this.text}`);
            rlog.debug(options, 'ComparisionExpressionNode build sucess', this.rule, this.text, stringify(result));
            resolve(result);
          }).catch((err) => {
            // log.error(options, `ComparisionExpressionNode build failed with error - ${err},text: ${this.text}`);
            rlog.error(options, 'ComparisionExpressionNode build failed', this.rule, this.text, err);
            reject(err);
          });
      }
    });
  };

  // TODO : implement item and object filter
  // TODO : see if the filter returns a function which can be applied on the list during execution
  ast.FilterExpressionNode.prototype.build = function (args) {
    const options = (args && args.context && args.context.options) || {};
    return new Promise((resolve, reject) => {
      this.expr.build(args).then((exprResult) => {
        // log.debug(options, `FilterExpressionNode - expr build success with result - ${exprResult},text: ${this.text}`);
        rlog.debug(options, 'FilterExpressionNode build success (expr)', this.rule, this.text, exprResult);
        const result = exprResult.context ? exprResult.context : exprResult;
        if (this.filterExpr instanceof ast.LiteralNode) {
          this.filterExpr.build(args).then((value) => {
            // log.debug(options, `FilterExpressionNode  - filterExpr build success with result - ${stringify(value)},text: ${this.text}`);
            rlog.debug(options, 'FilterExpressionNode build success (filterExpr)', this.rule, this.text, value);
            resolve(result[value]);
          }).catch((err) => {
            // log.error(options, `FilterExpressionNode - filterExpr build failed with error - ${err},text: ${this.text}`);
            rlog.error(options, 'FilterExpressionNode build failed (filterExpr)', this.rule, this.text, err);
            reject(err);
          });
        } else {
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
              const truthyValues = result.filter((d, i) => booleanValues[i]);
              // log.debug(options, `FilterExpressionNode build success with result- filtered values - ${stringify(truthyValues)},text: ${this.text}`);
              rlog.debug(options, 'FilterExpressionNode build success', this.rule, this.text, `filtered values - ${stringify(truthyValues)}`);
              resolve(truthyValues);
            }).catch((err) => {
              // log.error(options, `FilterExpressionNode build failed with error - ${err},text: ${this.text}`);
              rlog.error('FilterExpressionNode build failed', this.rule, this.text, err);
              reject(err);
            });
          } else {
            // log.error(options, 'FilterExpressionNode - filter can only be applied on a collection', `text: ${this.text}`);
            rlog.error(options, 'FilterExpressionNode build failed', this.rule, this.text, 'Can only be applied to a collection');
            reject('filter can be applied only on a collection');
          }
        }
      }).catch((err) => {
        // log.error(options, `FilterExpressionNode - expr build failed with error - ${err},text: ${this.text}`);
        rlog.error(options, 'FilterExpressionNode build failed (expr)', this.rule, this.text, err);
        reject(err);
      });
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
    const options = (args && args.context && args.context.options) || {};
    return new Promise((resolve, reject) => {
      if (this.exprList && this.exprList.length) {
        Promise.all(this.exprList.map(d => d.build(args))).then((result) => {
          // log.debug(options, `ListNode - build success with result - ${stringify(result)}, text: ${this.text}`);
          rlog.debug(options, 'ListNode build success', this.rule, this.text, stringify(result));
          resolve(result);
        }).catch((err) => {
          // log.error(options, `ListNode - build failed with error - ${err},text: ${this.text}`);
          rlog.error(options, 'ListNode build failed', this.rule, this.text, err);
          reject(err);
        });
      } else {
        log.warn(options, 'ListNode - No expression found');
        resolve([]);
      }
    });
  };

  ast.FunctionDefinitionNode.prototype.build = function (args) {
    const options = (args && args.context && args.context.options) || {};
    return new Promise((resolve, reject) => {
      const fnDfn = { isFunction: true };
      if (this.formalParams && this.formalParams.length) {
        Promise.all(this.formalParams.map(d => d.build(null, false))).then((results) => {
          fnDfn.fn = this.body;
          fnDfn.params = results;
          // log.debug(options, `FunctionDefinitionNode build success - body - ${stringify(this.body)}, params - ${stringify(results)}, text: ${this.text}`);
          rlog.debug(options, 'FunctionDefinitionNode build success', this.rule, this.text, `BODY - ${stringify(this.body)}, PARAMS - ${stringify(results)}`);
          resolve(fnDfn);
        }).catch((err) => {
          // log.error(options, `FunctionDefinitionNode build failed with error - ${err},text: ${this.text}`);
          rlog.error(options, 'FunctionDefinitionNode build failed', this.rule, this.text, err);
          reject(err);
        });
      } else {
        fnDfn.fn = this.body;
        fnDfn.params = null;
        // log.debug(options, `FunctionDefinitionNode build success - body - ${stringify(this.body)}, params - none, text: ${this.text}`);
        rlog.debug(options, 'FunctionDefinitionNode build success', this.rule, this.text, `BODY - ${stringify(this.body)}, PARAMS - none`);
        resolve(fnDfn);
      }
    });
  };

  ast.FunctionBodyNode.prototype.build = function (args) {
    const options = (args && args.context && args.context.options) || {};
    return new Promise((resolve, reject) => {
      if (this.extern) {
        log.debug(options, `FunctionBodyNode - external function found - ${this.expr}`);
        // rlog.debug(options, 'FunctionBodyNode ')
        try {
          this.expr.build({}).then((bodyMeta) => {
            externalFn(Object.assign({}, args.context, args.kwargs), bodyMeta).then((res) => {
              // log.debug(options, `FunctionBodyNode build success with result - ${res}, text: ${this.text}`);
              rlog.debug(options, 'FunctionBodyNode build success', this.rule, this.text, res);
              resolve(res);
            }).catch((err) => {
              // log.error(options, `FunctionBodyNode build failed with error from externalFn - ${err},text: ${this.text}`);
              rlog.error(options, 'FunctionBodyNode build failed (from externalFn)', this.rule, this.text, err);
              reject(err);
            });
          }).catch((err) => {
            // log.error(options, `FunctionBodyNode build failed with error when building ${this.expr} - ${err},text: ${this.text}`);
            rlog.error(options, 'FunctionBodyNode build failed', this.rule, this.text, `${err}, Expression: ${this.expr}`);
            reject(err);
          });
        } catch (err) {
          // log.error(options, `FunctionBodyNode - unexpected error - ${err},text: ${this.text}`);
          rlog.error(options, 'FunctionBodyNode build failed', this.rule, this.text, `Unexpected error: ${err}`);
          reject(err);
        }
      } else {
        this.expr.build(args).then((res) => {
          // log.debug(options, `FunctionBodyNode build success with result - ${stringify(res)}, text: ${this.text}`);
          rlog.debug(options, 'FunctionBodyNode build success', this.rule, this.text, stringify(res));
          resolve(res);
        }).catch((err) => {
          // log.error(options, `FunctionBodyNode build failed with error - ${err},text: ${this.text}`);
          rlog.error(options, 'FunctionBodyNode build failed', this.rule, this.text, err);
          reject(err);
        });
      }
    });
  };

  ast.ContextNode.prototype.build = function (args) {
    const options = (args && args.context && args.context.options) || {};
    return new Promise((resolve, reject) => {
      if (this.entries && this.entries.length) {
        this.entries
          .reduce((p, entry) => p.then(argsNew => entry.build(argsNew)), Promise.resolve(args))
          .then((ctx) => {
            if (ctx.kwargs) {
              if (typeof ctx.kwargs.result !== 'undefined') {
                // log.debug(options, `ContextNode build success - result context entry exists - ${stringify(ctx.kwargs.result)}, text: ${this.text}`);
                rlog.debug(options, 'ContextNode build success (with context entry)', this.rule, this.text, stringify(ctx.kwargs.result));
                resolve(ctx.kwargs.result);
              } else {
                // log.debug(options, `ContextNode build success - result context entry does not exist - ${stringify(ctx.kwargs)}, text: ${this.text}`);
                rlog.debug(options, 'ContextNode build success (with no context entry)', this.rule, this.text, stringify(ctx.kwargs));
                resolve(ctx.kwargs);
              }
            } else {
              log.error(options, 'ContextNode - ctx.kwargs undefined', `text: ${this.text}`);
              // rlog.error(options, 'ContextNode build failed', this.rule, this.text, 'ctx.kwargs undefined')
              reject('Error while parsing context. ctx.kwargs undefined');
            }
          })
          .catch((err) => {
            // log.error(options, `ContextNode build failed with error - ${err},text: ${this.text}`);
            rlog.error(options, 'ContextNode build failed', this.rule, this.text, err);
            reject(err);
          });
      } else {
        resolve({});
      }
    });
  };

  ast.ContextEntryNode.prototype.build = function (args) {
    const options = (args && args.context && args.context.options) || {};
    return new Promise((resolve, reject) => {
      Promise.all([this.expr.build(args), this.key.build(null, false)])
      .then(([value, key]) => {
        const obj = {};
        obj[key] = value;
        const argsNew = addKwargs(args, obj);
        // log.debug(options, `ContextEntryNode build success with result - ${stringify(argsNew)}, text: ${this.text}`);
        rlog.debug(options, 'ContextNode build success', this.rule, this.text, stringify(argsNew));
        resolve(argsNew);
      })
      .catch((err) => {
        // log.error(options, `ContextEntryNode build failed with error - ${err},text: ${this.text}`);
        rlog.error(options, 'ContextEntryNode build failed', this.rule, this.text, err);
        reject(err);
      });
    });
  };
};

/**
 * Hack in support for Function.name for browsers that don't support it.
 * IE, I'm looking at you.
 **/

(function () {
    if (Function.prototype.name === undefined && Object.defineProperty !== undefined) {
        Object.defineProperty(Function.prototype, 'name', {
            get: function get() {
                console.log(55);
                var funcNameRegex = /function\s([^(]{1,})\(/;
                var results = funcNameRegex.exec(this.toString());
                return results && results.length > 1 ? results[1].trim() : "";
            },
            set: function set(value) {}
        });
    }
})();

/**
 * CustomEvent polyfill for IE 11
 */
(function () {

    if (typeof window.CustomEvent === "function") return false;

    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();

var babelHelpers = {};
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var jsx = function () {
  var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7;
  return function createRawReactElement(type, props, key, children) {
    var defaultProps = type && type.defaultProps;
    var childrenLength = arguments.length - 3;

    if (!props && childrenLength !== 0) {
      props = {};
    }

    if (props && defaultProps) {
      for (var propName in defaultProps) {
        if (props[propName] === void 0) {
          props[propName] = defaultProps[propName];
        }
      }
    } else if (!props) {
      props = defaultProps || {};
    }

    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);

      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 3];
      }

      props.children = childArray;
    }

    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type: type,
      key: key === undefined ? null : '' + key,
      ref: null,
      props: props,
      _owner: null
    };
  };
}();

var asyncIterator = function (iterable) {
  if (typeof Symbol === "function") {
    if (Symbol.asyncIterator) {
      var method = iterable[Symbol.asyncIterator];
      if (method != null) return method.call(iterable);
    }

    if (Symbol.iterator) {
      return iterable[Symbol.iterator]();
    }
  }

  throw new TypeError("Object is not async iterable");
};

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();

var asyncGeneratorDelegate = function (inner, awaitWrap) {
  var iter = {},
      waiting = false;

  function pump(key, value) {
    waiting = true;
    value = new Promise(function (resolve) {
      resolve(inner[key](value));
    });
    return {
      done: false,
      value: awaitWrap(value)
    };
  }

  

  if (typeof Symbol === "function" && Symbol.iterator) {
    iter[Symbol.iterator] = function () {
      return this;
    };
  }

  iter.next = function (value) {
    if (waiting) {
      waiting = false;
      return value;
    }

    return pump("next", value);
  };

  if (typeof inner.throw === "function") {
    iter.throw = function (value) {
      if (waiting) {
        waiting = false;
        throw value;
      }

      return pump("throw", value);
    };
  }

  if (typeof inner.return === "function") {
    iter.return = function (value) {
      return pump("return", value);
    };
  }

  return iter;
};

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var defineEnumerableProperties = function (obj, descs) {
  for (var key in descs) {
    var desc = descs[key];
    desc.configurable = desc.enumerable = true;
    if ("value" in desc) desc.writable = true;
    Object.defineProperty(obj, key, desc);
  }

  return obj;
};

var defaults = function (obj, defaults) {
  var keys = Object.getOwnPropertyNames(defaults);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = Object.getOwnPropertyDescriptor(defaults, key);

    if (value && value.configurable && obj[key] === undefined) {
      Object.defineProperty(obj, key, value);
    }
  }

  return obj;
};

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var get$1 = function get$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$1(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var _instanceof = function (left, right) {
  if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
    return right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
};

var interopRequireDefault = function (obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
};

var interopRequireWildcard = function (obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj.default = obj;
    return newObj;
  }
};

var newArrowCheck = function (innerThis, boundThis) {
  if (innerThis !== boundThis) {
    throw new TypeError("Cannot instantiate an arrow function");
  }
};

var objectDestructuringEmpty = function (obj) {
  if (obj == null) throw new TypeError("Cannot destructure undefined");
};

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var selfGlobal = typeof global === "undefined" ? self : global;

var set$1 = function set$1(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set$1(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var slicedToArrayLoose = function (arr, i) {
  if (Array.isArray(arr)) {
    return arr;
  } else if (Symbol.iterator in Object(arr)) {
    var _arr = [];

    for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
      _arr.push(_step.value);

      if (i && _arr.length === i) break;
    }

    return _arr;
  } else {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }
};

var taggedTemplateLiteral = function (strings, raw) {
  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
};

var taggedTemplateLiteralLoose = function (strings, raw) {
  strings.raw = raw;
  return strings;
};

var temporalRef = function (val, name, undef) {
  if (val === undef) {
    throw new ReferenceError(name + " is not defined - temporal dead zone");
  } else {
    return val;
  }
};

var temporalUndefined = {};

var toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

babelHelpers;

(function (global) {

  //
  // Check for native Promise and it has correct interface
  //

  var NativePromise = global['Promise'];
  var nativePromiseSupported = NativePromise &&
  // Some of these methods are missing from
  // Firefox/Chrome experimental implementations
  'resolve' in NativePromise && 'reject' in NativePromise && 'all' in NativePromise && 'race' in NativePromise &&
  // Older version of the spec had a resolver object
  // as the arg rather than a function
  function () {
    var resolve;
    new NativePromise(function (r) {
      resolve = r;
    });
    return typeof resolve === 'function';
  }();

  //
  // export if necessary
  //

  if (typeof exports !== 'undefined' && exports) {
    // node.js
    exports.Promise = nativePromiseSupported ? NativePromise : Promise;
    exports.Polyfill = Promise;
  } else {
    // AMD
    if (typeof define == 'function' && define.amd) {
      define(function () {
        return nativePromiseSupported ? NativePromise : Promise;
      });
    } else {
      // in browser add to global
      if (!nativePromiseSupported) global['Promise'] = Promise;
    }
  }

  //
  // Polyfill
  //

  var PENDING = 'pending';
  var SEALED = 'sealed';
  var FULFILLED = 'fulfilled';
  var REJECTED = 'rejected';
  var NOOP = function NOOP() {};

  function isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  }

  // async calls
  var asyncSetTimer = typeof setImmediate !== 'undefined' ? setImmediate : setTimeout;
  var asyncQueue = [];
  var asyncTimer;

  function asyncFlush() {
    // run promise callbacks
    for (var i = 0; i < asyncQueue.length; i++) {
      asyncQueue[i][0](asyncQueue[i][1]);
    } // reset async asyncQueue
    asyncQueue = [];
    asyncTimer = false;
  }

  function asyncCall(callback, arg) {
    asyncQueue.push([callback, arg]);

    if (!asyncTimer) {
      asyncTimer = true;
      asyncSetTimer(asyncFlush, 0);
    }
  }

  function invokeResolver(resolver, promise) {
    function resolvePromise(value) {
      resolve(promise, value);
    }

    function rejectPromise(reason) {
      reject(promise, reason);
    }

    try {
      resolver(resolvePromise, rejectPromise);
    } catch (e) {
      rejectPromise(e);
    }
  }

  function invokeCallback(subscriber) {
    var owner = subscriber.owner;
    var settled = owner.state_;
    var value = owner.data_;
    var callback = subscriber[settled];
    var promise = subscriber.then;

    if (typeof callback === 'function') {
      settled = FULFILLED;
      try {
        value = callback(value);
      } catch (e) {
        reject(promise, e);
      }
    }

    if (!handleThenable(promise, value)) {
      if (settled === FULFILLED) resolve(promise, value);

      if (settled === REJECTED) reject(promise, value);
    }
  }

  function handleThenable(promise, value) {
    var resolved;

    try {
      if (promise === value) throw new TypeError('A promises callback cannot return that same promise.');

      if (value && (typeof value === 'function' || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object')) {
        var then = value.then; // then should be retrived only once

        if (typeof then === 'function') {
          then.call(value, function (val) {
            if (!resolved) {
              resolved = true;

              if (value !== val) resolve(promise, val);else fulfill(promise, val);
            }
          }, function (reason) {
            if (!resolved) {
              resolved = true;

              reject(promise, reason);
            }
          });

          return true;
        }
      }
    } catch (e) {
      if (!resolved) reject(promise, e);

      return true;
    }

    return false;
  }

  function resolve(promise, value) {
    if (promise === value || !handleThenable(promise, value)) fulfill(promise, value);
  }

  function fulfill(promise, value) {
    if (promise.state_ === PENDING) {
      promise.state_ = SEALED;
      promise.data_ = value;

      asyncCall(publishFulfillment, promise);
    }
  }

  function reject(promise, reason) {
    if (promise.state_ === PENDING) {
      promise.state_ = SEALED;
      promise.data_ = reason;

      asyncCall(publishRejection, promise);
    }
  }

  function publish(promise) {
    var callbacks = promise.then_;
    promise.then_ = undefined;

    for (var i = 0; i < callbacks.length; i++) {
      invokeCallback(callbacks[i]);
    }
  }

  function publishFulfillment(promise) {
    promise.state_ = FULFILLED;
    publish(promise);
  }

  function publishRejection(promise) {
    promise.state_ = REJECTED;
    publish(promise);
  }

  /**
  * @class
  */
  function Promise(resolver) {
    if (typeof resolver !== 'function') throw new TypeError('Promise constructor takes a function argument');

    if (this instanceof Promise === false) throw new TypeError('Failed to construct \'Promise\': Please use the \'new\' operator, this object constructor cannot be called as a function.');

    this.then_ = [];

    invokeResolver(resolver, this);
  }

  Promise.prototype = {
    constructor: Promise,

    state_: PENDING,
    then_: null,
    data_: undefined,

    then: function then(onFulfillment, onRejection) {
      var subscriber = {
        owner: this,
        then: new this.constructor(NOOP),
        fulfilled: onFulfillment,
        rejected: onRejection
      };

      if (this.state_ === FULFILLED || this.state_ === REJECTED) {
        // already resolved, call callback async
        asyncCall(invokeCallback, subscriber);
      } else {
        // subscribe
        this.then_.push(subscriber);
      }

      return subscriber.then;
    },

    'catch': function _catch(onRejection) {
      return this.then(null, onRejection);
    }
  };

  Promise.all = function (promises) {
    var Class = this;

    if (!isArray(promises)) throw new TypeError('You must pass an array to Promise.all().');

    return new Class(function (resolve, reject) {
      var results = [];
      var remaining = 0;

      function resolver(index) {
        remaining++;
        return function (value) {
          results[index] = value;
          if (! --remaining) resolve(results);
        };
      }

      for (var i = 0, promise; i < promises.length; i++) {
        promise = promises[i];

        if (promise && typeof promise.then === 'function') promise.then(resolver(i), reject);else results[i] = promise;
      }

      if (!remaining) resolve(results);
    });
  };

  Promise.race = function (promises) {
    var Class = this;

    if (!isArray(promises)) throw new TypeError('You must pass an array to Promise.race().');

    return new Class(function (resolve, reject) {
      for (var i = 0, promise; i < promises.length; i++) {
        promise = promises[i];

        if (promise && typeof promise.then === 'function') promise.then(resolve, reject);else resolve(promise);
      }
    });
  };

  Promise.resolve = function (value) {
    var Class = this;

    if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.constructor === Class) return value;

    return new Class(function (resolve) {
      resolve(value);
    });
  };

  Promise.reject = function (reason) {
    var Class = this;

    return new Class(function (resolve, reject) {
      reject(reason);
    });
  };
})(typeof window != 'undefined' ? window : typeof global != 'undefined' ? global : typeof self != 'undefined' ? self : undefined);

var nonEnumKeys = function nonEnumKeys(object) {
    var target = object;
    var enum_and_nonenum = Object.getOwnPropertyNames(target);
    var enum_only = Object.keys(target);
    var nonenum_only = enum_and_nonenum.filter(function (key) {
        var indexInEnum = enum_only.indexOf(key);
        if (indexInEnum == -1) {
            // not found in enum_only keys mean the key is non-enumerable,
            // so return true so we keep this in the filter
            return true;
        } else {
            return false;
        }
    });

    return nonenum_only;
}

/**
 * FormData wrapper for browsers supporting only FormData constructor and append()
 * Instead of keys(), entries(), values() have getAllElements()
 * Instead of delete() -> remove()
 * To get real FormData object use buildFormDataObject()
 * Also adds custom methods
  */

function BunnyFormData(form) {
    if (!(form instanceof HTMLFormElement)) {
        throw new Error('Form passed to BunnyFormData constructor is not an instance of HTMLFormElement');
    }

    // form
    this._form = form;

    // form control collection;
    this._collection = {};

    // build collection from form elements
    var elements = this.getInputs();
    for (var k = 0; k < elements.length; k++) {
        var input = elements[k];
        this._initSingleInput(input);
    }
}

BunnyFormData.prototype._initSingleInput = function _initSingleInput(input) {
    var type = this.getInputType(input);

    // check if parser for specific input type exists and call it instead
    var method = type.toLowerCase();
    method = method.charAt(0).toUpperCase() + method.slice(1); // upper case first char
    method = '_formControlParser' + method;
    if (this[method] !== undefined) {
        this[method](input);
    } else {
        // call default parser
        // if input with same name exists - override
        this._formControlParserDefault(input);
    }
};

BunnyFormData.prototype._formControlParserDefault = function _formControlParserDefault(input) {
    if (this._collection[input.name] !== undefined) {
        // element with same name already exists in collection
        if (!Array.isArray(this._collection[input.name])) {
            // is not array, convert to array first
            this._collection[input.name] = [this._collection[input.name]];
        }
        this._collection[input.name].push(input.value);
    } else {
        this._collection[input.name] = input.value;
    }
};

BunnyFormData.prototype._formControlParserRadio = function _formControlParserRadio(input) {
    // radio buttons must have same name and only one can be checked
    // exactly one radio must have checked attribute
    // radio buttons must have value attribute
    if (input.checked) {
        this._collection[input.name] = input.value;
    }
};

BunnyFormData.prototype._formControlParserCheckbox = function _formControlParserCheckbox(input) {
    // checkboxes may have different names or same name if checkboxes should be an array
    // each checkbox may have checked attribute
    // checkboxes must have value attribute
    if (this._collection[input.name] === undefined) {
        // first checkbox with this name found
        if (input.checked) {
            this._collection[input.name] = input.value;
        } else {
            this._collection[input.name] = '';
        }
    } else {
        if (input.checked) {
            // checkbox with same name already exists in collection
            if (!Array.isArray(this._collection[input.name])) {
                // is not array, convert to array first
                this._collection[input.name] = [this._collection[input.name]];
            }
            this._collection[input.name].push(input.value);
        }
    }
};

BunnyFormData.prototype._formControlParserFile = function _formControlParserFile(input) {
    this._collection[input.name] = input.files[0] === undefined || input.files[0] === null ? '' : input.files[0];
};

// since form inputs can be accessed via form.input_name and if input_name = elements
// then form.elements will return input not FormControlsCollection
// make sure to get real FormControlsCollection from prototype
BunnyFormData.prototype.getInputs = function getInputs() {
    return Object.getOwnPropertyDescriptor(this._form.constructor.prototype, 'elements').get.call(this._form);
};

BunnyFormData.prototype.getNamedInputs = function getNamedInputs() {
    var elements = this.getInputs();
    // IE does not return correct enum keys, get keys manually
    // non numbered keys will be named keys
    //const keys = nonEnumKeys(elements);
    //console.log(keys);
    var keys = Object.getOwnPropertyNames(elements).filter(function (key) {
        return isNaN(key);
    });

    var named_inputs = {};
    for (var k = 0; k < keys.length; k++) {
        var input_name = keys[k];
        named_inputs[input_name] = elements[input_name];
    }
    return named_inputs;
};

BunnyFormData.prototype.getNodeLists = function getNodeLists() {
    var elements = this.getNamedInputs();
    var node_lists = {};
    for (var input_name in elements) {
        if (this.isNodeList(input_name)) {
            node_lists[input_name] = elements[input_name];
        }
    }
    return node_lists;
};

BunnyFormData.prototype.getRadioLists = function getRadioLists() {
    var node_lists = this.getNodeLists();
    var radio_lists = {};
    for (var input_name in node_lists) {
        if (node_lists[input_name][0].type === 'radio') {
            radio_lists[input_name] = node_lists[input_name];
        }
    }
    return radio_lists;
};

BunnyFormData.prototype.getInputType = function getInputType(name_or_el) {
    var input = null;
    if ((typeof name_or_el === 'undefined' ? 'undefined' : _typeof(name_or_el)) === 'object') {
        input = name_or_el;
    } else {
        input = this.getInput(name_or_el);
    }

    if (input.type !== undefined && input.type !== null && input.type !== '') {
        return input.type;
    }
    if (input.tagName === 'TEXTAREA') {
        return 'textarea';
    } else if (this.isNodeList(input)) {
        return 'radiolist';
    } else {
        return undefined;
    }
};

BunnyFormData.prototype.getInput = function getInput(name) {
    return Object.getOwnPropertyDescriptor(this._form.constructor.prototype, 'elements').get.call(this._form)[name];
};

BunnyFormData.prototype.get = function get(input_name) {
    if (this._collection[input_name] === undefined) {
        return null;
    } else {
        return this._collection[input_name];
    }
};

// value can also be a Blob/File but this get() polyfill does not include 3rd argument filename
BunnyFormData.prototype.set = function get(input_name, value) {
    this._collection[input_name] = value;
};

BunnyFormData.prototype.setCheckbox = function setArrayKey(input_name, value, checked) {
    if (this.has(input_name) && !this.empty(input_name)) {
        if (checked) {
            // add element to array if not exists
            if (!this.isArray(input_name)) {
                // convert to array first
                if (this._collection[input_name] !== value) {
                    this._collection[input_name] = [this._collection[input_name]];
                    this._collection[input_name].push(value);
                }
            } else {
                if (this._collection[input_name].indexOf(value) === -1) {
                    this._collection[input_name].push(value);
                }
            }
        } else {
            // remove element from array if exists
            if (!this.isArray(input_name)) {
                // convert to array first
                if (this._collection[input_name] === value) {
                    this._collection[input_name] = '';
                }
            } else {
                var pos = this._collection[input_name].indexOf(value);
                if (pos !== -1) {
                    if (this._collection[input_name].length === 1) {
                        this._collection[input_name] = '';
                    } else {
                        this._collection[input_name].splice(pos, 1);
                    }
                }
            }
        }
    } else {
        this._collection[input_name] = value;
    }
};

BunnyFormData.prototype.has = function has(input_name) {
    return this._collection[input_name] !== undefined;
};

BunnyFormData.prototype.empty = function has(input_name) {
    return this._collection[input_name].length === 0;
};

BunnyFormData.prototype.isArray = function isArray(input_name) {
    return Array.isArray(this._collection[input_name]);
};

BunnyFormData.prototype.isNodeList = function isNodeList(input_name_or_el) {
    var input = (typeof input_name_or_el === 'undefined' ? 'undefined' : _typeof(input_name_or_el)) === 'object' ? input_name_or_el : this.getInput(input_name_or_el);
    // RadioNodeList is undefined in IE, Edge, it uses HTMLCollection instead
    return input instanceof (typeof RadioNodeList !== 'undefined' ? RadioNodeList : HTMLCollection);
};

BunnyFormData.prototype.append = function append(input_name, value) {
    if (this._collection[input_name] === undefined) {
        this._collection[input_name] = value;
    } else if (Array.isArray(this._collection[input_name])) {
        this._collection[input_name].push(value);
    } else {
        // convert single element into array and append new item
        var item = this._collection[input_name];
        this._collection[input_name] = [item, value];
    }
};

BunnyFormData.prototype.getAll = function getAll(input_name) {
    if (this._collection[input_name] === undefined) {
        return [];
    } else if (Array.isArray(this._collection[input_name])) {
        return this._collection[input_name];
    } else {
        return [this._collection[input_name]];
    }
};

// since entries(), keys(), values() return Iterator which is not supported in many browsers
// there is only one element to simply get object of key => value pairs of all form elements
// use this method instead of entries(), keys() or values()
BunnyFormData.prototype.getAllElements = function getAllElements() {
    return this._collection;
};

BunnyFormData.prototype.buildFormDataObject = function buildFormDataObject() {
    var _this = this;

    var formData = new FormData();

    var _loop = function _loop(key) {
        if (Array.isArray(_this._collection[key])) {
            _this._collection[key].forEach(function (item) {
                formData.append(key, item);
            });
        } else {
            formData.append(key, _this._collection[key]);
        }
    };

    for (var key in this._collection) {
        _loop(key);
    }
    return formData;
};

// remove instead of delete(). Also can remove element from array
BunnyFormData.prototype.remove = function remove(input_name) {
    var _this2 = this;

    var array_value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

    if (array_value !== undefined) {
        // remove element from array
        if (Array.isArray(this._collection[input_name])) {
            (function () {
                var new_array = [];
                _this2._collection[input_name].forEach(function (item) {
                    if (item !== array_value) {
                        new_array.push(item);
                    }
                });
                _this2._collection[input_name] = new_array;
            })();
        } else {
            // not an array, just remove single element
            delete this._collection[input_name];
        }
    } else {
        delete this._collection[input_name];
    }
};

var BunnyFormData = BunnyFormData;

/**
 * BunnyJS Form component
 * Wraps native FormData API to allow working with same form from multiple closures
 * and adds custom methods to make form processing, including AJAX submit, file uploads and date/times, easier
 * works only with real forms and elements in DOM
 * Whenever new input is added or removed from DOM - Form data is updated
 *
 * IE11+
 *
 * It should:
 * 1. RadioNodeList
 * 1.1. Setting .value of RadioNodeList for radio buttons is allowed only to one of values from all radio buttons within this RadioNodeList,
 * 1.2. If invalid value passed Error should be thrown
 * 1.3. If invalid value passed old value should be returned by .value getter, new value should not be saved
 * 1.4. Setting .value of RadioNodeList should redraw (update) radio buttons setting old unchecked and new checked
 * 1.5. Setting .value of RadioNodeList should save new value and getting .value should return same new value
 * 1.6. Setting .value of RadioNodeList should call 'change' event on related radio button
 *
 * 2. File input
 * 2.1. .value of file input should return first File object if file uploaded by user from native UI
 * 2.2. .value of file input should return Blob object if file was set by .value = blob
 * 2.3. value attribute can contain a string - URL to selected object, .value should return this file's Blob
 * 2.4. Only blob should be allowed to be assigned to setter .value
 * 2.5. URL (including rel path) can be assigned to .value (todo)
 * 2.6. File processing should be allowed to be delegated to a custom method, for example, to send file to cropper before storing it (todo)
 * 2.7. Setting .value should call 'change' event on file input
 * 2.8. After refresh if there is file uploaded by user via native UI file should be stored in .value (todo)
 *
 * 3. Common inputs
 * 3.1. Setting .value to any input should call 'change' event
 * 3.2. Setting .value to any input should redraw changes
 * 3.3.
 *
 * 4. DOM mutations, new inputs added to DOM or removed from DOM
 * 4.1. Whenever new input added to DOM inside form, it should be initiated and work as common input
 * 4.2. Whenever input is removed from DOM inside form, it should be also removed with all events from Form collection
 */
var Form$1 = Form = {

    /*
    properties
    */

    /**
     * Collection of FormData
     * @private
     */
    _collection: {},

    /**
     * Collection of mirrored elements
     * See Form.mirror() for detailed description
     */
    _mirrorCollection: {},

    _valueSetFromEvent: false,

    //_calcMirrorCollection: {},


    /*
    init methods
     */

    /**
     * Init form
     * Must be called after DOMContentLoaded (ready)
     *
     * @param {string} form_id
     *
     * @throws Error
     */
    init: function init(form_id) {
        var form = document.forms[form_id];
        if (form === undefined) {
            throw new Error('Form with ID ' + form_id + ' not found in DOM!');
        }
        if (this._collection[form_id] !== undefined) {
            throw new Error('Form with ID ' + form_id + ' already initiated!');
        }
        this._collection[form_id] = new BunnyFormData(form);
        this._attachChangeAndDefaultFileEvent(form_id);
        this._attachRadioListChangeEvent(form_id);
        this._attachDOMChangeEvent(form_id);
    },
    isInitiated: function isInitiated(form_id) {
        return this._collection[form_id] !== undefined;
    },


    /**
     * Update FormData when user changed input's value
     * or when value changed from script
     *
     * Also init default value for File inputs
     *
     * @param {string} form_id
     *
     * @private
     */
    _attachChangeAndDefaultFileEvent: function _attachChangeAndDefaultFileEvent(form_id) {
        var _this = this;

        var elements = this._collection[form_id].getInputs();
        [].forEach.call(elements, function (form_control) {

            _this.__attachSingleChangeEvent(form_id, form_control);
            _this.__observeSingleValueChange(form_id, form_control);

            // set default file input value
            if (form_control.type === 'file' && form_control.hasAttribute('value')) {
                var url = form_control.getAttribute('value');
                if (url !== '') {
                    _this.setFileFromUrl(form_id, form_control.name, url);
                }
            }
        });
    },
    _attachRadioListChangeEvent: function _attachRadioListChangeEvent(form_id) {
        var radio_lists = this._collection[form_id].getRadioLists();
        for (var radio_group_name in radio_lists) {
            var single_radio_list = radio_lists[radio_group_name];
            this.__observeSingleValueChange(form_id, single_radio_list);
        }
    },
    __attachSingleChangeEvent: function __attachSingleChangeEvent(form_id, form_control) {
        var _this2 = this;

        form_control.addEventListener('change', function (e) {
            if (form_control.type === 'file' && e.isTrusted) {
                // file selected by user
                //this._collection[form_id].set(form_control.name, form_control.files[0]);
                _this2._valueSetFromEvent = true;
                form_control.value = form_control.files[0];
                _this2._valueSetFromEvent = false;
            } else {
                _this2._parseFormControl(form_id, form_control, form_control.value);
            }

            // update mirror if mirrored
            if (_this2._mirrorCollection[form_id] !== undefined) {
                if (_this2._mirrorCollection[form_id][form_control.name] === true) {
                    _this2.setMirrors(form_id, form_control.name);
                }
            }
        });
    },


    // handlers for different input types
    // with 4th argument - setter
    // without 4th argument - getter
    // called from .value property observer
    _parseFormControl: function _parseFormControl(form_id, form_control) {
        var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

        var type = this._collection[form_id].getInputType(form_control);

        console.log(type);

        // check if parser for specific input type exists and call it instead
        var method = type.toLowerCase();
        method = method.charAt(0).toUpperCase() + method.slice(1); // upper case first char
        method = '_parseFormControl' + method;

        if (value === undefined) {
            method = method + 'Getter';
        }

        if (this[method] !== undefined) {
            return this[method](form_id, form_control, value);
        } else {
            // call default parser
            // if input with same name exists - override
            if (value === undefined) {
                return this._parseFormControlDefaultGetter(form_id, form_control);
            } else {
                this._parseFormControlDefault(form_id, form_control, value);
            }
        }
    },
    _parseFormControlDefault: function _parseFormControlDefault(form_id, form_control, value) {
        this._collection[form_id].set(form_control.name, value);
    },
    _parseFormControlDefaultGetter: function _parseFormControlDefaultGetter(form_id, form_control) {
        return Object.getOwnPropertyDescriptor(form_control.constructor.prototype, 'value').get.call(form_control);
        //return this._collection[form_id].get(form_control.name);
    },
    _parseFormControlRadiolist: function _parseFormControlRadiolist(form_id, form_control, value) {
        var found = false;
        var radio_list = form_control;
        for (var k = 0; k < radio_list.length; k++) {
            var radio_input = radio_list[k];
            if (radio_input.value === value) {
                this._collection[form_id].set(radio_input.name, value);
                found = true;
                break;
            }
        }

        if (!found) {
            throw new TypeError('Trying to Form.set() on radio with unexisted value="' + value + '"');
        }
    },
    _parseFormControlCheckbox: function _parseFormControlCheckbox(form_id, form_control, value) {
        var fd = this._collection[form_id];
        fd.setCheckbox(form_control.name, value, form_control.checked);
    },
    _parseFormControlFile: function _parseFormControlFile(form_id, form_control, value) {
        if (value !== '' && !(value instanceof Blob) && !(value instanceof File)) {
            throw new TypeError('Only empty string, Blob or File object is allowed to be assigned to .value property of file input using Bunny Form');
        } else {
            if (value.name === undefined) {
                value.name = 'blob';
            }
            this._collection[form_id].set(form_control.name, value);
        }
    },
    _parseFormControlFileGetter: function _parseFormControlFileGetter(form_id, form_control) {
        // Override native file input .value logic
        // return Blob or File object or empty string if no file set
        return this.get(form_id, form_control.name);
    },
    __observeSingleValueChange: function __observeSingleValueChange(form_id, form_control) {
        var _this3 = this;

        Object.defineProperty(form_control, 'value', {
            configurable: true,
            get: function get() {
                return _this3._parseFormControl(form_id, form_control);
            },
            set: function set(value) {
                console.log('setting to');
                console.log(value);
                console.log(form_control);
                // call parent setter to redraw changes in UI, update checked etc.
                if (form_control.type !== 'file') {
                    Object.getOwnPropertyDescriptor(form_control.constructor.prototype, 'value').set.call(form_control, value);
                }

                //this._parseFormControl(form_id, form_control, value);
                if (!_this3._collection[form_id].isNodeList(form_control)) {
                    if (!_this3._valueSetFromEvent) {
                        console.log('firing event');
                        var event = new CustomEvent('change');
                        form_control.dispatchEvent(event);
                    }
                } else {

                    // For radio - call change event on changed input
                    for (var k = 0; k < form_control.length; k++) {
                        var radio_input = form_control[k];
                        if (radio_input.getAttribute('value') === value) {
                            if (!_this3._valueSetFromEvent) {
                                console.log('firing radio event');
                                var _event = new CustomEvent('change');
                                radio_input.dispatchEvent(_event);
                                break;
                            }
                        }
                    }
                }
            }
        });
    },
    _initNewInput: function _initNewInput(form_id, input) {
        this._checkInit(form_id);
        this._collection[form_id]._initSingleInput(input);
        this.__attachSingleChangeEvent(form_id, input);
        this.__observeSingleValueChange(form_id, input, input.name);
    },
    _attachDOMChangeEvent: function _attachDOMChangeEvent(form_id) {
        var _this4 = this;

        var target = document.forms[form_id];
        var observer_config = { childList: true, subtree: true };
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.addedNodes.length > 0) {
                    // probably new input added, update form data
                    _this4.__handleAddedNodes(form_id, mutation.addedNodes);
                } else if (mutation.removedNodes.length > 0) {
                    // probably input removed, update form data
                    _this4.__handleRemovedNodes(form_id, mutation.removedNodes);
                }
            });
        });

        observer.observe(target, observer_config);
    },
    __handleAddedNodes: function __handleAddedNodes(form_id, added_nodes) {
        for (var k = 0; k < added_nodes.length; k++) {
            var node = added_nodes[k];
            if (node.tagName === 'INPUT') {
                this._initNewInput(form_id, node);
            } else if (node.getElementsByTagName !== undefined) {
                // to make sure node is not text node or any other type of node without full Element API
                var inputs = node.getElementsByTagName('input');
                if (inputs.length > 0) {
                    for (var k2 = 0; k2 < inputs.length; k2++) {
                        this._initNewInput(form_id, inputs[k2]);
                    }
                }
            }
        }
    },
    __handleRemovedNodes: function __handleRemovedNodes(form_id, removed_nodes) {
        for (var k = 0; k < removed_nodes.length; k++) {
            var node = removed_nodes[k];
            if (node.tagName === 'INPUT') {
                var input = node;
                this._collection[form_id].remove(input.name, input.value);
            } else if (node.getElementsByTagName !== undefined) {
                // to make sure node is not text node or any other type of node without full Element API
                var inputs = node.getElementsByTagName('input');
                if (inputs.length > 0) {
                    for (var k2 = 0; k2 < inputs.length; k2++) {
                        var _input = inputs[k2];
                        this._collection[form_id].remove(_input.name, _input.value);
                    }
                }
            }
        }
    },


    /**
     * Init all forms in DOM
     * Must be called after DOMContentLoaded (ready)
     */
    initAll: function initAll() {
        var _this5 = this;

        [].forEach.call(document.forms, function (form) {
            _this5.init(form.id);
        });
    },


    /**
     * Check if form is initiated
     *
     * @param {string} form_id
     *
     * @throws Error
     * @private
     */
    _checkInit: function _checkInit(form_id) {
        if (this._collection[form_id] === undefined) {
            throw new Error('Form with ID ' + form_id + ' is not initiated! Init form with Form.init(form_id) first.');
        }
    },


    /*
    Get and set form data methods
     */

    /**
     * Set new value of real DOM input or virtual input
     * Actually fires change event and values are set in _attachChangeAndDefaultFileEvent()
     *
     * @param {string} form_id
     * @param {string} input_name
     * @param {string|Blob|Object} input_value
     */
    set: function set(form_id, input_name, input_value) {
        this._checkInit(form_id);
        var input = this._collection[form_id].getInput(input_name);
        input.value = input_value;
    },


    /**
     * Fill form data with object values. Object property name/value => form input name/value
     * @param form_id
     * @param data
     */
    fill: function fill(form_id, data) {
        this._checkInit(form_id);
        for (var input_name in data) {
            if (this._collection[form_id].has(input_name)) {
                this.set(form_id, input_name, data[input_name]);
            }
        }
    },
    fillOrAppend: function fillOrAppend(form_id, data) {
        this._checkInit(form_id);
        for (var input_name in data) {
            if (this._collection[form_id].has(input_name)) {
                this.set(form_id, input_name, data[input_name]);
            } else {
                this.append(form_id, input_name, data[input_name]);
            }
        }
    },
    observe: function observe(form_id, data_object) {
        var _this6 = this;

        var new_data_object = Object.create(data_object);

        var _loop = function _loop(input_name) {
            Object.defineProperty(new_data_object, input_name, {
                set: function set(value) {
                    _this6.set(form_id, input_name, value);
                },
                get: function get() {
                    return _this6.get(form_id, input_name);
                }
            });
        };

        for (var input_name in new_data_object) {
            _loop(input_name);
        }
        return new_data_object;
    },
    fillAndObserve: function fillAndObserve(form_id, data_object) {
        this.fill(form_id, data_object);
        this.observe(form_id, data_object);
    },


    /**
     * Get value of real DOM input or virtual input
     *
     * @param {string} form_id
     * @param {string} input_name
     *
     * @returns {string|File|Blob}
     */
    get: function get(form_id, input_name) {
        this._checkInit(form_id);
        return this._collection[form_id].get(input_name);
    },
    getObservableModel: function getObservableModel(form_id) {
        return this.observe(form_id, this.getAll(form_id));
    },


    /**
     * Get all form input values as key - value object
     * @param form_id
     * @returns {object}
     */
    getAll: function getAll(form_id) {
        this._checkInit(form_id);
        /*const data = {};
        const items = this._collection[form_id].entries();
        for (let item of items) {
            data[item[0]] = item[1];
        }
        return data;*/
        return this._collection[form_id].getAllElements();
    },


    /**
     * Get native FormData object
     * For example, to submit form with custom handler
     * @param {string} form_id
     * @returns {FormData}
     */
    getFormDataObject: function getFormDataObject(form_id) {
        this._checkInit(form_id);
        return this._collection[form_id].buildFormDataObject();
    },
    getInput: function getInput(form_id, input_name) {
        return this._collection[form_id].getInput(input_name);
    },


    /*
     virtual checkbox, item list, tag list, etc methods
     */
    append: function append(form_id, array_name, value) {
        this._checkInit(form_id);
        var formData = this._collection[form_id];
        formData.append(array_name, value);
    },
    remove: function remove(form_id, array_name) {
        var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

        this._checkInit(form_id);
        /*const formData = this._collection[form_id];
        formData.delete(array_name);
        const collection = formData.getAll(array_name);
        collection.forEach( (item) => {
            if (item !== value) {
                formData.append(array_name, item);
            }
        });*/
        this._collection[form_id].remove(array_name, value);
    },


    /*
    binding (mirror) methods
     */

    /**
     * Mirrors real DOM input's value with any DOM element (two-way data binding)
     * All DOM elements with attribute data-mirror="form_id.input_name" are always updated when input value changed
     * @param {string} form_id
     * @param {string} input_name
     */
    mirror: function mirror(form_id, input_name) {
        var _this7 = this;

        this._checkInit(form_id);
        var input = this._collection[form_id].getInput(input_name);
        if (!(input instanceof HTMLInputElement)) {
            // make sure it is normal input and not RadioNodeList or other interfaces which don't have addEventListener
            throw new Error('Cannot mirror radio buttons or checkboxes.');
        }
        if (this._mirrorCollection[form_id] === undefined) {
            this._mirrorCollection[form_id] = {};
        }
        this._mirrorCollection[form_id][input_name] = true;

        //const input = document.forms[form_id].elements[input_name];
        this.setMirrors(form_id, input_name);
        input.addEventListener('change', function () {
            _this7.setMirrors(form_id, input_name);
        });
    },


    /**
     * Mirrors all inputs of form
     * Does not mirror radio buttons and checkboxes
     * See Form.mirror() for detailed description
     * @param form_id
     */
    mirrorAll: function mirrorAll(form_id) {
        var _this8 = this;

        this._checkInit(form_id);
        var inputs = this._collection[form_id].getInputs();
        [].forEach.call(inputs, function (input) {
            if (input instanceof HTMLInputElement && input.type !== 'checkbox' && input.type !== 'radio') {
                // make sure it is normal input and not RadioNodeList or other interfaces which don't have addEventListener
                _this8.mirror(form_id, input.name);
            }
        });
    },
    getMirrors: function getMirrors(form_id, input_name) {
        this._checkInit(form_id);
        return document.querySelectorAll('[data-mirror="' + form_id + '.' + input_name + '"]');
    },
    setMirrors: function setMirrors(form_id, input_name) {
        var _this9 = this;

        this._checkInit(form_id);
        var mirrors = this.getMirrors(form_id, input_name);
        var input = this._collection[form_id].getInput(input_name);
        //const input = document.forms[form_id].elements[input_name];
        [].forEach.call(mirrors, function (mirror) {
            if (mirror.tagName === 'IMG') {
                var data = _this9.get(form_id, input_name);
                if (data === '') {
                    mirror.src = '';
                } else if (data.size !== 0) {
                    mirror.src = URL.createObjectURL(_this9.get(form_id, input_name));
                }
            } else {
                mirror.textContent = input.value;
            }
        });
    },


    /*
    Calc methods
     */
    /*_getCalcMirrors(form_id) {
        this._checkInit(form_id);
        return document.querySelectorAll(`[data-mirror="${form_id}"]`);
    },
      _getCalcMirrorFunction(calc_mirror_el) {
        return calc_mirror_el.getAttribute('data-mirror-function');
    },
      _calcMirror(form_id, calc_mirror, calc_mirror_function) {
        // parse function
        const input_names = calc_mirror_function.split('*');
        console.log(input_names);
        // get arguments (inputs)
        const input1 = document.forms[form_id].elements[input_names[0]];
        const input2 = document.forms[form_id].elements[input_names[1]];
          const value1 = (input1.value === '') ? 0 : input1.value;
        const value2 = (input2.value === '') ? 0 : input2.value;
          // update collection
        if (this._calcMirrorCollection[form_id] === undefined) {
            this._calcMirrorCollection[form_id] = {};
        }
        if (this._calcMirrorCollection[form_id][input1.name] === undefined) {
            this._calcMirrorCollection[form_id][input1.name] = {}
        }
        if (this._calcMirrorCollection[form_id][input2.name] === undefined) {
            this._calcMirrorCollection[form_id][input2.name] = {}
        }
        this._calcMirrorCollection[form_id][input1.name][input2.name] = calc_mirror;
        this._calcMirrorCollection[form_id][input2.name][input1.name] = calc_mirror;
          // set initial value
        calc_mirror.textContent = value1 * value2;
          // set new value when input value changed
        input1.addEventListener('change', () => {
            calc_mirror.textContent = input1.value * document.forms[form_id].elements[input2.name].value;
        });
        input2.addEventListener('change', () => {
            calc_mirror.textContent = input2.value * document.forms[form_id].elements[input1.name].value;
        });
    },
      calcMirrorAll(form_id) {
        this._checkInit(form_id);
        const calc_mirrors = this._getCalcMirrors(form_id);
        for(let calc_mirror of calc_mirrors) {
            let f = this._getCalcMirrorFunction(calc_mirror);
            if (f === undefined) {
                console.trace();
                throw new Error('Calc mirror element with attribute data-mirror does not have attribute data-mirror-function')
            } else {
                this._calcMirror(form_id, calc_mirror, f);
            }
        }
    },*/

    /*
    file methods
     */
    setFileFromUrl: function setFileFromUrl(form_id, input_name, url) {
        var _this10 = this;

        var request = new XMLHttpRequest();
        var p = new Promise(function (success, fail) {
            request.onload = function () {
                if (request.status === 200) {
                    var blob = request.response;
                    _this10.set(form_id, input_name, blob);
                    success(blob);
                } else {
                    fail(request);
                }
            };
        });

        request.open('GET', url, true);
        request.responseType = 'blob';
        request.send();
        return p;
    },


    /*
    submit methods
     */

    submit: function submit(form_id) {
        var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'POST';
        var headers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { 'X-Requested-With': 'XMLHttpRequest' };

        this._checkInit(form_id);
        var request = new XMLHttpRequest();
        if (url === null) {
            if (document.forms[form_id].hasAttribute('action')) {
                url = document.forms[form_id].getAttribute('action');
            } else {
                //throw new Error('Form.submit() is missing 2nd URL argument');
                url = '';
            }
        }
        request.open(method, url);
        var p = new Promise(function (success, fail) {
            request.onload = function () {
                if (request.status === 200) {
                    success(request.responseText);
                } else {
                    fail(request);
                }
            };
        });
        for (var header in headers) {
            request.setRequestHeader(header, headers[header]);
        }
        this._collection[form_id].set('categories', [2, 3]);
        request.send(this.getFormDataObject(form_id));
        return p;
    }
};

var BunnyFile = {

    /**
     * Download file from URL via AJAX and make Blob object or return base64 string if 2nd argument is false
     * Only files from CORS-enabled domains can be downloaded or AJAX will get security error
     *
     * @param {String} URL
     * @param {Boolean} convert_to_blob = true
     * @returns {Promise}: success(Blob object | base64 string), fail(response XHR object)
     */
    download: function download(URL) {
        var convert_to_blob = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var request = new XMLHttpRequest();
        var p = new Promise(function (success, fail) {
            request.onload = function () {
                if (request.status === 200) {
                    var blob = request.response;
                    success(blob);
                } else {
                    fail(request);
                }
            };
        });

        request.open('GET', URL, true);
        if (convert_to_blob) {
            request.responseType = 'blob';
        }
        request.send();

        return p;
    },


    /**
     * Get File/Blob header (signature) to parse for MIME-type or any magic numbers
     * @param {File|Blob} blob
     * @returns {Promise} callback(str:signature)
     */
    getSignature: function getSignature(blob) {
        return new Promise(function (callback) {
            var reader = new FileReader();
            reader.onloadend = function () {
                var arr = new Uint8Array(reader.result).subarray(0, 4);
                var signature = '';
                for (var i = 0; i < arr.length; i++) {
                    signature += arr[i].toString(16);
                }
                callback(signature);
            };
            reader.readAsArrayBuffer(blob);
        });
    },


    /**
     * Check if string is a valid signature for image/jpeg
     * @param {String} signature
     * @returns {boolean}
     */
    isJpeg: function isJpeg(signature) {
        var signatures = ['ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2'];
        return signatures.indexOf(signature) > -1;
    },


    /**
     * Check if string is a valid signature for image/png
     * @param {String} signature
     * @returns {boolean}
     */
    isPng: function isPng(signature) {
        return signature === '89504e47';
    },


    /**
     * Convert base64 string to Blob object
     * @param {String} base64
     * @returns {Blob}
     */
    base64ToBlob: function base64ToBlob(base64) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(base64.split(',')[1]);

        // separate out the mime component
        var mimeString = base64.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        return new Blob([ab], { type: mimeString });
    },


    /**
     * Convert Blob object to base64string
     * @param {Blob} blob
     * @returns {Promise} success(base64 string), fail(error)
     */
    blobToBase64: function blobToBase64(blob) {
        var reader = new FileReader();
        var p = new Promise(function (success, fail) {
            reader.onloadend = function () {
                var base64 = reader.result;
                success(base64);
            };
            reader.onerror = function (e) {
                fail(e);
            };
        });

        reader.readAsDataURL(blob);

        return p;
    },


    /**
     * Get local browser object URL which can be used in img.src for example
     * @param {Blob} blob
     * @returns {String}
     */
    getBlobLocalURL: function getBlobLocalURL(blob) {
        if (!(blob instanceof Blob || blob instanceof File)) {
            throw new TypeError('Argument in BunnyFile.getBlobLocalURL() is not a Blob or File object');
        }
        return URL.createObjectURL(blob);
    }
};

/**
 * @component BunnyImage
 * Wrapper for Image object representing <img> tag, uses Canvas and BunnyFile
 *
 */
var BunnyImage = {

  IMG_CONVERT_TYPE: 'image/jpeg',
  IMG_QUALITY: 0.7,

  // SECTION: get Image object via different sources

  /**
   * Downloads image by any URL or converts from Blob, should work also for non-CORS domains
   *
   * @param {String|Blob} urlOrBlob
   * @returns {Promise} success(Image object), fail(error)
   */
  getImage: function getImage(urlOrBlob) {
    if (typeof urlOrBlob === 'string') {
      return this.getImageByURL(urlOrBlob);
    } else {
      return this.getImageByBlob(urlOrBlob);
    }
  },


  /**
   * Downloads image by any URL, should work also for non-CORS domains
   *
   * @param {String} URL
   * @returns {Promise} success(Image object), fail(error)
   */
  getImageByURL: function getImageByURL(URL) {
    return this._toImagePromise(URL, true);
  },
  _toImagePromise: function _toImagePromise(src) {
    var crossOrigin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var img = new Image();
    var p = new Promise(function (ok, fail) {
      img.onload = function () {
        ok(img);
      };
      img.onerror = function (e) {
        fail(e);
      };
    });
    if (crossOrigin) {
      img.crossOrigin = 'Anonymous';
    }
    img.src = src;
    return p;
  },
  getImageByBlob: function getImageByBlob(blob) {
    var url = BunnyFile.getBlobLocalURL(blob);
    return this._toImagePromise(url);
  },
  getImageByBase64: function getImageByBase64(base64) {
    var url = base64;
    return this._toImagePromise(url);
  },
  getImageByCanvas: function getImageByCanvas(canvas) {
    var url = canvas.toDataURL(this.IMG_CONVERT_TYPE, this.IMG_QUALITY);
    return this._toImagePromise(url);
  },


  // SECTION:: create different sources from Image object

  imageToCanvas: function imageToCanvas(img) {
    var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    if (!img.complete) {
      throw new Error('Can not create canvas from Image. Image is not loaded yet.');
    }
    var canvas = document.createElement("canvas");
    if (width === null && height === null) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d").drawImage(img, 0, 0);
    } else {
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
    }
    return canvas;
  },


  /**
   *
   * @param {Image|HTMLImageElement} img
   * @param {Number?} width
   * @param {Number?} height
   * @returns {string}
   */
  imageToBase64: function imageToBase64(img) {
    var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    return this.imageToCanvas(img, width, height).toDataURL(this.IMG_CONVERT_TYPE, this.IMG_QUALITY);
  },


  /**
   *
   * @param {Image|HTMLImageElement} img
   * @param {Number?} width
   * @param {Number?} height
   * @returns {Blob}
   */
  imageToBlob: function imageToBlob(img) {
    var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    return BunnyFile.base64ToBlob(this.imageToBase64(img, width, height));
  },


  // SECTION: basic Image statistics and info functions

  getImageURL: function getImageURL(img) {
    return img.src;
  },
  getImageWidth: function getImageWidth(img) {
    if (!img.complete) {
      throw new Error('Can not get Image.width. Image is not loaded yet.');
    }
    return img.width;
  },
  getImageHeight: function getImageHeight(img) {
    if (!img.complete) {
      throw new Error('Can not get Image.height. Image is not loaded yet.');
    }
    return img.height;
  },


  // SECTION: basic Image data math functions

  getImageNewAspectSizes: function getImageNewAspectSizes(img, max_width, max_height) {
    var img_width = this.getImageWidth(img);
    var img_height = this.getImageHeight(img);
    if (img_width === 0 || img_height === 0) {
      throw new Error('Image width or height is 0 in BunnyImage.getImageNewAspectSizes().');
    }
    var ratio = Math.min(max_width / img_width, max_height / img_height);

    return {
      width: Math.floor(img_width * ratio),
      height: Math.floor(img_height * ratio)
    };
  },


  // SECTION: basic Image manipulation
  // returns canvas

  /**
   * Resize image
   * @param {Image} img
   * @param {Number} max_width
   * @param {Number} max_height
   * @returns {Promise} success(Image), fail(error)
   */
  resizeImage: function resizeImage(img, max_width, max_height) {
    var sizes = this.getImageNewAspectSizes(img, max_width, max_height);
    var width = sizes.width;
    var height = sizes.height;
    var canvas = this.imageToCanvas(img, width, height);
    return canvas;
    //return this.getImageByCanvas(canvas);
  },
  resizeCanvas: function resizeCanvas(canvas, width) {
    var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    if (height === null) height = width;
    var tmpCanvas = document.createElement('canvas');
    var tmpCtx = tmpCanvas.getContext('2d');
    tmpCanvas.width = width;
    tmpCanvas.height = height;
    tmpCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, width, height);
    return tmpCanvas;
  },
  crop: function crop(img, x, y, width) {
    var height = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

    if (height === null) height = width;
    var proportion = img.naturalWidth / img.clientWidth;
    var canvas = document.createElement('canvas');
    var sizeX = width * proportion;
    var sizeY = height * proportion;
    canvas.width = sizeX;
    canvas.height = sizeY;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, x * proportion, y * proportion, sizeX, sizeY, 0, 0, sizeX, sizeY);
    return canvas;
  },
  cropByCursor: function cropByCursor(img, cursor) {
    return this.crop(img, cursor.offsetLeft, cursor.offsetTop, cursor.clientWidth, cursor.clientHeight);
  }
};

Form$1.initAll();

document.forms.form1.elements.name.addEventListener('change', function () {
    console.log(this);
    console.log(this.value);
});

var gender = document.forms.form1.elements.gender;
console.log(gender);
for (var k = 0; k < gender.length; k++) {
    gender[k].addEventListener('change', function () {
        console.log(this);
        console.log(this.value);
    });
}

Form$1.mirrorAll('form1');
//Form.calcMirrorAll('form2');

var link = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/400px-Google_2015_logo.svg.png';

var image = null;

BunnyImage.getImageByURL(link).then(function (img) {
    image = img;
});

document.forms.form1.addEventListener('submit', function (e) {
    e.preventDefault();
    Form$1.submit(document.forms[0].id).then(function (responseData) {
        console.log('ajax submit ok');
    }).catch(function (response) {
        console.log('ajax fail');
    });
});

document.getElementById('set_photo').addEventListener('click', function (e) {
    document.getElementById('form1_submit').setAttribute('disabled', 'disabled');
    Form$1.setFileFromUrl('form1', 'photo', link).then(function (blob) {
        document.getElementById('form1_submit').removeAttribute('disabled');
        console.log(blob);
    }).catch(function (e) {
        console.log(e);
    });
});

var counter = 1;

document.getElementById('add').addEventListener('click', function () {
    var input = document.createElement('input');
    input.type = 'text';
    input.name = 'custom_input';
    input.value = counter++;
    var close = document.createElement('a');
    close.classList.add('btn');
    close.classList.add('btn-danger');
    close.textContent = 'Delete';
    var div = document.createElement('div');
    div.appendChild(input);
    div.appendChild(close);
    close.addEventListener('click', function () {
        document.forms.form1.removeChild(div);
    });
    document.forms.form1.appendChild(div);
});

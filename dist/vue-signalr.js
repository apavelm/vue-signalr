"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var SignalR = _interopRequireWildcard(require("@microsoft/signalr/dist/browser/signalr"));

var EventEmitter = require("events");

var defaultOptions = {
  log: false
};

var SocketConnection = /*#__PURE__*/function (_EventEmitter) {
  (0, _inherits2.default)(SocketConnection, _EventEmitter);

  function SocketConnection(connection) {
    var _this;

    (0, _classCallCheck2.default)(this, SocketConnection);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(SocketConnection).call(this));
    _this.connection = connection;
    _this.listened = [];
    _this.socket = false;
    _this.toSend = [];
    _this.offline = false;
    return _this;
  }

  (0, _createClass2.default)(SocketConnection, [{
    key: "_initialize",
    value: function () {
      var _initialize2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var _this2 = this;

        var connection,
            transportType,
            con,
            socket,
            _args2 = arguments;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                connection = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : "";
                transportType = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : SignalR.HttpTransportType.None;
                con = connection || this.connection;
                _context2.prev = 3;
                socket = new SignalR.HubConnectionBuilder().withUrl(con).build(transportType);

                socket.connection.onclose = /*#__PURE__*/function () {
                  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(error) {
                    return _regenerator.default.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            if (_this2.options.log) console.log("Reconnecting...");
                            _this2.socket = false;
                            /* eslint-disable no-underscore-dangle */

                            _context.next = 4;
                            return _this2._initialize(con, SignalR.HttpTransportType.LongPolling);

                          case 4:
                            _this2.emit("reconnect");

                          case 5:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x) {
                    return _ref.apply(this, arguments);
                  };
                }();

                _context2.next = 8;
                return socket.start();

              case 8:
                this.socket = socket;
                this.emit("init");
                _context2.next = 16;
                break;

              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2["catch"](3);
                if (this.options.log) console.log("Error, reconnecting...");
                setTimeout(function () {
                  _this2._initialize(con, SignalR.HttpTransportType.LongPolling);
                }, 1000);

              case 16:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[3, 12]]);
      }));

      function _initialize() {
        return _initialize2.apply(this, arguments);
      }

      return _initialize;
    }()
  }, {
    key: "start",
    value: function () {
      var _start = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var options,
            _args3 = arguments;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                options = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {};
                this.options = Object.assign(defaultOptions, options);
                _context3.next = 4;
                return this._initialize();

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function start() {
        return _start.apply(this, arguments);
      }

      return start;
    }()
  }, {
    key: "authenticate",
    value: function () {
      var _authenticate = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(accessToken) {
        var options,
            _args4 = arguments;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                options = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : {};
                this.connection = "".concat(this.connection, "?authorization=").concat(accessToken);
                /* eslint-disable no-underscore-dangle */

                _context4.next = 4;
                return this.start(options);

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function authenticate(_x2) {
        return _authenticate.apply(this, arguments);
      }

      return authenticate;
    }()
  }, {
    key: "listen",
    value: function listen(method) {
      var _this3 = this;

      if (this.offline) return;
      if (this.listened.some(function (v) {
        return v === method;
      })) return;
      this.listened.push(method);
      this.on("init", function () {
        _this3.socket.on(method, function (data) {
          if (_this3.options.log) console.log({
            type: "receive",
            method: method,
            data: data
          });

          _this3.emit(method, data);
        });
      });
    }
  }, {
    key: "send",
    value: function send(methodName) {
      var _this4 = this;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (this.options.log) console.log({
        type: "send",
        methodName: methodName,
        args: args
      });
      if (this.offline) return;

      if (this.socket) {
        var _this$socket;

        (_this$socket = this.socket).send.apply(_this$socket, [methodName].concat(args));

        return;
      }

      this.once("init", function () {
        var _this4$socket;

        return (_this4$socket = _this4.socket).send.apply(_this4$socket, [methodName].concat(args));
      });
    }
  }, {
    key: "invoke",
    value: function () {
      var _invoke = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6(methodName) {
        var _this5 = this;

        var _len2,
            args,
            _key2,
            _this$socket2,
            _args6 = arguments;

        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                for (_len2 = _args6.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                  args[_key2 - 1] = _args6[_key2];
                }

                if (this.options.log) console.log({
                  type: "invoke",
                  methodName: methodName,
                  args: args
                });

                if (!this.offline) {
                  _context6.next = 4;
                  break;
                }

                return _context6.abrupt("return", false);

              case 4:
                if (!this.socket) {
                  _context6.next = 6;
                  break;
                }

                return _context6.abrupt("return", (_this$socket2 = this.socket).invoke.apply(_this$socket2, [methodName].concat(args)));

              case 6:
                return _context6.abrupt("return", new Promise( /*#__PURE__*/function () {
                  var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5(resolve) {
                    return _regenerator.default.wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            return _context5.abrupt("return", _this5.once("init", function () {
                              var _this5$socket;

                              return resolve((_this5$socket = _this5.socket).invoke.apply(_this5$socket, [methodName].concat(args)));
                            }));

                          case 1:
                          case "end":
                            return _context5.stop();
                        }
                      }
                    }, _callee5);
                  }));

                  return function (_x4) {
                    return _ref2.apply(this, arguments);
                  };
                }()));

              case 7:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function invoke(_x3) {
        return _invoke.apply(this, arguments);
      }

      return invoke;
    }()
  }]);
  return SocketConnection;
}(EventEmitter);

if (!SignalR) {
  throw new Error("[Vue-SignalR] Cannot locate signalr-client");
}

function install(Vue, connection) {
  if (!connection) {
    throw new Error("[Vue-SignalR] Cannot locate connection");
  }

  var Socket = new SocketConnection(connection);
  Vue.socket = Socket;
  Object.defineProperties(Vue.prototype, {
    $socket: {
      get: function get() {
        return Socket;
      }
    }
  });
  Vue.mixin({
    created: function created() {
      var _this6 = this;

      if (this.$options.sockets) {
        var methods = Object.getOwnPropertyNames(this.$options.sockets);
        methods.forEach(function (method) {
          Socket.listen(method);
          Socket.on(method, function (data) {
            return _this6.$options.sockets[method].call(_this6, data);
          });
        });
      }

      if (this.$options.subscribe) {
        Socket.on("authenticated", function () {
          _this6.$options.subscribe.forEach(function (channel) {
            Socket.invoke("join", channel);
          });
        });
      }
    },
    beforeDestroy: function beforeDestroy() {
      // Make sure to cleanup SignalR event handlers when removing the component
      if (this.$options.sockets) {
        Socket.connection.stop();
      }
    }
  });
}

var _default = install;
exports.default = _default;

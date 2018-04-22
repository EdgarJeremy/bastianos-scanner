'use strict';

var _createClass = function () {
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

function _asyncToGenerator(fn) {
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
                        return step("next", value);
                    }, function (err) {
                        return step("throw", err);
                    });
                }
            }
            return step("next");
        });
    };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
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
}

function cameraName(label) {
    var clean = label.replace(/\s*\([0-9a-f]+(:[0-9a-f]+)?\)\s*$/, '');
    return clean || label || null;
}

var MediaError = function (_Error) {
    _inherits(MediaError, _Error);

    function MediaError(type) {
        _classCallCheck(this, MediaError);

        var _this = _possibleConstructorReturn(this, (MediaError.__proto__ || Object.getPrototypeOf(MediaError)).call(this, 'Cannot access video stream (' + type + ').'));

        _this.type = type;
        return _this;
    }

    return MediaError;
}(Error);

var Camera = function () {
    function Camera(id, name) {
        _classCallCheck(this, Camera);

        this.id = id;
        this.name = name;
        this._stream = null;
    }

    _createClass(Camera, [{
        key: 'start',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                var _this2 = this;

                var constraints;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                constraints = {
                                    audio: false,
                                    video: {
                                        mandatory: {
                                            sourceId: this.id,
                                            minWidth: 600,
                                            maxWidth: 800,
                                            minAspectRatio: 1.6
                                        },
                                        optional: []
                                    }
                                };
                                _context2.next = 3;
                                return Camera._wrapErrors(_asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_context) {
                                        while (1) {
                                            switch (_context.prev = _context.next) {
                                                case 0:
                                                    _context.next = 2;
                                                    return navigator.mediaDevices.getUserMedia(constraints);

                                                case 2:
                                                    return _context.abrupt('return', _context.sent);

                                                case 3:
                                                case 'end':
                                                    return _context.stop();
                                            }
                                        }
                                    }, _callee, _this2);
                                })));

                            case 3:
                                this._stream = _context2.sent;
                                return _context2.abrupt('return', this._stream);

                            case 5:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function start() {
                return ref.apply(this, arguments);
            }

            return start;
        }()
    }, {
        key: 'stop',
        value: function stop() {
            if (!this._stream) {
                return;
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._stream.getVideoTracks()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var stream = _step.value;

                    stream.stop();
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this._stream = null;
        }
    }], [{
        key: 'getCameras',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                var devices;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this._ensureAccess();

                            case 2:
                                _context3.next = 4;
                                return navigator.mediaDevices.enumerateDevices();

                            case 4:
                                devices = _context3.sent;
                                return _context3.abrupt('return', devices.filter(function (d) {
                                    return d.kind === 'videoinput';
                                }).map(function (d) {
                                    return new Camera(d.deviceId, cameraName(d.label));
                                }));

                            case 6:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function getCameras() {
                return ref.apply(this, arguments);
            }

            return getCameras;
        }()
    }, {
        key: '_ensureAccess',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
                var _this3 = this;

                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return this._wrapErrors(_asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                                    var access, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, stream;

                                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                        while (1) {
                                            switch (_context4.prev = _context4.next) {
                                                case 0:
                                                    _context4.next = 2;
                                                    return navigator.mediaDevices.getUserMedia({
                                                        video: true
                                                    });

                                                case 2:
                                                    access = _context4.sent;
                                                    _iteratorNormalCompletion2 = true;
                                                    _didIteratorError2 = false;
                                                    _iteratorError2 = undefined;
                                                    _context4.prev = 6;

                                                    for (_iterator2 = access.getVideoTracks()[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                                        stream = _step2.value;

                                                        stream.stop();
                                                    }
                                                    _context4.next = 14;
                                                    break;

                                                case 10:
                                                    _context4.prev = 10;
                                                    _context4.t0 = _context4['catch'](6);
                                                    _didIteratorError2 = true;
                                                    _iteratorError2 = _context4.t0;

                                                case 14:
                                                    _context4.prev = 14;
                                                    _context4.prev = 15;

                                                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                                        _iterator2.return();
                                                    }

                                                case 17:
                                                    _context4.prev = 17;

                                                    if (!_didIteratorError2) {
                                                        _context4.next = 20;
                                                        break;
                                                    }

                                                    throw _iteratorError2;

                                                case 20:
                                                    return _context4.finish(17);

                                                case 21:
                                                    return _context4.finish(14);

                                                case 22:
                                                case 'end':
                                                    return _context4.stop();
                                            }
                                        }
                                    }, _callee4, _this3, [
                                        [6, 10, 14, 22],
                                        [15, , 17, 21]
                                    ]);
                                })));

                            case 2:
                                return _context5.abrupt('return', _context5.sent);

                            case 3:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function _ensureAccess() {
                return ref.apply(this, arguments);
            }

            return _ensureAccess;
        }()
    }, {
        key: '_wrapErrors',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(fn) {
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.prev = 0;
                                _context6.next = 3;
                                return fn();

                            case 3:
                                return _context6.abrupt('return', _context6.sent);

                            case 6:
                                _context6.prev = 6;
                                _context6.t0 = _context6['catch'](0);

                                if (!_context6.t0.name) {
                                    _context6.next = 12;
                                    break;
                                }

                                throw new MediaError(_context6.t0.name);

                            case 12:
                                throw _context6.t0;

                            case 13:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this, [
                    [0, 6]
                ]);
            }));

            function _wrapErrors(_x) {
                return ref.apply(this, arguments);
            }

            return _wrapErrors;
        }()
    }]);

    return Camera;
}();

module.exports = Camera;
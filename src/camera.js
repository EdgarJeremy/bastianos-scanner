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
        value: async function start() {
            var constraints = {
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

            this._stream = await Camera._wrapErrors(async function () {
                return await navigator.mediaDevices.getUserMedia(constraints);
            });

            return this._stream;
        }
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
        value: async function getCameras() {
            await this._ensureAccess();

            var devices = await navigator.mediaDevices.enumerateDevices();
            return devices.filter(function (d) {
                return d.kind === 'videoinput';
            }).map(function (d) {
                return new Camera(d.deviceId, cameraName(d.label));
            });
        }
    }, {
        key: '_ensureAccess',
        value: async function _ensureAccess() {
            return await this._wrapErrors(async function () {
                var access = await navigator.mediaDevices.getUserMedia({
                    video: true
                });
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = access.getVideoTracks()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var stream = _step2.value;

                        stream.stop();
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            });
        }
    }, {
        key: '_wrapErrors',
        value: async function _wrapErrors(fn) {
            try {
                return await fn();
            } catch (e) {
                if (e.name) {
                    throw new MediaError(e.name);
                } else {
                    throw e;
                }
            }
        }
    }]);

    return Camera;
}();

module.exports = Camera;
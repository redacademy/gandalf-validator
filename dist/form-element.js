'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _validator = require('./validator');

var validator = _interopRequireWildcard(_validator);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FormElement = function () {
    function FormElement(props) {
        _classCallCheck(this, FormElement);

        if (!props) throw 'field object is required';
        this.name = props.name;
        this.key = props.name;
        this.component = props.component;
        this.validators = props.validators;
        this.errorPropName = props.errorPropName;
        this.errorPropIsBool = props.errorPropIsBool;
        this.originalProps = props.props;
        this.onUpdate = props.onUpdate;
        this.debounce = props.debounce;
        this.getValueInOnChange = props.getValueInOnChange;
        this.children = props.children;
        this.errorMessage = '';
        this.value = '';
        this.timeOut = null;
        this.element = this.createReactElement();
    }

    _createClass(FormElement, [{
        key: 'createReactElement',
        value: function createReactElement() {
            return _react2.default.createElement(this.component, Object.assign({}, this.originalProps, this.buildElementProps()), this.children);
        }
    }, {
        key: 'buildElementProps',
        value: function buildElementProps() {
            var _ref;

            return _ref = {
                name: this.name,
                key: this.key,
                onChange: this.createChangeListener()
            }, _defineProperty(_ref, this.errorPropName, this.errorPropIsBool ? !!this.errorMessage : this.errorMessage), _defineProperty(_ref, 'value', this.value), _ref;
        }
    }, {
        key: 'createChangeListener',
        value: function createChangeListener() {
            var _this = this;

            return function (e, key, value) {
                _this.handleChange({
                    value: _this.getValueInOnChange ? _this.getValueInOnChange(e, key, value) : e.target.value
                });
            };
        }
    }, {
        key: 'handleChange',
        value: function handleChange(_ref2) {
            var value = _ref2.value,
                skipDebounce = _ref2.skipDebounce;

            this.value = value;
            if (this.debounce && !skipDebounce) {
                this.handleDebounce();
            } else {
                this.validate();
            }
            this.element = this.createReactElement();
            this.onUpdate(this);
        }
    }, {
        key: 'handleDebounce',
        value: function handleDebounce() {
            var _this2 = this;

            clearTimeout(this.timeOut);
            this.timeOut = setTimeout(function () {
                _this2.validate();
                _this2.element = _this2.createReactElement();
                _this2.onUpdate(_this2);
            }, this.debounce);
        }
    }, {
        key: 'validate',
        value: function validate() {
            var validationResult = validator.validate(this.validators, this.value);
            this.errorMessage = validationResult.errorMessage;
        }
    }]);

    return FormElement;
}();

exports.default = FormElement;
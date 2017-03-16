'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _formElement = require('./form-element');

var _formElement2 = _interopRequireDefault(_formElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Gandalf = function (_React$Component) {
    _inherits(Gandalf, _React$Component);

    function Gandalf() {
        var fieldData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        _classCallCheck(this, Gandalf);

        var _this = _possibleConstructorReturn(this, (Gandalf.__proto__ || Object.getPrototypeOf(Gandalf)).call(this));

        _this.state = { fieldData: fieldData, fields: {} };
        return _this;
    }

    _createClass(Gandalf, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.buildFields();
        }
    }, {
        key: 'componentWillUpdate',
        value: function componentWillUpdate() {
            this.buildFields();
        }
    }, {
        key: 'addField',
        value: function addField(field) {
            this.state.fieldData.push(field);
            this.setState({ fieldData: this.state.fieldData });
        }
    }, {
        key: 'buildFields',
        value: function buildFields() {
            var _this2 = this;

            this.state.fieldData.forEach(function (data) {
                data.onUpdate = function (field) {
                    return _this2.updateFieldState(field);
                };
                _this2.state.fields[data.name] = new _formElement2.default(data);
            });
        }
    }, {
        key: 'updateFieldState',
        value: function updateFieldState(field) {
            this.setState({
                fields: Object.assign({}, this.state.fields, _defineProperty({}, field.name, field))
            });
        }
    }, {
        key: 'getCleanFormData',
        value: function getCleanFormData() {
            this.runManualFormValidation();
            return this.formIsValid() ? this.getFormData() : null;
        }
    }, {
        key: 'runManualFormValidation',
        value: function runManualFormValidation() {
            var _this3 = this;

            Object.keys(this.state.fields).forEach(function (fieldName) {
                var field = _this3.state.fields[fieldName];
                field.handleChange({
                    value: field.value,
                    skipDebounce: true
                });
            });
        }
        // If any fields have an error message, the form is invalid

    }, {
        key: 'formIsValid',
        value: function formIsValid() {
            var _this4 = this;

            return !Object.keys(this.state.fields).find(function (fieldName) {
                return _this4.state.fields[fieldName].errorMessage;
            });
        }
    }, {
        key: 'getFormData',
        value: function getFormData() {
            var _this5 = this;

            return Object.keys(this.state.fields).reduce(function (formValues, fieldName) {
                var field = _this5.state.fields[fieldName];
                formValues[fieldName] = field.value;
                return formValues;
            }, {});
        }
    }]);

    return Gandalf;
}(_react2.default.Component);

exports.default = Gandalf;
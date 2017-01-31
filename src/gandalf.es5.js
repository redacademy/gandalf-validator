'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');

var Gandalf = function (_React$Component) {
  _inherits(Gandalf, _React$Component);

  function Gandalf() {
    var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Gandalf);

    var _this = _possibleConstructorReturn(this, (Gandalf.__proto__ || Object.getPrototypeOf(Gandalf)).call(this));

    _this.state = { fields: fields };

    _this.timeOuts = {};

    _this.errorMessages = {
      required: 'This field is required',
      numeric: 'This value must be a number',
      email: 'This value must an email address'
    };

    _this.validators = {
      required: function required(v) {
        return !v;
      },
      numeric: function numeric(v) {
        return isNaN(v);
      },
      email: function email(v) {
        return !/.+@.+\..+/.test(v);
      }
    };
    return _this;
  }

  _createClass(Gandalf, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var elementKeys = Object.keys(this.state.fields);

      elementKeys.forEach(function (name) {
        return _this2.augmentFieldData(name);
      });

      this.setState({ fields: Object.assign({}, this.state.fields) }, function () {
        elementKeys.forEach(function (name) {
          return _this2.createField(name);
        });
      });
    }
  }, {
    key: 'getErrorMessage',
    value: function getErrorMessage(name) {
      var _this3 = this;

      var _state$fields$name = this.state.fields[name],
          value = _state$fields$name.value,
          validators = _state$fields$name.validators;

      var errorKey = validators.find(function (validator) {
        return _this3.validators[validator](value);
      });

      return this.errorMessages[errorKey];
    }
  }, {
    key: 'createField',
    value: function createField(name) {
      var field = this.state.fields[name];
      field.element = this.buildFieldElement(field);
      this.updateFieldState(field);
    }
  }, {
    key: 'augmentFieldData',
    value: function augmentFieldData(name) {
      var _state$fields$name2 = this.state.fields[name],
          component = _state$fields$name2.component,
          _state$fields$name2$p = _state$fields$name2.props,
          props = _state$fields$name2$p === undefined ? {} : _state$fields$name2$p,
          validators = _state$fields$name2.validators,
          debounce = _state$fields$name2.debounce,
          _state$fields$name2$e = _state$fields$name2.errorPropName,
          errorPropName = _state$fields$name2$e === undefined ? 'error' : _state$fields$name2$e,
          _state$fields$name2$e2 = _state$fields$name2.errorPropIsBool,
          errorPropIsBool = _state$fields$name2$e2 === undefined ? false : _state$fields$name2$e2;


      var fieldData = {
        key: name,
        name: name,
        component: component,
        validators: validators,
        errorPropName: errorPropName,
        errorPropIsBool: errorPropIsBool,
        debounce: debounce,
        originalProps: props,
        errorMessage: '',
        value: ''
      };

      // Note: updated state won't propagate until setState() is called
      this.state.fields = Object.assign({}, this.state.fields, _defineProperty({}, name, fieldData));
    }
  }, {
    key: 'buildElementProps',
    value: function buildElementProps(name) {
      var _ref;

      var field = this.state.fields[name];

      return _ref = {
        name: name,
        key: name,
        onChange: this.createChangeListener(name)
      }, _defineProperty(_ref, field.errorPropName, field.errorPropIsBool ? !!field.errorMessage : field.errorMessage), _defineProperty(_ref, 'value', field.value), _ref;
    }
  }, {
    key: 'createChangeListener',
    value: function createChangeListener(name) {
      var _this4 = this;

      return function (e) {
        _this4.handleChange({
          name: name,
          value: e.target.value
        });
      };
    }
  }, {
    key: 'handleChange',
    value: function handleChange(_ref2) {
      var name = _ref2.name,
          value = _ref2.value,
          skipDebounce = _ref2.skipDebounce;

      var field = this.state.fields[name];

      field.value = value;

      if (field.debounce && !skipDebounce) {
        this.handleDebounce(name);
      } else {
        field.errorMessage = this.getErrorMessage(name);
      }

      field.element = this.buildFieldElement(field);

      this.updateFieldState(field);
    }
  }, {
    key: 'handleDebounce',
    value: function handleDebounce(name) {
      var _this5 = this;

      var field = this.state.fields[name];

      clearTimeout(this.timeOuts[name]);

      this.timeOuts[name] = setTimeout(function () {
        field.errorMessage = _this5.getErrorMessage(name);
        field.element = _this5.buildFieldElement(field);
        _this5.updateFieldState(field);
      }, field.debounce);
    }
  }, {
    key: 'buildFieldElement',
    value: function buildFieldElement(field) {
      return React.createElement(field.component, Object.assign({}, field.originalProps, this.buildElementProps(field.name)));
    }
  }, {
    key: 'updateFieldState',
    value: function updateFieldState(field) {
      this.setState({
        fields: Object.assign({}, this.state.fields, _defineProperty({}, field.name, field))
      });
    }

    // If any fields have an error message, the form is invalid

  }, {
    key: 'formIsValid',
    value: function formIsValid() {
      var _this6 = this;

      return !Object.keys(this.state.fields).find(function (fieldName) {
        return _this6.state.fields[fieldName].errorMessage;
      });
    }
  }, {
    key: 'runManualFormValidation',
    value: function runManualFormValidation() {
      var _this7 = this;

      Object.keys(this.state.fields).forEach(function (fieldName) {
        var field = _this7.state.fields[fieldName];
        _this7.handleChange({
          name: fieldName,
          value: field.value,
          skipDebounce: true
        });
      });
    }
  }, {
    key: 'getFormData',
    value: function getFormData() {
      var _this8 = this;

      return Object.keys(this.state.fields).reduce(function (formValues, fieldName) {
        var field = _this8.state.fields[fieldName];
        formValues[fieldName] = field.value;
        return formValues;
      }, {});
    }
  }, {
    key: 'getCleanFormData',
    value: function getCleanFormData() {
      this.runManualFormValidation();
      return this.formIsValid() ? this.getFormData() : false;
    }
  }]);

  return Gandalf;
}(React.Component);

module.exports = Gandalf;

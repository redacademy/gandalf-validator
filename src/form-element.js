// src/form-element
const React = require('react');
const validator = require('./validator');

class FormElement {
  constructor(props) {
    if (!props) throw 'field object is required';

    this.name = props.name;
    this.key = props.name;
    this.component = props.component;
    this.validators = props.validators;
    this.errorPropName = props.errorPropName;
    this.originalProps = props.props;
    this.onUpdate = props.onUpdate;
    this.errorMessage = '';
    this.value = '';
    this.timeOut = null;
    this.element = this.createReactElement();
  }

  createReactElement() {
    return React.createElement(
      this.component,
      Object.assign({}, this.originalProps, this.buildElementProps(this.name))
    );
  }

  buildElementProps() {
    return {
      name: this.name,
      key: this.key,
      onChange: this.createChangeListener(),
      [this.errorPropName]: this.errorPropIsBool ? !!this.errorMessage : this.errorMessage,
      value: this.value,
    };
  }

  createChangeListener() {
    return (e) => {
      this.handleChange({
        name,
        value: e.target.value
      });
    }
  }

  handleChange({ value, skipDebounce }) {
    this.value = value;

    if (this.debounce && !skipDebounce) {
      return this.handleDebounce();
    }

    this.validateAndUpdate();
  }

  handleDebounce() {
    clearTimeout(this.timeOut);

    this.timeOut = setTimeout(() => {
      this.validateAndUpdate();
    }, this.debounce);
  }

  validateAndUpdate() {
    const validationResult = validator.validate(this.validators, this.value);
    this.errorMessage = validationResult.errorMessage;
    this.element = this.createReactElement();
    this.onUpdate();
  }
}

module.exports = FormElement;

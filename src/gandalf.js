const React = require('react');

class Gandalf extends React.Component {
  constructor(fields = {}) {
    super();

    this.state = { fields };

    this.timeOuts = {};

    this.errorMessages = {
      required: 'This field is required',
      numeric: 'This value must be a number',
      email: 'This value must an email address',
    };

    this.validators = {
      required: v => !v,
      numeric: v => isNaN(v),
      email: v => !/.+@.+\..+/.test(v),
    };
  }

  componentWillMount() {
    const elementKeys = Object.keys(this.state.fields);

    elementKeys.forEach(name => this.augmentFieldData(name));

    this.setState({ fields: Object.assign({}, this.state.fields) }, () => {
      elementKeys.forEach(name => this.createField(name));
    });
  }

  getErrorMessage(name) {
    const { value, validators } = this.state.fields[name];
    const errorKey = validators.find(validator => this.validators[validator](value));

    return this.errorMessages[errorKey];
  }

  createField(name) {
    const field = this.state.fields[name];
    field.element = this.buildFieldElement(field);
    this.updateFieldState(field);
  }

  augmentFieldData(name) {
    const {
      component,
      props = {},
      validators,
      debounce,
      errorPropName = 'error',
      errorPropIsBool = false,
    } = this.state.fields[name];

    const fieldData = {
      key: name,
      name,
      component,
      validators,
      errorPropName,
      errorPropIsBool,
      debounce,
      originalProps: props,
      errorMessage: '',
      value: '',
    };

    // Note: updated state won't propagate until setState() is called
    this.state.fields = Object.assign({}, this.state.fields, { [name]: fieldData });
  }

  buildElementProps(name) {
    const field = this.state.fields[name];

    return {
      name,
      key: name,
      onChange: this.createChangeListener(name),
      [field.errorPropName]: field.errorPropIsBool ? !!field.errorMessage : field.errorMessage,
      value: field.value,
    };
  }

  createChangeListener(name) {
    return (e) => {
      this.handleChange({
        name,
        value: e.target.value
      });
    };
  }

  handleChange({ name, value, skipDebounce }) {
    const field = this.state.fields[name];

    field.value = value;

    if (field.debounce && !skipDebounce) {
      this.handleDebounce(name);
    } else {
      field.errorMessage = this.getErrorMessage(name);
    }

    field.element = this.buildFieldElement(field);

    this.updateFieldState(field);
  }

  handleDebounce(name) {
    const field = this.state.fields[name];

    clearTimeout(this.timeOuts[name]);

    this.timeOuts[name] = setTimeout(() => {
      field.errorMessage = this.getErrorMessage(name);
      field.element = this.buildFieldElement(field);
      this.updateFieldState(field);
    }, field.debounce);
  }

  buildFieldElement(field) {
    return React.createElement(
      field.component,
      Object.assign({}, field.originalProps, this.buildElementProps(field.name))
    );
  }

  updateFieldState(field) {
    this.setState({
      fields: Object.assign({}, this.state.fields, { [field.name]: field }),
    });
  }

  // If any fields have an error message, the form is invalid
  formIsValid() {
    return !Object.keys(this.state.fields).find(fieldName => this.state.fields[fieldName].errorMessage);
  }

  runManualFormValidation() {
    Object.keys(this.state.fields).forEach((fieldName) => {
      const field = this.state.fields[fieldName];
      this.handleChange({
        name: fieldName,
        value: field.value,
        skipDebounce: true,
      });
    });
  }

  getFormData() {
    return Object.keys(this.state.fields).reduce((formValues, fieldName) => {
      const field = this.state.fields[fieldName];
      formValues[fieldName] = field.value;
      return formValues;
    }, {});
  }

  getCleanFormData() {
    this.runManualFormValidation();
    return this.formIsValid() ? this.getFormData() : false;
  }
}

module.exports = Gandalf;

const React = require('react');
const FormElement = require('./form-element');

class Gandalf extends React.Component {
  constructor(fields = {}) {
    super();
    this.state = { fields };
  }

  componentWillMount() {
    const elementKeys = Object.keys(this.state.fields);

    elementKeys.forEach(name => {
      const data = this.state.fields[name];
      data.name = name;
      data.onUpdate = () => this.updateFieldState;
      this.state.fields[name] = new FormElement(data);
    });

    this.setState({ fields: Object.assign({}, this.state.fields) }, () => {
      elementKeys.forEach(name => this.state.fields[name].createReactElement());
    });
  }

  updateFieldState(field) {
    this.setState({
      fields: Object.assign({}, this.state.fields, { [field.name]: field }),
    });
  }

  getCleanFormData() {
    this.runManualFormValidation();
    return this.formIsValid() ? this.getFormData() : null;
  }

  runManualFormValidation() {
    Object.keys(this.state.fields).forEach((fieldName) => {
      const field = this.state.fields[fieldName];
      field.handleChange({
        value: field.value,
        skipDebounce: true,
      });
    });
  }

  // If any fields have an error message, the form is invalid
  formIsValid() {
    return !Object.keys(this.state.fields).find(fieldName => this.state.fields[fieldName].errorMessage);
  }

  getFormData() {
    return Object.keys(this.state.fields).reduce((formValues, fieldName) => {
      const field = this.state.fields[fieldName];
      formValues[fieldName] = field.value;
      return formValues;
    }, {});
  }
}

module.exports = Gandalf;

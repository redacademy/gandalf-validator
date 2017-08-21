import React from 'react';
import FormElement from './form-element';

interface GandalfState {
  fieldData: Array<any>
  fields?: Object
}

class Gandalf extends React.Component<{}, GandalfState> {

  constructor(fieldData = []) {
    super();
    this.state = { fieldData, fields: {} };
  }

  componentWillMount(): void {
    this.buildFields();
  }

  addField(fieldData): void {
    this.state.fieldData.push(fieldData);
    this.state.fields[fieldData.name] = this.buildField(fieldData);
    this.setState({ fieldData: this.state.fieldData, fields: this.state.fields });
  }

  buildFields(): void {
    this.state.fieldData.forEach(data => {
      this.state.fields[data.name] = this.buildField(data);
    });
  }

  buildField(data): FormElement {
    const fieldData = Object.assign({}, data, { onUpdate: field => this.updateFieldState(field) });
    return new FormElement(fieldData);
  }

  updateFieldState(field: FormElement): void {
    this.setState({
      fields: Object.assign({}, this.state.fields, { [field.name]: field }),
    });
  }

  getCleanFormData(): Object {
    this.runManualFormValidation();
    return this.formIsValid() ? this.getFormData() : null;
  }

  runManualFormValidation(): void {
    Object.keys(this.state.fields).forEach((fieldName) => {
      const field = this.state.fields[fieldName];
      field.handleChange({
        value: field.value,
        skipDebounce: true,
      });
    });
  }

  // If any fields have an error message, the form is invalid
  formIsValid(): boolean {
    return !Object.keys(this.state.fields).find(fieldName => this.state.fields[fieldName].errorMessage);
  }

  // None of the elements have been touched. They may be invalid, but don't show errors yet
  formHasPristineElements(): boolean {
    return !!Object.keys(this.state.fields).find(fieldName => (
      !!this.state.fields[fieldName].validators.length && this.state.fields[fieldName].pristine
    ));
  }

  getFormData(): Object {
    return Object.keys(this.state.fields).reduce((formValues, fieldName) => {
      const field = this.state.fields[fieldName];
      formValues[fieldName] = field.value;
      return formValues;
    }, {});
  }
}

export default Gandalf;

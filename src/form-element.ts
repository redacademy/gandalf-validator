// src/form-element
import React from 'react';
import * as validator from './validator';

interface changeObject {
  value: string,
  skipDebounce?: boolean
}

interface formElementProps {
  name: string;
  component: Object;
  validators: Array<string>;
  errorPropName: string;
  errorPropIsBool: boolean;
  debounce: number,
  props: Object;
  onUpdate: (FormElement) => void;
}

class FormElement {
  name: string;
  key: string;
  element: Object;
  validators: Array<string>;
  component: any;
  errorPropName: string;
  errorPropIsBool: boolean;
  originalProps: any;
  errorMessage: string;
  value: string;
  onUpdate: Function;
  debounce: number;

  private timeOut: number;

  constructor(props: formElementProps) {
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
    this.errorMessage = '';
    this.value = '';
    this.timeOut = null;
    this.element = this.createReactElement();
  }

  createReactElement(): React.ComponentElement<any, React.Component<any, React.ComponentState>> {
    return React.createElement(
      this.component,
      Object.assign({}, this.originalProps, this.buildElementProps())
    );
  }

  private buildElementProps(): Object {
    return {
      name: this.name,
      key: this.key,
      onChange: this.createChangeListener(),
      [this.errorPropName]: this.errorPropIsBool ? !!this.errorMessage : this.errorMessage,
      value: this.value,
    };
  }

  private createChangeListener(): Function {
    return (e) => {
      this.handleChange({
        value: e.target.value
      });
    }
  }

  /*

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
  */

  private handleChange({ value, skipDebounce }: changeObject) {
    this.value = value;

    if (this.debounce && !skipDebounce) {
      this.handleDebounce();
    } else {
      this.validate();
    }

    this.element = this.createReactElement();
    this.onUpdate(this);
  }

  private handleDebounce(): void {
    clearTimeout(this.timeOut);

    this.timeOut = setTimeout(() => {
      this.validate();
      this.element = this.createReactElement();
      this.onUpdate(this);
    }, this.debounce);
  }

  private validate(): void {
    const validationResult = validator.validate(this.validators, this.value);
    this.errorMessage = validationResult.errorMessage;
  }
}

export default FormElement;

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
  debounce: number;
  getValueInOnChange: (...args) => any;
  props: Object;
  children: Array<any>;
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
  getValueInOnChange: (...args) => any;
  children: Array<any>;

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
    this.getValueInOnChange = props.getValueInOnChange;
    this.children = props.children;

    this.errorMessage = '';
    this.value = '';
    this.timeOut = null;
    this.element = this.createReactElement();
  }

  createReactElement(): React.ComponentElement<any, React.Component<any, React.ComponentState>> {
    return React.createElement(
      this.component,
      Object.assign({}, this.originalProps, this.buildElementProps()),
      this.children
    );
  }

  private buildElementProps(): Object {
    return {
      name: this.name,
      key: this.key,
      onChange: this.createChangeListener(),
      onChangeText: this.createChangeListener(),
      [this.errorPropName]: this.errorPropIsBool ? !!this.errorMessage : this.errorMessage,
      value: this.value,
    };
  }

  private createChangeListener(): Function {
    return (e, key, value) => {

      this.handleChange({
        value: this.getValueInOnChange ? this.getValueInOnChange(e, key, value) : e.target.value
      });
    }
  }

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

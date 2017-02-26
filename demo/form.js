import React from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { Input } from 'semantic-ui-react';

import Gandalf from '../lib/gandalf';

class Form extends Gandalf {
  constructor() {
    const fields = {
      name: {
        component: TextField,
        validators: ['required'],
        errorPropName: 'errorText',
        props: {
          hintText: 'Name',
        },
      },
      age: {
        component: TextField,
        validators: ['required', 'numeric'],
        errorPropName: 'errorText',
        props: {
          hintText: 'Age',
        },
        debounce: 300,
      },
      colour: {
        component: Input,
        validators: ['required'],
        errorPropName: 'error',
        errorPropIsBool: true,
        props: {
          placeholder: 'Favourite Colour',
        },
        debounce: 300,
      },
      email: {
        component: TextField,
        validators: ['required', 'email'],
        errorPropName: 'errorText',
        props: {
          hintText: 'Email',
        },
        debounce: 300,
      },
    };

    super(fields);
  }

  handleSubmit() {
    const data = this.getCleanFormData();

    if (!data) return;

    // Submit to REDUX
    console.log('goin\' to REDUX', data);
  }

  render() {
    const fields = this.state.fields;

    return (
      <form>
        <h1>My Form</h1>
        { fields.name.element } <br />
        { fields.age.element } <br />
        { fields.email.element } <br />
        { fields.colour.element } <br />
        <span>{ fields.colour.errorMessage ? fields.colour.errorMessage : ''}</span>

        <FlatButton label="Submit" primary onClick={() => this.handleSubmit()} />
      </form>
    );
  }
}

export default Form;

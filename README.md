# gandalf-validator

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b0d590c831584384b3457c91926efaff)](https://www.codacy.com/app/REDAcademy/gandalf-validator?utm_source=github.com&utm_medium=referral&utm_content=redacademy/gandalf-validator&utm_campaign=badger)

Determines who shall and shall not pass form validation in React

## Installation

```shall
npm install --save gandalf-validator
```

## Usage

The `Gandalf` class extends `React.Component`, so we start by extending `Gandalf`.

```javascript
import React from 'react';
import Gandalf from 'gandalf-validator';

class Form extends Gandalf {}

export default Form;
```

The `Gandalf` constructor take a `fields` object as its only parameters.
The keys of the `fields` object are the names of your form elements.
The values at each key are the definition of the form elements you with to build.

__Options:__

| Property            | Type             | Description
|---------------------|------------------|------------------------------------------------------
| `component`         | React Component  | The component to render
| `props`             | Object           | Props to pass to the component
| `validators`        | Array            | List of validations to apply to the value
| `errorPropName`     | String           | The name of the prop in `component` used to display errors (optional)
| `errorPropIsBool`   | Boolean          | Whether the `errorPropName` expects a boolean instead of a string (optional)
| `debounce`          | Integer          | Milliseconds to delay validation, resets w/ each keystroke (optional)

__Example:__

```javascript
import React from 'react';
import Gandalf from 'gandalf-validator';
import TextField from 'material-ui/TextField';
import { Input } from 'semantic-ui-react';

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
}
```

## Rendering

Gandalf builds your elements for you, and exposes them as the `element`
member of each `fields` object.

Since Gandalf is a React Component, you can use its render method for output:

```javascript
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
    </form>
  );
}
```

## Contributing

File a Github Issue or fork this repo and make a PR.

To build locally, use `npm run build`. This will transpile and uglify the library.

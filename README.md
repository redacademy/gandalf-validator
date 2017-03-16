# gandalf-validator

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

#### Options

| Property              | Type             | Description
|-----------------------|------------------|------------------------------------------------------
| `component`           | React Component  | The component to render
| `props`               | Object           | Props to pass to the component
| `validators`          | Array            | List of validations to apply to the value
| `errorPropName`       | String           | The name of the prop in `component` used to display errors (optional)
| `errorPropIsBool`     | Boolean          | Whether the `errorPropName` expects a boolean instead of a string (optional)
| `onChangeHandler`     | Function         | Specify a name for the change handler function, defaults to `onChange`
| `getValueInOnChange`  | Function         | If the value in the onChange handler is something other than e.target.value, this function can get it. Takes (e, key, payload).
| `children          `  | Array            | Array of child React Components. Remember to add a `key` prop.
| `debounce`            | Integer          | Milliseconds to delay validation, resets w/ each keystroke (optional)

#### Fields Object

```javascript
import React from 'react';
import Gandalf from 'gandalf-validator';
import TextField from 'material-ui/TextField';
import { Input } from 'semantic-ui-react';

class Form extends Gandalf {
  constructor() {
    const fields = [
      {
        name: 'name',
        component: TextField,
        validators: ['required'],
        errorPropName: 'errorText',
        props: {
          hintText: 'Name',
        },
        debounce: 500,
      },
      {
        name: 'age',
        component: TextField,
        validators: ['required', 'numeric'],
        errorPropName: 'errorText',
        props: {
          hintText: 'Age',
        },
        debounce: 300,
      },
      {
        name: 'frequency',
        component: SelectField,
        validators: ['required'],
        errorPropName: 'errorText',
        getValueInOnChange: (e, key, value) => value,
        props: {
          hintText: 'Frequency',
        },
        children: [
          <MenuItem key={1} value="Never" primaryText="Never" />,
          <MenuItem key={2} value="Every Night" primaryText="Every Night" />,
          <MenuItem key={3} value="Weeknights" primaryText="Weeknights" />,
          <MenuItem key={4} value="Weekends" primaryText="Weekends" />,
          <MenuItem key={5} value="Weekly" primaryText="Weekly" />,
        ],
      },
      {
        name: 'colour',
        component: Input,
        validators: ['required'],
        errorPropName: 'error',
        errorPropIsBool: true,
        props: {
          placeholder: 'Favourite Colour',
        },
        debounce: 300,
      },
      {
        name: 'email',
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

#### Rendering

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
      { fields.frequency.element } <br />
      { fields.email.element } <br />
      { fields.colour.element } <br />
      <span>{ fields.colour.errorMessage ? fields.colour.errorMessage : ''}</span>
    </form>
  );
}
```

#### Getting Form Data

Gandalf provides two methods for getting form data:

```js
  // Returns form data, regardless of its validity
  this.getFormData();

  // If the form is valid, returns the form data, otherwise returns null
  this.getCleanFormData();
```

Recommended implementation:

```js
handleSubmit() {
  const data = this.getCleanFormData();

  // If form is invalid, all error messages will show automatically
  // So you can simply exit the function
  if (!data) return;

  // Handle valid data here
}
```


## Contributing

File a Github Issue or fork this repo and make a PR.

To build locally, use `npm run build`. This will transpile and uglify the library.

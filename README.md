# gandalf-validator

Determines who shall and shall not pass form validation in React

## Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Options](#options)
  - [Fields Object](#fields-object)
  - [Rendering](#rendering)
  - [Getting Form Data](#getting-form-data)
  - [Full Example](#full-example)
- [Building Components for Gandalf](#building-components-for-gandalf)
- [Contributing](#contributing)

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

The `Gandalf` constructor take a [fields object](#fields-object) as its only parameters.
The keys of the `fields` object are the names of your form elements.
The values at each key are the definition of the form elements you with to build.

#### Options

| Property              | Type             | Description
|-----------------------|------------------|------------------------------------------------------
| `component`           | React Component  | The component to render
| `props`               | Object           | Props to pass to the component
| `validators`          | Array            | List of [validators](#validators) to apply to the value
| `errorPropName`       | String           | The name of the prop in `component` used to display errors (optional)
| `errorPropIsBool`     | Boolean          | Whether the `errorPropName` expects a boolean instead of a string (optional)
| `onChangeHandler`     | Function         | Specify a name for the change handler function, defaults to `onChange`
| `getValueInOnChange`  | Function         | If the value in the onChange handler is something other than e.target.value, this function can get it. Takes (e, key, payload).
| `children          `  | Array            | Array of child React Components. Remember to add a `key` prop.
| `debounce`            | Integer          | Milliseconds to delay validation, resets w/ each keystroke (optional)
| `defaultValue`        | Any              | Default value for the component (optional)

#### Validators

Gandalf ships with several out of the box validations. Some are very simple, requiring only a string identifier. Others are more complex, requiring an object.

__Simple__

- `required`
- `numeric`
- `email`

To enable a simple validator, add the string identifier to the `validators` prop.

```js
validators: ['required', 'numeric', 'email']
```

__Complex__

- `minLength`
- `maxLength`
- `min`
- `max`
- `regex`

Complex validators are objects with a `name` and `value` property.

```js
validators: [{ name: 'minLength', value: 8 }, { name: regex, value: /[^0-9]/g }]
```

__Simple + Complex__

You can use both simple and complex validators on the same field.

```js
validators: [
  'required',
  { name: 'minLength', value: 8 },
  { name: regex, value: /.+\s.+/g }
]
```

__Custom Error Messages__

Gandalf provides generic error messages by default, but you can pass your own to the Validator object. If you're using a simple validator, you can use an object with `name` and `message` fields as shown below.

```js
validators: [
  { name: 'required', message: 'How dare you not fill this field?' }
  { name: 'minLength', value: 8, message: 'Your answer is too short! It must be at least 8 characters.' },
]
```


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

      <button onClick={() => this.handleSubmit()}>Submit</button>
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

Gandalf also privides two methods for checking the current state of the form:

```js
// Not every element on the form has been touched - it may be invalid, but not all errors are triggered
// An element is not included in this list if it has an empty validators array
this.formHasPristineElements()

// Whether the form is currently valid. Use in combination with formHasPristineElements for reliable results
this.formIsValid()
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

#### Full Example

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

  handleSubmit() {
    const data = this.getCleanFormData();

    // If form is invalid, all error messages will show automatically
    // So you can simply exit the function
    if (!data) return;

    // Handle valid data here
  }

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

        <button
          onClick={() => this.handleSubmit()}
          disabled={() => this.formHasPristineElements() || !this.formIsValid()}
        >
          Submit
        </button>
      </form>
    );
  }
}
```

## Building Components for Gandalf

Some component libraries provide inputs with built in error handling.

For example, Material UI TextFields provide an `errorText` prop that alters the component's appearance if it exists. Similarly, Semantic UI's Input component provides a boolean `error` prop that turns the input red if it exists.

But what if you want to build your own component for use with Gandalf? Turns out it's pretty easy.

#### React Native Example

React Native provides a TextInput component. It's very similar to an HTML input in regular React, with a few tiny differences. For example it exposes an `onChangeText` handler instead of an `onChange` handler for handling input changes.

But it has no build in error handling. So let's build it. We'll call it `ValidatedTextInput`.

```js
import React from 'react';
import { View, Text, TextInput } from 'react-native';

const ValidatedTextInput = (props) => (
  <View>
    <View>
      <Text>{ props.title }</Text>
      <TextInput
        onChangeText={props.onChange}
        placeholder={props.placeholder}
      />
    </View>
    {!!props.error &&
    <View>
      <Text>
        { props.error }
      </Text>
    </View>
    }
  </View>
);
```

We know that we can define arbitrary props in the [Fields Object](#fields-object).
On top of those, Gandalf passes in an `error` prop (string) and an `onChange` handler (function).

We can use the existence of `error` to conditionally render the error message UI. The rest is as simple as passing props to `TextInput`.

Now we can use `ValidatedTextInput` in Gandalf:

```js
import React from 'react';
import Gandalf from 'gandalf-validator';
import { View, Text, TouchableHighlight } from 'react-native';

import ValidatedTextInput from '../components/ValidatedTextInput';

class Form extends Gandalf {
  constructor() {
    const fields = [
      {
        name: 'fName',
        component: ValidatedTextInput,
        getValueInOnChange: value => value,
        validators: ['required'],
        props: {
          title: 'First Name',
          placeholder: 'John Doe',
        },
        debounce: 300,
      },
    };

    super(fields);
  }

  handleSubmit() {
    const data = this.getCleanFormData();

      // If form is invalid, all error messages will show automatically
      // So you can simply exit the function
      if (!data) return;

      // Handle valid data here
    }

  render() {
    const fields = this.state.fields;

    return (
      <View>
        { fields.fName.element }

        <TouchableHighlight onPress={this.handleSubmit}>
          <Text>Submit</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
```

## Contributing

File a Github Issue or fork this repo and make a PR.

To build locally, use `npm run build`. This will transpile and uglify the library.


#### Running tests locally

You will need to add a `.babelrc` file in your local `gandalf-validator` directory. It is git ignored, as it can conflict with `.babelrc` files in projects using Gandalf.

`.babelrc`:
```json
{
  "presets": ["es2015"]
}
```

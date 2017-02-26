const errorMessages = {
  required: 'This field is required',
  numeric: 'This value must be a number',
  email: 'This value must an email address',
};

const validatorFns = {
  required: v => v !== undefined && v !== null && v !== '',
  numeric: v => typeof v === 'number',
  email: v => /.+@.+\..+/.test(v),
};

const isValid = (validatorName, value) => {
  return validatorFns[validatorName](value);
}

const validate = (validators, value) => {
  const errorKey = validators.find(validator => !isValid(validator, value));

  return {
    valid: !errorMessages[errorKey],
    errorMessage: errorMessages[errorKey]
  }
}

module.exports = {
  errorMessages,
  isValid,
  validate
}

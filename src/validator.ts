interface validationResponse {
  valid: boolean,
  errorMessage?: string
};

const errorMessages = {
  required: 'This field is required',
  numeric: 'This value must be a number',
  email: 'This value must be an email address',
};

const validatorFns = {
  required: v => v !== undefined && v !== null && v !== '',
  numeric: v => /^string|number$/.test(typeof v) && !isNaN(v),
  email: v => /.+@.+\..+/.test(v),
};

const isValid = (validatorName: string, value: string): boolean => {
  return validatorFns[validatorName](value);
}

const validate = (validators: Array<string>, value: any): validationResponse => {
  const errorKey = validators.find(validator => !isValid(validator, value));

  return {
    valid: !errorMessages[errorKey],
    errorMessage: errorMessages[errorKey]
  }
}

export {
  errorMessages,
  isValid,
  validate
};

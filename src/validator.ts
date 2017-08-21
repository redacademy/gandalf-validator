interface validationResponse {
  valid: boolean,
  errorMessage?: string
};

interface complexValidator {
  name: string,
  value: any,
  message?: string
};

const errorMessages = {
  required: 'This field is required',
  numeric: 'This value must be a number',
  email: 'This value must be an email address',
  minLength: v => `This field must have at least ${v} characters`,
  maxLength: v => `This field must be ${v} characters or less`,
  min: v => `This value must be ${v} or more`,
  max: v => `This value must be ${v} or less`,
  regex: v => `This value is invalid`,
};

const validatorFns = {
  required: v => v !== undefined && v !== null && v !== '',
  numeric: v => /^string|number$/.test(typeof v) && !isNaN(v),
  email: v => /.+@.+\..+/.test(v),
  minLength: (v, l) => {
    const str = v.toString();
    return str.length >= l;
  },
  maxLength: (v, l) => {
    const str = v.toString();
    return str.length <= l;
  },
  min: (v, l) => {
    const num = parseInt(v, 10);
    return num >= l;
  },
  max: (v, l) => {
    const num = parseInt(v, 10);
    return num <= l;
  },
  regex: (v, r) => r.test(v)
};

const isValid = (validator: string | complexValidator, value: string): boolean => {
  if (typeof validator === 'string') {
    return validatorFns[validator](value);
  }

  return validatorFns[validator.name](value, validator.value);
};

const getErrorMessage = (validator: string | complexValidator): string => {
  if (!validator) return '';

  if (typeof validator === 'string') return errorMessages[validator];
  if (validator.message) return validator.message;

  if (typeof errorMessages[validator.name] === 'function') {
    return errorMessages[validator.name](validator.value);
  }

  return errorMessages[validator.name];
};

const validate = (validators: Array<string | complexValidator>, value: any): validationResponse => {
  const firstFailedValidator = validators.find(validator => !isValid(validator, value));

  return {
    valid: !firstFailedValidator,
    errorMessage: getErrorMessage(firstFailedValidator)
  };
};

export {
  errorMessages,
  isValid,
  validate
};

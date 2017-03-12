const validator = require('../src/validator');

describe('validator', () => {

  describe('.isValid', () => {

    describe('validator: required', () => {
      describe('when value exists', () => {
        it('should return true', () => {
          expect(validator.isValid('required', 'str')).toBe(true);
          expect(validator.isValid('required', 100)).toBe(true);
          expect(validator.isValid('required', true)).toBe(true);
          expect(validator.isValid('required', -100)).toBe(true);
          expect(validator.isValid('required', 0)).toBe(true);
        });
      });

      describe('when value does not exist', () => {
        it('should return false', () => {
          expect(validator.isValid('required', '')).toBe(false);
          expect(validator.isValid('required')).toBe(false);
          expect(validator.isValid('required', null)).toBe(false);
        });
      });
    });

    describe('validator: numeric', () => {
      describe('when value is numeric', () => {
        it('should return true', () => {
          expect(validator.isValid('numeric', '100')).toBe(true);
          expect(validator.isValid('numeric', -100)).toBe(true);
          expect(validator.isValid('numeric', 0)).toBe(true);
          expect(validator.isValid('numeric', 1.23)).toBe(true);
          expect(validator.isValid('numeric', 3/4)).toBe(true);
        });
      });

      describe('when value is not numeric', () => {
        it('should return false', () => {
          expect(validator.isValid('numeric')).toBe(false);
          expect(validator.isValid('numeric', null)).toBe(false);
          expect(validator.isValid('numeric', true)).toBe(false);
          expect(validator.isValid('numeric', 'str')).toBe(false);
        });
      });
    });

    describe('validator: email', () => {
      describe('when value matches /.+@.+\..+/', () => {
        it('should return true', () => {
          expect(validator.isValid('email', 'test@test.com')).toBe(true);
          expect(validator.isValid('email', 'test+123@sub.test.com')).toBe(true);
        });
      });

      describe('when value does not match /.+@.+\..+/', () => {
        it('should return false', () => {
          expect(validator.isValid('email')).toBe(false);
          expect(validator.isValid('email', null)).toBe(false);
          expect(validator.isValid('email', true)).toBe(false);
          expect(validator.isValid('email', 'str')).toBe(false);
          expect(validator.isValid('email', '100')).toBe(false);
        });
      });
    });
  });

  describe('validate', () => {
    describe('when a field is required', () => {
      describe('when value is present', () => {
        it('should be valid with no error message', () => {
          const result = validator.validate(['required'], 'string');
          expect(result.valid).toBe(true);
          expect(result.errorMessage).not.toBeDefined();
        });
      });

      describe('when value is not present', () => {
        it('should be invalid with the correct error message', () => {
          const result = validator.validate(['required'], null);
          expect(result.valid).toBe(false);
          expect(result.errorMessage).toEqual(validator.errorMessages.required);
        });
      });
    });
  });

  describe('when a field is invalid in two ways', () => {
    it('should return the error message for the first listed validator', () => {
      const result = validator.validate(['numeric', 'required'], 'FOO');
      expect(result.valid).toBe(false);
      expect(result.errorMessage).toEqual(validator.errorMessages.numeric);
    });
  });
});

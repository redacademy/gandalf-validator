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
      describe('when value matches the email regex', () => {
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
          expect(validator.isValid('email', 'test @test.com')).toBe(false);
          expect(validator.isValid('email', 'test@test..com')).toBe(false);
          expect(validator.isValid('email', 'test@@test.com')).toBe(false);
          expect(validator.isValid('email', 'test@testcom')).toBe(false);
          expect(validator.isValid('email', ' test@testcom')).toBe(false);
          expect(validator.isValid('email', '..test@testcom')).toBe(false);
        });
      });
    });

    describe('validator: minLength', () => {
      describe('when is less than minLength', () => {
        it('should return false', () => {
          expect(validator.isValid({ name: 'minLength', value: 8 }, 'aaasssd')).toBe(false);
        });
      });

      describe('when is equal to minLength', () => {
        it('should return true', () => {
          expect(validator.isValid({ name: 'minLength', value: 8 }, 'aaasssdd')).toBe(true);
          expect(validator.isValid({ name: 'minLength', value: 8 }, 12345678)).toBe(true);
        });
      });

      describe('when is greated than minLength', () => {
        it('should return true', () => {
          expect(validator.isValid({ name: 'minLength', value: 8 }, 'aaasssddd')).toBe(true);
        });
      });
    });

    describe('validator: maxLength', () => {
      describe('when value is less than maxLength', () => {
        it('should return true', () => {
          expect(validator.isValid({ name: 'maxLength', value: 8 }, 'aaasssd')).toBe(true);
        });
      });

      describe('when value is equal to maxLength', () => {
        it('should return false', () => {
          expect(validator.isValid({ name: 'maxLength', value: 8 }, 'aaasssdd')).toBe(true);
          expect(validator.isValid({ name: 'maxLength', value: 8 }, 12345678)).toBe(true);
        });
      });

      describe('when value is greater than maxLength', () => {
        it('should return false', () => {
          expect(validator.isValid({ name: 'maxLength', value: 8 }, 'aaasssddd')).toBe(false);
        });
      });
    });

    describe('validator: min', () => {
      describe('when is less than min', () => {
        it('should return false', () => {
          expect(validator.isValid({ name: 'min', value: 8 }, 7)).toBe(false);
        });
      });

      describe('when is equal to min', () => {
        it('should return true', () => {
          expect(validator.isValid({ name: 'min', value: 8 }, 8)).toBe(true);
        });
      });

      describe('when is greated than min', () => {
        it('should return true', () => {
          expect(validator.isValid({ name: 'min', value: 8 }, 9)).toBe(true);
        });
      });
    });

    describe('validator: max', () => {
      describe('when is less than max', () => {
        it('should return true', () => {
          expect(validator.isValid({ name: 'max', value: 8 }, 7)).toBe(true);
        });
      });

      describe('when is equal to max', () => {
        it('should return true', () => {
          expect(validator.isValid({ name: 'max', value: 8 }, 8)).toBe(true);
        });
      });

      describe('when is greated than max', () => {
        it('should return false', () => {
          expect(validator.isValid({ name: 'max', value: 8 }, 9)).toBe(false);
        });
      });
    });

    describe('validator: regex', () => {
      describe('when regex matches', () => {
        it('should return true', () => {
          expect(validator.isValid({ name: 'regex', value: /.+\s.+/ }, 'Blake Turner')).toBe(true);
        });
      });

      describe('when regex does not match', () => {
        it('should return false', () => {
          expect(validator.isValid({ name: 'regex', value: /.+\s.+/ }, 'BlakeTurner')).toBe(false);
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
          expect(result.errorMessage).toEqual('');
        });
      });

      describe('when value is not present', () => {
        it('should be invalid with the correct error message', () => {
          const result = validator.validate(['required'], null);
          expect(result.valid).toBe(false);
          expect(result.errorMessage).toEqual(validator.errorMessages.required);
        });

        describe('when custom error message is provided', () => {
          it('should be invalid with the custom error message', () => {
            const result = validator.validate([{ name: 'required', message: 'How dare you not fill this field?' }], null);
            expect(result.valid).toBe(false);
            expect(result.errorMessage).toEqual('How dare you not fill this field?');
          });
        });
      });
    });
  });

  describe('when a simple validator is passed as an object', () => {
    describe('when value is present', () => {
      it('should be valid with no error message', () => {
        const result = validator.validate([{ name: 'required' }], 'string');
        expect(result.valid).toBe(true);
        expect(result.errorMessage).toEqual('');
      });
    });

    describe('when value is not present', () => {
      it('should be invalid with the correct error message', () => {
        const result = validator.validate([{ name: 'required' }], null);
        expect(result.valid).toBe(false);
        expect(result.errorMessage).toEqual(validator.errorMessages.required);
      });
    });
  });

  describe('when a field has both simple and complex validators', () => {
    describe('when all validators pass', () => {
      it('should be valid with no error message', () => {
        const result = validator.validate(['required', { name: 'minLength', value: 5 }], 'string');
        expect(result.valid).toBe(true);
        expect(result.errorMessage).toEqual('');
      });
    });

    describe('when simple validation fails', () => {
      it('should be invalid with the correct error message', () => {
        const result = validator.validate(['required', { name: 'minLength', value: 5 }], null);
        expect(result.valid).toBe(false);
        expect(result.errorMessage).toEqual(validator.errorMessages.required);
      });
    });

    describe('when complex validation fails', () => {
      it('should be invalid with the correct error message', () => {
        const result = validator.validate(['required', { name: 'minLength', value: 5 }], 'abc');
        expect(result.valid).toBe(false);
        expect(result.errorMessage).toEqual(validator.errorMessages.minLength(5));
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

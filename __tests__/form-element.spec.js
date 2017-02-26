jest.mock('react');
jest.mock('../src/validator', () => ({
  validate: jest.fn()
}));

const FormElement = require('../src/form-element.js');
const React = require('react');
const validator = require('../src/validator');

describe('FormElement', () => {
  let test;

  beforeEach(() => {
    test = {};

    test.component = {
      name: 'component'
    }

    test.fieldData = {
      name: 'input',
      component: test.component,
      validators: ['required'],
      errorPropName: 'errorText',
      onUpdate: jest.fn(),
      props: {
        hintText: 'Name',
      },
    }
  });

  describe('.constructor', () => {
    describe('when we pass in nothing', () => {
      it('should throw an error', () => {
        expect(() => new FormElement()).toThrow('field object is required');
      });
    });

    describe('when we pass a field object', () => {

      beforeEach(() => {
        test.subject = new FormElement(test.fieldData);
      });

      it('should initialise its state', () => {
        expect(test.subject.name).toEqual(test.fieldData.name);
        expect(test.subject.key).toEqual(test.fieldData.name);
        expect(test.subject.component).toEqual(test.fieldData.component);
        expect(test.subject.validators).toEqual(test.fieldData.validators);
        expect(test.subject.errorPropName).toEqual(test.fieldData.errorPropName);
        expect(test.subject.originalProps).toEqual(test.fieldData.props);
        expect(typeof test.subject.onUpdate).toEqual('function');
        expect(test.subject.errorMessage).toEqual('');
        expect(test.subject.value).toEqual('');
      });
    });
  });

  describe('createReactElement', () => {

    beforeEach(() => {
      React.createElement.mockClear();
      test.subject = new FormElement(test.fieldData);
      test.subject.createReactElement();
    });

    it('should call React.createElement with the correct properties', () => {

      const args = React.createElement.mock.calls[0];
      const component = args[0];
      const props = args[1];

      expect(component).toEqual(test.component);
      expect(props.hintText).toEqual('Name');
      expect(props.name).toEqual(test.fieldData.name);
      expect(props.key).toEqual(test.fieldData.name);
      expect(props.value).toEqual('');
      expect(props[test.fieldData.errorPropName]).toEqual('');
      expect(typeof props.onChange).toEqual('function');
    });
  });

  describe('handleChange', () => {

    beforeEach(() => {
      validator.validate.mockClear();
      validator.validate.mockReturnValueOnce({
        valid: true,
        errorMessage: ''
      });

      test.newValue = 'new';

      test.subject = new FormElement(test.fieldData);
      test.subject.handleChange({ value: test.newValue });
    });

    it('should update the value', () => {
      expect(test.subject.value).toEqual(test.newValue);
    });

    it('should call update function', () => {
      expect(test.fieldData.onUpdate).toHaveBeenCalled();
    });

    describe('when debounce is not active', () => {
      it('should call validator.getErrorMessage with correct params', () => {
        expect(validator.validate)
          .toHaveBeenCalledWith(test.fieldData.validators, test.newValue);
      });
    });
  });
});






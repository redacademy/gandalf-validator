// __tests__/gandalf.spec.js
jest.mock('react');

import Gandalf from '../src/gandalf';

describe('Gandalf', () => {
  let test;

  const simulateReactBuild = () => {
    test.subject = new Gandalf(test.fields);
    test.subject.componentWillMount();
  };

  beforeEach(() => {
    test = {};

    test.component = {
      name: 'component'
    };

    test.fields = [
      {
        name: 'name',
        component: test.component,
        validators: ['required'],
        errorPropName: 'errorText',
        props: {
          hintText: 'Name',
        },
      },
      {
        name: 'next',
        component: test.component,
        validators: ['required'],
        errorPropName: 'errorText',
        props: {
          hintText: 'Next',
        },
      },
    ]
  });

  describe('.getCleanFormData', () => {

    describe('when the form is untouched and invalid', () => {
      beforeEach(() => {
        simulateReactBuild();
      });

      it('should return null', () => {
        expect(test.subject.getCleanFormData()).toBe(null);
      });
    });

    describe('when the form is updated and valid', () => {

      beforeEach(() => {
        simulateReactBuild();

        test.field = test.subject.state.fields.name;
        test.field.element.props.onChange({
          target: {
            value: 'Blake'
          }
        });

        test.field2 = test.subject.state.fields.next;
        test.field2.element.props.onChange({
          target: {
            value: 'Next'
          }
        });

      });

      it('should return an object', () => {
        const result = test.subject.getCleanFormData();
        expect(result !== null).toBe(true);
      });
    });

    describe('when the form is updated and invalid', () => {

      beforeEach(() => {
        simulateReactBuild();

        test.field = test.subject.state.fields.name;
        test.field.element.props.onChange({
          target: {
            value: ''
          }
        });
      });

      it('should return null', () => {
        const result = test.subject.getCleanFormData();
        expect(result).toEqual(null);
      });
    });
  });

  describe('.formHasPristineElements', () => {
    describe('when form is untouched', () => {
      beforeEach(() => {
        simulateReactBuild();
      });

      it('should return true', () => {
        const result = test.subject.formHasPristineElements();
        expect(result).toBe(true);
      });
    });

    describe('when all form elements do not have validators', () => {
      beforeEach(() => {
        test.fields = [
          {
            name: 'name',
            component: test.component,
            validators: [],
            errorPropName: 'errorText',
            props: {
              hintText: 'Name',
            },
          }
        ];
        simulateReactBuild();
      });

      it('should return false', () => {
        const result = test.subject.formHasPristineElements();
        expect(result).toBe(false);
      });
    });

    describe('when some elements have been touched', () => {
      beforeEach(() => {
        simulateReactBuild();

        test.field = test.subject.state.fields.name;
        test.field.element.props.onChange({
          target: {
            value: 'Blake'
          }
        });
      });

      it('should return true', () => {
        const result = test.subject.formHasPristineElements();
        expect(result).toBe(true);
      });
    });
  });

  describe('when all elements have been touched', () => {
    beforeEach(() => {
      simulateReactBuild();

      test.field = test.subject.state.fields.name;
      test.field.element.props.onChange({
        target: {
          value: 'Blake'
        }
      });

      test.field2 = test.subject.state.fields.next;
      test.field2.element.props.onChange({
        target: {
          value: 'Next'
        }
      });
    });

    it('should return false', () => {
      const result = test.subject.formHasPristineElements();
      expect(result).toBe(false);
    });
  });
});

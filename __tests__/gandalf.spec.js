// __tests__/gandalf.spec.js
jest.mock('react');

const Gandalf = require('../src/gandalf');

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

    test.fields = {
      name: {
        component: test.component,
        validators: ['required'],
        errorPropName: 'errorText',
        props: {
          hintText: 'Name',
        },
      },
    }
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
});

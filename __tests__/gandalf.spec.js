jest.mock('react');

const Gandalf  = require('../src/gandalf');

describe('Gandalf', () => {
  let test;

  const simulateReactBuild = () => {
    test.subject = new Gandalf(test.fields);
    test.subject.componentWillMount();
  }

  beforeEach(() => {
    test = {};

    test.uiComponent = { name: 'component' };

    test.fields = {
      name: {
        component: test.uiComponent,
        validators: ['required'],
        errorPropName: 'errorText',
        props: {
          hintText: 'Name',
        },
      },
      age: {
        component: test.uiComponent,
        validators: ['required', 'numeric'],
        errorPropName: 'errorText',
        props: {
          hintText: 'Age',
        },
        debounce: 300,
      },
    };
  });

  fdescribe('getCleanFormData', () => {
    beforeEach(() => {
      simulateReactBuild();
    });

    describe('if no data has been entered', () => {
      it('should return null', () => {
        expect(test.subject.getCleanFormData()).toBe(null);
      });
    })
  });
});

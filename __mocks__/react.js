// jest.mock('react);
// redirects the include to the below fil
// __mocks__/react.js

// a class called Component <- DONE
// a function called createElement
// a function called setState <- DONE

class Component {
    setState(updates, cb) {
        Object.assign(this.state, updates);
        if(cb) cb();
    }
}

const createElement = jest.fn((component, props) => {
    return { component, props };
});

module.exports = {
    Component,
    createElement
}

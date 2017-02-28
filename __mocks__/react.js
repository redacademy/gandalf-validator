class Component {
  setState(updates, cb) {
    Object.assign(this.state, updates);
    if (cb) cb();
  }
}

const createElement = jest.fn((component, props) => {
  return { component, props };
});

export default {
  Component,
  createElement
}

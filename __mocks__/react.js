class Component {
  setState(updates, cb) {
    Object.assign(this.state, updates);
    if (cb) cb();
  }
}

const createElement = (component, props) => {
  return { component, props };
}

module.exports = {
  Component,
  createElement
};

const applyMixin = (obj, mixin) => {
  const o = Object.assign({}, obj);
  Object.keys(mixin).forEach((key) => {
    const value = mixin[key];
    if (value.fn) {
      o[key] = value.executeOnApply ? mixin[key].call(obj) : mixin[key].bind(obj);
    }
  });
  return o;
};

module.exports = applyMixin;

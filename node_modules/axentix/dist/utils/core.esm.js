var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var _init, init_fn, _detectIds, detectIds_fn, _instanciate, instanciate_fn;
const config = {
  components: [],
  plugins: [],
  prefix: "ax",
  mode: ""
};
const getComponentClass = (component) => config.components.find((c) => c.name === component).class;
const getAutoInitElements = () => {
  const autoInitComponents = config.components.filter((component) => component.autoInit && component.autoInit.enabled);
  const autoInitPlugins = config.plugins.filter((plugin) => plugin.autoInit && plugin.autoInit.enabled);
  return [...autoInitComponents, ...autoInitPlugins].reduce((acc, el) => {
    acc[el.name] = document.querySelectorAll(el.autoInit.selector);
    return acc;
  }, {});
};
class Axentix {
  constructor(component, options) {
    __privateAdd(this, _init);
    __privateAdd(this, _detectIds);
    __privateAdd(this, _instanciate);
    __publicField(this, "component");
    __publicField(this, "isAll");
    __publicField(this, "options");
    this.component = component[0].toUpperCase() + component.slice(1).toLowerCase();
    this.isAll = component === "all" ? true : false;
    this.options = this.isAll ? {} : options;
    __privateMethod(this, _init, init_fn).call(this);
  }
}
_init = new WeakSet();
init_fn = function() {
  const componentList = getAutoInitElements();
  const isInList = componentList.hasOwnProperty(this.component);
  if (isInList) {
    const ids = __privateMethod(this, _detectIds, detectIds_fn).call(this, componentList[this.component]);
    __privateMethod(this, _instanciate, instanciate_fn).call(this, ids, this.component);
  } else if (this.isAll) {
    Object.keys(componentList).forEach((component) => {
      const ids = __privateMethod(this, _detectIds, detectIds_fn).call(this, componentList[component]);
      if (ids.length > 0)
        __privateMethod(this, _instanciate, instanciate_fn).call(this, ids, component);
    });
  }
};
_detectIds = new WeakSet();
detectIds_fn = function(component) {
  return Array.from(component).map((el) => "#" + el.id);
};
_instanciate = new WeakSet();
instanciate_fn = function(ids, component) {
  ids.forEach((id) => {
    const constructor = getComponentClass(component);
    const args = [id, this.options];
    try {
      new constructor(...args);
    } catch (error) {
      console.error("[Axentix] Unable to load " + component, error);
    }
  });
};
export { Axentix };

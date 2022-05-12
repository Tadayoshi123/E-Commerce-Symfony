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
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var _triggers, _sidenavTriggers, _isInit, _isActive, _isAnimated, _childIsActive, _listenerRef, _resizeRef, _sidenavId, _handleResize, handleResize_fn, _detectSidenav, detectSidenav_fn, _addActiveInSidenav, addActiveInSidenav_fn, _toggleTriggerActive, toggleTriggerActive_fn, _autoClose, autoClose_fn, _applyOverflow, applyOverflow_fn, _onClickTrigger, onClickTrigger_fn;
var collapsible = "";
const instances = [];
const config = {
  components: [],
  plugins: [],
  prefix: "ax",
  mode: ""
};
const getComponentClass = (component) => config.components.find((c) => c.name === component).class;
const getDataElements = () => {
  const dataComponents = config.components.filter((component) => component.dataDetection);
  const dataPlugins = config.plugins.filter((plugin) => plugin.dataDetection);
  return [...dataComponents, ...dataPlugins].map((el) => el.name);
};
const register = (el, term) => {
  if (!el.name || !el.class) {
    console.error(`[Axentix] Error registering ${term} : Missing required parameters.`);
    return;
  }
  if (config[term].some((elem) => elem.name === el.name)) {
    console.error(`[Axentix] Error registering ${term} : Already exist.`);
    return;
  }
  if (el.autoInit)
    el.autoInit.selector = el.autoInit.selector += ":not(.no-axentix-init)";
  config[term].push(el);
};
const registerComponent = (component) => {
  register(component, "components");
};
const getFormattedName = (name) => {
  return name.replace(/[\w]([A-Z])/g, (s) => {
    return s[0] + "-" + s[1];
  }).toLowerCase();
};
const getName = (name, baseName = "") => {
  const fmtName = getFormattedName(name);
  return baseName ? baseName + "-" + fmtName : fmtName;
};
const getOptionsForObject = (obj, name, component, element, baseName = "") => {
  const tmpOptName = name[0].toUpperCase() + name.slice(1).toLowerCase();
  if (getDataElements().includes(tmpOptName) && component !== "Collapsible" && tmpOptName !== "Sidenav")
    obj[name] = getComponentClass(tmpOptName).getDefaultOptions();
  const fmtName = baseName ? baseName + "-" + name : name;
  const keys = getOptions(obj[name], component, element, fmtName);
  if (!(Object.keys(keys).length === 0 && obj.constructor === Object))
    return keys;
};
const getOptions = (obj, component, element, baseName = "") => {
  return Object.keys(obj).reduce((acc, name) => {
    if (typeof obj[name] === "object" && obj[name] !== null) {
      const opts = getOptionsForObject(obj, name, component, element, baseName);
      if (opts)
        acc[name] = opts;
    } else if (obj[name] !== null) {
      const dataAttribute = "data-" + component.toLowerCase() + "-" + getName(name, baseName);
      if (element.hasAttribute(dataAttribute)) {
        const attr = element.getAttribute(dataAttribute);
        acc[name] = typeof obj[name] === "number" ? Number(attr) : attr;
        if (typeof obj[name] === "boolean")
          acc[name] = attr === "true";
      }
    }
    return acc;
  }, {});
};
const formatOptions = (component, element) => {
  const defaultOptions = Object.assign({}, getComponentClass(component).getDefaultOptions());
  return getOptions(defaultOptions, component, element);
};
const setup = () => {
  const elements = document.querySelectorAll("[data-ax]");
  elements.forEach((el) => {
    let component = el.dataset.ax;
    component = component[0].toUpperCase() + component.slice(1).toLowerCase();
    if (!getDataElements().includes(component)) {
      console.error(`[Axentix] Error: ${component} component doesn't exist. 
 Did you forget to register him ?`, el);
      return;
    }
    try {
      const classDef = getComponentClass(component);
      new classDef(`#${el.id}`);
    } catch (error) {
      console.error("[Axentix] Data: Unable to load " + component, error);
    }
  });
};
const setupAll = () => {
  try {
    new Axentix.Axentix("all");
  } catch (error) {
    console.error("[Axentix] Unable to auto init.", error);
  }
};
document.addEventListener("DOMContentLoaded", () => {
  if (document.documentElement.dataset.axentix)
    setupAll();
  setup();
});
const extend = (...args) => {
  return args.reduce((acc, obj) => {
    for (let key in obj) {
      acc[key] = typeof obj[key] === "object" && obj[key] !== null ? extend(acc[key], obj[key]) : obj[key];
    }
    return acc;
  }, {});
};
const getComponentOptions = (component, options, el) => extend(getComponentClass(component).getDefaultOptions(), formatOptions(component, el), options);
const createEvent = (element, eventName, extraData) => {
  const event = new CustomEvent("ax." + eventName, {
    detail: extraData || {},
    bubbles: true
  });
  element.dispatchEvent(event);
};
const getInstanceByType = (type) => instances.filter((ins) => ins.type === type).map((ins) => ins.instance);
const getInstance = (element) => {
  const el = instances.find((ins) => ins.type !== "Toast" && "#" + ins.instance.el.id === element);
  if (el)
    return el.instance;
  return false;
};
const getTriggers = (id, query = '[data-target="{ID}"]') => Array.from(document.querySelectorAll(query.replace("{ID}", id)));
class AxentixComponent {
  constructor() {
    __publicField(this, "el");
  }
  removeListeners() {
  }
  setupListeners() {
  }
  setup() {
  }
  preventDbInstance(element) {
    if (element && getInstance(element))
      throw new Error(`Instance already exist on ${element}`);
  }
  sync() {
    createEvent(this.el, "component.sync");
    this.removeListeners();
    this.setupListeners();
  }
  reset() {
    createEvent(this.el, "component.reset");
    this.removeListeners();
    this.setup();
  }
  destroy() {
    createEvent(this.el, "component.destroy");
    this.removeListeners();
    const index = instances.findIndex((ins) => ins.instance.el.id === this.el.id);
    instances.splice(index, 1);
  }
}
const CollapsibleOptions = {
  animationDuration: 300,
  sidenav: {
    activeClass: true,
    activeWhenOpen: true,
    autoClose: true
  }
};
class Collapsible extends AxentixComponent {
  constructor(element, options) {
    super();
    __privateAdd(this, _handleResize);
    __privateAdd(this, _detectSidenav);
    __privateAdd(this, _addActiveInSidenav);
    __privateAdd(this, _toggleTriggerActive);
    __privateAdd(this, _autoClose);
    __privateAdd(this, _applyOverflow);
    __privateAdd(this, _onClickTrigger);
    __publicField(this, "options");
    __privateAdd(this, _triggers, void 0);
    __privateAdd(this, _sidenavTriggers, void 0);
    __privateAdd(this, _isInit, true);
    __privateAdd(this, _isActive, false);
    __privateAdd(this, _isAnimated, false);
    __privateAdd(this, _childIsActive, false);
    __privateAdd(this, _listenerRef, void 0);
    __privateAdd(this, _resizeRef, void 0);
    __privateAdd(this, _sidenavId, void 0);
    try {
      this.preventDbInstance(element);
      instances.push({ type: "Collapsible", instance: this });
      this.el = document.querySelector(element);
      this.options = getComponentOptions("Collapsible", options, this.el);
      this.setup();
    } catch (error) {
      console.error("[Axentix] Collapsible init error", error);
    }
  }
  setup() {
    createEvent(this.el, "collapsible.setup");
    __privateSet(this, _triggers, getTriggers(this.el.id));
    __privateSet(this, _isInit, true);
    __privateSet(this, _isActive, this.el.classList.contains("active") ? true : false);
    __privateSet(this, _isAnimated, false);
    __privateSet(this, _sidenavId, "");
    __privateSet(this, _childIsActive, false);
    this.setupListeners();
    this.el.style.transitionDuration = this.options.animationDuration + "ms";
    __privateMethod(this, _detectSidenav, detectSidenav_fn).call(this);
    __privateSet(this, _childIsActive, this.el.querySelector(".active") ? true : false);
    if (this.options.sidenav.activeClass)
      __privateMethod(this, _addActiveInSidenav, addActiveInSidenav_fn).call(this);
    if (__privateGet(this, _isActive))
      this.open();
    __privateSet(this, _isInit, false);
  }
  setupListeners() {
    __privateSet(this, _listenerRef, __privateMethod(this, _onClickTrigger, onClickTrigger_fn).bind(this));
    __privateGet(this, _triggers).forEach((trigger) => trigger.addEventListener("click", __privateGet(this, _listenerRef)));
    __privateSet(this, _resizeRef, __privateMethod(this, _handleResize, handleResize_fn).bind(this));
    window.addEventListener("resize", __privateGet(this, _resizeRef));
  }
  removeListeners() {
    __privateGet(this, _triggers).forEach((trigger) => trigger.removeEventListener("click", __privateGet(this, _listenerRef)));
    __privateSet(this, _listenerRef, void 0);
    window.removeEventListener("resize", __privateGet(this, _resizeRef));
    __privateSet(this, _resizeRef, void 0);
  }
  open() {
    if (__privateGet(this, _isActive) && !__privateGet(this, _isInit))
      return;
    createEvent(this.el, "collapsible.open");
    __privateSet(this, _isActive, true);
    __privateSet(this, _isAnimated, true);
    this.el.style.display = "block";
    __privateMethod(this, _applyOverflow, applyOverflow_fn).call(this);
    this.el.style.maxHeight = this.el.scrollHeight + "px";
    if (this.options.sidenav.activeWhenOpen)
      __privateMethod(this, _toggleTriggerActive, toggleTriggerActive_fn).call(this, true);
    if (this.options.sidenav.autoClose)
      __privateMethod(this, _autoClose, autoClose_fn).call(this);
    setTimeout(() => {
      __privateSet(this, _isAnimated, false);
    }, this.options.animationDuration);
  }
  close() {
    if (!__privateGet(this, _isActive))
      return;
    createEvent(this.el, "collapsible.close");
    __privateSet(this, _isAnimated, true);
    this.el.style.maxHeight = "";
    __privateMethod(this, _applyOverflow, applyOverflow_fn).call(this);
    if (this.options.sidenav.activeWhenOpen)
      __privateMethod(this, _toggleTriggerActive, toggleTriggerActive_fn).call(this, false);
    setTimeout(() => {
      this.el.style.display = "";
      __privateSet(this, _isAnimated, false);
      __privateSet(this, _isActive, false);
    }, this.options.animationDuration);
  }
}
_triggers = new WeakMap();
_sidenavTriggers = new WeakMap();
_isInit = new WeakMap();
_isActive = new WeakMap();
_isAnimated = new WeakMap();
_childIsActive = new WeakMap();
_listenerRef = new WeakMap();
_resizeRef = new WeakMap();
_sidenavId = new WeakMap();
_handleResize = new WeakSet();
handleResize_fn = function() {
  if (__privateGet(this, _isActive) && !__privateGet(this, _sidenavId))
    this.el.style.maxHeight = this.el.scrollHeight + "px";
};
_detectSidenav = new WeakSet();
detectSidenav_fn = function() {
  const sidenavElem = this.el.closest(".sidenav");
  if (sidenavElem) {
    __privateSet(this, _sidenavId, sidenavElem.id);
    __privateSet(this, _sidenavTriggers, __privateGet(this, _triggers).filter((t) => {
      var _a;
      return ((_a = t.closest(".sidenav")) == null ? void 0 : _a.id) === sidenavElem.id;
    }));
  }
};
_addActiveInSidenav = new WeakSet();
addActiveInSidenav_fn = function() {
  if (!__privateGet(this, _childIsActive) || !__privateGet(this, _sidenavId))
    return;
  __privateGet(this, _sidenavTriggers).forEach((trigger) => trigger.classList.add("active"));
  this.el.classList.add("active");
  this.open();
  __privateSet(this, _isActive, true);
};
_toggleTriggerActive = new WeakSet();
toggleTriggerActive_fn = function(state) {
  if (!__privateGet(this, _sidenavId))
    return;
  __privateGet(this, _sidenavTriggers).forEach((trigger) => {
    if (state)
      trigger.classList.add("active");
    else
      trigger.classList.remove("active");
  });
};
_autoClose = new WeakSet();
autoClose_fn = function() {
  if (!__privateGet(this, _isInit) && __privateGet(this, _sidenavId)) {
    getInstanceByType("Collapsible").forEach((collapsible2) => {
      if (__privateGet(collapsible2, _sidenavId) === __privateGet(this, _sidenavId) && collapsible2.el.id !== this.el.id)
        collapsible2.close();
    });
  }
};
_applyOverflow = new WeakSet();
applyOverflow_fn = function() {
  this.el.style.overflow = "hidden";
  setTimeout(() => {
    this.el.style.overflow = "";
  }, this.options.animationDuration);
};
_onClickTrigger = new WeakSet();
onClickTrigger_fn = function(e) {
  e.preventDefault();
  if (__privateGet(this, _isAnimated))
    return;
  if (__privateGet(this, _isActive))
    this.close();
  else
    this.open();
};
__publicField(Collapsible, "getDefaultOptions", () => CollapsibleOptions);
registerComponent({
  class: Collapsible,
  name: "Collapsible",
  dataDetection: true,
  autoInit: {
    enabled: true,
    selector: ".collapsible"
  }
});
export { Collapsible as default };

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
var _oldLink, _updateRef, _links, _elements, _setupBasic, setupBasic_fn, _setupAuto, setupAuto_fn, _getElement, getElement_fn, _removeOldLink, removeOldLink_fn, _getClosestElem, getClosestElem_fn, _update, update_fn;
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
const getInstance = (element) => {
  const el = instances.find((ins) => ins.type !== "Toast" && "#" + ins.instance.el.id === element);
  if (el)
    return el.instance;
  return false;
};
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
const ScrollSpyOptions = {
  offset: 200,
  linkSelector: "a",
  classes: "active",
  auto: {
    enabled: false,
    classes: "",
    selector: ""
  }
};
class ScrollSpy extends AxentixComponent {
  constructor(element, options) {
    super();
    __privateAdd(this, _setupBasic);
    __privateAdd(this, _setupAuto);
    __privateAdd(this, _getElement);
    __privateAdd(this, _removeOldLink);
    __privateAdd(this, _getClosestElem);
    __privateAdd(this, _update);
    __publicField(this, "options");
    __privateAdd(this, _oldLink, void 0);
    __privateAdd(this, _updateRef, void 0);
    __privateAdd(this, _links, void 0);
    __privateAdd(this, _elements, void 0);
    try {
      this.preventDbInstance(element);
      instances.push({ type: "ScrollSpy", instance: this });
      this.el = document.querySelector(element);
      this.options = getComponentOptions("ScrollSpy", options, this.el);
      this.setup();
    } catch (error) {
      console.error("[Axentix] ScrollSpy init error", error);
    }
  }
  setup() {
    createEvent(this.el, "scrollspy.setup");
    if (this.options.auto.enabled)
      __privateMethod(this, _setupAuto, setupAuto_fn).call(this);
    else
      __privateMethod(this, _setupBasic, setupBasic_fn).call(this);
    if (typeof this.options.classes === "string")
      this.options.classes = this.options.classes.split(" ");
    __privateSet(this, _oldLink, "");
    this.setupListeners();
    __privateMethod(this, _update, update_fn).call(this);
  }
  setupListeners() {
    __privateSet(this, _updateRef, __privateMethod(this, _update, update_fn).bind(this));
    window.addEventListener("scroll", __privateGet(this, _updateRef));
    window.addEventListener("resize", __privateGet(this, _updateRef));
  }
  removeListeners() {
    window.removeEventListener("scroll", __privateGet(this, _updateRef));
    window.removeEventListener("resize", __privateGet(this, _updateRef));
    __privateSet(this, _updateRef, void 0);
  }
}
_oldLink = new WeakMap();
_updateRef = new WeakMap();
_links = new WeakMap();
_elements = new WeakMap();
_setupBasic = new WeakSet();
setupBasic_fn = function() {
  __privateSet(this, _links, Array.from(this.el.querySelectorAll(this.options.linkSelector)));
  __privateSet(this, _elements, __privateGet(this, _links).map((link) => document.querySelector(link.getAttribute("href"))));
};
_setupAuto = new WeakSet();
setupAuto_fn = function() {
  __privateSet(this, _elements, Array.from(document.querySelectorAll(this.options.auto.selector)));
  __privateSet(this, _links, __privateGet(this, _elements).map((el) => {
    const link = document.createElement("a");
    link.className = this.options.auto.classes;
    link.setAttribute("href", "#" + el.id);
    link.innerHTML = el.innerHTML;
    this.el.appendChild(link);
    return link;
  }));
};
_getElement = new WeakSet();
getElement_fn = function() {
  const top = window.scrollY, left = window.scrollX, right = window.innerWidth, bottom = window.innerHeight, topBreakpoint = top + this.options.offset;
  if (bottom + top >= document.body.offsetHeight - 2)
    return __privateGet(this, _elements)[__privateGet(this, _elements).length - 1];
  return __privateGet(this, _elements).find((el) => {
    const elRect = el.getBoundingClientRect();
    return elRect.top + top >= top && elRect.left + left >= left && elRect.right <= right && elRect.bottom <= bottom && elRect.top + top <= topBreakpoint;
  });
};
_removeOldLink = new WeakSet();
removeOldLink_fn = function() {
  if (!__privateGet(this, _oldLink))
    return;
  this.options.classes.forEach((cl) => __privateGet(this, _oldLink).classList.remove(cl));
};
_getClosestElem = new WeakSet();
getClosestElem_fn = function() {
  const top = window.scrollY;
  return __privateGet(this, _elements).reduce((prev, curr) => {
    const currTop = curr.getBoundingClientRect().top + top;
    const prevTop = prev.getBoundingClientRect().top + top;
    if (currTop > top + this.options.offset)
      return prev;
    else if (Math.abs(currTop - top) < Math.abs(prevTop - top))
      return curr;
    return prev;
  });
};
_update = new WeakSet();
update_fn = function() {
  let element = __privateMethod(this, _getElement, getElement_fn).call(this);
  if (!element)
    element = __privateMethod(this, _getClosestElem, getClosestElem_fn).call(this);
  const link = __privateGet(this, _links).find((l) => l.getAttribute("href").split("#")[1] === element.id);
  if (link === __privateGet(this, _oldLink))
    return;
  createEvent(this.el, "scrollspy.update");
  __privateMethod(this, _removeOldLink, removeOldLink_fn).call(this);
  this.options.classes.forEach((cl) => link.classList.add(cl));
  __privateSet(this, _oldLink, link);
};
__publicField(ScrollSpy, "getDefaultOptions", () => ScrollSpyOptions);
registerComponent({
  class: ScrollSpy,
  name: "ScrollSpy",
  dataDetection: true,
  autoInit: {
    enabled: true,
    selector: ".scrollspy"
  }
});
export { ScrollSpy as default };

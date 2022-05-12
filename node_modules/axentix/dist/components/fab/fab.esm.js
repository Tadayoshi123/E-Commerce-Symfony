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
var _isAnimated, _isActive, _trigger, _fabMenu, _openRef, _closeRef, _documentClickRef, _listenerRef, _verifOptions, verifOptions_fn, _setProperties, setProperties_fn, _setMenuPosition, setMenuPosition_fn, _handleDocumentClick, handleDocumentClick_fn, _onClickTrigger, onClickTrigger_fn;
var fab = "";
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
const FabOptions = {
  animationDuration: 300,
  hover: true,
  direction: "top",
  position: "bottom-right",
  offsetX: "1rem",
  offsetY: "1.5rem"
};
class Fab extends AxentixComponent {
  constructor(element, options) {
    super();
    __privateAdd(this, _verifOptions);
    __privateAdd(this, _setProperties);
    __privateAdd(this, _setMenuPosition);
    __privateAdd(this, _handleDocumentClick);
    __privateAdd(this, _onClickTrigger);
    __publicField(this, "options");
    __privateAdd(this, _isAnimated, false);
    __privateAdd(this, _isActive, false);
    __privateAdd(this, _trigger, void 0);
    __privateAdd(this, _fabMenu, void 0);
    __privateAdd(this, _openRef, void 0);
    __privateAdd(this, _closeRef, void 0);
    __privateAdd(this, _documentClickRef, void 0);
    __privateAdd(this, _listenerRef, void 0);
    try {
      this.preventDbInstance(element);
      instances.push({ type: "Fab", instance: this });
      this.el = document.querySelector(element);
      this.options = getComponentOptions("Fab", options, this.el);
      this.setup();
    } catch (error) {
      console.error("[Axentix] Fab init error", error);
    }
  }
  setup() {
    createEvent(this.el, "fab.setup");
    __privateSet(this, _isAnimated, false);
    __privateSet(this, _isActive, false);
    __privateSet(this, _trigger, getTriggers(this.el.id)[0]);
    __privateSet(this, _fabMenu, this.el.querySelector(".fab-menu"));
    __privateMethod(this, _verifOptions, verifOptions_fn).call(this);
    this.setupListeners();
    this.el.style.transitionDuration = this.options.animationDuration + "ms";
    __privateMethod(this, _setProperties, setProperties_fn).call(this);
  }
  setupListeners() {
    if (this.options.hover) {
      __privateSet(this, _openRef, this.open.bind(this));
      __privateSet(this, _closeRef, this.close.bind(this));
      this.el.addEventListener("mouseenter", __privateGet(this, _openRef));
      this.el.addEventListener("mouseleave", __privateGet(this, _closeRef));
    } else {
      __privateSet(this, _listenerRef, __privateMethod(this, _onClickTrigger, onClickTrigger_fn).bind(this));
      this.el.addEventListener("click", __privateGet(this, _listenerRef));
    }
    __privateSet(this, _documentClickRef, __privateMethod(this, _handleDocumentClick, handleDocumentClick_fn).bind(this));
    document.addEventListener("click", __privateGet(this, _documentClickRef), true);
  }
  removeListeners() {
    if (this.options.hover) {
      this.el.removeEventListener("mouseenter", __privateGet(this, _openRef));
      this.el.removeEventListener("mouseleave", __privateGet(this, _closeRef));
      __privateSet(this, _openRef, void 0);
      __privateSet(this, _closeRef, void 0);
    } else {
      this.el.removeEventListener("click", __privateGet(this, _listenerRef));
      __privateSet(this, _listenerRef, void 0);
    }
    document.removeEventListener("click", __privateGet(this, _documentClickRef), true);
    __privateSet(this, _documentClickRef, void 0);
  }
  open() {
    if (__privateGet(this, _isActive))
      return;
    createEvent(this.el, "fab.open");
    __privateSet(this, _isAnimated, true);
    __privateSet(this, _isActive, true);
    this.el.classList.add("active");
    setTimeout(() => {
      __privateSet(this, _isAnimated, false);
    }, this.options.animationDuration);
  }
  close() {
    if (!__privateGet(this, _isActive))
      return;
    createEvent(this.el, "fab.close");
    __privateSet(this, _isAnimated, true);
    __privateSet(this, _isActive, false);
    this.el.classList.remove("active");
    setTimeout(() => {
      __privateSet(this, _isAnimated, false);
    }, this.options.animationDuration);
  }
}
_isAnimated = new WeakMap();
_isActive = new WeakMap();
_trigger = new WeakMap();
_fabMenu = new WeakMap();
_openRef = new WeakMap();
_closeRef = new WeakMap();
_documentClickRef = new WeakMap();
_listenerRef = new WeakMap();
_verifOptions = new WeakSet();
verifOptions_fn = function() {
  const directionList = ["right", "left", "top", "bottom"];
  if (!directionList.includes(this.options.direction))
    this.options.direction = "top";
  const positionList = ["top-right", "top-left", "bottom-right", "bottom-left"];
  if (!positionList.includes(this.options.position))
    this.options.position = "bottom-right";
};
_setProperties = new WeakSet();
setProperties_fn = function() {
  if (this.options.position.split("-")[0] === "top")
    this.el.style.top = this.options.offsetY;
  else
    this.el.style.bottom = this.options.offsetY;
  if (this.options.position.split("-")[1] === "right")
    this.el.style.right = this.options.offsetX;
  else
    this.el.style.left = this.options.offsetX;
  if (this.options.direction === "right" || this.options.direction === "left")
    this.el.classList.add("fab-dir-x");
  __privateMethod(this, _setMenuPosition, setMenuPosition_fn).call(this);
};
_setMenuPosition = new WeakSet();
setMenuPosition_fn = function() {
  if (this.options.direction === "top" || this.options.direction === "bottom") {
    const height = __privateGet(this, _trigger).clientHeight;
    if (this.options.direction === "top")
      __privateGet(this, _fabMenu).style.bottom = height + "px";
    else
      __privateGet(this, _fabMenu).style.top = height + "px";
  } else {
    const width = __privateGet(this, _trigger).clientWidth;
    if (this.options.direction === "right")
      __privateGet(this, _fabMenu).style.left = width + "px";
    else
      __privateGet(this, _fabMenu).style.right = width + "px";
  }
};
_handleDocumentClick = new WeakSet();
handleDocumentClick_fn = function(e) {
  const isInside = this.el.contains(e.target);
  if (!isInside && __privateGet(this, _isActive))
    this.close();
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
__publicField(Fab, "getDefaultOptions", () => FabOptions);
registerComponent({
  class: Fab,
  name: "Fab",
  dataDetection: true,
  autoInit: {
    enabled: true,
    selector: ".fab:not(i)"
  }
});
export { Fab as default };

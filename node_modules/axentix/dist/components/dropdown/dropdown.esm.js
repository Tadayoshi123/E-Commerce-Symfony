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
var _dropdownContent, _trigger, _isAnimated, _isActive, _documentClickRef, _listenerRef, _contentHeightRef, _setupAnimation, setupAnimation_fn, _onDocumentClick, onDocumentClick_fn, _onClickTrigger, onClickTrigger_fn, _autoClose, autoClose_fn, _setContentHeight, setContentHeight_fn;
var dropdown = "";
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
const DropdownOptions = {
  animationDuration: 300,
  animationType: "none",
  hover: false,
  autoClose: true,
  preventViewport: false,
  closeOnClick: true
};
class Dropdown extends AxentixComponent {
  constructor(element, options) {
    super();
    __privateAdd(this, _setupAnimation);
    __privateAdd(this, _onDocumentClick);
    __privateAdd(this, _onClickTrigger);
    __privateAdd(this, _autoClose);
    __privateAdd(this, _setContentHeight);
    __publicField(this, "options");
    __privateAdd(this, _dropdownContent, void 0);
    __privateAdd(this, _trigger, void 0);
    __privateAdd(this, _isAnimated, false);
    __privateAdd(this, _isActive, false);
    __privateAdd(this, _documentClickRef, void 0);
    __privateAdd(this, _listenerRef, void 0);
    __privateAdd(this, _contentHeightRef, void 0);
    try {
      this.preventDbInstance(element);
      instances.push({ type: "Dropdown", instance: this });
      this.el = document.querySelector(element);
      this.options = getComponentOptions("Dropdown", options, this.el);
      this.setup();
    } catch (error) {
      console.error("[Axentix] Dropdown init error", error);
    }
  }
  setup() {
    createEvent(this.el, "dropdown.setup");
    __privateSet(this, _dropdownContent, this.el.querySelector(".dropdown-content"));
    __privateSet(this, _trigger, getTriggers(this.el.id)[0]);
    __privateSet(this, _isAnimated, false);
    __privateSet(this, _isActive, this.el.classList.contains("active") ? true : false);
    if (this.options.hover)
      this.el.classList.add("active-hover");
    else
      this.setupListeners();
    if (this.options.preventViewport)
      this.el.classList.add("dropdown-vp");
    __privateMethod(this, _setupAnimation, setupAnimation_fn).call(this);
  }
  setupListeners() {
    if (this.options.hover)
      return;
    __privateSet(this, _listenerRef, __privateMethod(this, _onClickTrigger, onClickTrigger_fn).bind(this));
    __privateGet(this, _trigger).addEventListener("click", __privateGet(this, _listenerRef));
    __privateSet(this, _documentClickRef, __privateMethod(this, _onDocumentClick, onDocumentClick_fn).bind(this));
    document.addEventListener("click", __privateGet(this, _documentClickRef), true);
    __privateSet(this, _contentHeightRef, __privateMethod(this, _setContentHeight, setContentHeight_fn).bind(this));
    if (this.options.preventViewport)
      window.addEventListener("scroll", __privateGet(this, _contentHeightRef));
  }
  removeListeners() {
    if (this.options.hover)
      return;
    __privateGet(this, _trigger).removeEventListener("click", __privateGet(this, _listenerRef));
    __privateSet(this, _listenerRef, void 0);
    document.removeEventListener("click", __privateGet(this, _documentClickRef), true);
    __privateSet(this, _documentClickRef, void 0);
    if (this.options.preventViewport)
      window.removeEventListener("scroll", __privateGet(this, _contentHeightRef));
    __privateSet(this, _contentHeightRef, void 0);
  }
  open() {
    if (__privateGet(this, _isActive))
      return;
    createEvent(this.el, "dropdown.open");
    __privateGet(this, _dropdownContent).style.display = "flex";
    if (this.options.preventViewport)
      __privateMethod(this, _setContentHeight, setContentHeight_fn).call(this);
    setTimeout(() => {
      this.el.classList.add("active");
      __privateSet(this, _isActive, true);
    }, 10);
    if (this.options.autoClose)
      __privateMethod(this, _autoClose, autoClose_fn).call(this);
    if (this.options.animationType !== "none") {
      __privateSet(this, _isAnimated, true);
      setTimeout(() => {
        __privateSet(this, _isAnimated, false);
        createEvent(this.el, "dropdown.opened");
      }, this.options.animationDuration);
    } else {
      createEvent(this.el, "dropdown.opened");
    }
  }
  close() {
    if (!__privateGet(this, _isActive))
      return;
    createEvent(this.el, "dropdown.close");
    this.el.classList.remove("active");
    if (this.options.animationType !== "none") {
      __privateSet(this, _isAnimated, true);
      setTimeout(() => {
        __privateGet(this, _dropdownContent).style.display = "";
        __privateSet(this, _isAnimated, false);
        __privateSet(this, _isActive, false);
        createEvent(this.el, "dropdown.closed");
      }, this.options.animationDuration);
    } else {
      __privateGet(this, _dropdownContent).style.display = "";
      __privateSet(this, _isActive, false);
      createEvent(this.el, "dropdown.closed");
    }
  }
}
_dropdownContent = new WeakMap();
_trigger = new WeakMap();
_isAnimated = new WeakMap();
_isActive = new WeakMap();
_documentClickRef = new WeakMap();
_listenerRef = new WeakMap();
_contentHeightRef = new WeakMap();
_setupAnimation = new WeakSet();
setupAnimation_fn = function() {
  const animationList = ["none", "fade"];
  this.options.animationType = this.options.animationType.toLowerCase();
  if (!animationList.includes(this.options.animationType))
    this.options.animationType = "none";
  if (this.options.animationType === "fade" && !this.options.hover) {
    __privateGet(this, _dropdownContent).style.transitionDuration = this.options.animationDuration + "ms";
    this.el.classList.add("dropdown-anim-fade");
  }
};
_onDocumentClick = new WeakSet();
onDocumentClick_fn = function(e) {
  if (e.target === __privateGet(this, _trigger) || __privateGet(this, _isAnimated) || !__privateGet(this, _isActive) || !this.options.closeOnClick && e.target.closest(".dropdown-content"))
    return;
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
_autoClose = new WeakSet();
autoClose_fn = function() {
  getInstanceByType("Dropdown").forEach((dropdown2) => {
    if (dropdown2.el.id !== this.el.id)
      dropdown2.close();
  });
};
_setContentHeight = new WeakSet();
setContentHeight_fn = function() {
  const elRect = __privateGet(this, _dropdownContent).getBoundingClientRect();
  const bottom = elRect.height - (elRect.bottom - (window.innerHeight || document.documentElement.clientHeight)) - 10;
  __privateGet(this, _dropdownContent).style.maxHeight = bottom + "px";
};
__publicField(Dropdown, "getDefaultOptions", () => DropdownOptions);
registerComponent({
  class: Dropdown,
  name: "Dropdown",
  dataDetection: true,
  autoInit: {
    enabled: true,
    selector: ".dropdown"
  }
});
export { Dropdown as default };

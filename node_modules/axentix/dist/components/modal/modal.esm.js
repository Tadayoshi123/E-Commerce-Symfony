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
var _triggers, _isActive, _isAnimated, _listenerRef, _toggleBodyScroll, toggleBodyScroll_fn, _setZIndex, setZIndex_fn, _onClickTrigger, onClickTrigger_fn;
var modal = "";
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
const createOverlay = (isActive, overlay, id, animationDuration) => {
  const overlayElement = isActive && overlay ? document.querySelector(`.ax-overlay[data-target="${id}"]`) : document.createElement("div");
  overlayElement.classList.add("ax-overlay");
  overlayElement.style.transitionDuration = animationDuration + "ms";
  overlayElement.dataset.target = id;
  return overlayElement;
};
const updateOverlay = (overlay, overlayElement, listenerRef, state, animationDuration) => {
  if (!overlay)
    return;
  if (state) {
    overlayElement.addEventListener("click", listenerRef);
    document.body.appendChild(overlayElement);
    setTimeout(() => {
      overlayElement.classList.add("active");
    }, 50);
  } else {
    overlayElement.classList.remove("active");
    setTimeout(() => {
      overlayElement.removeEventListener("click", listenerRef);
      document.body.removeChild(overlayElement);
    }, animationDuration);
  }
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
const ModalOptions = {
  overlay: true,
  bodyScrolling: false,
  animationDuration: 400
};
class Modal extends AxentixComponent {
  constructor(element, options) {
    super();
    __privateAdd(this, _toggleBodyScroll);
    __privateAdd(this, _setZIndex);
    __privateAdd(this, _onClickTrigger);
    __publicField(this, "options");
    __publicField(this, "overlayElement");
    __privateAdd(this, _triggers, void 0);
    __privateAdd(this, _isActive, false);
    __privateAdd(this, _isAnimated, false);
    __privateAdd(this, _listenerRef, void 0);
    try {
      this.preventDbInstance(element);
      instances.push({ type: "Modal", instance: this });
      this.el = document.querySelector(element);
      this.options = getComponentOptions("Modal", options, this.el);
      this.setup();
    } catch (error) {
      console.error("[Axentix] Modal init error", error);
    }
  }
  setup() {
    createEvent(this.el, "modal.setup");
    __privateSet(this, _triggers, getTriggers(this.el.id));
    __privateSet(this, _isActive, this.el.classList.contains("active") ? true : false);
    __privateSet(this, _isAnimated, false);
    this.setupListeners();
    if (this.options.overlay)
      this.overlayElement = createOverlay(__privateGet(this, _isActive), this.options.overlay, this.el.id, this.options.animationDuration);
    this.el.style.transitionDuration = this.options.animationDuration + "ms";
    this.el.style.animationDuration = this.options.animationDuration + "ms";
  }
  setupListeners() {
    __privateSet(this, _listenerRef, __privateMethod(this, _onClickTrigger, onClickTrigger_fn).bind(this));
    __privateGet(this, _triggers).forEach((trigger) => trigger.addEventListener("click", __privateGet(this, _listenerRef)));
  }
  removeListeners() {
    __privateGet(this, _triggers).forEach((trigger) => trigger.removeEventListener("click", __privateGet(this, _listenerRef)));
    __privateSet(this, _listenerRef, void 0);
  }
  open() {
    if (__privateGet(this, _isActive))
      return;
    createEvent(this.el, "modal.open");
    __privateSet(this, _isActive, true);
    __privateSet(this, _isAnimated, true);
    __privateMethod(this, _setZIndex, setZIndex_fn).call(this);
    this.el.style.display = "block";
    updateOverlay(this.options.overlay, this.overlayElement, __privateGet(this, _listenerRef), true, this.options.animationDuration);
    __privateMethod(this, _toggleBodyScroll, toggleBodyScroll_fn).call(this, false);
    setTimeout(() => {
      this.el.classList.add("active");
    }, 50);
    setTimeout(() => {
      __privateSet(this, _isAnimated, false);
      createEvent(this.el, "modal.opened");
    }, this.options.animationDuration);
  }
  close() {
    if (!__privateGet(this, _isActive))
      return;
    createEvent(this.el, "modal.close");
    __privateSet(this, _isAnimated, true);
    this.el.classList.remove("active");
    updateOverlay(this.options.overlay, this.overlayElement, __privateGet(this, _listenerRef), false, this.options.animationDuration);
    setTimeout(() => {
      this.el.style.display = "";
      __privateSet(this, _isAnimated, false);
      __privateSet(this, _isActive, false);
      __privateMethod(this, _toggleBodyScroll, toggleBodyScroll_fn).call(this, true);
      createEvent(this.el, "modal.closed");
    }, this.options.animationDuration);
  }
}
_triggers = new WeakMap();
_isActive = new WeakMap();
_isAnimated = new WeakMap();
_listenerRef = new WeakMap();
_toggleBodyScroll = new WeakSet();
toggleBodyScroll_fn = function(state) {
  if (!this.options.bodyScrolling)
    document.body.style.overflow = state ? "" : "hidden";
};
_setZIndex = new WeakSet();
setZIndex_fn = function() {
  const totalModals = document.querySelectorAll(".modal.active").length + 1;
  if (this.options.overlay)
    this.overlayElement.style.zIndex = String(800 + totalModals * 10 - 2);
  this.el.style.zIndex = String(800 + totalModals * 10);
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
__publicField(Modal, "getDefaultOptions", () => ModalOptions);
registerComponent({
  class: Modal,
  name: "Modal",
  dataDetection: true,
  autoInit: {
    enabled: true,
    selector: ".modal"
  }
});
export { Modal as default };

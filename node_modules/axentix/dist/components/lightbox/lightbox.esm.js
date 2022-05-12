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
var _onClickRef, _transitionEndEventRef, _keyUpRef, _scrollRef, _resizeRef, _overlay, _overlayClickEventRef, _overflowParents, _baseRect, _newHeight, _newWidth, _isActive, _isResponsive, _container, _isClosing, _isOpening, _setOverlay, setOverlay_fn, _showOverlay, showOverlay_fn, _hideOverlay, hideOverlay_fn, _unsetOverlay, unsetOverlay_fn, _calculateRatio, calculateRatio_fn, _setOverflowParents, setOverflowParents_fn, _unsetOverflowParents, unsetOverflowParents_fn, _handleTransition, handleTransition_fn, _handleKeyUp, handleKeyUp_fn, _handleScroll, handleScroll_fn, _handleResize, _clearLightbox, clearLightbox_fn, _onClickTrigger, onClickTrigger_fn;
var lightbox = "";
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
const wrap = (target, wrapper = document.createElement("div")) => {
  const parent = target[0].parentElement;
  parent.insertBefore(wrapper, target[0]);
  target.forEach((elem) => wrapper.appendChild(elem));
  return wrapper;
};
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
const LightboxOptions = {
  animationDuration: 400,
  overlayClass: "grey dark-4",
  offset: 150,
  mobileOffset: 80,
  caption: ""
};
class Lightbox extends AxentixComponent {
  constructor(element, options) {
    super();
    __privateAdd(this, _setOverlay);
    __privateAdd(this, _showOverlay);
    __privateAdd(this, _hideOverlay);
    __privateAdd(this, _unsetOverlay);
    __privateAdd(this, _calculateRatio);
    __privateAdd(this, _setOverflowParents);
    __privateAdd(this, _unsetOverflowParents);
    __privateAdd(this, _handleTransition);
    __privateAdd(this, _handleKeyUp);
    __privateAdd(this, _handleScroll);
    __privateAdd(this, _clearLightbox);
    __privateAdd(this, _onClickTrigger);
    __publicField(this, "options");
    __privateAdd(this, _onClickRef, void 0);
    __privateAdd(this, _transitionEndEventRef, void 0);
    __privateAdd(this, _keyUpRef, void 0);
    __privateAdd(this, _scrollRef, void 0);
    __privateAdd(this, _resizeRef, void 0);
    __privateAdd(this, _overlay, void 0);
    __privateAdd(this, _overlayClickEventRef, void 0);
    __privateAdd(this, _overflowParents, void 0);
    __privateAdd(this, _baseRect, void 0);
    __privateAdd(this, _newHeight, 0);
    __privateAdd(this, _newWidth, 0);
    __privateAdd(this, _isActive, false);
    __privateAdd(this, _isResponsive, false);
    __privateAdd(this, _container, void 0);
    __privateAdd(this, _isClosing, false);
    __privateAdd(this, _isOpening, false);
    __privateAdd(this, _handleResize, () => {
      if (__privateGet(this, _isActive))
        this.close();
    });
    try {
      this.preventDbInstance(element);
      instances.push({ type: "Lightbox", instance: this });
      this.el = document.querySelector(element);
      this.options = getComponentOptions("Lightbox", options, this.el);
      this.setup();
    } catch (error) {
      console.error("[Axentix] Lightbox init error", error);
    }
  }
  setup() {
    createEvent(this.el, "lightbox.setup");
    this.el.style.transitionDuration = this.options.animationDuration + "ms";
    __privateSet(this, _container, wrap([this.el]));
    this.setupListeners();
  }
  setupListeners() {
    __privateSet(this, _onClickRef, __privateMethod(this, _onClickTrigger, onClickTrigger_fn).bind(this));
    this.el.addEventListener("click", __privateGet(this, _onClickRef));
    __privateSet(this, _keyUpRef, __privateMethod(this, _handleKeyUp, handleKeyUp_fn).bind(this));
    __privateSet(this, _scrollRef, __privateMethod(this, _handleScroll, handleScroll_fn).bind(this));
    __privateSet(this, _resizeRef, __privateGet(this, _handleResize).bind(this));
    __privateSet(this, _transitionEndEventRef, __privateMethod(this, _handleTransition, handleTransition_fn).bind(this));
    window.addEventListener("keyup", __privateGet(this, _keyUpRef));
    window.addEventListener("scroll", __privateGet(this, _scrollRef));
    window.addEventListener("resize", __privateGet(this, _resizeRef));
    this.el.addEventListener("transitionend", __privateGet(this, _transitionEndEventRef));
  }
  removeListeners() {
    this.el.removeEventListener("click", __privateGet(this, _onClickRef));
    this.el.removeEventListener("transitionend", __privateGet(this, _transitionEndEventRef));
    window.removeEventListener("keyup", __privateGet(this, _keyUpRef));
    window.removeEventListener("scroll", __privateGet(this, _scrollRef));
    window.removeEventListener("resize", __privateGet(this, _resizeRef));
    __privateSet(this, _onClickRef, void 0);
    __privateSet(this, _keyUpRef, void 0);
    __privateSet(this, _scrollRef, void 0);
    __privateSet(this, _resizeRef, void 0);
    __privateSet(this, _transitionEndEventRef, void 0);
  }
  open() {
    __privateSet(this, _isOpening, true);
    let rect, containerRect;
    if (__privateGet(this, _isClosing)) {
      rect = containerRect = __privateGet(this, _container).getBoundingClientRect();
    } else {
      rect = containerRect = this.el.getBoundingClientRect();
    }
    __privateSet(this, _isClosing, false);
    __privateMethod(this, _setOverlay, setOverlay_fn).call(this);
    __privateMethod(this, _showOverlay, showOverlay_fn).call(this);
    const centerTop = window.innerHeight / 2;
    const centerLeft = window.innerWidth / 2;
    __privateSet(this, _baseRect, rect);
    this.el.style.width = __privateGet(this, _baseRect).width + "px";
    this.el.style.height = __privateGet(this, _baseRect).height + "px";
    this.el.style.top = "0";
    this.el.style.left = "0";
    const newTop = centerTop + window.scrollY - (containerRect.top + window.scrollY);
    const newLeft = centerLeft + window.scrollX - (containerRect.left + window.scrollX);
    __privateMethod(this, _calculateRatio, calculateRatio_fn).call(this);
    __privateGet(this, _container).style.position = "relative";
    setTimeout(() => {
      createEvent(this.el, "lightbox.open");
      __privateSet(this, _isActive, true);
      if (this.el.classList.contains("responsive-media")) {
        __privateSet(this, _isResponsive, true);
        this.el.classList.remove("responsive-media");
      }
      this.el.classList.add("active");
      __privateGet(this, _container).style.width = __privateGet(this, _baseRect).width + "px";
      __privateGet(this, _container).style.height = __privateGet(this, _baseRect).height + "px";
      this.el.style.width = __privateGet(this, _newWidth) + "px";
      this.el.style.height = __privateGet(this, _newHeight) + "px";
      this.el.style.top = newTop - __privateGet(this, _newHeight) / 2 + "px";
      this.el.style.left = newLeft - __privateGet(this, _newWidth) / 2 + "px";
    }, 50);
  }
  close(e) {
    if ((e == null ? void 0 : e.key) && e.key !== "Escape")
      return;
    __privateSet(this, _isActive, false);
    __privateSet(this, _isClosing, true);
    __privateSet(this, _isOpening, false);
    createEvent(this.el, "lightbox.close");
    __privateMethod(this, _hideOverlay, hideOverlay_fn).call(this);
    this.el.style.position = "absolute";
    this.el.style.top = "0px";
    this.el.style.left = "0px";
    this.el.style.width = __privateGet(this, _baseRect).width + "px";
    this.el.style.height = __privateGet(this, _baseRect).height + "px";
  }
}
_onClickRef = new WeakMap();
_transitionEndEventRef = new WeakMap();
_keyUpRef = new WeakMap();
_scrollRef = new WeakMap();
_resizeRef = new WeakMap();
_overlay = new WeakMap();
_overlayClickEventRef = new WeakMap();
_overflowParents = new WeakMap();
_baseRect = new WeakMap();
_newHeight = new WeakMap();
_newWidth = new WeakMap();
_isActive = new WeakMap();
_isResponsive = new WeakMap();
_container = new WeakMap();
_isClosing = new WeakMap();
_isOpening = new WeakMap();
_setOverlay = new WeakSet();
setOverlay_fn = function() {
  if (__privateGet(this, _overlay)) {
    return;
  }
  __privateMethod(this, _setOverflowParents, setOverflowParents_fn).call(this);
  __privateSet(this, _overlay, document.createElement("div"));
  __privateGet(this, _overlay).style.transitionDuration = this.options.animationDuration + "ms";
  __privateGet(this, _overlay).className = "lightbox-overlay " + this.options.overlayClass;
  __privateGet(this, _container).appendChild(__privateGet(this, _overlay));
  if (this.options.caption) {
    const caption = document.createElement("p");
    caption.className = "lightbox-caption";
    caption.innerHTML = this.options.caption;
    __privateGet(this, _overlay).appendChild(caption);
  }
  __privateSet(this, _overlayClickEventRef, this.close.bind(this));
  __privateGet(this, _overlay).addEventListener("click", __privateGet(this, _overlayClickEventRef));
};
_showOverlay = new WeakSet();
showOverlay_fn = function() {
  setTimeout(() => {
    __privateGet(this, _overlay).style.opacity = "1";
  }, 50);
};
_hideOverlay = new WeakSet();
hideOverlay_fn = function() {
  __privateGet(this, _overlay).style.opacity = "0";
};
_unsetOverlay = new WeakSet();
unsetOverlay_fn = function() {
  __privateGet(this, _overlay).removeEventListener("click", __privateGet(this, _overlayClickEventRef));
  __privateGet(this, _overlay).remove();
  __privateSet(this, _overlay, null);
};
_calculateRatio = new WeakSet();
calculateRatio_fn = function() {
  const offset = window.innerWidth >= 960 ? this.options.offset : this.options.mobileOffset;
  if (window.innerWidth / window.innerHeight >= __privateGet(this, _baseRect).width / __privateGet(this, _baseRect).height) {
    __privateSet(this, _newHeight, window.innerHeight - offset);
    __privateSet(this, _newWidth, __privateGet(this, _newHeight) * __privateGet(this, _baseRect).width / __privateGet(this, _baseRect).height);
  } else {
    __privateSet(this, _newWidth, window.innerWidth - offset);
    __privateSet(this, _newHeight, __privateGet(this, _newWidth) * __privateGet(this, _baseRect).height / __privateGet(this, _baseRect).width);
  }
};
_setOverflowParents = new WeakSet();
setOverflowParents_fn = function() {
  __privateSet(this, _overflowParents, []);
  for (let elem = this.el; elem && elem !== document; elem = elem.parentNode) {
    const elementSyle = window.getComputedStyle(elem);
    if (elementSyle.overflow === "hidden" || elementSyle.overflowX === "hidden" || elementSyle.overflowY === "hidden") {
      __privateGet(this, _overflowParents).push(elem);
      if (elem !== document.body)
        elem.style.setProperty("overflow", "visible", "important");
      document.body.style.overflowX = "hidden";
    }
  }
};
_unsetOverflowParents = new WeakSet();
unsetOverflowParents_fn = function() {
  __privateGet(this, _overflowParents).forEach((parent) => parent.style.overflow = "");
  document.body.style.overflowX = "";
};
_handleTransition = new WeakSet();
handleTransition_fn = function(e) {
  if (!e.propertyName.includes("width") && !e.propertyName.includes("height")) {
    return;
  }
  if (__privateGet(this, _isClosing)) {
    __privateMethod(this, _clearLightbox, clearLightbox_fn).call(this);
    __privateSet(this, _isClosing, false);
    __privateSet(this, _isActive, false);
    createEvent(this.el, "lightbox.closed");
  } else if (__privateGet(this, _isOpening)) {
    __privateSet(this, _isOpening, false);
    createEvent(this.el, "lightbox.opened");
  }
};
_handleKeyUp = new WeakSet();
handleKeyUp_fn = function(e) {
  if (e.key === "Escape" && (__privateGet(this, _isOpening) || __privateGet(this, _isActive)))
    this.close();
};
_handleScroll = new WeakSet();
handleScroll_fn = function() {
  if (__privateGet(this, _isActive) || __privateGet(this, _isOpening))
    this.close();
};
_handleResize = new WeakMap();
_clearLightbox = new WeakSet();
clearLightbox_fn = function() {
  this.el.classList.remove("active");
  __privateMethod(this, _unsetOverlay, unsetOverlay_fn).call(this);
  __privateMethod(this, _unsetOverflowParents, unsetOverflowParents_fn).call(this);
  if (__privateGet(this, _isResponsive))
    this.el.classList.add("responsive-media");
  __privateGet(this, _container).removeAttribute("style");
  this.el.style.position = "";
  this.el.style.left = "";
  this.el.style.top = "";
  this.el.style.width = "";
  this.el.style.height = "";
  this.el.style.transform = "";
};
_onClickTrigger = new WeakSet();
onClickTrigger_fn = function() {
  if (__privateGet(this, _isOpening) || __privateGet(this, _isActive)) {
    this.close();
    return;
  }
  this.open();
};
__publicField(Lightbox, "getDefaultOptions", () => LightboxOptions);
registerComponent({
  class: Lightbox,
  name: "Lightbox",
  dataDetection: true,
  autoInit: {
    enabled: true,
    selector: ".lightbox"
  }
});
export { Lightbox as default };

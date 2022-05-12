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
var _tooltip, _positionList, _listenerEnterRef, _listenerLeaveRef, _listenerResizeRef, _timeoutRef, _elRect, _tooltipRect, _setProperties, setProperties_fn, _setBasicPosition, setBasicPosition_fn, _manualTransform, manualTransform_fn, _onHover, onHover_fn, _onHoverOut, onHoverOut_fn;
var tooltip = "";
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
const TooltipOptions = {
  content: "",
  animationDelay: 0,
  offset: "10px",
  animationDuration: 200,
  classes: "grey dark-4 light-shadow-2 p-2",
  position: "top"
};
class Tooltip extends AxentixComponent {
  constructor(element, options) {
    super();
    __privateAdd(this, _setProperties);
    __privateAdd(this, _setBasicPosition);
    __privateAdd(this, _manualTransform);
    __privateAdd(this, _onHover);
    __privateAdd(this, _onHoverOut);
    __publicField(this, "options");
    __privateAdd(this, _tooltip, void 0);
    __privateAdd(this, _positionList, void 0);
    __privateAdd(this, _listenerEnterRef, void 0);
    __privateAdd(this, _listenerLeaveRef, void 0);
    __privateAdd(this, _listenerResizeRef, void 0);
    __privateAdd(this, _timeoutRef, void 0);
    __privateAdd(this, _elRect, void 0);
    __privateAdd(this, _tooltipRect, void 0);
    try {
      this.preventDbInstance(element);
      instances.push({ type: "Tooltip", instance: this });
      this.el = document.querySelector(element);
      this.options = getComponentOptions("Tooltip", options, this.el);
      this.setup();
    } catch (error) {
      console.error("[Axentix] Tooltip init error", error);
    }
  }
  setup() {
    if (!this.options.content)
      return console.error(`Tooltip #${this.el.id} : empty content.`);
    createEvent(this.el, "tooltip.setup");
    this.options.position = this.options.position.toLowerCase();
    const tooltips = document.querySelectorAll(".tooltip");
    tooltips.forEach((tooltip2) => {
      if (tooltip2.dataset.tooltipId && tooltip2.dataset.tooltipId === this.el.id)
        __privateSet(this, _tooltip, tooltip2);
    });
    if (!__privateGet(this, _tooltip))
      __privateSet(this, _tooltip, document.createElement("div"));
    if (__privateGet(this, _tooltip).dataset.tooltipId !== this.el.id)
      __privateGet(this, _tooltip).dataset.tooltipId = this.el.id;
    __privateMethod(this, _setProperties, setProperties_fn).call(this);
    document.body.appendChild(__privateGet(this, _tooltip));
    __privateSet(this, _positionList, ["right", "left", "top", "bottom"]);
    if (!__privateGet(this, _positionList).includes(this.options.position))
      this.options.position = "top";
    this.setupListeners();
    this.updatePosition();
    __privateGet(this, _tooltip).style.display = "none";
  }
  setupListeners() {
    __privateSet(this, _listenerEnterRef, __privateMethod(this, _onHover, onHover_fn).bind(this));
    __privateSet(this, _listenerLeaveRef, __privateMethod(this, _onHoverOut, onHoverOut_fn).bind(this));
    __privateSet(this, _listenerResizeRef, this.updatePosition.bind(this));
    this.el.addEventListener("mouseenter", __privateGet(this, _listenerEnterRef));
    this.el.addEventListener("mouseleave", __privateGet(this, _listenerLeaveRef));
    window.addEventListener("resize", __privateGet(this, _listenerResizeRef));
  }
  removeListeners() {
    this.el.removeEventListener("mouseenter", __privateGet(this, _listenerEnterRef));
    this.el.removeEventListener("mouseleave", __privateGet(this, _listenerLeaveRef));
    window.removeEventListener("resize", __privateGet(this, _listenerResizeRef));
    __privateSet(this, _listenerEnterRef, void 0);
    __privateSet(this, _listenerLeaveRef, void 0);
    __privateSet(this, _listenerResizeRef, void 0);
  }
  updatePosition() {
    __privateSet(this, _elRect, this.el.getBoundingClientRect());
    __privateMethod(this, _setBasicPosition, setBasicPosition_fn).call(this);
    __privateSet(this, _tooltipRect, __privateGet(this, _tooltip).getBoundingClientRect());
    __privateMethod(this, _manualTransform, manualTransform_fn).call(this);
  }
  show() {
    __privateGet(this, _tooltip).style.display = "block";
    this.updatePosition();
    clearTimeout(__privateGet(this, _timeoutRef));
    __privateSet(this, _timeoutRef, setTimeout(() => {
      createEvent(this.el, "tooltip.show");
      const negativity = this.options.position == "top" || this.options.position == "left" ? "-" : "";
      const verticality = this.options.position == "top" || this.options.position == "bottom" ? "Y" : "X";
      __privateGet(this, _tooltip).style.transform = `translate${verticality}(${negativity}${this.options.offset})`;
      __privateGet(this, _tooltip).style.opacity = "1";
    }, this.options.animationDelay));
  }
  hide() {
    createEvent(this.el, "tooltip.hide");
    clearTimeout(__privateGet(this, _timeoutRef));
    __privateGet(this, _tooltip).style.transform = "translate(0)";
    __privateGet(this, _tooltip).style.opacity = "0";
    __privateSet(this, _timeoutRef, setTimeout(() => {
      __privateGet(this, _tooltip).style.display = "none";
    }, this.options.animationDuration));
  }
  change(options) {
    this.options = getComponentOptions("Tooltip", options, this.el);
    if (!__privateGet(this, _positionList).includes(this.options.position))
      this.options.position = "top";
    __privateMethod(this, _setProperties, setProperties_fn).call(this);
    this.updatePosition();
  }
}
_tooltip = new WeakMap();
_positionList = new WeakMap();
_listenerEnterRef = new WeakMap();
_listenerLeaveRef = new WeakMap();
_listenerResizeRef = new WeakMap();
_timeoutRef = new WeakMap();
_elRect = new WeakMap();
_tooltipRect = new WeakMap();
_setProperties = new WeakSet();
setProperties_fn = function() {
  __privateGet(this, _tooltip).style.transform = "translate(0)";
  __privateGet(this, _tooltip).style.opacity = "0";
  __privateGet(this, _tooltip).className = "tooltip " + this.options.classes;
  __privateGet(this, _tooltip).style.transitionDuration = this.options.animationDuration + "ms";
  __privateGet(this, _tooltip).innerHTML = this.options.content;
};
_setBasicPosition = new WeakSet();
setBasicPosition_fn = function() {
  const isVerticalSide = this.options.position == "top" || this.options.position == "bottom";
  if (isVerticalSide) {
    const top = this.options.position === "top" ? __privateGet(this, _elRect).top : __privateGet(this, _elRect).top + __privateGet(this, _elRect).height;
    __privateGet(this, _tooltip).style.top = top + "px";
  } else if (this.options.position == "right") {
    __privateGet(this, _tooltip).style.left = __privateGet(this, _elRect).left + __privateGet(this, _elRect).width + "px";
  }
};
_manualTransform = new WeakSet();
manualTransform_fn = function() {
  const isVerticalSide = this.options.position == "top" || this.options.position == "bottom";
  if (isVerticalSide) {
    __privateGet(this, _tooltip).style.left = __privateGet(this, _elRect).left + __privateGet(this, _elRect).width / 2 - __privateGet(this, _tooltipRect).width / 2 + "px";
  } else {
    __privateGet(this, _tooltip).style.top = __privateGet(this, _elRect).top + __privateGet(this, _elRect).height / 2 - __privateGet(this, _tooltipRect).height / 2 + "px";
  }
  if (this.options.position == "top") {
    __privateGet(this, _tooltip).style.top = __privateGet(this, _tooltipRect).top - __privateGet(this, _tooltipRect).height + "px";
  } else if (this.options.position == "left") {
    __privateGet(this, _tooltip).style.left = __privateGet(this, _elRect).left - __privateGet(this, _tooltipRect).width + "px";
  }
  const scrollY = window.scrollY;
  const tooltipTop = parseFloat(__privateGet(this, _tooltip).style.top);
  if (this.options.position === "top")
    __privateGet(this, _tooltip).style.top = scrollY * 2 + tooltipTop + "px";
  else
    __privateGet(this, _tooltip).style.top = scrollY + tooltipTop + "px";
};
_onHover = new WeakSet();
onHover_fn = function(e) {
  e.preventDefault();
  this.show();
};
_onHoverOut = new WeakSet();
onHoverOut_fn = function(e) {
  e.preventDefault();
  this.hide();
};
__publicField(Tooltip, "getDefaultOptions", () => TooltipOptions);
registerComponent({
  class: Tooltip,
  name: "Tooltip",
  dataDetection: true
});
export { Tooltip as default };

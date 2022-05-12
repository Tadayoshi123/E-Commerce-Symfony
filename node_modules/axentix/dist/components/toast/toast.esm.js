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
var _content, _toasters, _createToaster, createToaster_fn, _removeToaster, removeToaster_fn, _fadeInToast, fadeInToast_fn, _fadeOutToast, fadeOutToast_fn, _animOut, animOut_fn, _createToast, createToast_fn, _hide, hide_fn;
var toast = "";
const instances = [];
const config = {
  components: [],
  plugins: [],
  prefix: "ax",
  mode: ""
};
const getCssVar = (variable) => `--${config.prefix}-${variable}`;
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
const createEvent = (element, eventName, extraData) => {
  const event = new CustomEvent("ax." + eventName, {
    detail: extraData || {},
    bubbles: true
  });
  element.dispatchEvent(event);
};
const getInstanceByType = (type) => instances.filter((ins) => ins.type === type).map((ins) => ins.instance);
const ToastOptions = {
  animationDuration: 400,
  duration: 4e3,
  classes: "",
  position: "right",
  direction: "top",
  mobileDirection: "bottom",
  offset: { x: "5%", y: "0%", mobileX: "10%", mobileY: "0%" },
  isClosable: false,
  closableContent: "x",
  loading: {
    enabled: true,
    border: "2px solid #E2E2E2"
  }
};
const _Toast = class {
  constructor(content, options) {
    __privateAdd(this, _createToaster);
    __privateAdd(this, _removeToaster);
    __privateAdd(this, _fadeInToast);
    __privateAdd(this, _fadeOutToast);
    __privateAdd(this, _animOut);
    __privateAdd(this, _createToast);
    __privateAdd(this, _hide);
    __publicField(this, "options");
    __publicField(this, "id");
    __privateAdd(this, _content, void 0);
    __privateAdd(this, _toasters, void 0);
    if (getInstanceByType("Toast").length > 0) {
      console.error("[Axentix] Toast: Don't try to create multiple toast instances");
      return;
    }
    instances.push({ type: "Toast", instance: this });
    this.id = Math.random().toString().split(".")[1];
    __privateSet(this, _content, content);
    this.options = extend(_Toast.getDefaultOptions(), options);
    this.options.position = this.options.position.toLowerCase();
    this.options.direction = this.options.direction.toLowerCase();
    this.options.mobileDirection = this.options.mobileDirection.toLowerCase();
    __privateSet(this, _toasters, {});
  }
  destroy() {
    const index = instances.findIndex((ins) => ins.instance.id === this.id);
    instances.splice(index, 1);
  }
  show() {
    try {
      if (!Object.keys(__privateGet(this, _toasters)).includes(this.options.position))
        __privateMethod(this, _createToaster, createToaster_fn).call(this);
      __privateMethod(this, _createToast, createToast_fn).call(this);
    } catch (error) {
      console.error("[Axentix] Toast error", error);
    }
  }
  change(content, options) {
    __privateSet(this, _content, content);
    this.options = extend(this.options, options);
  }
};
let Toast = _Toast;
_content = new WeakMap();
_toasters = new WeakMap();
_createToaster = new WeakSet();
createToaster_fn = function() {
  let toaster = document.createElement("div");
  const positionList = ["right", "left"];
  if (!positionList.includes(this.options.position))
    this.options.position = "right";
  if (this.options.position === "right")
    toaster.style.right = this.options.offset.x;
  else
    toaster.style.left = this.options.offset.x;
  const directionList = ["bottom", "top"];
  if (!directionList.includes(this.options.direction))
    this.options.direction = "top";
  if (this.options.direction === "top")
    toaster.style.top = this.options.offset.y;
  else
    toaster.style.bottom = this.options.offset.y;
  if (!directionList.includes(this.options.mobileDirection))
    this.options.mobileDirection = "bottom";
  toaster.style.setProperty(getCssVar("toaster-m-width"), 100 - this.options.offset.mobileX.slice(0, -1) + "%");
  toaster.style.setProperty(getCssVar("toaster-m-offset"), this.options.offset.mobileY);
  if (this.options.loading.enabled)
    toaster.style.setProperty(getCssVar("toast-loading-border"), this.options.loading.border);
  toaster.className = `toaster toaster-${this.options.position} toast-${this.options.direction} toaster-m-${this.options.mobileDirection}`;
  __privateGet(this, _toasters)[this.options.position] = toaster;
  document.body.appendChild(toaster);
};
_removeToaster = new WeakSet();
removeToaster_fn = function() {
  for (const key in __privateGet(this, _toasters)) {
    let toaster = __privateGet(this, _toasters)[key];
    if (toaster.childElementCount <= 0) {
      toaster.remove();
      delete __privateGet(this, _toasters)[key];
    }
  }
};
_fadeInToast = new WeakSet();
fadeInToast_fn = function(toast2) {
  setTimeout(() => {
    createEvent(toast2, "toast.show");
    if (this.options.loading.enabled) {
      toast2.classList.add("toast-loading");
      toast2.style.setProperty(getCssVar("toast-loading-duration"), this.options.duration + "ms");
    }
    toast2.classList.add("toast-animated");
    setTimeout(() => {
      createEvent(toast2, "toast.shown");
      if (this.options.loading.enabled)
        toast2.classList.add("toast-load");
    }, this.options.animationDuration);
  }, 50);
};
_fadeOutToast = new WeakSet();
fadeOutToast_fn = function(toast2) {
  setTimeout(() => {
    createEvent(toast2, "toast.hide");
    __privateMethod(this, _hide, hide_fn).call(this, toast2);
  }, this.options.duration + this.options.animationDuration);
};
_animOut = new WeakSet();
animOut_fn = function(toast2) {
  toast2.style.transitionTimingFunction = "cubic-bezier(0.445, 0.05, 0.55, 0.95)";
  toast2.style.paddingTop = "0";
  toast2.style.paddingBottom = "0";
  toast2.style.margin = "0";
  toast2.style.height = "0";
};
_createToast = new WeakSet();
createToast_fn = function() {
  let toast2 = document.createElement("div");
  toast2.className = "toast shadow-1 " + this.options.classes;
  toast2.innerHTML = __privateGet(this, _content);
  toast2.style.transitionDuration = this.options.animationDuration + "ms";
  if (this.options.isClosable) {
    let trigger = document.createElement("div");
    trigger.className = "toast-trigger";
    trigger.innerHTML = this.options.closableContent;
    trigger.listenerRef = __privateMethod(this, _hide, hide_fn).bind(this, toast2, trigger);
    trigger.addEventListener("click", trigger.listenerRef);
    toast2.appendChild(trigger);
  }
  __privateMethod(this, _fadeInToast, fadeInToast_fn).call(this, toast2);
  __privateGet(this, _toasters)[this.options.position].appendChild(toast2);
  __privateMethod(this, _fadeOutToast, fadeOutToast_fn).call(this, toast2);
  const height = toast2.clientHeight;
  toast2.style.height = height + "px";
};
_hide = new WeakSet();
hide_fn = function(toast2, trigger, e) {
  if (toast2.isAnimated)
    return;
  let timer = 1;
  if (e) {
    e.preventDefault();
    timer = 0;
    if (this.options.isClosable)
      trigger.removeEventListener("click", trigger.listenerRef);
  }
  toast2.style.opacity = "0";
  toast2.isAnimated = true;
  const delay = timer * this.options.animationDuration + this.options.animationDuration;
  setTimeout(() => {
    __privateMethod(this, _animOut, animOut_fn).call(this, toast2);
  }, delay / 2);
  setTimeout(() => {
    toast2.remove();
    createEvent(toast2, "toast.remove");
    __privateMethod(this, _removeToaster, removeToaster_fn).call(this);
  }, delay * 1.45);
};
__publicField(Toast, "getDefaultOptions", () => ToastOptions);
registerComponent({
  class: Toast,
  name: "Toast"
});
export { Toast as default };

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
var _tabArrow, _tabLinks, _tabMenu, _currentItemIndex, _leftArrow, _rightArrow, _scrollLeftRef, _scrollRightRef, _arrowRef, _caroulixSlideRef, _resizeTabRef, _tabItems, _tabCaroulix, _tabCaroulixInit, _caroulixInstance, _isAnimated, _handleResizeEvent, handleResizeEvent_fn, _handleCaroulixSlide, handleCaroulixSlide_fn, _getItems, getItems_fn, _hideContent, hideContent_fn, _enableSlideAnimation, enableSlideAnimation_fn, _setActiveElement, setActiveElement_fn, _toggleArrowMode, toggleArrowMode_fn, _scrollLeft, scrollLeft_fn, _scrollRight, scrollRight_fn, _onClickItem, onClickItem_fn, _getPreviousItemIndex, getPreviousItemIndex_fn, _getNextItemIndex, getNextItemIndex_fn;
var tab = "";
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
const TabOptions = {
  animationDuration: 300,
  animationType: "none",
  disableActiveBar: false,
  caroulix: {
    animationDuration: 300,
    backToOpposite: false,
    enableTouch: false,
    autoplay: {
      enabled: false
    }
  }
};
class Tab extends AxentixComponent {
  constructor(element, options) {
    super();
    __privateAdd(this, _handleResizeEvent);
    __privateAdd(this, _handleCaroulixSlide);
    __privateAdd(this, _getItems);
    __privateAdd(this, _hideContent);
    __privateAdd(this, _enableSlideAnimation);
    __privateAdd(this, _setActiveElement);
    __privateAdd(this, _toggleArrowMode);
    __privateAdd(this, _scrollLeft);
    __privateAdd(this, _scrollRight);
    __privateAdd(this, _onClickItem);
    __privateAdd(this, _getPreviousItemIndex);
    __privateAdd(this, _getNextItemIndex);
    __publicField(this, "options");
    __privateAdd(this, _tabArrow, void 0);
    __privateAdd(this, _tabLinks, void 0);
    __privateAdd(this, _tabMenu, void 0);
    __privateAdd(this, _currentItemIndex, 0);
    __privateAdd(this, _leftArrow, void 0);
    __privateAdd(this, _rightArrow, void 0);
    __privateAdd(this, _scrollLeftRef, void 0);
    __privateAdd(this, _scrollRightRef, void 0);
    __privateAdd(this, _arrowRef, void 0);
    __privateAdd(this, _caroulixSlideRef, void 0);
    __privateAdd(this, _resizeTabRef, void 0);
    __privateAdd(this, _tabItems, void 0);
    __privateAdd(this, _tabCaroulix, void 0);
    __privateAdd(this, _tabCaroulixInit, false);
    __privateAdd(this, _caroulixInstance, void 0);
    __privateAdd(this, _isAnimated, false);
    try {
      this.preventDbInstance(element);
      instances.push({ type: "Tab", instance: this });
      this.el = document.querySelector(element);
      this.options = getComponentOptions("Tab", options, this.el);
      this.setup();
    } catch (error) {
      console.error("[Axentix] Tab init error", error);
    }
  }
  setup() {
    createEvent(this.el, "tab.setup");
    const animationList = ["none", "slide"];
    if (!animationList.includes(this.options.animationType))
      this.options.animationType = "none";
    __privateSet(this, _isAnimated, false);
    __privateSet(this, _tabArrow, this.el.querySelector(".tab-arrow"));
    __privateSet(this, _tabLinks, this.el.querySelectorAll(".tab-menu .tab-link"));
    __privateSet(this, _tabMenu, this.el.querySelector(".tab-menu"));
    __privateSet(this, _currentItemIndex, 0);
    __privateSet(this, _tabItems, __privateMethod(this, _getItems, getItems_fn).call(this));
    if (__privateGet(this, _tabArrow)) {
      __privateMethod(this, _toggleArrowMode, toggleArrowMode_fn).call(this);
      __privateSet(this, _leftArrow, this.el.querySelector(".tab-arrow .tab-prev"));
      __privateSet(this, _rightArrow, this.el.querySelector(".tab-arrow .tab-next"));
    }
    this.setupListeners();
    __privateGet(this, _tabMenu).style.transitionDuration = this.options.animationDuration + "ms";
    if (this.options.animationType === "slide")
      __privateMethod(this, _enableSlideAnimation, enableSlideAnimation_fn).call(this);
    else
      this.updateActiveElement();
  }
  setupListeners() {
    __privateGet(this, _tabLinks).forEach((item) => {
      item.listenerRef = __privateMethod(this, _onClickItem, onClickItem_fn).bind(this, item);
      item.addEventListener("click", item.listenerRef);
    });
    __privateSet(this, _resizeTabRef, __privateMethod(this, _handleResizeEvent, handleResizeEvent_fn).bind(this));
    window.addEventListener("resize", __privateGet(this, _resizeTabRef));
    if (__privateGet(this, _tabArrow)) {
      __privateSet(this, _arrowRef, __privateMethod(this, _toggleArrowMode, toggleArrowMode_fn).bind(this));
      window.addEventListener("resize", __privateGet(this, _arrowRef));
      __privateSet(this, _scrollLeftRef, __privateMethod(this, _scrollLeft, scrollLeft_fn).bind(this));
      __privateSet(this, _scrollRightRef, __privateMethod(this, _scrollRight, scrollRight_fn).bind(this));
      __privateGet(this, _leftArrow).addEventListener("click", __privateGet(this, _scrollLeftRef));
      __privateGet(this, _rightArrow).addEventListener("click", __privateGet(this, _scrollRightRef));
    }
  }
  removeListeners() {
    __privateGet(this, _tabLinks).forEach((item) => {
      item.removeEventListener("click", item.listenerRef);
      item.listenerRef = void 0;
    });
    window.removeEventListener("resize", __privateGet(this, _resizeTabRef));
    __privateSet(this, _resizeTabRef, void 0);
    if (__privateGet(this, _tabArrow)) {
      window.removeEventListener("resize", __privateGet(this, _arrowRef));
      __privateSet(this, _arrowRef, void 0);
      __privateGet(this, _leftArrow).removeEventListener("click", __privateGet(this, _scrollLeftRef));
      __privateGet(this, _rightArrow).removeEventListener("click", __privateGet(this, _scrollRightRef));
      __privateSet(this, _scrollLeftRef, void 0);
      __privateSet(this, _scrollRightRef, void 0);
    }
    if (__privateGet(this, _caroulixSlideRef)) {
      this.el.removeEventListener("ax.caroulix.slide", __privateGet(this, _caroulixSlideRef));
      __privateSet(this, _caroulixSlideRef, void 0);
    }
  }
  select(itemId) {
    if (__privateGet(this, _isAnimated))
      return;
    __privateSet(this, _isAnimated, true);
    const menuItem = this.el.querySelector('.tab-menu a[href="#' + itemId + '"]');
    __privateSet(this, _currentItemIndex, Array.from(__privateGet(this, _tabLinks)).findIndex((item) => item.children[0] === menuItem));
    createEvent(menuItem, "tab.select", { currentIndex: __privateGet(this, _currentItemIndex) });
    __privateMethod(this, _setActiveElement, setActiveElement_fn).call(this, menuItem.parentElement);
    if (__privateGet(this, _tabCaroulixInit)) {
      __privateGet(this, _tabItems).forEach((item) => item.id === itemId ? item.classList.add("active") : "");
      const caroulixClass = getComponentClass("Caroulix");
      __privateSet(this, _caroulixInstance, new caroulixClass("#" + __privateGet(this, _tabCaroulix).id, this.options.caroulix, this.el, true));
      __privateSet(this, _caroulixSlideRef, __privateMethod(this, _handleCaroulixSlide, handleCaroulixSlide_fn).bind(this));
      this.el.addEventListener("ax.caroulix.slide", __privateGet(this, _caroulixSlideRef));
      __privateSet(this, _tabCaroulixInit, false);
      __privateSet(this, _isAnimated, false);
      return;
    }
    if (this.options.animationType === "slide") {
      const nb = __privateGet(this, _tabItems).findIndex((item) => item.id === itemId);
      __privateGet(this, _caroulixInstance).goTo(nb);
      setTimeout(() => {
        __privateSet(this, _isAnimated, false);
      }, this.options.animationDuration);
    } else {
      __privateMethod(this, _hideContent, hideContent_fn).call(this);
      __privateGet(this, _tabItems).forEach((item) => {
        if (item.id === itemId)
          item.style.display = "block";
      });
      __privateSet(this, _isAnimated, false);
    }
  }
  updateActiveElement() {
    let itemSelected;
    __privateGet(this, _tabLinks).forEach((item, index) => {
      if (item.classList.contains("active")) {
        itemSelected = item;
        __privateSet(this, _currentItemIndex, index);
      }
    });
    if (!itemSelected) {
      itemSelected = __privateGet(this, _tabLinks).item(0);
      __privateSet(this, _currentItemIndex, 0);
    }
    const target = itemSelected.children[0].getAttribute("href");
    this.select(target.split("#")[1]);
  }
  prev(step = 1) {
    if (__privateGet(this, _isAnimated))
      return;
    const previousItemIndex = __privateMethod(this, _getPreviousItemIndex, getPreviousItemIndex_fn).call(this, step);
    __privateSet(this, _currentItemIndex, previousItemIndex);
    createEvent(this.el, "tab.prev", { step });
    const target = __privateGet(this, _tabLinks)[previousItemIndex].children[0].getAttribute("href");
    this.select(target.split("#")[1]);
  }
  next(step = 1) {
    if (__privateGet(this, _isAnimated))
      return;
    const nextItemIndex = __privateMethod(this, _getNextItemIndex, getNextItemIndex_fn).call(this, step);
    __privateSet(this, _currentItemIndex, nextItemIndex);
    createEvent(this.el, "tab.next", { step });
    const target = __privateGet(this, _tabLinks)[nextItemIndex].children[0].getAttribute("href");
    this.select(target.split("#")[1]);
  }
}
_tabArrow = new WeakMap();
_tabLinks = new WeakMap();
_tabMenu = new WeakMap();
_currentItemIndex = new WeakMap();
_leftArrow = new WeakMap();
_rightArrow = new WeakMap();
_scrollLeftRef = new WeakMap();
_scrollRightRef = new WeakMap();
_arrowRef = new WeakMap();
_caroulixSlideRef = new WeakMap();
_resizeTabRef = new WeakMap();
_tabItems = new WeakMap();
_tabCaroulix = new WeakMap();
_tabCaroulixInit = new WeakMap();
_caroulixInstance = new WeakMap();
_isAnimated = new WeakMap();
_handleResizeEvent = new WeakSet();
handleResizeEvent_fn = function() {
  this.updateActiveElement();
  for (let i = 100; i < 500; i += 100) {
    setTimeout(() => {
      this.updateActiveElement();
    }, i);
  }
};
_handleCaroulixSlide = new WeakSet();
handleCaroulixSlide_fn = function() {
  if (__privateGet(this, _currentItemIndex) !== __privateGet(this, _caroulixInstance).activeIndex) {
    __privateSet(this, _currentItemIndex, __privateGet(this, _caroulixInstance).activeIndex);
    __privateMethod(this, _setActiveElement, setActiveElement_fn).call(this, __privateGet(this, _tabLinks)[__privateGet(this, _currentItemIndex)]);
  }
};
_getItems = new WeakSet();
getItems_fn = function() {
  return Array.from(__privateGet(this, _tabLinks)).map((link) => {
    const id = link.children[0].getAttribute("href");
    return this.el.querySelector(id);
  });
};
_hideContent = new WeakSet();
hideContent_fn = function() {
  __privateGet(this, _tabItems).forEach((item) => item.style.display = "none");
};
_enableSlideAnimation = new WeakSet();
enableSlideAnimation_fn = function() {
  __privateGet(this, _tabItems).forEach((item) => item.classList.add("caroulix-item"));
  __privateSet(this, _tabCaroulix, wrap(__privateGet(this, _tabItems)));
  __privateGet(this, _tabCaroulix).classList.add("caroulix");
  const nb = Math.random().toString().split(".")[1];
  __privateGet(this, _tabCaroulix).id = "tab-caroulix-" + nb;
  __privateSet(this, _tabCaroulixInit, true);
  if (this.options.animationDuration !== 300)
    this.options.caroulix.animationDuration = this.options.animationDuration;
  this.updateActiveElement();
};
_setActiveElement = new WeakSet();
setActiveElement_fn = function(element) {
  __privateGet(this, _tabLinks).forEach((item) => item.classList.remove("active"));
  if (!this.options.disableActiveBar) {
    const elementRect = element.getBoundingClientRect();
    const elementPosLeft = elementRect.left;
    const menuPosLeft = __privateGet(this, _tabMenu).getBoundingClientRect().left;
    const left = elementPosLeft - menuPosLeft + __privateGet(this, _tabMenu).scrollLeft;
    const elementWidth = elementRect.width;
    const right = __privateGet(this, _tabMenu).clientWidth - left - elementWidth;
    __privateGet(this, _tabMenu).style.setProperty(getCssVar("tab-bar-left-offset"), Math.floor(left) + "px");
    __privateGet(this, _tabMenu).style.setProperty(getCssVar("tab-bar-right-offset"), Math.ceil(right) + "px");
  }
  element.classList.add("active");
};
_toggleArrowMode = new WeakSet();
toggleArrowMode_fn = function() {
  const totalWidth = Array.from(__privateGet(this, _tabLinks)).reduce((acc, element) => {
    acc += element.clientWidth;
    return acc;
  }, 0);
  const arrowWidth = __privateGet(this, _tabArrow).clientWidth;
  if (totalWidth > arrowWidth) {
    if (!__privateGet(this, _tabArrow).classList.contains("tab-arrow-show"))
      __privateGet(this, _tabArrow).classList.add("tab-arrow-show");
  } else {
    if (__privateGet(this, _tabArrow).classList.contains("tab-arrow-show"))
      __privateGet(this, _tabArrow).classList.remove("tab-arrow-show");
  }
};
_scrollLeft = new WeakSet();
scrollLeft_fn = function(e) {
  e.preventDefault();
  __privateGet(this, _tabMenu).scrollLeft -= 40;
};
_scrollRight = new WeakSet();
scrollRight_fn = function(e) {
  e.preventDefault();
  __privateGet(this, _tabMenu).scrollLeft += 40;
};
_onClickItem = new WeakSet();
onClickItem_fn = function(item, e) {
  e.preventDefault();
  if (__privateGet(this, _isAnimated) || item.classList.contains("active"))
    return;
  const target = item.children[0].getAttribute("href");
  this.select(target.split("#")[1]);
};
_getPreviousItemIndex = new WeakSet();
getPreviousItemIndex_fn = function(step) {
  let previousItemIndex = 0;
  let index = __privateGet(this, _currentItemIndex);
  for (let i = 0; i < step; i++) {
    if (index > 0) {
      previousItemIndex = index - 1;
      index--;
    } else {
      index = __privateGet(this, _tabLinks).length - 1;
      previousItemIndex = index;
    }
  }
  return previousItemIndex;
};
_getNextItemIndex = new WeakSet();
getNextItemIndex_fn = function(step) {
  let nextItemIndex = 0;
  let index = __privateGet(this, _currentItemIndex);
  for (let i = 0; i < step; i++) {
    if (index < __privateGet(this, _tabLinks).length - 1) {
      nextItemIndex = index + 1;
      index++;
    } else {
      index = 0;
      nextItemIndex = index;
    }
  }
  return nextItemIndex;
};
__publicField(Tab, "getDefaultOptions", () => TabOptions);
registerComponent({
  class: Tab,
  name: "Tab",
  dataDetection: true,
  autoInit: {
    enabled: true,
    selector: ".tab"
  }
});
export { Tab as default };

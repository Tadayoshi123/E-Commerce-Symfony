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
var __privateWrapper = (obj, member, setter, getter) => {
  return {
    set _(value) {
      __privateSet(obj, member, value, setter);
    },
    get _() {
      return __privateGet(obj, member, getter);
    }
  };
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var _draggedPositionX, _isAnimated, _children, _totalMediaToLoad, _loadedMediaCount, _isResizing, _isScrolling, _isPressed, _deltaX, _deltaY, _windowResizeRef, _arrowPrev, _arrowNext, _arrowNextRef, _arrowPrevRef, _touchStartRef, _touchMoveRef, _touchReleaseRef, _xStart, _yStart, _indicators, _autoplayInterval, _pointerType, _getChildren, getChildren_fn, _waitForLoad, waitForLoad_fn, _newItemLoaded, newItemLoaded_fn, _setItemsPosition, setItemsPosition_fn, _setBasicCaroulixHeight, setBasicCaroulixHeight_fn, _handleDragStart, handleDragStart_fn, _handleDragMove, handleDragMove_fn, _handleDragRelease, handleDragRelease_fn, _enableIndicators, enableIndicators_fn, _handleIndicatorClick, handleIndicatorClick_fn, _resetIndicators, resetIndicators_fn, _getXPosition, getXPosition_fn, _getYPosition, getYPosition_fn, _setTransitionDuration, setTransitionDuration_fn, _emitSlideEvent, emitSlideEvent_fn;
var caroulix = "";
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
const isTouchEnabled = () => "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
const isPointerEnabled = () => !!window.PointerEvent && "maxTouchPoints" in window.navigator && window.navigator.maxTouchPoints >= 0;
const getPointerType = () => {
  if (isTouchEnabled())
    return "touch";
  else if (isPointerEnabled())
    return "pointer";
  return "mouse";
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
const CaroulixOptions = {
  animationDuration: 500,
  height: "",
  backToOpposite: true,
  enableTouch: true,
  indicators: {
    enabled: false,
    isFlat: false,
    customClasses: ""
  },
  autoplay: {
    enabled: true,
    interval: 5e3,
    side: "right"
  }
};
class Caroulix extends AxentixComponent {
  constructor(element, options) {
    super();
    __privateAdd(this, _getChildren);
    __privateAdd(this, _waitForLoad);
    __privateAdd(this, _newItemLoaded);
    __privateAdd(this, _setItemsPosition);
    __privateAdd(this, _setBasicCaroulixHeight);
    __privateAdd(this, _handleDragStart);
    __privateAdd(this, _handleDragMove);
    __privateAdd(this, _handleDragRelease);
    __privateAdd(this, _enableIndicators);
    __privateAdd(this, _handleIndicatorClick);
    __privateAdd(this, _resetIndicators);
    __privateAdd(this, _getXPosition);
    __privateAdd(this, _getYPosition);
    __privateAdd(this, _setTransitionDuration);
    __privateAdd(this, _emitSlideEvent);
    __publicField(this, "options");
    __publicField(this, "activeIndex");
    __privateAdd(this, _draggedPositionX, 0);
    __privateAdd(this, _isAnimated, false);
    __privateAdd(this, _children, void 0);
    __privateAdd(this, _totalMediaToLoad, 0);
    __privateAdd(this, _loadedMediaCount, 0);
    __privateAdd(this, _isResizing, false);
    __privateAdd(this, _isScrolling, false);
    __privateAdd(this, _isPressed, false);
    __privateAdd(this, _deltaX, 0);
    __privateAdd(this, _deltaY, 0);
    __privateAdd(this, _windowResizeRef, void 0);
    __privateAdd(this, _arrowPrev, void 0);
    __privateAdd(this, _arrowNext, void 0);
    __privateAdd(this, _arrowNextRef, void 0);
    __privateAdd(this, _arrowPrevRef, void 0);
    __privateAdd(this, _touchStartRef, void 0);
    __privateAdd(this, _touchMoveRef, void 0);
    __privateAdd(this, _touchReleaseRef, void 0);
    __privateAdd(this, _xStart, 0);
    __privateAdd(this, _yStart, 0);
    __privateAdd(this, _indicators, void 0);
    __privateAdd(this, _autoplayInterval, void 0);
    __privateAdd(this, _pointerType, void 0);
    try {
      this.preventDbInstance(element);
      instances.push({ type: "Caroulix", instance: this });
      this.el = document.querySelector(element);
      this.options = getComponentOptions("Caroulix", options, this.el);
      this.setup();
    } catch (error) {
      console.error("[Axentix] Caroulix init error", error);
    }
  }
  setup() {
    createEvent(this.el, "caroulix.setup");
    this.options.autoplay.side = this.options.autoplay.side.toLowerCase();
    const sideList = ["right", "left"];
    if (!sideList.includes(this.options.autoplay.side))
      this.options.autoplay.side = "right";
    this.activeIndex = 0;
    __privateSet(this, _draggedPositionX, 0);
    __privateSet(this, _isAnimated, false);
    __privateSet(this, _pointerType, getPointerType());
    __privateSet(this, _children, __privateMethod(this, _getChildren, getChildren_fn).call(this));
    if (this.options.indicators.enabled)
      __privateMethod(this, _enableIndicators, enableIndicators_fn).call(this);
    const activeEl = this.el.querySelector(".active");
    if (activeEl)
      this.activeIndex = __privateGet(this, _children).indexOf(activeEl);
    else
      __privateGet(this, _children)[0].classList.add("active");
    __privateMethod(this, _waitForLoad, waitForLoad_fn).call(this);
    if (__privateGet(this, _totalMediaToLoad) === 0)
      __privateMethod(this, _setBasicCaroulixHeight, setBasicCaroulixHeight_fn).call(this);
    this.setupListeners();
    if (this.options.autoplay.enabled)
      this.play();
  }
  setupListeners() {
    __privateSet(this, _windowResizeRef, __privateMethod(this, _setBasicCaroulixHeight, setBasicCaroulixHeight_fn).bind(this));
    window.addEventListener("resize", __privateGet(this, _windowResizeRef));
    if (__privateGet(this, _arrowNext)) {
      __privateSet(this, _arrowNextRef, this.next.bind(this, 1));
      __privateGet(this, _arrowNext).addEventListener("click", __privateGet(this, _arrowNextRef));
    }
    if (__privateGet(this, _arrowPrev)) {
      __privateSet(this, _arrowPrevRef, this.prev.bind(this, 1));
      __privateGet(this, _arrowPrev).addEventListener("click", __privateGet(this, _arrowPrevRef));
    }
    if (this.options.enableTouch) {
      __privateSet(this, _touchStartRef, __privateMethod(this, _handleDragStart, handleDragStart_fn).bind(this));
      __privateSet(this, _touchMoveRef, __privateMethod(this, _handleDragMove, handleDragMove_fn).bind(this));
      __privateSet(this, _touchReleaseRef, __privateMethod(this, _handleDragRelease, handleDragRelease_fn).bind(this));
      this.el.addEventListener(`${__privateGet(this, _pointerType)}${__privateGet(this, _pointerType) === "touch" ? "start" : "down"}`, __privateGet(this, _touchStartRef));
      this.el.addEventListener(`${__privateGet(this, _pointerType)}move`, __privateGet(this, _touchMoveRef));
      this.el.addEventListener(`${__privateGet(this, _pointerType)}${__privateGet(this, _pointerType) === "touch" ? "end" : "up"}`, __privateGet(this, _touchReleaseRef));
      this.el.addEventListener(__privateGet(this, _pointerType) === "pointer" ? "pointerleave" : "mouseleave", __privateGet(this, _touchReleaseRef));
    }
  }
  removeListeners() {
    window.removeEventListener("resize", __privateGet(this, _windowResizeRef));
    __privateSet(this, _windowResizeRef, void 0);
    if (__privateGet(this, _arrowNext)) {
      __privateGet(this, _arrowNext).removeEventListener("click", __privateGet(this, _arrowNextRef));
      __privateSet(this, _arrowNextRef, void 0);
    }
    if (__privateGet(this, _arrowPrev)) {
      __privateGet(this, _arrowPrev).removeEventListener("click", __privateGet(this, _arrowPrevRef));
      __privateSet(this, _arrowPrevRef, void 0);
    }
    if (this.options.enableTouch) {
      this.el.removeEventListener(`${__privateGet(this, _pointerType)}${__privateGet(this, _pointerType) === "pointer" ? "down" : "start"}`, __privateGet(this, _touchStartRef));
      this.el.removeEventListener(`${__privateGet(this, _pointerType)}move`, __privateGet(this, _touchMoveRef));
      this.el.removeEventListener(`${__privateGet(this, _pointerType)}${__privateGet(this, _pointerType) === "touch" ? "end" : "up"}`, __privateGet(this, _touchReleaseRef));
      this.el.removeEventListener(__privateGet(this, _pointerType) === "pointer" ? "pointerleave" : "mouseleave", __privateGet(this, _touchReleaseRef));
      __privateSet(this, _touchStartRef, void 0);
      __privateSet(this, _touchMoveRef, void 0);
      __privateSet(this, _touchReleaseRef, void 0);
    }
  }
  goTo(number) {
    if (number === this.activeIndex)
      return;
    const side = number > this.activeIndex ? "right" : "left";
    if (side === "left")
      this.prev(Math.abs(this.activeIndex - number));
    else
      this.next(Math.abs(this.activeIndex - number));
    if (this.options.indicators.enabled)
      __privateMethod(this, _resetIndicators, resetIndicators_fn).call(this);
  }
  play() {
    if (!this.options.autoplay.enabled)
      return;
    this.stop();
    __privateSet(this, _autoplayInterval, setInterval(() => {
      if (this.options.autoplay.side === "right")
        this.next(1, false);
      else
        this.prev(1, false);
    }, this.options.autoplay.interval));
  }
  stop() {
    if (!this.options.autoplay.enabled)
      return;
    clearInterval(__privateGet(this, _autoplayInterval));
  }
  next(step = 1, resetAutoplay = true) {
    if (__privateGet(this, _isResizing) || this.activeIndex === __privateGet(this, _children).length - 1 && !this.options.backToOpposite)
      return;
    createEvent(this.el, "caroulix.next", { step });
    __privateSet(this, _isAnimated, true);
    if (resetAutoplay && this.options.autoplay.enabled)
      this.stop();
    if (this.activeIndex < __privateGet(this, _children).length - 1)
      this.activeIndex += step;
    else if (this.options.backToOpposite)
      this.activeIndex = 0;
    __privateMethod(this, _emitSlideEvent, emitSlideEvent_fn).call(this);
    __privateMethod(this, _setItemsPosition, setItemsPosition_fn).call(this);
    if (resetAutoplay && this.options.autoplay.enabled)
      this.play();
  }
  prev(step = 1, resetAutoplay = true) {
    if (__privateGet(this, _isResizing) || this.activeIndex === 0 && !this.options.backToOpposite)
      return;
    createEvent(this.el, "caroulix.prev", { step });
    __privateSet(this, _isAnimated, true);
    if (resetAutoplay && this.options.autoplay.enabled)
      this.stop();
    if (this.activeIndex > 0)
      this.activeIndex -= step;
    else if (this.options.backToOpposite)
      this.activeIndex = __privateGet(this, _children).length - 1;
    __privateMethod(this, _emitSlideEvent, emitSlideEvent_fn).call(this);
    __privateMethod(this, _setItemsPosition, setItemsPosition_fn).call(this);
    if (resetAutoplay && this.options.autoplay.enabled)
      this.play();
  }
}
_draggedPositionX = new WeakMap();
_isAnimated = new WeakMap();
_children = new WeakMap();
_totalMediaToLoad = new WeakMap();
_loadedMediaCount = new WeakMap();
_isResizing = new WeakMap();
_isScrolling = new WeakMap();
_isPressed = new WeakMap();
_deltaX = new WeakMap();
_deltaY = new WeakMap();
_windowResizeRef = new WeakMap();
_arrowPrev = new WeakMap();
_arrowNext = new WeakMap();
_arrowNextRef = new WeakMap();
_arrowPrevRef = new WeakMap();
_touchStartRef = new WeakMap();
_touchMoveRef = new WeakMap();
_touchReleaseRef = new WeakMap();
_xStart = new WeakMap();
_yStart = new WeakMap();
_indicators = new WeakMap();
_autoplayInterval = new WeakMap();
_pointerType = new WeakMap();
_getChildren = new WeakSet();
getChildren_fn = function() {
  return Array.from(this.el.children).reduce((acc, child) => {
    if (child.classList.contains("caroulix-item"))
      acc.push(child);
    if (child.classList.contains("caroulix-prev"))
      __privateSet(this, _arrowPrev, child);
    if (child.classList.contains("caroulix-next"))
      __privateSet(this, _arrowNext, child);
    return acc;
  }, []);
};
_waitForLoad = new WeakSet();
waitForLoad_fn = function() {
  __privateSet(this, _totalMediaToLoad, 0);
  __privateSet(this, _loadedMediaCount, 0);
  __privateGet(this, _children).forEach((item) => {
    const media = item.querySelector("img, video");
    if (media) {
      __privateWrapper(this, _totalMediaToLoad)._++;
      if (media.complete) {
        __privateMethod(this, _newItemLoaded, newItemLoaded_fn).call(this, media, true);
      } else {
        media.loadRef = __privateMethod(this, _newItemLoaded, newItemLoaded_fn).bind(this, media);
        media.addEventListener("load", media.loadRef);
      }
    }
  });
};
_newItemLoaded = new WeakSet();
newItemLoaded_fn = function(media, alreadyLoad) {
  __privateWrapper(this, _loadedMediaCount)._++;
  if (!alreadyLoad) {
    media.removeEventListener("load", media.loadRef);
    media.loadRef = void 0;
  }
  if (__privateGet(this, _totalMediaToLoad) == __privateGet(this, _loadedMediaCount)) {
    __privateMethod(this, _setBasicCaroulixHeight, setBasicCaroulixHeight_fn).call(this);
    __privateMethod(this, _setItemsPosition, setItemsPosition_fn).call(this, true);
  }
};
_setItemsPosition = new WeakSet();
setItemsPosition_fn = function(init = false) {
  const caroulixWidth = this.el.getBoundingClientRect().width;
  __privateGet(this, _children).forEach((child, index) => {
    child.style.transform = `translateX(${caroulixWidth * index - caroulixWidth * this.activeIndex - __privateGet(this, _draggedPositionX)}px)`;
  });
  if (this.options.indicators.enabled)
    __privateMethod(this, _resetIndicators, resetIndicators_fn).call(this);
  const activeElement = __privateGet(this, _children).find((child) => child.classList.contains("active"));
  activeElement.classList.remove("active");
  __privateGet(this, _children)[this.activeIndex].classList.add("active");
  setTimeout(() => {
    __privateSet(this, _isAnimated, false);
  }, this.options.animationDuration);
  if (init)
    setTimeout(() => __privateMethod(this, _setTransitionDuration, setTransitionDuration_fn).call(this, this.options.animationDuration), 50);
};
_setBasicCaroulixHeight = new WeakSet();
setBasicCaroulixHeight_fn = function() {
  __privateSet(this, _isResizing, true);
  this.el.style.transitionDuration = "";
  if (this.options.autoplay.enabled)
    this.play();
  if (this.options.height) {
    this.el.style.height = this.options.height;
  } else {
    const childrenHeight = __privateGet(this, _children).map((child) => child.offsetHeight);
    const maxHeight = Math.max(...childrenHeight);
    this.el.style.height = maxHeight + "px";
  }
  __privateMethod(this, _setItemsPosition, setItemsPosition_fn).call(this);
  setTimeout(() => {
    this.el.style.transitionDuration = this.options.animationDuration + "ms";
    __privateSet(this, _isResizing, false);
  }, 50);
};
_handleDragStart = new WeakSet();
handleDragStart_fn = function(e) {
  if (e.target.closest(".caroulix-arrow") || e.target.closest(".caroulix-indicators") || __privateGet(this, _isAnimated))
    return;
  if (e.type !== "touchstart")
    e.preventDefault();
  if (this.options.autoplay.enabled)
    this.stop();
  __privateMethod(this, _setTransitionDuration, setTransitionDuration_fn).call(this, 0);
  __privateSet(this, _isPressed, true);
  __privateSet(this, _isScrolling, false);
  __privateSet(this, _deltaX, 0);
  __privateSet(this, _deltaY, 0);
  __privateSet(this, _xStart, __privateMethod(this, _getXPosition, getXPosition_fn).call(this, e));
  __privateSet(this, _yStart, __privateMethod(this, _getYPosition, getYPosition_fn).call(this, e));
};
_handleDragMove = new WeakSet();
handleDragMove_fn = function(e) {
  if (!__privateGet(this, _isPressed) || __privateGet(this, _isScrolling))
    return;
  let x = __privateMethod(this, _getXPosition, getXPosition_fn).call(this, e), y = __privateMethod(this, _getYPosition, getYPosition_fn).call(this, e);
  __privateSet(this, _deltaX, __privateGet(this, _xStart) - x);
  __privateSet(this, _deltaY, Math.abs(__privateGet(this, _yStart) - y));
  if (e.type === "touchmove" && __privateGet(this, _deltaY) > Math.abs(__privateGet(this, _deltaX))) {
    __privateSet(this, _isScrolling, true);
    __privateSet(this, _deltaX, 0);
    return false;
  }
  if (e.cancelable)
    e.preventDefault();
  __privateSet(this, _draggedPositionX, __privateGet(this, _deltaX));
  __privateMethod(this, _setItemsPosition, setItemsPosition_fn).call(this);
};
_handleDragRelease = new WeakSet();
handleDragRelease_fn = function(e) {
  if (e.target.closest(".caroulix-arrow") || e.target.closest(".caroulix-indicators"))
    return;
  if (e.cancelable)
    e.preventDefault();
  if (__privateGet(this, _isPressed)) {
    __privateMethod(this, _setTransitionDuration, setTransitionDuration_fn).call(this, this.options.animationDuration);
    let caroulixWidth = this.el.getBoundingClientRect().width;
    __privateSet(this, _isPressed, false);
    const percent = caroulixWidth * 15 / 100;
    if (this.activeIndex !== __privateGet(this, _children).length - 1 && __privateGet(this, _deltaX) > percent) {
      this.next();
    } else if (this.activeIndex !== 0 && __privateGet(this, _deltaX) < -percent) {
      this.prev();
    }
    __privateSet(this, _deltaX, 0);
    __privateSet(this, _draggedPositionX, 0);
    __privateMethod(this, _setItemsPosition, setItemsPosition_fn).call(this);
    if (this.options.autoplay.enabled)
      this.play();
  }
};
_enableIndicators = new WeakSet();
enableIndicators_fn = function() {
  __privateSet(this, _indicators, document.createElement("ul"));
  __privateGet(this, _indicators).classList.add("caroulix-indicators");
  if (this.options.indicators.isFlat)
    __privateGet(this, _indicators).classList.add("caroulix-flat");
  if (this.options.indicators.customClasses)
    __privateGet(this, _indicators).className = `${__privateGet(this, _indicators).className} ${this.options.indicators.customClasses}`;
  for (let i = 0; i < __privateGet(this, _children).length; i++) {
    const li = document.createElement("li");
    li.triggerRef = __privateMethod(this, _handleIndicatorClick, handleIndicatorClick_fn).bind(this, i);
    li.addEventListener("click", li.triggerRef);
    __privateGet(this, _indicators).appendChild(li);
  }
  this.el.appendChild(__privateGet(this, _indicators));
};
_handleIndicatorClick = new WeakSet();
handleIndicatorClick_fn = function(i, e) {
  e.preventDefault();
  if (i === this.activeIndex)
    return;
  this.goTo(i);
};
_resetIndicators = new WeakSet();
resetIndicators_fn = function() {
  Array.from(__privateGet(this, _indicators).children).forEach((li) => li.removeAttribute("class"));
  __privateGet(this, _indicators).children[this.activeIndex].classList.add("active");
};
_getXPosition = new WeakSet();
getXPosition_fn = function(e) {
  if (e.targetTouches && e.targetTouches.length >= 1)
    return e.targetTouches[0].clientX;
  return e.clientX;
};
_getYPosition = new WeakSet();
getYPosition_fn = function(e) {
  if (e.targetTouches && e.targetTouches.length >= 1)
    return e.targetTouches[0].clientY;
  return e.clientY;
};
_setTransitionDuration = new WeakSet();
setTransitionDuration_fn = function(duration) {
  this.el.style.transitionDuration = duration + "ms";
};
_emitSlideEvent = new WeakSet();
emitSlideEvent_fn = function() {
  createEvent(this.el, "caroulix.slide", {
    nextElement: __privateGet(this, _children)[this.activeIndex],
    currentElement: __privateGet(this, _children)[__privateGet(this, _children).findIndex((child) => child.classList.contains("active"))]
  });
};
__publicField(Caroulix, "getDefaultOptions", () => CaroulixOptions);
registerComponent({
  class: Caroulix,
  name: "Caroulix",
  dataDetection: true,
  autoInit: {
    enabled: true,
    selector: ".caroulix"
  }
});
export { Caroulix as default };

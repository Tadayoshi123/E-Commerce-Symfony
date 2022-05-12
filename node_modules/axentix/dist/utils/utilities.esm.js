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
const unwrap = (wrapper) => wrapper.replaceWith(...wrapper.childNodes);
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
const getInstanceByType = (type) => instances.filter((ins) => ins.type === type).map((ins) => ins.instance);
const getInstance = (element) => {
  const el = instances.find((ins) => ins.type !== "Toast" && "#" + ins.instance.el.id === element);
  if (el)
    return el.instance;
  return false;
};
const getUid = () => Math.random().toString().split(".")[1];
const getAllInstances = () => instances;
const sync = (element) => getInstance(element).sync();
const syncAll = () => instances.map((ins) => ins.instance.sync());
const reset = (element) => getInstance(element).reset();
const resetAll = () => instances.map((ins) => ins.instance.reset());
const destroy = (element) => getInstance(element).destroy();
const destroyAll = () => instances.map((ins) => ins.instance.destroy());
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
export { createEvent, createOverlay, destroy, destroyAll, extend, getAllInstances, getComponentOptions, getInstance, getInstanceByType, getPointerType, getTriggers, getUid, isPointerEnabled, isTouchEnabled, reset, resetAll, sync, syncAll, unwrap, updateOverlay, wrap };

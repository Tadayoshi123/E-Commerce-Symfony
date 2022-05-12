var __pow = Math.pow;
var waves = "";
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
const isTouchEnabled = () => "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
const isPointerEnabled = () => !!window.PointerEvent && "maxTouchPoints" in window.navigator && window.navigator.maxTouchPoints >= 0;
const getPointerType = () => {
  if (isTouchEnabled())
    return "touch";
  else if (isPointerEnabled())
    return "pointer";
  return "mouse";
};
const getUid = () => Math.random().toString().split(".")[1];
let pointerType = "";
const targetMap = {};
const itemMap = {};
const createWaveItem = (target) => {
  const id = getUid();
  const el = document.createElement("div");
  const container = document.createElement("div");
  const tagName = target.tagName.toLowerCase();
  target.setAttribute("data-waves-id", id);
  container.classList.add("data-waves-item-inner");
  container.setAttribute("data-waves-id", id);
  el.classList.add("data-waves-box");
  el.setAttribute("data-waves-id", id);
  el.appendChild(container);
  targetMap[id] = target;
  itemMap[id] = el;
  if (["img", "video"].includes(tagName))
    target.parentNode.appendChild(el);
  else
    target.appendChild(el);
  return el;
};
const createWaves = ({ id, size, x, y, container, item, target }, color) => {
  const waves2 = document.createElement("span");
  let style = `height:${size}px;
           width:${size}px;
           left:${x}px;
           top:${y}px;`;
  if (color)
    style += `${getCssVar("waves-color")}: ${color}`;
  waves2.setAttribute("data-waves-id", id);
  waves2.classList.add("data-waves-item");
  waves2.setAttribute("style", style);
  waves2.addEventListener("animationend", () => {
    container.removeChild(waves2);
    if (!container.children.length && item) {
      if (item.parentNode)
        item.parentNode.removeChild(item);
      target.removeAttribute("data-waves-id");
      delete itemMap[id];
      delete targetMap[id];
    }
  }, { once: true });
  return waves2;
};
const getWavesParams = (clientX, clientY, id, target) => {
  const { top, left, width, height } = target.getBoundingClientRect();
  const x = clientX - left;
  const y = clientY - top;
  let item = itemMap[id];
  if (!item)
    item = createWaveItem(target);
  id = item.getAttribute("data-waves-id") || getUid();
  const container = item.children[0];
  const size = __pow(__pow(Math.max(left + width - clientX, clientX - left), 2) + __pow(Math.max(top + height - clientY, clientY - top), 2), 0.5) * 2;
  return { id, size, x, y, container, item, target };
};
const getContainerStyle = (target, item) => {
  const { left, top, width, height } = target.getBoundingClientRect();
  const { left: itemLeft, top: itemTop } = item.getBoundingClientRect();
  const { borderRadius, zIndex } = window.getComputedStyle(target);
  return `left:${left - itemLeft}px;
          top:${top - itemTop}px;
          height:${height}px;
          width:${width}px;
          border-radius:${borderRadius || "0"};
          z-index:${zIndex};`;
};
const getTarget = (el, id) => {
  const target = targetMap[id];
  if (target)
    return target;
  if (el.getAttribute("data-waves") !== null)
    return el;
  return el.closest("[data-waves]") || null;
};
const handler = (e) => {
  const el = e.target;
  const id = el.getAttribute("data-waves-id") || "";
  const target = getTarget(el, id);
  if (!target || target.getAttribute("disabled"))
    return;
  const color = target.getAttribute("data-waves");
  let { clientX, clientY } = e;
  if (pointerType === "touch") {
    const click = e.touches[0];
    clientX = click.clientX;
    clientY = click.clientY;
  }
  const params = getWavesParams(clientX, clientY, id, target);
  const waves2 = createWaves(params, color);
  const { container, item } = params;
  container.setAttribute("style", getContainerStyle(target, item));
  container.appendChild(waves2);
};
const Waves = () => {
  pointerType = getPointerType();
  const eventType = `${pointerType}${pointerType === "touch" ? "start" : "down"}`;
  window.addEventListener(eventType, handler);
};
document.addEventListener("DOMContentLoaded", () => Waves());
export { Waves as default };

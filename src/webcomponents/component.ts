function setStyles(element: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
  for (const key in styles) {
    element.style[key as any] = styles[key];
  }
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options?:  {
    element?: ElementCreationOptions,
    style?: Partial<CSSStyleDeclaration>,
    attributes?: Record<string, string>,
  }
): HTMLElementTagNameMap[K] {
  const { style, element, attributes} = options || {};
  const elm = document.createElement(tagName, element);
  for (const key in attributes) {
    elm.setAttribute(key, attributes[key]);
  }
  if (style) setStyles(elm, style);
  return elm;
}
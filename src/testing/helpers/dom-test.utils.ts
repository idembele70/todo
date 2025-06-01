/**
 * Returns an attribute value from the given DOM element.
 * @param element - the element to check.
 * @param attributeName - The name of the attribute.
 */
export const getAttributesValue = (element: HTMLElement, attributeName: string) =>
  element.attributes.getNamedItem(attributeName)?.value;

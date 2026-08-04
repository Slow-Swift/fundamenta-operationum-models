export class Theme {
  constructor(element, prefix='--theme-') {
    this.element = element;
    this.prefix = prefix;
    this.updateThemeValues();
    this.properties = {};
  }

  updateThemeValues() {
    const styles = getComputedStyle(this.element);
    this.properties = {};
    
    for (const property of styles) {
      if (property.startsWith(this.prefix)) {
        const key = property.slice(this.prefix.length);
        this.properties[key] = styles.getPropertyValue(property).trim();
      }
    }
  }

  get(property) {
    return this.properties[property] ?? 0xFF00FF;
  }
}

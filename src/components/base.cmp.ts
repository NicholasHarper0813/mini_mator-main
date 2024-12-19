export function Component(name: string, cssLink?: string) 
{ 
  return function (constructor: any) 
  { 
    constructor.prototype.cssLink = cssLink;
    customElements.define(name, constructor);
    if (cssLink) 
    {
      const link = document.createElement('link');
      link.setAttribute('rel', 'prefetch');
      link.setAttribute('href', cssLink);
      document.head.append(link);
    }
  }
}

@Component('base-cmp')
export class BaseComponent extends HTMLElement 
{
  cssLink?: string;
  refs = new Map<string, Element>();

  constructor(html: string = '') 
  {
    super();
    this.attachShadow({ mode: 'open' });

    const {cssLink} = this.constructor.prototype;
    if (cssLink) 
    {
      this.style.visibility = 'hidden';

      const link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('href', cssLink);
      link.onload = () => {
        this.style.visibility = 'visible';
      }
      link.onerror = () => {
        throw new Error(`Fail to load stylesheet for ${this.constructor.name}. 
        CSS Link : ${cssLink}`);
      };
      this.shadowRoot?.append(link);
    }
    
    const container = document.createElement('div');
    const refs = container.querySelectorAll('[data-ref]');
    container.innerHTML = html;
    refs.forEach((bit) => {
      const bitName = bit.getAttribute('data-ref');
      if (bitName === null) 
      {
        return;
      }
      if (this.refs.get(bitName)) 
      {
        throw new Error(
          `BaseComponent has been created with duplicated key for '${bitName}'`
        );
      }
      this.refs.set(bitName, bit);
    });

    this.shadowRoot?.append(...container.children);
  }
}

export class Shortcut {
  listeners: Map<string, listener[]> = new Map();
  isCtrlMetaOn = false;

  keyupListener: (event: KeyboardEvent) => void;
  keydownListener: (event: KeyboardEvent) => void;

  constructor() {
    this.keyupListener = this.onKeyUp.bind(this);
    this.keydownListener = this.onKeyDown.bind(this);
    window.addEventListener('keyup', this.keyupListener);
    window.addEventListener('keydown', this.keydownListener);
  }

  on(eventName: string, listener: listener) 
  {
    if (![...EVENTS, ...MODIFIERS].find(x => x.name===eventName)) 
    {
      throw new Error('Ask to listen for a non existing shortcut');
    }
    let listeners = this.listeners.get(eventName);
    if (!listeners) 
    {
      listeners = [];
      this.listeners.set(eventName, listeners);
    }
    listeners.push(listener);
    return () => {
      let listeners = this.listeners.get(eventName) as listener[];
      let listenerIndex = listeners.indexOf(listener);
      if (~listenerIndex) {
        listeners.splice(listenerIndex, 1);
      }
    };
  }
  
  onKeyUp(event: KeyboardEvent)
  {
    this.updateMetaState(event);
    for (let eventSpecs of MODIFIERS) 
    {
      if (event.key === eventSpecs.key) 
      {
        this.dispatch(eventSpecs.name, false);
      }
    }
  }

  onKeyDown(event: KeyboardEvent) 
  {
    this.updateMetaState(event);
    const key = event.key.toLowerCase();
    for (let eventSpecs of EVENTS) 
    {
      if (eventSpecs.key === key &&
        (eventSpecs.ctrlKey === undefined || eventSpecs.ctrlKey === this.isCtrlMetaOn) &&
        (eventSpecs.shiftKey === undefined || eventSpecs.shiftKey === event.shiftKey)) 
      {
        this.dispatch(eventSpecs.name);
        event.preventDefault();
        return;
      } 
    }
    for (let eventSpecs of MODIFIERS) 
    {
      if (event.key === eventSpecs.key) 
      {
        this.dispatch(eventSpecs.name, true);
      }
    }
  }

  updateMetaState(event: KeyboardEvent) 
  {
    const isCtrlMetaOn = event.ctrlKey || event.metaKey;
    if (this.isCtrlMetaOn === isCtrlMetaOn) 
    {
      return;
    }

    this.isCtrlMetaOn = isCtrlMetaOn;
    this.dispatch('ctrl', isCtrlMetaOn);
  }

  dispatch(eventName: string, isOn?: boolean) 
  {
    let listeners = this.listeners.get(eventName) || [];
    for (let listenerIndex in listeners) {
      listeners[listenerIndex](isOn);
    }
  }

  destroy() 
  {
    window.removeEventListener('keyup', this.keyupListener);
    window.removeEventListener('keydown', this.keydownListener);
    this.listeners.clear();
  }
}

export const EVENTS: EventDef[] = [
  {
    name: 'redo',
    key: 'y',
    ctrlKey: true,
  },
  {
    name: 'redo',
    key: 'z',
    ctrlKey: true,
    shiftKey: true,
  },
  {
    name: 'undo',
    key: 'z',
    ctrlKey: true,
  },
  {
    name: 'delete',
    key: 'backspace',
  },
  {
    name: 'cut',
    key: 'x',
    ctrlKey: true,
  },
  {
    name: 'copy',
    key: 'c',
    ctrlKey: true,
  },
  {
    name: 'paste',
    key: 'v',
    ctrlKey: true,
  },
  {
    name: 'zoomin',
    key: '+',
    ctrlKey: true,
  },
  {
    name: 'zoomin',
    key: '=',
    ctrlKey: true,
  },
  {
    name: 'zoomout',
    key: '-',
    ctrlKey: true,
  },
];
const MODIFIERS: EventDef[] = [
  {
    name: 'move',
    key: ' ',
  }
];

type listener = (isOn?: boolean) => void;
interface EventDef 
{
  name: string;
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
}

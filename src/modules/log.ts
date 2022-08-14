import { globalLogEnabled } from './config.js'

export class Log {
  submes?: string;
  enabled: boolean;

  constructor (submes) {
    this.submes = submes;
    this.enabled = true;
  }

  log(...args) {
    if (this.enabled && globalLogEnabled) {
      if (this.submes) {
        console.log(`[${this.submes}]: `, ...args);
      } else {
        console.log(...args);
      }
    }
  }

  logCloneObject(...args) {
    const clonedArgs = args.map(a => JSON.parse(JSON.stringify(a)));
    this.log(...clonedArgs)
  }
}

import { globalLogEnabled } from './config.js'

export class Log {
  submes?: string;
  enabled: boolean;

  constructor (submes: string) {
    this.submes = submes;
    this.enabled = true;
  }

  log(...args: any[]) {
    if (this.enabled && globalLogEnabled) {
      if (this.submes) {
        console.log(`[${this.submes}]: `, ...args);
      } else {
        console.log(...args);
      }
    }
  }

  logCloneObject(...args: any[]) {
    const clonedArgs = args.map(a => JSON.parse(JSON.stringify(a)));
    this.log(...clonedArgs)
  }
}

const globalLogEnabled = true;

export class Log {
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

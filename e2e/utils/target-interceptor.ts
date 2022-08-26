import { Browser, CDPSession, Protocol, Target } from 'puppeteer';

interface RequestInterceptorArgs {
  requestId: Protocol.Fetch.RequestPausedEvent['requestId'];
  request: Protocol.Fetch.RequestPausedEvent['request'];
}

interface ResponseInterceptorArgs {
  requestId: Protocol.Fetch.RequestPausedEvent['requestId'];
  request: Protocol.Fetch.RequestPausedEvent['request'];
  responseHeaders: Protocol.Fetch.RequestPausedEvent['responseHeaders'];
  responseStatusCode: Protocol.Fetch.RequestPausedEvent['responseStatusCode'];
}

interface CDPRequest {
  requestId: Protocol.Fetch.RequestPausedEvent['requestId'];
  url: string;
  responseStatus: number | null;
  isResolved: boolean;
  promise: Promise<any>;
  customStatus: string;
}

class CDPRequest implements CDPRequest{
  private resolvePromise: ((value?: any) => void) | null = null;

  constructor({
    requestId,
    url,
  }: { requestId: CDPRequest['requestId'], url: CDPRequest['url'] }) {
    this.requestId = requestId;
    this.url = url;
    this.responseStatus = null;
    this.isResolved = false;
    this.promise = new Promise((res) => {
      this.resolvePromise = res;
    });
  }

  resolve() {
    if (!this.resolvePromise) {
      throw Error('this.resolvePromise is "undefined"');
    }
    this.resolvePromise();
    this.isResolved = true;
  }

  setResponseStatus(responseStatus: number) {
    this.responseStatus =  responseStatus;
  }

  setCustomStatus(customStatus: string) {
    this.customStatus = customStatus;
  }
}

export class TargetInterceptor {
  browser: Browser;
  targetTypes: ReturnType<Target['type']>[];
  resourceTypesExcludeFilter: Protocol.Network.ResourceType[];
  _target: Target | null;
  _cdpClient: CDPSession | null;
  replaceableHeaders: Record<string, string> | null;
  blockedUrls: string[];
  reqs: CDPRequest[]

  constructor({
    browser,
    targetTypes = [],
    replaceableHeaders = {},
    blockedUrls = [],
    resourceTypesExcludeFilter = []
  }: { browser: Browser, targetTypes: ReturnType<Target['type']>[], replaceableHeaders?: Record<string, string>, blockedUrls?: string[], resourceTypesExcludeFilter?: Protocol.Network.ResourceType[] }) {
    this.browser = browser;
    this.targetTypes = targetTypes;
    this._cdpClient = null;
    this._target = null;
    this.replaceableHeaders = replaceableHeaders;
    this.blockedUrls = blockedUrls;
    this.reqs = [];
    this.resourceTypesExcludeFilter = resourceTypesExcludeFilter;
  }

  get target(): Target {
    if (this._target === null) {
      throw Error('target not initialized');
    }
    return this._target;
  }

  set target(value: Target | null) {
    this._target = value;
  }

  get cdpClient(): CDPSession {
    if (this._cdpClient === null) {
      throw Error('cdpClient not initialized');
    }
    return this._cdpClient;
  }

  set cdpClient(value: CDPSession | null) {
    this._cdpClient = value;
  }

  run() {
    this.browser.on('targetcreated', this.onTargetCreated);
  }

  onTargetCreated = (target: Target) => {
    this.addInterceptorOnTarget(target);
  }

  async addInterceptorOnTarget (target: Target) {
    this.target = target;
    if (!this.targetTypes.includes(this.target.type())) {
      return null;
    }
    await this.createChromeDevtoolsProtocolClient();
    await this.cdpClient.on('Fetch.requestPaused', this.networkInterceptor);
  }

  async createChromeDevtoolsProtocolClient () {
    this.cdpClient = await this.target.createCDPSession();
    await this.cdpClient.send('Fetch.enable', {
      patterns: [
        {
          urlPattern: '*',
          requestStage: 'Request'
        },
        {
          urlPattern: '*',
          requestStage: 'Response'
        }
      ]
    });
    return this.cdpClient;
  }

  replaceHeaders(request: Protocol.Fetch.RequestPausedEvent['request']) {
    for(const headerName in this.replaceableHeaders) {
      request.headers[headerName] = this.replaceableHeaders[headerName];
    }
  }

  isRequest(responseHeaders: Protocol.Fetch.RequestPausedEvent['responseHeaders']) {
    return !responseHeaders;
  }

  networkInterceptor = async ({ requestId, request, responseHeaders, frameId, resourceType, responseStatusCode }: Protocol.Fetch.RequestPausedEvent) => {
    if (this.resourceTypesExcludeFilter.includes(resourceType)) {
      await this.cdpClient.send('Fetch.continueRequest', { requestId });
      return null;
    }
    if (this.isRequest(responseHeaders)) {
      await this.requestInterceptor({ requestId, request });
    } else {
      await this.responseInterceptor({ requestId, request, responseHeaders, responseStatusCode });
    }
  }

  async requestInterceptor ({ requestId, request }: RequestInterceptorArgs) {
    this.replaceHeaders(request);
    if (this.blockedUrls.includes(request.url)) {
      await this.cdpClient.send('Fetch.failRequest', { requestId, errorReason: 'Aborted' });
    } else {
      await this.cdpClient.send('Fetch.continueRequest', { requestId });
    }
    this.reqs.push(new CDPRequest({ requestId, url: request.url }));
  }

  async responseInterceptor({ requestId, request, responseHeaders, responseStatusCode }: ResponseInterceptorArgs) {
    // TODO complicate this method (add custom callbacks)
    const currentReq = this.reqs.find(req => req.requestId === requestId);
    if (!currentReq) {
      throw Error('Cannot find currentReq');
    }
    currentReq.setResponseStatus(responseStatusCode as number);

    if (responseStatusCode === 200) {
      const responseBody = await this.cdpClient.send('Fetch.getResponseBody', {
        requestId
      });

      if (responseBody !== null) {
        await this.cdpClient.send('Fetch.fulfillRequest', {
          requestId,
          responseCode: 200,
          responseHeaders,
          body: responseBody.body
        });
      } else {
        await this.cdpClient.send('Fetch.continueRequest', { requestId });
      }
      currentReq.setCustomStatus('complete');
    } else {
      await this.cdpClient.send('Fetch.continueRequest', { requestId });
      currentReq.setCustomStatus('fail');
    }
    currentReq.resolve();
  }

  getAllReqs(): CDPRequest[] {
    return this.reqs;
  }

  clearRequests() {
    this.reqs = [];
  }

  waitLoadingReqs() {
    // TODO add timer here
    return Promise.all(this.reqs.map(({ promise }) => promise));
  }
}

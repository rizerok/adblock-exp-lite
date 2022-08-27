import { Log } from './modules/log';

const log = new Log('background-sw');
log.log('chrome', chrome);

import './background-sw/activeTabLifecycle';
import './background-sw/canceling-requests';


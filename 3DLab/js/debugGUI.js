import Stats from '../three/examples/jsm/libs/stats.module.js';
import { GUI } from '../three/examples/jsm/libs/dat.gui.module.js';

'use strict';

let debugStats = new Stats();
document.body.appendChild(debugStats.dom);

let debugPanel = new GUI({width: 310});

export { debugStats, debugPanel };
// CJS-callable facade for minimatch@11 (serve-handler still does require('minimatch')(...)).
'use strict';
const real = require('minimatch-lib');
const fn = typeof real === 'function' ? real : real.minimatch;
module.exports = fn;
for (const key of Object.keys(real)) {
  if (!(key in module.exports)) {
    module.exports[key] = real[key];
  }
}

# minimatch CJS shim

`serve-handler@6.1.7` calls `require('minimatch')(path, pattern)`.
Upstream `minimatch@>=9` exports a namespace object under CJS, so a direct
npm override to 11.x breaks static serving when glob sources are evaluated.

This local package pins advisory-clean `minimatch@11.0.4` (via the
`minimatch-lib` alias) and re-exports a callable default for Dependabot /
`npm audit` while keeping Playwright's `serve` webServer working.

const Module = require('node:module')
const path = require('node:path')

const miniappRoot = path.resolve(__dirname, '..')
const localTypescriptRoot = path.join(miniappRoot, 'node_modules', 'typescript')
const originalResolveFilename = Module._resolveFilename

Module._resolveFilename = function resolveMiniappTypescript(request, parent, isMain, options) {
  if (request === 'typescript') {
    return path.join(localTypescriptRoot, 'lib', 'typescript.js')
  }

  if (request === 'typescript/package.json') {
    return path.join(localTypescriptRoot, 'package.json')
  }

  if (request === 'typescript/lib/tsc') {
    return path.join(localTypescriptRoot, 'lib', 'tsc.js')
  }

  if (request.startsWith('typescript/')) {
    return path.join(localTypescriptRoot, request.slice('typescript/'.length))
  }

  return originalResolveFilename.call(this, request, parent, isMain, options)
}

require('../../../node_modules/vue-tsc/bin/vue-tsc.js')

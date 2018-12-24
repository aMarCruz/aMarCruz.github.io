# How To use JSLib with TypeScript

Make sure that your tsconfig.json has the option "moduleResolution" set to "node" and, if you are using ES6 imports, the option "esModuleInterop" enabled.

```json
  "compilerOptions": {
    "esModuleInterop": true,  // required for ES6 imports only
    "moduleResolution": "node",
    ...
  },
```

With ES6 imports:

```ts
import escapeRegexStr from '@tslib/escape-regex-str'
import { startsWith } from '@tslib/strings'
```

With the `import =` syntax:

```ts
import escapeRegexStr = require('@tslib/escape-regex-str')
import strings = require('@tslib/strings')

const { startsWith } = strings
```

A direct `require` works too:

```ts
import escapeRegexStr = require('@tslib/escape-regex-str')
const { startsWith } = require('@tslib/strings')
```

...but you loose the typings.

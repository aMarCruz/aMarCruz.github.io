# How To use JSLib with NodeJS

If you are using the default CommonJS modules:

```js
const escapeRegexStr = require('@tslib/escape-regex-str')
const { startsWith } = require('@tslib/strings')
```

If you are using node v11+ ES imports:

```ts
import escapeRegexStr from '@tslib/escape-regex-str'
import { startsWith } from '@tslib/strings'
```

Instead the last line, you can also use the asterisk, for example:

```ts
import * as S from '@tslib/strings'

console.log(S.startsWith('~foo', '~)
```

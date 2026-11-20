---
"@collana-solutions/react-hook-form-components": patch
---

The package is now published as `@collana-solutions/react-hook-form-components`. The API and the styles are unchanged, and 4.5.0 is available under both names. To migrate, replace the old package with the new one:

```shell
npm uninstall @neolution-ch/react-hook-form-components
npm install @collana-solutions/react-hook-form-components
```

Then change the imports, including the stylesheet:

```js
import { Form, Input, useFormContext } from "@collana-solutions/react-hook-form-components";
import "@collana-solutions/react-hook-form-components/styles.css";
```

`@neolution-ch/react-hook-form-components` gets deprecated and receives no further releases.

# Upgrade Steps

Follow this description to upgrade `plugin-react` from `v5.x` to `v6.x`. The `v5.x` version can still run normally, but some inelegant writing methods have been unified and improved in the `v6.x` version. Subsequent new `features` will be updated in the `v6.x` version.

## Latest Example

You can create the latest `react` type `example` through the `npm init` command to get the latest code.

```shell
$ npm init ssr-app my-ssr-project
$ cd my-ssr-project
$ npm install # You can use yarn, don't use cnpm
$ npm start
$ open http://localhost:3000 # Access the application
$ npm run build # Resource building, equivalent to npx ssr build
$ npm run start:vite # Start in vite mode, equivalent to npx ssr start --tools vite
```

## Change Details

Users upgrading from old versions need to make the following code changes:

### Modify Dependency Version Numbers

`ssr-plugin-react@^5.0.0` => `ssr-plugin-react@^6.0.0`

### Modify Context Acquisition Method

In the old version, we mounted `STORE_CONTEXT` on `window` so it could be used anywhere, but this method is very inelegant. In the new version, we acquire `context` as follows:

```js
import {
    useStoreContext
} from 'ssr-common-utils'

export default function Index(props: SProps) {
    const {
        state,
        dispatch
    } = useContext < IContext < IData >> (useStoreContext())
    return ( <
        div >
        <
        Search > < /Search> {
            state?.indexData?.data?.[0]?.components ? < div >
                <
                Slider {
                    ...props
                }
            data = {
                state.indexData.data[0].components
            }
            /> <
            Rectangle {
                ...props
            }
            data = {
                state.indexData.data[1].components
            }
            /> <
            /div> : <img src='https:/ / gw.alicdn.com / tfs / TB1v.zIE7T2gK0jSZPcXXcKkpXa - 128 - 128. gif ' className='
            loading ' />
        } <
        /div>
    )
}
```

### Modify web/tsconfig.json

Modify `web/tsconfig.json` to get correct type hints:

```js
"paths": {
    "@/*": ["./*"],
    "~/*": ["../*"],
    "_build/*": ["../build/*"] // Add this line here
}
```

### Move Type Declarations

It's recommended to put all common types in the `typings` folder under the root directory with file suffix ending in `d.ts`.

### Modify fetch Method Parameters

For better type hints, in the new version we changed the parameter form of the `fetch` method to the following code:

```js
import {
    ReactMidwayFetch
} from 'ssr-types'
import {
    IndexData
} from '~/typings/data'

const fetch: ReactMidwayFetch < {
    apiService: {
        index: () => Promise < IndexData >
    }
} > = async ({
    ctx,
    routerProps
}) => {
    // Read documentation for more information http://doc.ssr-fc.com/docs/features$fetch#%E5%88%A4%E6%96%AD%E5%BD%93%E5%89%8D%E7%8E%AF%E5%A2%83
    const data = __isBrowser__ ? await (await window.fetch('/api/index')).json() : await ctx!.apiService?.index()
    return {
        // It's recommended to add namespace to data based on modules to prevent data overwriting
        indexData: data
    }
}

export default fetch
```

When you need to get dynamic parameters:

```js
import {
    ReactMidwayFetch
} from 'ssr-types'
import {
    Ddata
} from '~/typings/data'

const fetch: ReactMidwayFetch < {
    apiDeatilservice: {
        index: (id: string) => Promise < Ddata >
    }
}, {
    id: string
} > = async ({
    ctx,
    routerProps
}) => {
    // Read documentation for more information http://doc.ssr-fc.com/docs/features$fetch#%E5%88%A4%E6%96%AD%E5%BD%93%E5%89%8D%E7%8E%AF%E5%A2%83
    const data = __isBrowser__ ? await (await window.fetch(`/api/detail/${routerProps!.match.params.id}`)).json() : await ctx!.apiDeatilservice.index(ctx!.params.id)
    return {
        // It's recommended to add namespace to data based on modules to prevent data overwriting
        detailData: data
    }
}
export default fetch
```

# Technology Choices

This chapter will introduce some technology choices of the `ssr` framework in different scenarios. We recommend reading [Ant Frontend Development Best Practices](https://github.com/sorrycc/blog/issues/90). We always believe that fixing a set of optimal technology choice solutions is far better than supporting diverse technology solutions.

## Server-Side Framework Technology Choices

Since we extend through plugin mechanisms, theoretically we can support any server-side framework. Currently, the official provides `Midway.js` and `Nest.js` implementation solutions that can be used directly. If you want to encapsulate a plugin based on other Node.js frameworks, it's also very easy. See [Plugin Mechanism](./features$plugin) for details.

## Frontend Framework Technology Choices

Here we support common popular frontend frameworks `React`, `Vue2`, `Vue3`. Users can use them directly.

### React Technology Choices

- Frontend Framework: React v17, keeping up with React17's new features in real-time
- Development Language: TypeScript
- Code Style (optional): Default [eslint-config-standard-react-ts](https://github.com/zhangyuang/standardjs-react)
- Style Processing: less + css modules (automatically recognizes .module.less files using css-modules based on file extensions)
- UI Components: Default packaging configuration for `antd` usage, no additional configuration needed
- Frontend Routing: Conventional routing/Declarative routing
- Data Management: Using Hooks' `useContext` to implement minimal cross-component communication solutions, abandoning traditional redux/dva and other data management solutions. See [Component Communication](./features$communication) for details
- Build Tools: [Webpack](https://webpack.docschina.org/)/[Vite](http://vitejs.dev/)

### Vue Technology Choices

- Frontend Framework: Vue2.0, Vue3.0
- Development Language: TypeScript
- Code Style (optional): [eslint-config-standard-vue-ts](https://github.com/zhangyuang/standardjs-vue)
- Style Processing: less + vue scoped
- UI Components: Default packaging configuration for `vant` usage, no additional configuration needed
- Frontend Routing: Conventional routing/Declarative routing
- Data Management: [Vuex](https://vuex.vuejs.org/)/[Provide/Inject](./features$communication#Provide/Inject)
- Build Tools: [Webpack](https://webpack.docschina.org/)/[Vite](http://vitejs.dev/)

#### Vue3 + TSX (Optional)

In Vue3 scenarios, we default to loading the [@vue/babel-plugin-jsx](https://github.com/vuejs/jsx-next#installation) plugin at the underlying level. Developers can decide whether to use template or tsx approaches for development based on personal preferences. For example, if you want to use tsx, you just need to change .vue files to .tsx files.

`Note: Vue3 + volar (VSCode plugin) + Pinia's ts support is already excellent, not recommended to use Vue3 + TSX combination. Due to the babel plugin's own issues, Webpack HMR hot update capabilities have certain problems in this scenario. If you must use it, it's recommended to use it together with Vite.`

```html
<template>
  <div>
    <search />
    <template v-if="indexData">
      <Slider :data="indexData[0].components" />
      <Rectangle :data="indexData[1].components" />
    </template>
    <template v-else>
      <img
        src="https://gw.alicdn.com/tfs/TB1v.zIE7T2gK0jSZPcXXcKkpXa-128-128.gif"
        class="loading"
      />
    </template>
  </div>
</template>

<script>
  import { mapState } from "vuex";
  import Slider from "@/components/slider";
  import Rectangle from "@/components/rectangle";
  import Search from "@/components/search";

  export default {
    components: {
      Slider,
      Rectangle,
      Search,
    },
    computed: {
      ...mapState({
        indexData: (state) => state.indexStore?.data,
      }),
    },
  };
</script>
```

The corresponding tsx writing method is:

```jsx
// render.tsx
import { mapState } from "vuex";
import Slider from "@/components/slider";
import Rectangle from "@/components/rectangle";
import Search from "@/components/search";

export default {
  computed: {
    ...mapState({
      indexData: (state) => state.indexStore?.data,
    }),
  },

  render() {
    const { indexData } = this;
    return (
      <div>
        <Search />
        {indexData ? (
          <div>
            <Slider data={indexData[0].components} />
            <Rectangle data={indexData[1].components} />
          </div>
        ) : (
          <img
            src="https://gw.alicdn.com/tfs/TB1v.zIE7T2gK0jSZPcXXcKkpXa-128-128.gif"
            className="loading"
          />
        )}
      </div>
    );
  },
};
```

## Notes

The above choices are an excellent solution we've summarized after careful consideration. If developers must use other solutions, such as those introduced below:

- `sass`, refer to [documentation](./features$faq#) can modify default `Webpack` configuration support through `chainBaseConfig` approach. But we don't recommend doing this. `90%` of framework `issue` types are caused by users modifying default configurations.
- `koa`, developing an `ssr` framework `koa` plugin only takes two minutes, but we still don't recommend doing this. If you must choose other server-side Node.js frameworks, please choose relatively mature ones.
- `redux`, by default doesn't support `redux` as data management, and we don't plan to support it in the future either. `redux-saga`, `dva` are the same, we don't plan to support them in the future either. `useContext` is already excellent enough. If you must choose other data management solutions, in the future we might consider the framework layer providing `MobX` or `redux-toolkit` as relatively complex data management solutions.

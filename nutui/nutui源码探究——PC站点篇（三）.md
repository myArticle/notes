## 前言

`nutui` 的官网分为两部分：
1. doc PC 官网的大体框架
2. mobile h5 示例 demo 及效果预览，通过 `iframe` 嵌入到 PC 官网内

![image.png](https://wos.58cdn.com.cn/IjGfEdCbIlr/ishare/d35c9675-a776-4dfd-9ab3-0e521d4947c8image.png)


## 1. doc 部分

### 页面布局/结构
- header 头部 header
- nav 左侧组件导航
- content 主内容区域，即 markdown 文档内容
- 右侧示例 **mobile** h5 模块

### 路由

`vite` 提供了 [import.meta.glob()](https://cn.vitejs.dev/guide/features.html#glob-import) 函数，从文件系统导入多个模块。

`nutui` 通过 `import.meta.glob()` 去导入所有组件的 .doc 文件，并将组件名作为路由路径，组成 `vue` 的 `routes` 。

而且 `nutui` 提供了中英文文档，通过路由中的路径 `/zh-CN/` 和 `/en-US/` 来区分；
也提供了 `h5` 和 `taro` 文档，通过路由中的是否包含 `-taro` 去区分。 

PC 网站的路由分为四类：
- 中文 vue markdown 文件，如 `/#/zh-CN/uploader`
- 中文 taro markdown 文件 `/#/zh-CN/uploader-taro`
- 英文 vue markdown 文件 `/#/en-US/uploader`
- 英文 taro markdown 文件 `/#/en-US/uploader-taro`


<details>
<summary><strong>点击展开查看 router.ts 源码</strong></summary>

```typescript
/* eslint-disable @typescript-eslint/no-var-requires */
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Index from './views/Index.vue';
import config from '../config/env';
const pagesRouter: Array<RouteRecordRaw> = [];

/** vite */
const modulesPage = import.meta.glob('/src/packages/__VUE/**/doc.md');
for (const path in modulesPage) {
  let name = (/packages\/__VUE\/(.*)\/doc.md/.exec(path) as any[])[1];
  pagesRouter.push({
    path: '/zh-CN/' + name,
    component: modulesPage[path]
    // name
  });
}

const pagesEnRouter: Array<RouteRecordRaw> = [];

const modulesEnPage = import.meta.glob('/src/packages/__VUE/**/doc.en-US.md');
for (const path in modulesEnPage) {
  let name = (/packages\/__VUE\/(.*)\/doc.en-US.md/.exec(path) as any[])[1];
  pagesEnRouter.push({
    path: '/en-US/' + name,
    component: modulesEnPage[path]
    // name: 'en' + name
  });
}

/** vite-taro **/
const modulesPageTaro = import.meta.glob('/src/packages/__VUE/**/*.taro.md');
for (const path in modulesPageTaro) {
  let name = (/packages\/__VUE\/(.*)\/doc.taro.md/.exec(path) as any[])[1];
  pagesRouter.push({
    path: `/zh-CN//${name}-taro`,
    component: modulesPageTaro[path]
    // name: `${name}-taro`
  });
  pagesRouter.push({
    path: `/en-US/${name}-taro`,
    component: modulesPageTaro[path]
  });
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/zh-CN/',
    name: '/zh-CN/',
    component: Index,
    children: pagesRouter
  },
  {
    path: '/en-US/',
    name: '/en-US/',
    component: Index,
    children: pagesEnRouter
  }
];
routes.push({
  name: 'notFound',
  path: '/:path(.*)+',
  redirect: {
    name: '/zh-CN/'
  }
});
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      const id = to.hash.split('#')[1];
      const ele = document.getElementById(id);
      setTimeout(() => {
        ele && ele.scrollIntoView(true);
      });
    }
  }
});
router.afterEach((to, from) => {
  window.scrollTo(0, 0);
});
export default router;

```

</details>


### markdown 文档

>如何将 `.md` 文件嵌入到页面中并渲染的？

借助 [vite-plugin-md](https://github.com/antfu/vite-plugin-md) （⚠️需要注意版本），以及 `css` 样式表。

因为一般还会有代码示例，所以还需要代码高亮——[highlight.js](https://github.com/highlightjs/highlight.js)。

除此之外， `nutui` 还对 `.md` 文件中的 `demo` 部分，用组件 `demo-block` 包裹了一下，方便加入一些其他功能：`在线调试代码`、`复制代码`等。

<details>

<summary><strong>点击展开查看 vite.config.ts 源码</strong></summary>

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import Markdown from 'vite-plugin-md';
import path from 'path';
import config from './package.json';
const hljs = require('highlight.js'); // https://highlightjs.org/
import { compressText } from './src/sites/doc/components/demo-block/basedUtil';
const resolve = path.resolve;
// https://vitejs.dev/config/
export default defineConfig({
  base: '/3x/',
  server: {
    port: 2021,
    host: '0.0.0.0',
    proxy: {
      '/devServer': {
        target: 'https://nutui.jd.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/devServer/, '')
      },
      '/devTheme': {
        target: 'https://nutui.jd.com/theme/source',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/devTheme/, '')
      }
    }
  },
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, './src') }]
  },
  css: {
    preprocessorOptions: {
      scss: {
        // example : additionalData: `@import "./src/design/styles/variables";`
        // dont need include file extend .scss
        additionalData: `@import "@/packages/styles/variables.scss";@import "@/sites/assets/styles/variables.scss";`
      }
    },
    postcss: {
      plugins: [
        require('autoprefixer')({
          overrideBrowserslist: ['> 0.5%', 'last 2 versions', 'ie > 11', 'iOS >= 10', 'Android >= 5']
        })
      ]
    }
  },
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/]
    }),
    Markdown({
      // default options passed to markdown-it
      // see: https://markdown-it.github.io/markdown-it/
      markdownItOptions: {
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(lang, str).value;
            } catch (__) {}
          }

          return ''; // 使用额外的默认转义
        }
      },
      markdownItSetup(md) {
        md.use(require('markdown-it-container'), 'demo', {
          validate: function (params) {
            return params.match(/^demo\s*(.*)$/);
          },

          render: function (tokens, idx) {
            const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
            if (tokens[idx].nesting === 1) {
              // opening tag
              const contentHtml = compressText(tokens[idx + 1].content);
              return `<demo-block data-type="vue" data-value="${contentHtml}">` + md.utils.escapeHtml(m[1]) + '\n';
            } else {
              // closing tag
              return '</demo-block>\n';
            }
          }
        });
      }
    })
    // legacy({
    //   targets: ['defaults', 'not IE 11']
    // })
  ],
  build: {
    target: 'es2015',
    outDir: './dist/3x/',
    // assetsDir: config.version,
    cssCodeSplit: true,
    cssTarget: ['chrome61'],
    rollupOptions: {
      input: {
        // doc: resolve(__dirname, 'index.html'),
        mobile: resolve(__dirname, 'demo.html')
      },
      output: {
        entryFileNames: `demo-${config.version}/[name].js`,
        chunkFileNames: `demo-${config.version}/[name].js`,
        assetFileNames: `demo-${config.version}/[name].[ext]`,
        plugins: []
      }
    }
  }
});
```

</details>

## 2. mobile

### 路由

跟上面一样，通过 `import.meta.glob()` 将所有组件的 `demo.vue` 生成路由。

<details>
<summary><strong>点击展开查看 router.ts 源码</strong></summary>

```typescript
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Index from './components/Index.vue';
import IndexTaro from './components/IndexTaro.vue';
import { nav } from '../../config.json';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: '/',
    component: Index
  }
];

/** webpack */
// const files = require.context('@/packages', true, /demo\.vue$/);
// files.keys().forEach(component => {
//   const componentEntity = files(component).default;
//   routes.push({
//     path: `/${componentEntity.baseName}`,
//     name: componentEntity.baseName,
//     component: componentEntity
//   });
// });

const findComponentName = (name: string) => {
  for (const key in nav) {
    if (Object.prototype.hasOwnProperty.call(nav, key)) {
      const element = nav[key];
      let idx = element.packages.findIndex(
        (i) => i.name.toLowerCase() === name
      );
      if (idx !== -1) {
        return element.packages[idx].name;
      }
    }
  }
};

/** vite */
const modulesPage = import.meta.glob('/src/packages/__VUE/**/demo.vue');

for (const path in modulesPage) {
  let name = (/packages\/__VUE\/(.*)\/demo.vue/.exec(path) as any[])[1];
  routes.push({
    path: '/' + name,
    component: modulesPage[path],
    name,
    meta: {
      ComponentName: findComponentName(name)
    }
  });

  routes.push({
    path: '/' + name + '-taro',
    component: IndexTaro,
    name: name + '-taro',
    meta: {
      ComponentName: findComponentName(name)
    }
  });
}

routes.push({
  name: 'NotFound',
  path: '/:path(.*)+',
  redirect: () => '/'
});

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
```
</details>

mobile 的模版入口是 `demo.html` ，在 `doc` 的 `views/Index.vue` 中监听路由的变化(`onBeforeRouteUpdate`)，如果路由发生变化(`watchDemoUrl`)，就需要将对应的 `iframe` 的 `url` 更新（`iframe` 的 `url` 即为 mobile 的路由）。

```typescript
const watchDemoUrl = (router: RouteLocationNormalized) => {
    const { origin, pathname } = window.location;
    RefData.getInstance().currentRoute.value = router.path as string;
    let url = `${origin}${pathname.replace('index.html', '')}demo.html#${router.path}`;
    data.demoUrl = url.replace('/zh-CN', '').replace('/en-US', '');
};
```

<details>
<summary><strong>点击展开查看 doc/views/Index.vue 源码</strong></summary>

```html
<template>
  <div>
    <doc-header></doc-header>
    <doc-nav></doc-nav>
    <div class="doc-content">
      <div class="doc-title">
        <div class="doc-title-position" :class="{ fixed: fixed, hidden: hidden }">
          <div class="title">{{ componentName.name }}&nbsp;{{ componentName.cName }}</div>
          <doc-issue class=""></doc-issue>
        </div>
      </div>
      <div class="doc-content-document isComponent">
        <div class="doc-content-tabs" v-if="isShowTaroDoc">
          <div
            class="tab-item"
            :class="{ cur: curKey === item.key }"
            v-for="item in tabs"
            :key="item.key"
            @click="handleTabs(item.key)"
            >{{ item.text }}</div
          >
        </div>
        <div class="doc-content-tabs single" v-if="!isShowTaroDoc">
          <div class="tab-item cur">vue / taro</div>
        </div>
        <router-view />
      </div>
      <doc-demo-preview :url="demoUrl" :class="{ fixed: fixed }"></doc-demo-preview>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, computed } from 'vue';
import { nav } from '@/config.json';
import { onBeforeRouteUpdate, RouteLocationNormalized, useRoute, useRouter } from 'vue-router';
import Header from '@/sites/doc/components/Header.vue';
import Nav from '@/sites/doc/components/Nav.vue';
import DemoPreview from '@/sites/doc/components/DemoPreview.vue';
import Issue from '@/sites/doc/components/Issue.vue';
import { RefData } from '@/sites/assets/util/ref';
import { initSiteLang } from '@/sites/assets/util/useTranslate';
export default defineComponent({
  name: 'doc',
  components: {
    [Header.name]: Header,
    [Nav.name]: Nav,
    [DemoPreview.name]: DemoPreview,
    [Issue.name]: Issue
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    initSiteLang();
    const excludeTaro = ['/intro', '/start', '/theme', '/joinus', '/starttaro', '/contributing'];
    const state = reactive({
      fixed: false, // 是否吸顶
      hidden: false, // 是否隐藏
      // 组件名称
      componentName: {
        name: '',
        cName: ''
      }
    });
    const data = reactive({
      demoUrl: 'demo.html',
      curKey: 'vue',
      tabs: [
        {
          key: 'vue',
          text: 'vue'
        },
        {
          key: 'taro',
          text: 'taro'
        }
      ]
    });

    const configNav = computed(() => {
      let tarodocs = [] as string[];
      nav.map((item) => {
        item.packages.forEach((element) => {
          let { tarodoc, name } = element;
          if (tarodoc) {
            tarodocs.push(name.toLowerCase());
            tarodocs.push(`${name.toLowerCase()}-taro`);
          }
        });
      });
      return tarodocs;
    });

    const isTaro = (router: RouteLocationNormalized) => {
      return router.path.indexOf('taro') > -1;
    };

    const isShowTaroDoc = computed(() => {
      let routename = route.path.toLocaleLowerCase().split('/').pop() || '';
      return configNav.value.findIndex((item) => item === routename) > -1;
    });

    const watchDemoUrl = (router: RouteLocationNormalized) => {
      const { origin, pathname } = window.location;
      RefData.getInstance().currentRoute.value = router.path as string;
      let url = `${origin}${pathname.replace('index.html', '')}demo.html#${router.path}`;
      data.demoUrl = url.replace('/zh-CN', '').replace('/en-US', '');
    };

    const watchDocMd = (curKey: string) => {
      const path = route.path;
      // router.replace(isTaro(route) ? path.substr(0, path.length - 5) : `${path}-taro`);
      if (curKey.includes('taro')) {
        router.replace(isTaro(route) ? path : `${path}-taro`);
      } else {
        router.replace(isTaro(route) ? path.substr(0, path.length - 5) : path);
      }
    };

    const handleTabs = (curKey: string) => {
      data.curKey = curKey;
      watchDocMd(curKey);
    };

    onMounted(() => {
      componentTitle();
      watchDemoUrl(route);
      data.curKey = isTaro(route) ? 'taro' : 'vue';
      document.addEventListener('scroll', scrollTitle);
    });

    const scrollTitle = () => {
      let top = document.documentElement.scrollTop;
      // console.log('state.hidden', state.hidden)
      if (top > 127) {
        state.fixed = true;
        if (top < 142) {
          state.hidden = true;
        } else {
          state.hidden = false;
        }
      } else {
        state.fixed = false;
        state.hidden = false;
      }
    };

    // 获得组件名称
    const componentTitle = (to?: any) => {
      if (to?.path) {
        ['zh-CN/', 'zh-TW/', 'en-US/'].map((file) => {
          if (to.path.includes(file)) {
            state.componentName.name = to.path.split(file)[1];
          }
        });
      } else {
        ['zh-CN/', 'zh-TW/', 'en-US/'].map((file) => {
          if (route.path.includes(file)) {
            state.componentName.name = route.path.split(file)[1];
          }
        });
      }
      nav.forEach((item: any) => {
        item.packages.forEach((sItem: any) => {
          if (sItem.name.toLowerCase() == state.componentName.name) {
            state.componentName.name = sItem.name;
            state.componentName.cName = sItem.cName;
            return;
          }
        });
      });
    };

    onBeforeRouteUpdate((to) => {
      watchDemoUrl(to);
      data.curKey = isTaro(to) ? 'taro' : 'vue';
      componentTitle(to);
    });

    return {
      ...toRefs(state),
      ...toRefs(data),
      handleTabs,
      isShowTaroDoc
    };
  }
});
</script>

<style lang="scss" scoped>
$doc-title-height: 137px;
.doc {
  &-content {
    margin-left: 290px;
    display: flex;
    flex-direction: column;

    &-document {
      min-height: 800px;

      .markdown-body {
        min-height: 600px;
      }
    }
    &-tabs {
      position: absolute;
      right: 475px;
      top: 48px;
      display: flex;
      height: 40px;
      align-items: center;
      justify-content: space-between;
      z-index: 1;
      padding: 2px;
      box-sizing: border-box;

      border-radius: 2px;
      background: #eee;
      box-shadow: rgb(0 0 0 / 15%) 0px 2px 4px;
      &.single {
        padding: 0;
        .tab-item {
          line-height: 40px;
          cursor: auto;
        }
      }
      .tab-item {
        position: relative;
        padding: 0 10px;
        line-height: 36px;
        cursor: pointer;
        font-size: 16px;
        color: #323232;
        text-align: center;
        border-radius: 2px;
        background: #eee;
        &.cur {
          font-weight: bold;
          color: #323232;
          background: #fff;
        }
      }
    }
    &-contributors {
      margin: 50px 0;
      a {
        position: relative;
      }
      img {
        height: 26px;
        height: 26px;
        border-radius: 50%;
        margin-left: 8px;
      }
      .contributors-hover {
        display: none;
        padding: 5px 10px;
        color: #fff;
        font-size: 12px;
        background-color: #000;
        border-radius: 5px;
        position: absolute;
        /* min-width:150px; */
        white-space: nowrap;
        top: -200%;
        transform: translateX(-55%);
      }
      a:hover {
        .contributors-hover {
          display: inline-block;
        }
      }
    }
  }
  &-title {
    width: 100%;
    height: $doc-title-height;
    z-index: 2;
    &-position {
      top: 0px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 40px;
      // line-height: 56px;
      border-bottom: 1px solid #eee;
      background: #fff;
      visibility: visible;
      opacity: 1;
      // transition: opacity 0.8s linear, visibility 0.8s linear;
      transition: opacity 0.8s;
      &.fixed {
        width: calc(100% - 290px);
        position: fixed;
        padding: 24px 48px;
        .title {
          font-size: 24px;
          font-weight: bold;
        }
      }
      &.hidden {
        visibility: hidden;
        opacity: 0;
      }
      .title {
        font-size: 40px;
        font-weight: bold;
      }
    }
  }
}
</style>
```

</details>
## 前言

>目前 nutui-cli 只支持 vue2 版本的构建，底层为 webpack4
最新 3.x vue3 是基于 vite 构建，目前 nutui-cli 内部暂未升级
构建自己的一套组件库，可以参考 next 分支的 vite 配置
详细的设计图见下 [参考 #1273](https://github.com/jdf2e/nutui/discussions/1273)

![image.png](https://wos.58cdn.com.cn/IjGfEdCbIlr/ishare/ddd4aa3e-ef83-4ca4-a4aa-4b17c4a267d7image.png)

## 根据构建命令解析熟悉项目

```json
 "scripts": {
    "checked": "npm run generate:file && tsc",
    "checked:taro:vue": "npm run generate:file:taro:vue",
    "dev": "npm run checked && vite --open --force",
    "dev:taro:weapp": "npm run createTaroConfig && npm run checked:taro:vue && cd src/sites/mobile-taro/vue/ && npm run dev:weapp",
    "dev:taro:alipay": "npm run createTaroConfig && npm run checked:taro:vue && cd src/sites/mobile-taro/vue/ && npm run dev:alipay",
    "dev:taro:jd": "npm run createTaroConfig && npm run checked:taro:vue && cd src/sites/mobile-taro/vue/ && npm run dev:jd",
    "dev:taro:h5": "npm run createTaroConfig && npm run checked:taro:vue && cd src/sites/mobile-taro/vue/ && npm run dev:h5",
    "build:site": "npm run checked && vite build",
    "build:site-jdt": "npm run checked && vite build --config vite.config.jdt.ts ",
    "build:site:oss": "npm run checked && vite build --base=/nutui/3x/",
    "build": "npm run checked && vite build --config vite.config.build.ts && vite build --config vite.config.build.disperse.ts && npm run generate:types && npm run generate:themes && vite build --config vite.config.build.css.ts && vite build --config vite.config.build.locale.ts && npm run attrs",
    "build:taro:vue": "npm run checked:taro:vue && vite build --config vite.config.build.taro.vue.ts && vite build --config vite.config.build.taro.vue.disperse.ts && npm run generate:types:taro && npm run generate:themes && vite build --config vite.config.build.css.ts && vite build --config vite.config.build.locale.ts && npm run attrs",
    "serve": "vite preview",
    "upload": "yarn build:site:oss && node ./jd/upload.js",
    "add": "node jd/createComponentMode.js",
    "publish:beta": "npm publish --tag=beta",
    "publish": "npm publish",
    "generate:file": "node jd/generate-nutui.js",
    "generate:file:taro:vue": "node jd/generate-nutui-taro-vue.js",
    "generate:types": "node jd/generate-types.js",
    "generate:types:taro": "node jd/generate-types-taro.js",
    "generate:themes": "node jd/generate-themes.js",
    "prepare": "husky install",
    "test": "jest",
    "release": "standard-version -a",
    "codeformat": "prettier --write .",
    "copydocs": "node ./jd/copymd.js",
    "createTaroConfig": "node ./jd/generate-taro-route.js",
    "attrs": "node ./jd/createAttributes.js"
  },
```

### `yarn dev:taro:weapp` 启动调试模式 Taro 微信小程序

1. 直接执行上面的调试命令可能会报错，提示需要先安装下面这三个包，其实错误原因是没有在 `src/sites/mobile-taro/vue/` 目录下执行安装依赖包
- `@tarojs/plugin-platform-weapp`
- `@tarojs/plugin-framework-vue3`
- `@tarojs/plugin-html`

2. `cd src/sites/mobile-taro/vue/`，因为这个目录下就是一个小程序工程项目，所以 `yarn` 执行安装依赖包
3. 再回到根目录执行 `yarn dev:taro:weapp`
4. 打开【微信开发工具】导入 `src/sites/mobile-taro/vue/dist` 目录预览调试

#### 命令拆解分析

> "dev:taro:weapp": "npm run createTaroConfig && npm run checked:taro:vue && cd src/sites/mobile-taro/vue/ && npm run dev:weapp"

##### 1. `npm run createTaroConfig`

`"createTaroConfig": "node ./jd/generate-taro-route.js",` 执行 node.js 脚本，根据 `src/config.json` 里的组件导航分类的信息，生成**小程序的路由配置**信息文件 `app.config.ts`

<details>

<summary>`./jd/generate-taro-route.js`</summary>

```javascript
// ./jd/generate-taro-route.js
const fse = require('fs-extra');
//	文档、组件导航信息
const config = require('../src/config.json');
const targetBaseUrl = `${process.cwd()}/src`;
const taroConfig = `${targetBaseUrl}/sites/mobile-taro/vue/src/app.config.ts`;

// 创建 config
const createConfig = async () => {
  let configRef = [];

  return new Promise((res, rej) => {
    config.nav.map((item) => {
      let co = {
        root: item.enName,
        pages: []
      };

      item.packages.map((it) => {
        if (!(it.exportEmpty == false) && it.show) {
          co.pages.push(`pages/${it.name.toLowerCase()}/index`);
        }
      });

      configRef.push(co);
    });

    res(configRef);
  });
};

const create = async () => {
  const subpackages = await createConfig();

  fse.writeFileSync(
    taroConfig,
    `
const subPackages = ${JSON.stringify(subpackages, null, 2)};\n
export default {
  pages: ['pages/index/index'],
  subPackages,
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'NutUI',
    navigationBarTextStyle: 'black'
  }
}`,
    'utf8'
  );
};

create();
```

</details>

##### 2. `npm run checked:taro:vue`

- `"checked:taro:vue": "npm run generate:file:taro:vue",`
- `"generate:file:taro:vue": "node jd/generate-nutui-taro-vue.js",` 

执行 node.js 脚本，根据 `src/config.json`里的组件导航分类的信息，生成**组件的入口文件**

<details>

<summary>`jd/generate-nutui-taro-vue.js`</summary>

```javascript
// jd/generate-nutui-taro-vue.js
const package = require('../package.json');
const config = require('../src/config.json');
const path = require('path');
const fs = require('fs-extra');
let importStr = `import { App } from 'vue';
import Locale from './locale';\n`;
let importScssStr = `\n`;
const packages = [];
config.nav.map((item) => {
  item.packages.forEach((element) => {
    let { name } = element;
    const filePath = path.join(`src/packages/__VUE/${name.toLowerCase()}/index.taro.vue`);
    importStr += `import ${name} from './__VUE/${name.toLowerCase()}/index${
      fs.existsSync(filePath) ? '.taro' : ''
    }.vue';\n`;
    importScssStr += `import './__VUE/${name.toLowerCase()}/index.scss';\n`;
    packages.push(name);
  });
});
let installFunction = `function install(app: any) {
  const packages = [${packages.join(',')}];
  packages.forEach((item:any) => {
    if (item.install) {
      app.use(item);
    } else if (item.name) {
      app.component(item.name, item);
    }
  });
}`;
let fileStrBuild = `${importStr}
${installFunction}
const version = '${package.version}';
export { install, version, Locale };
export default { install, version, Locale};`;

fs.outputFile(path.resolve(__dirname, '../src/packages/nutui.taro.vue.build.ts'), fileStrBuild, 'utf8', (error) => {
  // logger.success(`${package_config_path} 文件写入成功`);
});
let fileStrDev = `${importStr}
${installFunction}
${importScssStr}
export { install, Locale, ${packages.join(',')}  };
export default { install, version:'${package.version}', Locale};`;
fs.outputFile(path.resolve(__dirname, '../src/packages/nutui.taro.vue.ts'), fileStrDev, 'utf8', (error) => {
  // logger.success(`${package_config_path} 文件写入成功`);
});
```
</details>



##### 3. `cd src/sites/mobile-taro/vue/ && npm run dev:weapp`

这个命令就很熟悉了，就是 taro 项目本地调试微信小程序。


### `yarn build:taro:vue` 构建 Npm 包 [@nutui/nutui-taro](https://www.npmjs.com/package/@nutui/nutui-taro)

#### 命令拆解

>  "build:taro:vue": "npm run checked:taro:vue && vite build --config vite.config.build.taro.vue.ts && vite build --config vite.config.build.taro.vue.disperse.ts && npm run generate:types:taro && npm run generate:themes && vite build --config vite.config.build.css.ts && vite build --config vite.config.build.locale.ts && npm run attrs",

##### 1. `npm run checked:taro:vue`

- `"checked:taro:vue": "npm run generate:file:taro:vue",`
- `"generate:file:taro:vue": "node jd/generate-nutui-taro-vue.js",` 

跟本地调试 taro 版组件一样，执行 node.js 脚本，根据 src/config.json里的组件导航分类的信息，生成组件的入口文件

##### 2. `vite build --config vite.config.build.taro.vue.ts`

根据 `generate:file:taro:vue` 构建生产环境的**组件库(注册)入口文件**

<details>

<summary>`vite.config.build.taro.vue.ts`</summary>

```typescript
// vite.config.build.taro.vue.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import config from './package.json';

const banner = `/*!
* ${config.name} v${config.version} ${new Date()}
* (c) 2022 @jdf2e.
* Released under the MIT License.
*/`;
export default defineConfig({
  define: {
    'process.env.TARO_ENV': 'process.env.TARO_ENV'
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }]
  },
  css: {
    preprocessorOptions: {
      scss: {
        // example : additionalData: `@import "./src/design/styles/variables";`
        // dont need include file extend .scss
        additionalData: `@import "@/packages/styles/variables.scss";@import "@/sites/assets/styles/variables.scss";`
      }
    }
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => {
            return (
              tag.startsWith('swiper') ||
              tag.startsWith('swiper-item') ||
              tag.startsWith('scroll-view') ||
              tag.startsWith('picker') ||
              tag.startsWith('picker-view') ||
              tag.startsWith('picker-view-column')
            );
          },
          whitespace: 'preserve'
        }
      }
    })
  ],
  build: {
    minify: false,
    rollupOptions: {
      // 请确保外部化那些你的库中不需要的依赖
      external: ['vue', 'vue-router', '@tarojs/taro', '@tarojs/components'],
      output: {
        banner,
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        },
        plugins: []
      }
    },
    lib: {
      entry: 'src/packages/nutui.taro.vue.build.ts',
      name: 'nutui',
      fileName: 'nutui',
      formats: ['es', 'umd']
    }
  }
});
```

</details>

##### 3. `vite build --config vite.config.build.taro.vue.disperse.ts`

构建生产环境的**组件目录结构**及 组件对应的 typescript 类型定义

<details>
<summary>`vite.config.build.taro.vue.disperse.ts`</summary>

```typescript
// vite.config.build.taro.vue.disperse.ts
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import vue from '@vitejs/plugin-vue';
import path from 'path';
const fs = require('fs-extra');
import config from './package.json';
import configPkg from './src/config.json';

const banner = `/*!
* ${config.name} v${config.version} ${new Date()}
* (c) 2022 @jdf2e.
* Released under the MIT License.
*/`;

let input = {};

configPkg.nav.map((item) => {
  item.packages.forEach((element) => {
    let { name } = element;
    // if (name.toLowerCase().indexOf('calendar') != -1) {
    const filePath = path.join(`./src/packages/__VUE/${name.toLowerCase()}/index.taro.vue`);
    input[name] = `./src/packages/__VUE/${name.toLowerCase()}/index${fs.existsSync(filePath) ? '.taro' : ''}.vue`;
    // }
  });
});

export default defineConfig({
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }]
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => {
            return (
              tag.startsWith('scroll-view') ||
              tag.startsWith('swiper') ||
              tag.startsWith('swiper-item') ||
              tag.startsWith('picker') ||
              tag.startsWith('picker-view') ||
              tag.startsWith('picker-view-column')
            );
          },
          whitespace: 'preserve'
        }
      }
    }),
    dts({
      insertTypesEntry: true,
      copyDtsFiles: false,
      cleanVueFileName: false,
      outputDir: path.resolve(__dirname, './dist/types'),
      include: path.resolve(__dirname, './src/packages/__VUE'),
      beforeWriteFile: (filePath: string, content: string) => {
        const fileContent = `import { App, PropType, CSSProperties } from 'vue';
declare type Install<T> = T & {
  install(app: App): void;
};
`;
        const start = 'declare const _sfc_main:';
        const end = ';\nexport default _sfc_main;\n';
        let name = Object.keys(input).find((item: string) => item.toLowerCase() === filePath.split('/').slice(-2)[0]);
        name = name ? name : ' ';
        const remain = `
declare module 'vue' {
  interface GlobalComponents {
      Nut${name}: typeof _sfc_main;
  }
}     
      `;
        const inputs = content.match(RegExp(`${start}([\\s\\S]*?)${end}`));
        const changeContent = inputs && inputs.length ? `${start} Install<${inputs[1]}>${end}${remain}` : content;
        return {
          filePath,
          content: fileContent + changeContent
        };
      }
    })
  ],
  build: {
    minify: false,
    lib: {
      entry: '',
      name: 'index',
      // fileName: (format) => format,
      formats: ['es']
    },
    rollupOptions: {
      // 请确保外部化那些你的库中不需要的依赖
      external: ['vue', 'vue-router', '@tarojs/taro', '@/packages/locale', '@tarojs/components'],
      input,
      output: {
        banner,
        paths: {
          '@/packages/locale': '../locale/lang'
        },
        dir: path.resolve(__dirname, './dist/packages/_es'),
        entryFileNames: '[name].js',
        plugins: []
      }
    },
    emptyOutDir: false
  }
});
```

</details>

##### 4. `npm run generate:types:taro`

- `"generate:types:taro": "node jd/generate-types-taro.js",`

构建生产环境 typescript 方式的入口文件

<details>

<summary>`jd/generate-types-taro.js`</summary>

```javascript
// jd/generate-types-taro.js
const config = require('../src/config.json');
const package = require('../package.json');
const path = require('path');
const fs = require('fs-extra');
let importStr = `import Locale from '../packages/locale';\n`;
const packages = [];
config.nav.map((item) => {
  item.packages.forEach((element) => {
    let { name } = element;
    const filePath = path.join(`./src/packages/__VUE/${name.toLowerCase()}/index.taro.vue`);
    importStr += `import ${name} from './__VUE/${name.toLowerCase()}/${
      fs.existsSync(filePath) ? 'index.taro.vue' : 'index.vue'
    }';\n`;

    packages.push(name);
  });
});
let installFunction = `
export { Locale,${packages.join(',')} };`;
let fileStr = importStr + installFunction;
fs.outputFileSync(path.resolve(__dirname, '../dist/types/nutui.d.ts'), fileStr, 'utf8');
fs.outputFileSync(
  path.resolve(__dirname, '../dist/types/index.d.ts'),
  `declare namespace _default {
  export { install };
  export { version };
}
export function install(app: any): void;
export const version: '${package.version}';
export default _default;
export * from './nutui';`,
  'utf8'
);
```

</details>

##### 5. `npm run generate:themes`

- `"generate:themes": "node jd/generate-themes.js",`

构建生产环境的**组件样式**

<details>

<summary>`jd/generate-themes.js`</summary>

```javascript
// jd/generate-themes.js
const config = require('../src/config.json');
const path = require('path');
const fs = require('fs-extra');
let sassFileStr = ``;
let tasks = [];
config.nav.map((item) => {
  item.packages.forEach((element) => {
    let folderName = element.name.toLowerCase();
    tasks.push(
      fs
        .copy(
          path.resolve(__dirname, `../src/packages/__VUE/${folderName}/index.scss`),
          path.resolve(__dirname, `../dist/packages/${folderName}/index.scss`)
        )
        .then((success) => {
          sassFileStr += `@import '../../packages/${folderName}/index.scss';\n`;
        })
        .catch((error) => {})
    );
  });
});

tasks.push(fs.copy(path.resolve(__dirname, '../src/packages/styles'), path.resolve(__dirname, '../dist/styles')));

Promise.all(tasks).then((res) => {
  let themes = [
    { file: 'default.scss', sourcePath: `@import '../variables.scss';` },
    { file: 'jdt.scss', sourcePath: `@import '../variables-jdt.scss';` },
    { file: 'jdb.scss', sourcePath: `@import '../variables-jdb.scss';` },
    { file: 'jddkh.scss', sourcePath: `@import '../variables-jddkh.scss';` }
  ];

  themes.forEach((item) => {
    fs.outputFile(
      path.resolve(__dirname, `../dist/styles/themes/${item.file}`),
      `${item.sourcePath}
${sassFileStr}`,
      'utf8',
      (error) => {
        // logger.success(`文件写入成功`);
      }
    );
  });
});
```

</details>

##### 6. `vite build --config vite.config.build.css.ts`

构建生产环境的全局引入组件时的全部样式

<details>

<summary>`config vite.config.build.css.ts`</summary>

```typescript
//config vite.config.build.css.ts
import { defineConfig } from 'vite';
import config from './package.json';

const banner = `/*!
* ${config.name} v${config.version} ${new Date()}
* (c) 2022 @jdf2e.
* Released under the MIT License.
*/`;

export default defineConfig({
  build: {
    minify: true,
    lib: {
      entry: './dist/styles/themes/default.scss',
      formats: ['es'],
      name: 'style',
      fileName: 'style'
    },
    // rollupOptions: {
    //   output: {
    //     banner
    //   }
    // },
    emptyOutDir: false
  }
});
```

</details>


##### 7. `vite build --config vite.config.build.locale.ts`

构建生产环境的国际化

<details>

<summary>`vite.config.build.locale.ts`</summary>

```typescript
// vite.config.build.locale.ts
import { defineConfig } from 'vite';
import path from 'path';
import config from './package.json';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
const banner = `/*!
* ${config.name} v${config.version} ${new Date()}
* (c) 2022 @jdf2e.
* Released under the MIT License.
*/`;

let input = {
  index: `./src/packages/locale/index`
};
// 动态读取file name
['zh-CN', 'zh-TW', 'en-US', 'id-ID'].map((file) => {
  input[file] = `./src/packages/locale/lang/${file}`;
});
import fs from 'fs-extra';
// 构建index.scss 兼容插件市场按需加载插件
fs.outputFile(path.resolve(__dirname, './dist/packages/locale/index.scss'), ' ', 'utf8', (error) => {});
fs.outputFile(path.resolve(__dirname, './dist/packages/locale/lang/index.scss'), ' ', 'utf8', (error) => {});

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      copyDtsFiles: true,
      cleanVueFileName: true,
      outputDir: path.resolve(__dirname, './dist/packages/'),
      include: path.resolve(__dirname, './src/packages/locale')
    })
  ],
  build: {
    minify: true,
    lib: {
      entry: '',
      name: 'index',
      // fileName: (format) => format,
      formats: ['es']
    },
    rollupOptions: {
      // 请确保外部化那些你的库中不需要的依赖
      external: ['vue'],
      input,
      output: {
        banner,
        dir: path.resolve(__dirname, './dist/packages/locale/lang'),
        entryFileNames: '[name].js',
        plugins: []
      }
    },
    emptyOutDir: false
  }
});
```

</details>

##### 8. `npm run attrs`

- `"attrs": "node ./jd/createAttributes.js"`

构建生产环境的组件涉及到的所有的属性信息

<details>

<summary>`./jd/createAttributes.js`</summary>

```javascript
// ./jd/createAttributes.js
const path = require('path');
const fs = require('fs');
const MarkdownIt = require('markdown-it')();

const basePath = path.resolve(__dirname, './../src/packages/__VUE');
const componentDirs = fs.readdirSync(basePath, 'utf8');
const config = require('./../package.json');
const TYPE_IDENTIFY_OPEN = 'tbody_open';
const TYPE_IDENTIFY_CLOSE = 'tbody_close';
const TR_TYPE_IDENTIFY_OPEN = 'tr_open';
const TR_TYPE_IDENTIFY_CLOSE = 'tr_close';

const getSubSources = (sources) => {
  let sourcesMap = [];
  const startIndex = sources.findIndex((source) => source.type === TYPE_IDENTIFY_OPEN);
  const endIndex = sources.findIndex((source) => source.type === TYPE_IDENTIFY_CLOSE);
  sources = sources.slice(startIndex, endIndex + 1);
  while (sources.filter((source) => source.type === TR_TYPE_IDENTIFY_OPEN).length) {
    let trStartIndex = sources.findIndex((source) => source.type === TR_TYPE_IDENTIFY_OPEN);
    let trEndIndex = sources.findIndex((source) => source.type === TR_TYPE_IDENTIFY_CLOSE);
    sourcesMap.push(sources.slice(trStartIndex, trEndIndex + 1));
    sources.splice(trStartIndex, trEndIndex - trStartIndex + 1);
  }
  return sourcesMap;
};

const genaratorTags = () => {
  let componentTags = {};
  if (!componentDirs.length) return;

  for (let componentDir of componentDirs) {
    let stat = fs.lstatSync(`${basePath}/${componentDir}`);
    if (stat.isDirectory()) {
      const absolutePath = path.join(`${basePath}/${componentDir}`, 'doc.md');
      if (!fs.existsSync(absolutePath)) continue;
      const data = fs.readFileSync(absolutePath, 'utf8');
      let sources = MarkdownIt.parse(data, {});
      let sourcesMap = getSubSources(sources);
      componentTags[`nut-${componentDir}`] = { attributes: [] };
      for (let sourceMap of sourcesMap) {
        let propItem = sourceMap.filter((source) => source.type === 'inline').length
          ? `${sourceMap.filter((source) => source.type === 'inline')[0].content.replace(/`.*?`/g, '')}`
          : '';
        componentTags[`nut-${componentDir}`]['attributes'].push(propItem);
      }
    }
  }

  return componentTags;
};

const genaratorAttributes = () => {
  let componentTags = {};
  if (!componentDirs.length) return;
  for (let componentDir of componentDirs) {
    let stat = fs.lstatSync(`${basePath}/${componentDir}`);
    if (stat.isDirectory()) {
      const absolutePath = path.join(`${basePath}/${componentDir}`, 'doc.md');
      if (!fs.existsSync(absolutePath)) continue;
      const data = fs.readFileSync(absolutePath, 'utf8');
      let sources = MarkdownIt.parse(data, {});
      let sourcesMap = getSubSources(sources);
      for (let sourceMap of sourcesMap) {
        const inlineItem = sourceMap.filter((source) => source.type === 'inline').length
          ? sourceMap.filter((source) => source.type === 'inline')
          : [];
        const propItem = inlineItem.length ? `${inlineItem[0].content.replace(/`.*?`/g, '')}` : '';
        const infoItem = inlineItem.length ? `${inlineItem[1].content}` : '';
        const typeItem = inlineItem.length ? `${inlineItem[2].content.toLowerCase()}` : '';
        const defaultItem = inlineItem.length ? `${inlineItem[3].content}` : '';
        componentTags[`nut-${componentDir}/${propItem}`] = {
          type: `${typeItem}`,
          description: `属性说明：${infoItem}，默认值：${defaultItem}`
        };
      }
    }
  }

  return componentTags;
};

const genaratorWebTypes = () => {
  let typesData = {
    $schema: 'https://raw.githubusercontent.com/JetBrains/web-types/master/schema/web-types.json',
    framework: 'vue',
    name: 'NutUI',
    version: config.version,
    contributions: {
      html: {
        tags: [],
        attributes: [],
        'types-syntax': 'typescript'
      }
    }
  };

  if (!componentDirs.length) return;

  for (let componentDir of componentDirs) {
    let stat = fs.lstatSync(`${basePath}/${componentDir}`);
    if (stat.isDirectory()) {
      const absolutePath = path.join(`${basePath}/${componentDir}`, 'doc.md');
      let attributes = [];
      if (!fs.existsSync(absolutePath)) continue;
      const data = fs.readFileSync(absolutePath, 'utf8');
      let sources = MarkdownIt.parse(data, {});
      let sourcesMap = getSubSources(sources);
      for (let sourceMap of sourcesMap) {
        const inlineItem = sourceMap.filter((source) => source.type === 'inline').length
          ? sourceMap.filter((source) => source.type === 'inline')
          : [];
        const propItem = inlineItem.length ? `${inlineItem[0].content.replace(/`.*?`/g, '')}` : '';
        const infoItem = inlineItem.length ? `${inlineItem[1].content}` : '';
        const typeItem = inlineItem.length ? `${inlineItem[2].content.toLowerCase()}` : '';
        const defaultItem = inlineItem.length ? `${inlineItem[3].content}` : '';
        attributes.push({
          name: propItem,
          default: defaultItem,
          description: infoItem,
          value: {
            type: typeItem,
            kind: 'expression'
          }
        });
      }
      typesData.contributions.html.tags.push({
        name: `nut-${componentDir}`,
        slots: [],
        events: [],
        attributes: attributes.slice()
      });
    }
  }

  return typesData;
};

const writeTags = () => {
  const componentTags = genaratorTags();
  let innerText = `${JSON.stringify(componentTags, null, 2)}`;
  const distPath = path.resolve(__dirname, './../dist');
  const componentTagsPath = path.resolve(__dirname, './../dist/smartips/tags.json');
  if (!fs.existsSync(path.join(distPath + '/smartips'))) {
    fs.mkdirSync(path.join(distPath + '/smartips'));
  }

  fs.writeFileSync(componentTagsPath, innerText);
};

const writeAttributes = () => {
  const componentAttributes = genaratorAttributes();
  let innerText = `${JSON.stringify(componentAttributes, null, 2)}`;
  const distPath = path.resolve(__dirname, './../dist');
  const componentAttributespPath = path.resolve(__dirname, './../dist/smartips/attributes.json');
  if (!fs.existsSync(path.join(distPath + '/smartips'))) {
    fs.mkdirSync(path.join(distPath + '/smartips'));
  }
  fs.writeFileSync(componentAttributespPath, innerText);
};

const writeWebTypes = () => {
  const typesData = genaratorWebTypes();
  let innerText = `${JSON.stringify(typesData, null, 2)}`;
  const distPath = path.resolve(__dirname, './../dist');
  const componentWebTypespPath = path.resolve(__dirname, './../dist/smartips/web-types.json');
  if (!fs.existsSync(path.join(distPath + '/smartips'))) {
    fs.mkdirSync(path.join(distPath + '/smartips'));
  }
  fs.writeFileSync(componentWebTypespPath, innerText);
};

writeTags();
writeAttributes();
writeWebTypes();
```

</details>



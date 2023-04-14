# [Donut](https://dev.weixin.qq.com/docs/framework/) 初探

## 什么是 Donut 多端框架

Donut 多端框架是支持使用小程序原生语法开发移动应用的框架，开发者可以一次编码，分别编译为小程序和 Android 以及 iOS 应用，实现多端开发；能帮助企业有效降低多端应用开发的技术门槛和研发成本，以及提升开发效率和开发体验。

### 核心特性

- 基于该框架开发者可以将小程序构建成可独立运行的移动应用；也可以将小程序构建成运行于原生应用中的业务模块(**该模式暂未全面开放**)。

- 该框架支持条件编译，开发者可灵活按需构建多端应用模块，可更好地满足企业在不同业务场景下搭建移动应用的需求。

- 此外，基于该框架构建的移动应用可实现接近 iOS 和 Android 原生界面和交互体验，可为用户提供高质量的体验。

![](./imgs/img_donut_202212292106959.png)

### 应用场景

Donut 多端框架可以满足不同企业的业务开发需求，开发者可按照企业实际情况进行使用。

![](./imgs/img_donut_202212062310615.png)

### 开发模式

Donut 多端框架开发模式支持嵌入式开发和非嵌入式开发两种模式。

![](./imgs/img_donut_202212292111137.png)


## Mac iOS 开发环境配置

### 1. 安装 Xcode

- 通过 App Store 或是到[ Apple 开发者官网](https://developer.apple.com/xcode/downloads/)下载
- 安装 Xcode 后打开并安装 Apple SDK（完成后这一步骤会同时安装 Xcode IDE、Xcode 的命令行工具和 iOS 模拟器）


### 2. 安装 Cocoapods

- (可能需要先安装/升级 ruby)
    ```bash
    # 安装 ruby
    brew install ruby

    #升级 ruby
    sudo gem update --system
    ```

- Cocoapods
    ```bash
    brew install cocoapods
    # 或者
    sudo gem install cocoapods
    ```

## Mac Android 开发环境配置

### 1. 安装 JDK

1. 前往[官网](https://www.oracle.com/java/technologies/downloads/#java11)下载 （当前多端项目模板使用的是 `6.7.1` 的 gradle 版本，建议使用 `JAVA8` <= JAVA 版本 <= `JAVA15` 的 JAVA 版本）并安装。参考[文章](https://developers.weixin.qq.com/community/develop/article/doc/0006ee52a58b1092580fac7265b013)
2. 配置环境前，可打开终端输入命令 `echo $SHELL` 判断本地 shell 版本， 从而选择对应的环境变量方式，如下面的 bash 或者 zsh
3. 执行 `open -e ~/.bash_profile`， 或者 `open -e ~/.zshrc` 打开对应的配置文件（如果执行的时候发现文件不存在，可以通过 `touch ～/.bash_profile` 或 `touch ~/.zshrc` 新建打开）
4. 添加 `JAVA_HOME` 等相关环境变量，例如下载的版本为 11.0.17，则添加下方内容

    ```bash
    JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-11.0.17.jdk/Contents/Home
    PATH=$JAVA_HOME/bin:$PATH:.
    CLASSPATH=$JAVA_HOME/lib/tools.jar:$JAVA_HOME/lib/dt.jar:.
    export JAVA_HOME
    export PATH
    export CLASSPATH
    ```
5. 执行命令 `source ~/.bash_profile` 或者 `source ~/.zshrc` 使配置生效
6. 验证 JDK 是否安装成功 打开终端，输入 `java -version` 和 `echo $JAVA_HOME` ，查看效果

>注意：如果已经打开开发者工具，需要重启下工具

查看 JDK 安装目录

```bash
/usr/libexec/java_home -V
```


### 2. 安装 Android SDK


#### 1. 下载安装 Android Studio

- 点击安装，安装时选择 `Custom` 选项，不选 `Standard`
- 确保选中了以下几项：`Android SDK`、`Android SDK Platform`、`Android Virtual Device`

>注意：Android SDK 的版本和 supported 的不一致，可以前往「SDK Manager」重新安装一个匹配的版本

![](./imgs/img_donut_20230413174301.png)

#### 2. 通过 Android Studio 安装 Android SDK Command-line Tools

- 打开 Android studio 进行安装 `Android SDK Command-line Tools`
- 选择 `SDK Manager` 进入 `android sdk` 管理器，并勾选 `Android SDK Command-line Tools` 进行安装

#### 3. 配置环境变量

安装后 需要配置对应的环境变量

1. 配置环境前，可打开终端输入可执行 `echo $SHELL` 判断本地 shell 版本，从而选择对应的环境变量方式，如下面的 bash 或者 zsh
2. 执行 `open -e ~/.bash_profile`， 或者 `open -e ~/.zshrc` 打开对应的配置文件（如果执行的时候发现文件不存在，可以通过 `touch ～/.bash_profile` 或 `touch ~/.zshrc` 新建打开）
3. 添加 `ANDROID_HOME` 等相关环境变量，例如下方内容

    ```bash
    export ANDROID_HOME=$HOME/Library/Android/sdk
    export PATH=$PATH:$ANDROID_HOME/emulator
    export PATH=$PATH:$ANDROID_HOME/tools
    export PATH=$PATH:$ANDROID_HOME/tools/bin
    export PATH=$PATH:$ANDROID_HOME/platform-tools
    ```

查看 `ANDROID_HOME` 安装目录

![](./imgs/img_donut_20230413175101.png)

4. 执行命令 `source ~/.bash_profile` 或者 `source ~/.zshrc` 使配置生效
5. 验证是否配置成功，打开终端，输入 `echo $ANDROID_HOME` ，查看效果

>注意：修复环境变量需要重启微信开发者工具项目

>到此，开发环境已安装完成。可以打开「微信开发者工具」——「工具」——「环境检测」查看

![](./imgs/img_donut_20230413175701.png)


## 实操

- 通过「微信开发者工具」打开一个小程序项目，然后切换开发模式为「多端应用模式(Beta)」
    ![](./imgs/img_donut_20230413180201.png)
    ![](./imgs/img_donut_20230413195501.jpg)
    ![](./imgs/img_donut_20230413195502.jpg)
    ![](./imgs/img_donut_20230413195503.jpg)
    ![](./imgs/img_donut_20230413195504.jpg)
    ![](./imgs/img_donut_20230413195505.jpg)

- 登录 [Donut 平台](https://dev.weixin.qq.com/console/crossPlatform)，将当前小程序绑定为多端应用的开发小程序

- 配置多端项目
    ![](./imgs/img_donut_20230413195506.jpg)
    ![](./imgs/img_donut_20230413195507.jpg)

- 填写 SDK 密钥，密钥在 [Donut 平台](https://dev.weixin.qq.com/console/crossPlatform)——「多端应用」——「应用概览」下查看
    ![](./imgs/img_donut_20230413195508.jpg)
    ![](./imgs/img_donut_20230413195509.jpg)
    ![](./imgs/img_donut_20230413195510.jpg)

- 通过「微信开发者工具」——「工具」——「环境检测」查看开发环境
    ![](./imgs/img_donut_20230413195511.jpg)

- 配置构建包输出路径，然后构建打包
    ![](./imgs/img_donut_20230413195512.jpg)
    ![](./imgs/img_donut_20230413195513.jpg)
    ![](./imgs/img_donut_20230413195514.jpg)
    ![](./imgs/img_donut_20230413195515.jpg)

- <a href="./apk/app-arm-release.apk" >apk</a>
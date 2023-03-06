// 单例模式
{
    const Singleton = function ({ name } = {}) {
        this.name = name;
        this.instance = null;
    }
    Singleton.prototype.getName = function () {
        return this.name;
    }
    Singleton.getInstance = function (params) {
        if (!this.instance) {
            this.instance = new Singleton(params)
        }
        return this.instance
    }
    const a = Singleton.getInstance({ name: "a" })
    const b = Singleton.getInstance({ name: "b" })
    console.log(a === b)        //  true
}

// 单例模式
{
    const Singleton = function ({ name } = {}) {
        this.name = name;
    }
    Singleton.prototype.getName = function () {
        return this.name;
    }
    Singleton.getInstance = (function () {
        let instance = null;
        return function (params) {
            if (!instance) {
                instance = new Singleton(params)
            }
            return instance
        }
    })()
    const a = Singleton.getInstance({ name: "a" })
    const b = Singleton.getInstance({ name: "b" })
    console.log(a === b)        //  true
}

// 透明的单例模式
{
    const Singleton = (function () {
        let instance = null;
        const Singleton = function ({ name } = {}) {
            if (instance) {
                return instance
            }
            this.name = name
            this.init()
            instance = this
        }
        Singleton.prototype.init = function () {
            console.log('init')
        }
        return Singleton
    })()
    const a = new Singleton({ name: "a" })
    const b = new Singleton({ name: "b" })
    console.log(a === b)        //  true
}

// 用代理实现单例模式
{
    const Singleton = function ({ name } = {}) {
        this.name = name
        this.init()
    }
    Singleton.prototype.init = function () {
        console.log('init')
    }
    const proxySingleton = (function () {
        let instance = null;
        return function (params) {
            if (!instance) {
                instance = new Singleton(params)
            }
            return instance
        }
    })()
    const a = new proxySingleton({ name: "a" })
    const b = new proxySingleton({ name: "b" })
    console.log(a === b)        //  true
}

{
    const Singleton = {}
}

{
    // 对象字面量
    const namespace1 = {
        a: () => {
            console.log('a')
        },
        b: () => {
            console.log('b')
        }
    }
}

{
    // 动态创建命名空间
    const App = {}
    App.namespace = function ({ name, value } = {}, content = App) {
        const keys = name.split('.')
        for (let key in keys) {
            if (!content[keys[key]]) content[keys[key]] = {}
            if (JSON.parse(key) === keys.length - 1) content[keys[key]] = value
            content = content[keys[key]]
        }
    }
    App.namespace({ name: 'namespace1' })
    App.namespace({ name: 'namespace2.a', value: function () { console.log('a') } })
    console.log(App)
    /*  { 
            namespace: [Function],
            namespace1: undefined,
            namespace2: { a: [Function: value] }
        }
    */
}

{
    // 使用闭包封装私有变量
    const App = (function () {
        const _namespace1 = undefined
        const _namespace2 = {
            a: function () { console.log('a') }
        }
        return {
            namespace1: _namespace1,
            namespace2: _namespace2
        }
    })()
    console.log(App)    //  { namespace1: undefined, namespace2: { a: [Function: a] } }
}

{
    // 惰性单例
    const Singleton = function ({ name } = {}) {
        this.name = name
    }
    Singleton.getInstance = (function () {
        let instance = null
        return function (params) {
            if (!instance) {
                instance = new Singleton(params)
            }
            return instance
        }
    })()
    const a = Singleton.getInstance({ name: 'a' })
    const b = Singleton.getInstance({ name: 'b' })
    console.log(a === b)    //  true
}

{
    const popupEl = (function () {
        //todo 创建弹窗
        const div = document.createElement('div')
        div.innerText = '返回弹窗实例'
        div.style.display = 'none'
        document.body.appendChild(div)
        return div
    })()
    document.body.onclick = function () {
        popupEl.style.display = 'block'
    }
}

{
    const popupEl = function () {
        //todo 创建弹窗
        const div = document.createElement('div')
        div.innerText = '返回弹窗实例'
        div.style.display = 'none'
        document.body.appendChild(div)
        return div
    }
    document.body.onclick = function () {
        const instance = popupEl()
        instance.style.display = 'block'
    }
}

{
    const popupEl = (function () {
        let instance = null
        return function () {
            if (!instance) {
                //todo 创建弹窗
                const div = document.createElement('div')
                div.innerText = '返回弹窗实例'
                div.style.display = 'none'
                document.body.appendChild(div)
                instance = div
            }
            return instance
        }
    })()
    document.body.onclick = function () {
        const instance = popupEl()
        instance.style.display = 'block'
    }
}

{
    const obj = null;
    if (!obj) {
        obj = 'todo create instance'
    }
}

{
    const getInstance = function (fn) {
        let result = null;
        return function () {
            return result || (result = fn.apply(this, arguments))
        }
    }
}

{
    const handleClick = function () {
        document.body.addEventListener('click', () => {
            alert('infinite')
        })
    }
    handleClick()
}

{
    const getInstance = function (fn) {
        let result = null;
        return function () {
            return result || (result = fn.apply(this, arguments))
        }
    }
    const handleClick = function () {
        alert(1)

        return true
    }
    getInstance(handleClick)()
}

{
    let queue: ComponentInstance[] = [];
    let allowMultiple = false;

    function getInstance() {
        if (!queue.length || allowMultiple) {
            const instance = createInstance();
            queue.push(instance);
        }
        return queue[queue.length - 1];
    }
}

{
    Toast.allowMultiple = (value = true) => {
        allowMultiple = value;
    };
}
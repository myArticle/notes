# Vue Test Utils

## Vue Test Utils（VTU）是什么

[Vue Test Utils（VTU）](https://test-utils.vuejs.org/)是一组工具函数，旨在简化 Vue.js 组件的测试。它提供了一些以隔离的方式安装 Vue 组件并与之交互的方法。


## Vue Test Utils（VTU）API

![alt Vue Test Utils API](./Vue%20Test%20Utils.png)

- 测试通常包3个阶段；挂载、动作和断言。
- `mount()` 挂载组件，返回一个包装器。
- `get()` 和 `findAll()` 查询 DOM。
- `trigger()` 触发事件和 `setValue()` 更新值是模拟用户输入。
- `setValue()` 在 DOM 输入和 Vue 组件上设置值。
- `trigger()` 触发带有和不带有修饰符的 DOM 事件。
- `trigger()` 使用第二个参数添加额外的事件数据。
- 断言 DOM 已更改并且发出了正确的事件。尽量不要在 Component 实例上断言数据。
- 更新的 DOM 是一个异步操作，所以一定要使用 `async/await`。
- `find()` 和 `exists()` 一起使用，以验证元素是否在 DOM 中。
- `get()` 获取元素，如果元素不存在会抛出异常，这也是为什么建议：如果元素预计位于 DOM 中时才使用 `get()` 的原因。
- 挂载选项 `data` 可用于设置组件的默认值。
- 使用 `props` 和 `data` 安装选项来预设组件的状态。
- 用于 `setProps()` 在测试期间更新道具。
- 使用 `await` 关键字以确保 `setProps()` 完成更新道具值后再去继续后面的测试。
- `setValue` 和 `trigger` 结合使用，以确保 `data` 一切正常。
- 使用 `get()` 和 `withisVisible()` 验证 DOM 中元素的可见性。
- 用于 `emitted()` 访问 Vue 组件发出的事件。
- `emitted(eventName)` 返回一个数组，其中每个元素代表一个发出的事件。
- 参数按照它们发出的相同顺序存储 `emitted(eventName)[index]` 在数组中。

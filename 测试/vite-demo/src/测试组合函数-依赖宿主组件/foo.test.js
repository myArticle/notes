import { withSetup } from './foo.test-utils'
import { useFoo } from './foo'

test('useFoo', () => {
    const [result, app] = withSetup(() => useFoo(123))
    // 为注入的测试模拟一方供给
    app.provide()
    // 执行断言
    expect(result.foo.value).toBe(123)
    // 如果需要的话可以这样触发
    app.unmount()
})
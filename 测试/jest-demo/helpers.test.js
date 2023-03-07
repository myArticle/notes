const increment = require('./helpers');

test('执行函数 increment(0, 10)， 期待得到 1', () => {
    expect(increment(0, 10)).toBe(1);
})

test('执行函数 increment(10, 10)，期待得到最大值 10', () => {
    expect(increment(10, 10)).toBe(10);
})

test('执行函数 increment(10)，期待得到默认值的最大值 10', () => {
    expect(increment(10)).toBe(10);
})
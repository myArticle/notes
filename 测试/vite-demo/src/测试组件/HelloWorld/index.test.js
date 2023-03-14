import { test, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HelloWorld from './index.vue';

test('content is not exist for default', () => {
    const wrapper = mount(HelloWorld);
    expect(wrapper.find('.hello-world-content').exists()).toBe(false);
})

test('content is exist when visible value is true', () => {
    const wrapper = mount(HelloWorld, {
        props: {
            visible: true,
            content: 'hello world'
        }
    });
    expect(wrapper.find('.hello-world-content').exists()).toBe(true);
    expect(wrapper.find('.hello-world-content').isVisible()).toBe(true);
    expect(wrapper.find('.hello-world-content').html()).toContain('hello');
    expect(wrapper.find('.hello-world-content').html()).toContain('hello world');
    expect(wrapper.find('.hello-world-content').text()).toContain('hello');
    expect(wrapper.find('.hello-world-content').text()).toContain('hello world');
    expect(wrapper.find('.hello-world-content').text()).toBe('hello world');
})

test('setProps change value need async/await', async () => {
    const wrapper = mount(HelloWorld, {
        props: {
            visible: true,
            content: 'vitest'
        }
    });
    expect(wrapper.props()).toContain({ visible: true });
    expect(wrapper.props()).toEqual({
        visible: true,
        content: 'vitest'
    });
    await wrapper.setProps({ content: 'setProps content' });
    expect(wrapper.props()).toContain({
        content: 'setProps content'
    })
    expect(wrapper.props()).toEqual({
        visible: true,
        content: 'setProps content'
    });
    expect(wrapper.find('input').element.value).toBe('setProps content');
})

test('trigger change event', async () => {
    const wrapper = mount(HelloWorld, {
        props: {
            visible: true,
            content: 'vitest',
            // 'onupdate:content': (e) => wrapper.setProps({ content: e })
        }
    });
    expect(wrapper.props()).toContain({ visible: true });
    const input = wrapper.find('input');
    input.element.value = 'trigger input';
    await input.trigger('input');
    expect(wrapper.find('input').element.value).toBe('trigger input');
    expect(wrapper.emitted('update:content')[0][0]).toEqual('trigger input');
    expect(wrapper.props()).not.toContain({
        content: 'trigger input'
    });
})

test('setValue on input', async () => {
    const wrapper = mount(HelloWorld, {
        props: {
            visible: true,
            content: 'vitest',
            // 'onupdate:content': (e) => wrapper.setProps({ content: e })
        }
    });
    expect(wrapper.props()).toContain({ visible: true });
    const input = wrapper.find('input');
    await input.setValue('trigger input')
    expect(wrapper.find('input').element.value).toBe('trigger input');
    expect(wrapper.emitted('update:content')[0][0]).toEqual('trigger input');
    expect(wrapper.props()).not.toContain({
        content: 'trigger input'
    });
})
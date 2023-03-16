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

test('shallow is false', async () => {
    const wrapper = mount(HelloWorld, {
        props: {
            visible: true,
        },
        shallow: false,

    });

    expect(wrapper.classes()).toBe('')
    expect(wrapper.attributes()).toBe('')
    expect(wrapper.html()).toEqual(`<div data-v-a9034a0d="" class="hello-world">
  <div data-v-4d69ffda="" data-v-a9034a0d="" class="header">
    <div data-v-4d69ffda="" class="header-logo">logo</div>
    <div data-v-4d69ffda="" class="header-title">title</div>
    <div data-v-f6b4b835="" data-v-4d69ffda="" class="footer">
      <div data-v-f6b4b835="" class="footer-content">footer</div>
    </div>
  </div>
  <div data-v-a9034a0d="" class="hello-world-content">hello world</div><input data-v-a9034a0d="" type="text">
  <div data-v-f6b4b835="" data-v-a9034a0d="" class="footer">
    <div data-v-f6b4b835="" class="footer-content">footer</div>
  </div>
</div>`);
})

test('shallow is true', async () => {
    const wrapper = mount(HelloWorld, {
        props: {
            visible: true,
        },
        shallow: true,
    });

    expect(wrapper.html()).toEqual(`<div data-v-a9034a0d="" class="hello-world">
  <header-bar-stub data-v-a9034a0d="" logo="logo" title="title"></header-bar-stub>
  <div data-v-a9034a0d="" class="hello-world-content">hello world</div><input data-v-a9034a0d="" type="text">
  <footer-bar-stub data-v-a9034a0d="" content="footer"></footer-bar-stub>
</div>`);
})

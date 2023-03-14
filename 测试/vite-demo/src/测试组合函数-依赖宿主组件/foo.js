import { ref } from 'vue'

export function useFoo(val = 0) {
    const foo = ref(val)

    return {
        foo,
    }
}
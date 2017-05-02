export function debounce(debounceTime = 400) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.value = debounceWrapper(descriptor.value, debounceTime);
    }
}

function debounceWrapper(method: (...args: any[]) => any, duration: number) {
    let timeoutId: NodeJS.Timer;

    function debounceWrapper (...args: any[]) {
        clear();

        timeoutId = setTimeout(() => {
            timeoutId = null;
            method.apply(this, args)
        }, duration)
    }

    function clear() {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null
        }
    }

    return debounceWrapper
}

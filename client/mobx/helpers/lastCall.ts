export function lastCall<T>(callback: string, callbackForReject?: string) {


    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.value = lastCallWrapper(descriptor.value, callback, callbackForReject)
    }
}

function lastCallWrapper(method: () => Promise<any>, callback: any, callbackForReject: any) {
    let raceRej: () => void;

    function lastCallWrapper(...args: any[]) {
        clear();

        return Promise.race([
            method.apply(this, args),
            new Promise((_, rej) => raceRej = rej)
        ])
            .then(this[callback])
            .catch(() => this[callbackForReject] && this[callbackForReject]())
        }

    function clear() {
        if (raceRej) {
            raceRej()
        }
    }

    return lastCallWrapper;
}
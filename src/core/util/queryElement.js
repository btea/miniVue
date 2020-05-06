export function queryElement(el) {
    if (typeof el === 'string') {
        return document.querySelector(el)
    }
    if (el.nodeType) {
        return el
    }
    return document.createElement('div')
}
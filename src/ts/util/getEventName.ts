export const getEventName = () => {
    if (navigator.userAgent.indexOf('iPhone') > -1) {
        return 'touchstart'
    } else {
        return 'click'
    }
}

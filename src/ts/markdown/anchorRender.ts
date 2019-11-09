export const anchorRender = () => {
    document.querySelectorAll('.vditor-anchor').forEach((anchor: HTMLLinkElement) => {
        anchor.onclick = () => {
            const id = anchor.getAttribute('href').substr(1)
            const top = document.getElementById('vditorAnchor-' + id).offsetTop
            document.querySelector("html").scrollTop = top
        }
    })

    window.onhashchange = () => {
        const element = document.getElementById('vditorAnchor-' + decodeURIComponent(window.location.hash.substr(1)))
        if (element) {
            document.querySelector("html").scrollTop = element.offsetTop
        }
    }
};

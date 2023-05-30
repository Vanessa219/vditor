import { getSize, setSize, sizeReg, numToPx } from "../markdown/imageRender";

export const previewImage = (oldImgElement: HTMLImageElement, lang: keyof II18n = "zh_CN", theme = "classic") => {
    const oldImgRect = oldImgElement.getBoundingClientRect();
    const height = 36;
    document.body.insertAdjacentHTML("beforeend", `<div class="vditor vditor-img${theme === "dark" ? " vditor--dark" : ""}">
    <div class="vditor-img__bar">
      <span class="vditor-img__btn" data-deg="0">
        <svg><use xlink:href="#vditor-icon-redo"></use></svg>
        ${window.VditorI18n.spin}
      </span>
      <span class="vditor-img__btn"  onclick="this.parentElement.parentElement.outerHTML = '';document.body.style.overflow = ''">
        X &nbsp;${window.VditorI18n.close}
      </span>
    </div>
    <div class="vditor-img__img" onclick="this.parentElement.outerHTML = '';document.body.style.overflow = ''">
      <img style="width: ${oldImgElement.width}px;height:${oldImgElement.height}px;transform: translate3d(${oldImgRect.left}px, ${oldImgRect.top - height}px, 0)" src="${oldImgElement.getAttribute("src")}">
    </div>
</div>`);
    document.body.style.overflow = "hidden";

    // 图片从原始位置移动到预览正中间的动画效果
    const imgElement = document.querySelector(".vditor-img img") as HTMLImageElement;
    const translate3d = `translate3d(${Math.max(0, window.innerWidth - oldImgElement.naturalWidth) / 2}px, ${Math.max(0, window.innerHeight - height - oldImgElement.naturalHeight) / 2}px, 0)`;
    setTimeout(() => {
        imgElement.setAttribute("style", `transition: transform .3s ease-in-out;transform: ${translate3d}`);
        setTimeout(() => {
            imgElement.parentElement.scrollTo(
                (imgElement.parentElement.scrollWidth - imgElement.parentElement.clientWidth) / 2,
                (imgElement.parentElement.scrollHeight - imgElement.parentElement.clientHeight) / 2);
        }, 400);
    });

    // 旋转
    const btnElement = document.querySelector(".vditor-img__btn");
    btnElement.addEventListener("click", () => {
        const deg = parseInt(btnElement.getAttribute("data-deg"), 10) + 90;
        if ((deg / 90) % 2 === 1 && oldImgElement.naturalWidth > imgElement.parentElement.clientHeight) {
            imgElement.style.transform = `translate3d(${
                Math.max(0, window.innerWidth - oldImgElement.naturalWidth) / 2}px, ${
                oldImgElement.naturalWidth / 2 - oldImgElement.naturalHeight / 2}px, 0) rotateZ(${deg}deg)`;
        } else {
            imgElement.style.transform = `${translate3d} rotateZ(${deg}deg)`;
        }
        btnElement.setAttribute("data-deg", deg.toString());
        setTimeout(() => {
            imgElement.parentElement.scrollTo(
                (imgElement.parentElement.scrollWidth - imgElement.parentElement.clientWidth) / 2,
                (imgElement.parentElement.scrollHeight - imgElement.parentElement.clientHeight) / 2);
        }, 400);
    });
};

export const resizeImage = (oldImgElement: HTMLImageElement, containerElement:HTMLDivElement, vditor: IVditor)=> {
    const nextElement: Element = oldImgElement.nextElementSibling
    if(nextElement && nextElement.id === 'mceResizeHandlenw') {
        return true;
    }
    oldImgElement.style.outline = '3px solid #b4d7ff';

    const {width,height,offsetLeft,offsetTop,resizeEndTop,resizeRight,resizeStartLeft,resizeStartTop} = getResizeAttribute(oldImgElement)

    const enwId = "mceResizeHandlenw", eneId = "mceResizeHandlene", eseId = "mceResizeHandlese", eswId = "mceResizeHandlesw";
    const mceResizeList: string[] = [eneId, eneId, eseId, eswId];
    oldImgElement.insertAdjacentHTML("afterend", `
        <div id="${enwId}" data-mce-bogus="all" class="mce-resizehandle" unselectable="true" style="cursor: nw-resize; margin: 0px; padding: 0px; left: ${resizeStartLeft}px; top: ${resizeStartTop}px;" ></div>
        <div id="${eneId}" data-mce-bogus="all" class="mce-resizehandle" unselectable="true" style="cursor: ne-resize; margin: 0px; padding: 0px; left: ${resizeRight}px; top: ${resizeStartTop}px;"></div>
        <div id="${eseId}" data-mce-bogus="all" class="mce-resizehandle" unselectable="true" style="cursor: se-resize; margin: 0px; padding: 0px; left: ${resizeRight}px; top: ${resizeEndTop}px;"></div>
        <div id="${eswId}" data-mce-bogus="all" class="mce-resizehandle" unselectable="true" style="cursor: sw-resize; margin: 0px; padding: 0px; left: ${resizeStartLeft}px; top: ${resizeEndTop}px;"></div>
    `);

    const resizehandleElement: HTMLElement[] = Array.from(oldImgElement.parentElement.querySelectorAll('.mce-resizehandle'))
    bindEvent()

    let isKeyDown = false;
    const cloneImage = oldImgElement.cloneNode() as HTMLImageElement;
    cloneImage.style.cssText = `position:absolute;border:1px dashed;left:${offsetLeft}px;top:${offsetTop}px;width:${width}px;height:${height}px;z-index:1;`;
    function bindEvent() {
        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
        document.addEventListener('mousedown', onDocMouseDown)
    }
    function onDocMouseDown(e: MouseEvent) {
        const target = e.target as HTMLElement
        if(target === oldImgElement || target === cloneImage) {
            return true;
        }
        console.log(resizehandleElement.indexOf(target), target, resizehandleElement)
        if(resizehandleElement.indexOf(target) === -1) {
            onMouseUp()
            oldImgElement.style.outline = 'none';
            document.removeEventListener('mousedown', onDocMouseDown)
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
            resizehandleElement.forEach(el => el.remove())
        }else {
            onMouseDown(e)
        }
    }

    let x = 0, y = 0;
    let cloneW:string, cloneH:string;

    function onMouseDown(e: MouseEvent) {
        x = e.pageX, y = e.pageY;
        oldImgElement.parentElement.appendChild(cloneImage);
        isKeyDown = true
        cloneW = cloneImage.style.width;
        cloneH = cloneImage.style.height;
        containerElement.style.userSelect = 'none';
        cloneImage.style.opacity = '0.3';
    }
    function onMouseMove(e: MouseEvent) {
        if(isKeyDown) {
            const bothX = e.pageX - x, bothY = e.pageY - y;
            const cloneWidthNum = parseFloat(cloneW),
                  cloneHeightNum = parseFloat(cloneH);
            const imgScale = cloneWidthNum / cloneHeightNum;

            let newWidth = 0, newHeight = 0;
            if(bothX > bothY) {
                newWidth = bothX + cloneWidthNum;
                newHeight = newWidth / imgScale;
            }else {
                newHeight = bothY + cloneHeightNum;
                newWidth = newHeight * imgScale;
            }
            cloneImage.style.cssText += `;width:${newWidth}px;height:${newHeight}px;`
        }
    }
    function onMouseUp() {
        if(isKeyDown && oldImgElement.parentElement.lastElementChild === cloneImage) {
            isKeyDown = false
            const size = getSize(oldImgElement);
            const alt = oldImgElement.alt;
            if(size) {
                oldImgElement.alt = alt.replace(sizeReg, `#${cloneImage.style.width} ${cloneImage.style.height}`);
            }else {
                oldImgElement.alt = alt + `#${cloneImage.style.width} ${cloneImage.style.height}`
            }
            setSize(oldImgElement)
            setResizeHandle(resizehandleElement, oldImgElement)

            const codeBracket: HTMLElement[] = Array.from(vditor.sv.element.querySelectorAll('.vditor-sv__marker--bracket'))
            for(const el of codeBracket) {
                const content = el.textContent.trim()
                if(content === oldImgElement.src.trim() || alt === content) {
                    el.textContent = oldImgElement.alt
                    break;
                }
            }
            oldImgElement.parentElement.removeChild(cloneImage);
            containerElement.style.userSelect = 'auto';
            cloneImage.style.opacity = '1';
        }
    }
    function getResizeAttribute(element: HTMLImageElement) {
        const {offsetLeft, offsetTop, width, height} = getImgRect(element);
        const blockLeft = offsetLeft - 10 //去掉10px内边距的内容
        const blockTop = offsetTop - 10

        const rateLeft = 3, rateRight = 6, rateMiddle = 5;
        const resizeStartLeft = rateLeft + blockLeft; //左边
        const resizeRight = rateRight + blockLeft + width; //右边
        const resizeStartTop = blockTop + rateMiddle; //右上
        const resizeEndTop = resizeStartTop + height //右下
        return {
            blockLeft,
            blockTop,
            resizeStartLeft,
            resizeRight,
            resizeStartTop,
            resizeEndTop,
            offsetLeft, offsetTop, width, height,
        }
    }
    function getImgRect(element: HTMLElement) {
        const {width,height} = element.getBoundingClientRect();
        const {offsetTop, offsetLeft} = element
        return {
            width,
            height,
            offsetTop,
            offsetLeft
        }
    }
    function setResizeHandle(elementList: HTMLElement[], imgElement: HTMLImageElement) {
        elementList.forEach((node: HTMLElement) => {
            if(mceResizeList.includes(node.id)) {
                const {resizeStartLeft, resizeRight, resizeStartTop, resizeEndTop} = getResizeAttribute(imgElement)

                let cssEntris = [resizeStartLeft, resizeStartTop]
                switch(node.id) {
                    case mceResizeList[1]:
                        cssEntris = [resizeRight, resizeStartTop]
                        break;
                    case mceResizeList[2]:
                        cssEntris = [resizeRight, resizeEndTop]
                        break;
                    case mceResizeList[3]:
                        cssEntris = [resizeStartLeft, resizeEndTop]
                        break;
                }
                node.style.cssText += `;left:${numToPx(cssEntris[0])};top:${numToPx(cssEntris[1])};`
            }
        })
    }
}

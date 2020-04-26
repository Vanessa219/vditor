import {i18n} from "../i18n";
import {getMarkdown} from "../util/getMarkdown";

export const download = (vditor: IVditor, content: string, filename: string) => {
    const aElement = document.createElement("a");
    if ("download" in aElement) {
        aElement.download = filename;
        aElement.style.display = "none";
        aElement.href = URL.createObjectURL(new Blob([content]));

        document.body.appendChild(aElement);
        aElement.click();
        aElement.remove();
    } else {
        vditor.tip.show(i18n[vditor.options.lang].downloadTip, 0);
    }
};

export const exportMarkdown = (vditor: IVditor) => {
    const content = getMarkdown(vditor);
    download(vditor, content, content.substr(0, 10) + ".md");
};

export const exportPDF = (vditor: IVditor) => {
    vditor.tip.show(i18n[vditor.options.lang].generate, 3800);
    const iframe = document.querySelector("iframe");
    iframe.contentDocument.open();
    iframe.contentDocument.write(`<link rel="stylesheet" href="${vditor.options.cdn}/dist/index.css"/>
<script src="${vditor.options.cdn}/dist/method.min.js"></script>
<div id="preview"></div>
<script>
window.addEventListener("message", (e) => {
  if(!e.data) {
    return;
  }
  Vditor.preview(document.getElementById('preview'), e.data, {
    markdown: {
      theme: "${vditor.options.preview.markdown.theme}"
    },
    hljs: {
      style: "${vditor.options.preview.hljs.style}"
    }
  });
  setTimeout(() => {
        window.print();
    }, 3600);
}, false);
</script>`);
    iframe.contentDocument.close();
    setTimeout(() => {
        iframe.contentWindow.postMessage(getMarkdown(vditor), "*");
    }, 200);
};

export const exportHTML = (vditor: IVditor) => {
    const content = getMarkdown(vditor);
    const html = `<link rel="stylesheet" href="${vditor.options.cdn}/dist/index.css"/>
<script src="${vditor.options.cdn}/dist/method.min.js"></script>
<div id="preview"></div>
<textarea style="display: none" id="textarea">${content}</textarea>
<script>
  Vditor.preview(document.getElementById('preview'), document.getElementById('textarea').textContent, {
    markdown: {
      theme: "${vditor.options.preview.markdown.theme}"
    },
    hljs: {
      style: "${vditor.options.preview.hljs.style}"
    }
  });
</script>`;
    download(vditor, html, content.substr(0, 10) + ".html");
};

export const exportWeChat = (vditor: IVditor) => {
    vditor.tip.show("已复制，请到微信公众平台粘贴");
    // https://github.com/mdnice/markdown-nice/blob/d34ce36799fbe485b27fe8dfbab2b7c60c46e064/src/utils/converter.js
    // /src/component/Sidebar/Wechat.js
    // https://mdnice.com/
};

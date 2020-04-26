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

export const exportMarkdown = (vditor: IVditor, content: string) => {
    download(vditor, content, content.substr(0, 10) + ".md");
};

export const exportPDF = (vditor: IVditor, content: string) => {
    vditor.tip.show(i18n[vditor.options.lang].generate, 3800);
    const iframe = document.querySelector("iframe");
    iframe.contentDocument.open();
    iframe.contentDocument.write(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vditor@3.1.18/dist/index.css"/>
<script src="https://cdn.jsdelivr.net/npm/vditor@3.1.18/dist/method.min.js"></script>
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

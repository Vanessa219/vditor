import {code160to32} from "../util/code160to32";
import {getPrismEditor} from "./prismRender";

export const getMarkdown = (vditor: IVditor) => {
    if (vditor.currentMode === "sv") {
        return code160to32(`${vditor.sv.element.textContent}\n`.replace(/\n\n$/, "\n"));
    } else if (vditor.currentMode === "wysiwyg") {
        // 在 WYSIWYG 模式下，需要从 Prism Code Editor 获取代码内容
        const wysiwygElement = vditor.wysiwyg.element;
        // 查找所有已渲染的代码块预览区域（包括 data-render='1' 和 data-render='2'）
        const previewElements = wysiwygElement.querySelectorAll(".vditor-wysiwyg__preview");
        
        // 临时存储原始内容，用于恢复
        const originalContents = new Map<HTMLElement, string>();
        
        // 遍历所有代码块预览区域，从 Prism 编辑器获取内容
        previewElements.forEach((previewElement: HTMLElement) => {
            const editor = getPrismEditor(previewElement);
            if (editor) {
                try {
                    // 获取 Prism 编辑器中的代码内容
                    const codeContent = editor.value || "";
                    
                    // 找到对应的原始代码区域
                    const previousElement = previewElement.previousElementSibling as HTMLElement;
                    if (previousElement) {
                        const codeElement = previousElement.querySelector("code");
                        if (codeElement) {
                            // 保存原始内容
                            originalContents.set(codeElement, codeElement.textContent);
                            // 临时替换为 Prism 编辑器中的内容
                            codeElement.textContent = codeContent;
                        }
                    }
                } catch (e) {
                    console.error("Failed to get value from Prism editor:", e);
                }
            }
        });
        
        // 转换 DOM 为 Markdown
        const markdown = vditor.lute.VditorDOM2Md(wysiwygElement.innerHTML);
        
        // 恢复原始内容
        originalContents.forEach((originalContent, codeElement) => {
            codeElement.textContent = originalContent;
        });
        
        return markdown;
    } else if (vditor.currentMode === "ir") {
        return vditor.lute.VditorIRDOM2Md(vditor.ir.element.innerHTML);
    }
    return "";
};

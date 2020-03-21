import {abcRender} from "./ts/markdown/abcRender";
import {chartRender} from "./ts/markdown/chartRender";
import {codeRender} from "./ts/markdown/codeRender";
import {graphvizRender} from "./ts/markdown/graphvizRender";
import {highlightRender} from "./ts/markdown/highlightRender";
import {mathRender} from "./ts/markdown/mathRender";
import {md2htmlByPreview} from "./ts/markdown/md2html";
import {mediaRender} from "./ts/markdown/mediaRender";
import {mermaidRender} from "./ts/markdown/mermaidRender";
import {previewRender} from "./ts/markdown/previewRender";
import {speechRender} from "./ts/markdown/speechRender";
class Vditor {

    /** 为 element 中的代码块添加复制按钮 */
    public static codeRender = codeRender;
    /** 对 graphviz 进行渲染 */
    public static graphvizRender = graphvizRender;
    /** 为 element 中的代码块进行高亮渲染 */
    public static highlightRender = highlightRender;
    /** 对数学公式进行渲染 */
    public static mathRender = mathRender;
    /** 转换 element 中 class 为 className 的元素为流程图/时序图/甘特图 */
    public static mermaidRender = mermaidRender;
    /** 图表渲染 */
    public static chartRender = chartRender;
    /** 五线谱渲染 */
    public static abcRender = abcRender;
    /** 为[特定链接](https://github.com/Vanessa219/vditor/issues/7)分别渲染为视频、音频、嵌入的 iframe */
    public static mediaRender = mediaRender;
    /** 对选中的文字进行阅读 */
    public static speechRender = speechRender;
    /** Markdown 文本转换为 HTML */
    public static md2html = md2htmlByPreview;
    /** 页面 Markdown 文章渲染 */
    public static preview = previewRender;
}

export default Vditor;

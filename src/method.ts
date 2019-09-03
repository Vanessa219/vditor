import {abcRender} from "./ts/markdown/abcRender";
import {chartRender} from "./ts/markdown/chartRender";
import {codeRender} from "./ts/markdown/codeRender";
import {emojiRender} from "./ts/markdown/emojiRender";
import {highlightRender} from "./ts/markdown/highlightRender";
import {mathRender} from "./ts/markdown/mathRender";
import {md2htmlByText} from "./ts/markdown/md2html";
import {mermaidRender} from "./ts/markdown/mermaidRender";
import {preview, preview as vditorPreview} from "./ts/markdown/preview";

class Vditor {

    public static codeRender = codeRender;
    public static highlightRender = highlightRender;
    public static mathRender = mathRender;
    public static mermaidRender = mermaidRender;
    public static chartRender = chartRender;
    public static abcRender = abcRender;
    public static md2html = md2htmlByText;
    public static emojiRender = emojiRender;
    public static preview = vditorPreview;
}

export default Vditor;

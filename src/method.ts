import {abcRender} from "./ts/markdown/abcRender";
import {chartRender} from "./ts/markdown/chartRender";
import {codeRender} from "./ts/markdown/codeRender";
import {mathRender} from "./ts/markdown/mathRender";
import {mermaidRender} from "./ts/markdown/mermaidRender";
import {preview} from "./ts/markdown/preview";
import {md2htmlByText} from "./ts/markdown/md2html";

class Vditor {

    public static mathRender = mathRender;
    public static mermaidRender = mermaidRender;
    public static abcRender = abcRender;
    public static codeRender = codeRender;
    public static chartRender = chartRender;
    public static md2html = md2htmlByText;
    public static preview = preview;
}

export default Vditor;

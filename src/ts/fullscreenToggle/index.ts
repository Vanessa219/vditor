import {setPadding, setTypewriterPosition} from "../ui/initUI";

export class FullscreenToggle {
  public fullscreenToggle(vditor: IVditor) {
    if (vditor.element.className.includes("vditor--fullscreen")) {
      vditor.element.style.zIndex = "";
      document.body.style.overflow = "";
      vditor.element.classList.remove("vditor--fullscreen");
      Object.keys(vditor.toolbar.elements).forEach((key) => {
        const svgElement = vditor.toolbar.elements[key].firstChild as HTMLElement;
        if (svgElement) {
          svgElement.className = svgElement.className.replace("__s", "__n");
        }
      });
      if (vditor.counter) {
        vditor.counter.element.className = vditor.counter.element.className.replace("__s", "__n");
      }
    } else {
      vditor.element.style.zIndex = vditor.options.fullscreen.index.toString();
      document.body.style.overflow = "hidden";
      vditor.element.classList.add("vditor--fullscreen");
      Object.keys(vditor.toolbar.elements).forEach((key) => {
        const svgElement = vditor.toolbar.elements[key].firstChild as HTMLElement;
        if (svgElement) {
          svgElement.className = svgElement.className.replace("__n", "__s");
        }
      });
      if (vditor.counter) {
        vditor.counter.element.className = vditor.counter.element.className.replace("__n", "__s");
      }
    }

    if (vditor.devtools) {
      vditor.devtools.renderEchart(vditor);
    }

    setPadding(vditor);

    setTypewriterPosition(vditor);
  }

}
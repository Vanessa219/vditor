import {disableToolbar, enableToolbar} from "../toolbar/setToolbar";
import {Constants} from "../constants";
export class Title {
  public element: HTMLElement;
  private input: HTMLInputElement;

  constructor(vditor:IVditor) {
      this.element = document.createElement("div");
      this.element.className = "vditor-title";

      this.input = document.createElement("input");
      this.input.className = "vditor-title__input";
      this.input.type = "text";
      this.element.appendChild(this.input)

      this.element.addEventListener("input", (event: InputEvent) => {
        if (typeof vditor.options.titleInput === "function") {
          vditor.options.titleInput(this.input.value)
        }
      })

      this.input.addEventListener("focus", () => {
        disableToolbar(vditor.toolbar.elements,Constants.EDIT_TOOLBARS)
      });

      this.input.addEventListener("blur", () => {
        enableToolbar(vditor.toolbar.elements,Constants.EDIT_TOOLBARS)
      });

  }
   
  public setValue(content: string) { 
    this.input.value = content
  }

  public getValue() { 
    return this.input.value
  }

}
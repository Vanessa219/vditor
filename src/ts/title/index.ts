import {disableToolbar, enableToolbar} from "../toolbar/setToolbar";
import {Constants} from "../constants";
export class Title {
  public element: HTMLElement;
  private textarea: HTMLTextAreaElement;

  constructor(vditor:IVditor) {
      this.element = document.createElement("div");
      this.element.className = "vditor-title";
    
      this.textarea = document.createElement("textarea");
      this.textarea.className = "vditor-title__input";
      this.element.appendChild(this.textarea);
      this.textarea.rows =1
      this.textarea.autofocus = true
      this.textarea.addEventListener("input", function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
      });
      this.element.addEventListener("input", (event: InputEvent) => {
        if (typeof vditor.options.titleInput === "function") {
          vditor.options.titleInput(this.textarea.value)
        }
      })

      this.textarea.addEventListener("keydown", (e) => {
        if (e.keyCode === 13) {
          e.preventDefault();
        }
      })

      this.textarea.addEventListener("focus", () => {
        disableToolbar(vditor.toolbar.elements,Constants.EDIT_TOOLBARS)
      });

      this.textarea.addEventListener("blur", () => {
        enableToolbar(vditor.toolbar.elements,Constants.EDIT_TOOLBARS)
      });
  }
   
  public setValue(content: string, maxLength:number) { 
    this.textarea.value = content;
    this.textarea.value = content;
    this.textarea.maxLength = maxLength ? maxLength : 100;
    this.textarea.style.height = 'auto';
    this.textarea.style.height = (this.textarea.scrollHeight) + 'px';
  }

  public getValue() { 
    return this.textarea.value
  }

}
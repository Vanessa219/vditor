
export class Title {
  public element: HTMLElement;
  private input: HTMLInputElement;

  constructor() {
      this.element = document.createElement("div");
      this.element.className = "vditor-title";

      this.input = document.createElement("input");
      this.input.className = "vditor-title__input";
      this.input.type = "text";
      this.element.appendChild(this.input)
  }
   
  public setValue(content: string) { 
    this.input.value = content
  }

  public getValue() { 
    return this.input.value
  }

}
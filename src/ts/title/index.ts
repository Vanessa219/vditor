
export class Title {
  public element: HTMLElement;
  public value: string;

  constructor() {
      this.element = document.createElement("div");
      this.element.className = "vditor-title";
      this.value = ''
  }
   
  public setValue(content: string) { 
    this.element.innerHTML = `<input class="vditor-title__input" type="text" value=${content}> </input>`;
    this.value = content
    this.element.addEventListener("input", (event: InputEvent) => {
      this.value = event.target.value
    })
  }

  public getValue() { 
    return this.value
  }

}
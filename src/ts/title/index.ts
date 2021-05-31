
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
      if (event.data) {
        this.value =  this.value += event.data
      } else {
        this.value =  this.value.substr(0, this.value.length - 1)
      }
    })
  }

  public getValue() { 
    return this.value
  }

}
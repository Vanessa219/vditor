// import {disableToolbar} from "./setToolbar";

export class Title {
  public element: HTMLElement;

  constructor() {
      this.element = document.createElement("div");
      this.element.className = "vditor-title";
  }
}
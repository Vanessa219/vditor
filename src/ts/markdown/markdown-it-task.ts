export const task = (md: markdownit) => {
    md.core.ruler.after("inline", "github-task-lists", (state) => {
        state.tokens.forEach((token, index: number) => {
            if (token.type === "inline" &&
                (token.content.indexOf("[ ] ") === 0 || token.content.toLocaleLowerCase().indexOf("[x] ") === 0) &&
                state.tokens[index - 1].type === "paragraph_open" &&
                state.tokens[index - 2].type === "list_item_open"
            ) {
                const checkbox = new state.Token("checkbox_input", "input", 0);
                checkbox.attrs = [["type", "checkbox"], ["disabled", "true"]];
                if (token.content.toLocaleLowerCase().indexOf("[x] ") === 0) {
                    checkbox.attrs.push(["checked", "true"]);
                }

                token.children[0].content = token.children[0].content.slice(3);
                token.children.unshift(checkbox);

                if (state.tokens[index - 2].attrIndex("class") < 0) {
                    state.tokens[index - 2].attrPush(["class", "vditor-task"]);
                } else {
                    state.tokens[index - 2].attrs[index] = ["class", "vditor-task"];
                }
            }
        });
    });
};

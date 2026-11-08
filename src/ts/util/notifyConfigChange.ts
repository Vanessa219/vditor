export const notifyConfigChange = (vditor: IVditor) => {
    vditor.options.configChange?.({
        mode: vditor.currentMode,
        theme: vditor.options.theme,
        preview: {
            mode: vditor.options.preview.mode,
            theme: {current: vditor.options.preview.theme.current},
            hljs: {style: vditor.options.preview.hljs.style},
        },
        outline: {
            enable: vditor.options.outline.enable,
            position: vditor.options.outline.position,
            ...(vditor.options.outline.width === undefined ? {} : {width: vditor.options.outline.width}),
        },
    });
};

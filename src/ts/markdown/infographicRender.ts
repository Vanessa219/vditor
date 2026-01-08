import {Constants} from "../constants";
import {addScript} from "../util/addScript";

declare const AntVInfographic: {
    Infographic: new (options: {
        container: HTMLElement;
        svg?: {
            style?: {
                width?: string;
                height?: string;
                background?: string;
            };
            background?: boolean;
        };
        theme?: string;
        themeConfig?: {
            colorPrimary?: string;
            colorBg?: string;
        };
    }) => {
        render(code: string): void;
    };
    setDefaultFont: (font: string) => void;
    setFontExtendFactor: (factor: number) => void;
};

type InfographicThemeMode = "dark" | "light";

interface InfographicRenderOptions {
    themeMode: InfographicThemeMode;
}

const INFOGRAPHIC_LANGUAGE = "infographic";
const INFOGRAPHIC_CONTAINER_CLASS = "infographic-diagram";
const INFOGRAPHIC_SCRIPT_ID = "vditorInfographicScript";
const INFOGRAPHIC_DEFAULT_FONT =
    '"Helvetica Neue", "Luxi Sans", "DejaVu Sans", "Hiragino Sans GB", "Microsoft Yahei", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Segoe UI Symbol", "Android Emoji", EmojiSymbols';

let hasConfiguredDefaults = false;

const DATA_PROCESSED_ATTR = "data-infographic-processed";
const DATA_CODE_ATTR = "data-infographic-code";
const DATA_THEME_ATTR = "data-infographic-theme";
const DATA_RENDER_ID_ATTR = "data-infographic-render-id";

const toHslString = (value: string) => {
    if (!value) {
        return undefined;
    }
    const normalized = value.replace(/\s*\/\s*/g, " ").trim();
    const parts = normalized.split(/\s+/);
    if (parts.length === 3) {
        return `hsl(${parts.join(", ")})`;
    }
    if (parts.length === 4) {
        return `hsla(${parts.join(", ")})`;
    }
    return undefined;
};

const normalizeThemeColor = (value: string) => {
    const trimmed = value?.trim();
    if (!trimmed) {
        return undefined;
    }
    return toHslString(trimmed) || trimmed;
};

const ensureInfographicDefaults = () => {
    if (hasConfiguredDefaults || typeof AntVInfographic === "undefined") {
        return;
    }
    AntVInfographic.setFontExtendFactor(1.1);
    AntVInfographic.setDefaultFont(INFOGRAPHIC_DEFAULT_FONT);
    hasConfiguredDefaults = true;
};

const getThemeRoot = (element: HTMLElement) => {
    return element.closest(".vditor") || element.ownerDocument.documentElement;
};

const isTransparentColor = (value?: string) => {
    if (!value) {
        return true;
    }
    const normalized = value.replace(/\s+/g, "").toLowerCase();
    return normalized === "transparent" || normalized === "rgba(0,0,0,0)";
};

const getThemeColors = (element: HTMLElement) => {
    const root = getThemeRoot(element);
    const computedStyle = getComputedStyle(root);
    const primary =
        computedStyle.getPropertyValue("--toolbar-icon-hover-color") ||
        computedStyle.getPropertyValue("--ir-link-color") ||
        computedStyle.getPropertyValue("--textarea-text-color");
    const background =
        computedStyle.getPropertyValue("--panel-background-color") ||
        computedStyle.getPropertyValue("--textarea-background-color") ||
        computedStyle.backgroundColor;

    const colorPrimary = normalizeThemeColor(primary);
    const colorBg = normalizeThemeColor(background);
    return {
        colorPrimary,
        colorBg: isTransparentColor(colorBg) ? undefined : colorBg,
    };
};

const renderInfographicError = (container: HTMLElement, error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    container.innerHTML = `
        <div style="color: #b91c1c; padding: 10px; border: 1px solid #b91c1c; background: rgba(185, 28, 28, 0.08);">
            Infographic render error: ${message}
        </div>
    `;
};

const renderInfographic = async (
    container: HTMLElement,
    code: string,
    options: InfographicRenderOptions,
) => {
    if (typeof window === "undefined") {
        return;
    }

    try {
        if (typeof AntVInfographic === "undefined") {
            throw new Error("Infographic library not loaded.");
        }
        ensureInfographicDefaults();
        const renderTheme = options.themeMode === "dark" ? "dark" : "default";
        const themeColors = getThemeColors(container);
        const renderId = `${Date.now().toString(36)}-${Math.random()
            .toString(36)
            .slice(2, 8)}`;
        container.setAttribute(DATA_RENDER_ID_ATTR, renderId);

        const instance = new AntVInfographic.Infographic({
            container,
            svg: {
                style: {
                    width: "100%",
                    height: "100%",
                    background: themeColors.colorBg || "transparent",
                },
                background: false
            },
            theme: renderTheme,
            themeConfig: {
                colorPrimary: themeColors.colorPrimary || undefined,
                colorBg: themeColors.colorBg,
            },
        });

        instance.render(code);
    } catch (error) {
        renderInfographicError(container, error);
    }
};

const getInfographicCode = (element: HTMLElement) => {
    const cached = element.getAttribute(DATA_CODE_ATTR);
    if (cached) {
        return cached;
    }
    return element.textContent || "";
};

const ensureInfographicContainer = (element: HTMLElement) => {
    const existing = element.querySelector<HTMLElement>(
        `.${INFOGRAPHIC_CONTAINER_CLASS}`,
    );
    if (existing) {
        return existing;
    }

    const container = document.createElement("div");
    container.className = INFOGRAPHIC_CONTAINER_CLASS;
    container.textContent = "Loading infographic...";

    element.innerHTML = "";
    element.appendChild(container);
    return container;
};

const getInfographicNodes = (element: HTMLElement | Document) => {
    const nodes = new Set<HTMLElement>();
    if (element instanceof HTMLElement) {
        if (element.classList.contains(`language-${INFOGRAPHIC_LANGUAGE}`)) {
            nodes.add(element);
        }
    }
    element
        .querySelectorAll<HTMLElement>(`.language-${INFOGRAPHIC_LANGUAGE}`)
        .forEach((node) => nodes.add(node));
    return Array.from(nodes);
};

export const infographicRender = (
    element: HTMLElement | Document = document,
    cdn = Constants.CDN,
    theme: string,
) => {
    if (typeof window === "undefined") {
        return;
    }

    const themeMode: InfographicThemeMode = theme === "dark" ? "dark" : "light";
    const nodes = getInfographicNodes(element);
    if (nodes.length === 0) {
        return;
    }

    const targets = nodes.filter((node) => {
        const parent = node.parentElement;
        if (
            parent?.classList.contains("vditor-wysiwyg__pre") ||
            parent?.classList.contains("vditor-ir__marker--pre")
        ) {
            return false;
        }

        const copyElement = node.previousElementSibling;
        if (copyElement?.classList.contains("vditor-copy")) {
            copyElement.remove();
        }

        const code = getInfographicCode(node).trim();
        if (!code) {
            return false;
        }

        const previousCode = node.getAttribute(DATA_CODE_ATTR);
        const previousTheme = node.getAttribute(DATA_THEME_ATTR);
        const processed = node.getAttribute(DATA_PROCESSED_ATTR) === "true";
        if (processed && previousCode === code && previousTheme === themeMode) {
            return false;
        }

        node.setAttribute(DATA_CODE_ATTR, code);
        node.setAttribute(DATA_THEME_ATTR, themeMode);
        node.setAttribute(DATA_PROCESSED_ATTR, "true");

        return true;
    });

    if (targets.length === 0) {
        return;
    }

    addScript(`${cdn}/dist/js/infographic/infographic.min.js`, INFOGRAPHIC_SCRIPT_ID).then(() => {
        targets.forEach((node) => {
            const code = getInfographicCode(node).trim();
            if (!code) {
                return;
            }
            const container = ensureInfographicContainer(node);
            container.textContent = "Loading infographic...";
            void renderInfographic(container, code, {themeMode});
        });
    }).catch((error) => {
        targets.forEach((node) => {
            const container = ensureInfographicContainer(node);
            renderInfographicError(container, error);
        });
    });
};

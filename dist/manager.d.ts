import { ThemeInterface } from "./types";
export type StyleObject = {
    [selector: string]: {
        [property: string]: string;
    };
};
export interface ThemeManagerInterface {
    theme: ThemeInterface<{}>;
    composedTheme?: SingleLayerObject;
    singleLayerTheme?: SingleLayerObject;
    overriders?: Record<string, SingleLayerObject>;
}
type SingleLayerObjectValue = {
    routeSet: Set<string>;
    value: string;
    varName: string;
    overriderRoute?: string[];
};
type SingleLayerObject = Record<string, SingleLayerObjectValue>;
export declare class ThemeManager {
    static shared: ThemeManager;
    separator: string;
    populateTheme(theme: ThemeInterface<{}>): void;
    private loadThemeOnStyleTag;
    private populateThemeVars;
    switchOveriderOnElement(overriderTypes: string[], element?: HTMLElement): void;
    loadOveriderOnElement(overriderClass: string, overriderTypes: string[], element?: HTMLElement): void;
    private nameReplacer;
    getFontCSSClassesFromFonts(fonts?: any, inter?: (fontName: string, className: string) => void): Record<string, Record<string, string>>;
    private transformMultilayerObject;
    private getElementsFromSingleLayerObject;
    private getSingleLayerComposedTheme;
    private setSingleLayerThemeAndOverriders;
    private getVariablesFrom;
}
export {};

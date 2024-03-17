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
export type SingleLayerObjectValue = {
    routeSet: Set<string>;
    value: string;
    varName: string;
    overriderRoute?: string[];
};
export type SingleLayerObject = Record<string, SingleLayerObjectValue>;
export type SingleLayerSearch = Record<string, {
    contains: boolean;
    route: string[];
}>;
export type OverriderClassType = {
    oType: string;
    className: string;
};
export declare class ThemeManager {
    static shared: ThemeManager;
    separator: string;
    populateTheme(theme: ThemeInterface<{}>): void;
    private loadThemeOnStyleTag;
    private populatevars;
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

import { StyleObject } from "./manager";
import { ThemeType, ColorTypes, ColorOpacities } from "./types";
export declare class ThemeManagerUtils {
    static populateObjectValue(obj: any, route: string[], value: any): void;
    static jsonToCss(jsonStyles: StyleObject): string;
    static splitAtOccurrence(str: string, separator: string, occurrence: number): [string, string?];
    static generateColorVariants(baseColor: string, theme: ThemeType): ColorTypes;
    static transformColorsRecursive(current: any, route?: string[], theme?: ThemeType): void;
    static getColorOpacities(color: string): ColorOpacities;
    static addAlphaToColor(hex: string, alpha: number): string;
    static lightenOrDarkenColor(color: string, amt: number): string;
}

import { StyleObject, ThemeManager } from "./manager";
import { ThemeType, ColorTypes, ColorOpacities } from "./types";


export class ThemeManagerUtils {

    // MARK: UTILS 
    static populateObjectValue(obj: any,route : string[], value: any): void {
        let current = obj;
        for (let i = 0; i < route.length - 1; i++) {
            const key = route[i];
            if (!(key in current)) {
            current[key] = {};
            }
            current = current[key];
        }
        current[route[route.length - 1]] = value;
    }

    static jsonToCss(jsonStyles: StyleObject): string {
        let cssString = "";
        for (const selector in jsonStyles) {
            cssString += `${selector} {\n`;
            for (const property in jsonStyles[selector]) {
            const value = jsonStyles[selector][property];
            if (value == "" || value == undefined) {continue}
            cssString += `  ${property}: ${value};\n`;
            }
            cssString += "}\n";
        }
        return cssString;
    }
      

    static splitAtOccurrence(str: string, separator: string, occurrence: number): [string, string?] {
        let index = -1;

        // Loop to find the nth occurrence of the separator
        for (let i = 0; i < occurrence; i++) {
            index = str.indexOf(separator, index + 1);
            if (index === -1) {
                break;
            }
        }

        if (index === -1) {
            return [str];
        }

        // Split the string into two parts: before and after the nth separator
        const firstPart: string = str.substring(0, index);
        // Add separator.length to skip the separator
        const secondPart: string = str.substring(index + separator.length);

        return [firstPart, secondPart];
    }


    // MARK: COLORS
    static generateColorVariants(baseColor: string, theme:ThemeType): ColorTypes {
        const adjustment = theme === 'dark' ? 20 : -15;
        const adjustedColor = this.lightenOrDarkenColor(baseColor, adjustment);

        return {
            normal: this.getColorOpacities(baseColor),
            variant: this.getColorOpacities(adjustedColor),
        };
    }


    static transformColorsRecursive(current: any,route: string[] = [],theme: ThemeType = "dark") {
        let isColors = (route[route.length - 1]) == "colors"
        let mTheme: ThemeType  = theme  
         Object.entries(current).forEach(([currentKey, currentValue]) => {
            const newRoute = [...route,currentKey]
            if (currentKey == "themeType") {mTheme = currentValue as ThemeType}
            if (isColors) {
                current[currentKey] = this.generateColorVariants(`${currentValue}`,mTheme as ThemeType)
                return
            }
            if (typeof currentValue === 'object' && !Array.isArray(currentValue) && currentValue !== null  && currentValue !== undefined) {
                this.transformColorsRecursive(currentValue,newRoute,mTheme)
            } 
        }, {});
    }


    // Utility function to apply an alpha variant to a given color
    static getColorOpacities(color: string): ColorOpacities {
        const alphaMapping: ColorOpacities = {
            _10: this.addAlphaToColor(color, 0.1),
            _25: this.addAlphaToColor(color, 0.25),
            _50: this.addAlphaToColor(color, 0.5),
            _75: this.addAlphaToColor(color, 0.75),
            _90: this.addAlphaToColor(color, 0.9),
            _100: color, // Full opacity
        };
        return alphaMapping;
    }

    static addAlphaToColor(hex: string, alpha: number): string {
        // Assuming hex format is "#RRGGBB"
        const r = parseInt(hex.slice(1, 3), 16),
              g = parseInt(hex.slice(3, 5), 16),
              b = parseInt(hex.slice(5, 7), 16),
              a = alpha.toFixed(2);
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    static lightenOrDarkenColor(color: string, amt: number): string {
        // Simple function to lighten or darken a hex color
        let usePound = false;
        if (color[0] == "#") {
            color = color.slice(1);
            usePound = true;
        }

        var num = parseInt(color, 16);
        var r = (num >> 16) + amt;
        if (r > 255) r = 255;
        else if (r < 0) r = 0;

        var b = ((num >> 8) & 0x00FF) + amt;
        if (b > 255) b = 255;
        else if (b < 0) b = 0;

        var g = (num & 0x0000FF) + amt;
        if (g > 255) g = 255;
        else if (g < 0) g = 0;

        return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
    }


}
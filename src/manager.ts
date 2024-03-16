import { ThemeInterface } from "./types";
import { defaultTheme } from "./default-theme";
import { ThemeManagerUtils } from "./utils";

export type StyleObject = {
    [selector: string]: {
      [property: string]: string;
    };
  };

export interface ThemeManagerInterface {

    theme : ThemeInterface<{}>;

    // THEME WITH OVERRIDERS
    composedTheme?: SingleLayerObject;
    // THEME
    singleLayerTheme?: SingleLayerObject;
    // OVERRIDERS
    overriders?: Record<string,SingleLayerObject>
}

export type SingleLayerObjectValue = {
    routeSet : Set<string>,
    value: string,
    varName : string,
    overriderRoute?: string[]
}

export type SingleLayerObject = Record<string,SingleLayerObjectValue>
export type SingleLayerSearch = Record<string,{ contains: boolean, route: string[]}>

export class ThemeManager {

    static shared : ThemeManager = new ThemeManager();

    separator = "---"

    // on:HTMLElement = App.getAPP().rootView.getElement()?.get(0) || document.body

    populateTheme(theme:ThemeInterface<{}>)  {
    
        // Creat a new theme:
        let themeInterface : ThemeManagerInterface = {theme: theme}

        // override the unset values of theme with default theme.
        themeInterface.composedTheme =  this.getSingleLayerComposedTheme(theme)

        // Separate overriders from the themes.
        this.setSingleLayerThemeAndOverriders(themeInterface)
        
        // create all the variables of the theme and set them on the root of the stylesheet.
        this.loadThemeOnStyleTag(themeInterface)

        // Populate theme vars with overrider and font classes and vars.
        this.populateThemeVars(themeInterface)
    }

  


    private loadThemeOnStyleTag(themeInterface:ThemeManagerInterface) {
        let stylesObject : StyleObject = {
            ':root': {
                ...{...this.getVariablesFrom(themeInterface.singleLayerTheme)}
            },
            ...Object.entries(themeInterface.overriders || {}).reduce((accumulator,[key,value]) => {
                accumulator["." + key] = this.getVariablesFrom(value," !important")
                return accumulator
            },{} as Record<string,Record<string,string>>),
            ...{...this.getFontCSSClassesFromFonts(themeInterface.theme.themeCreator.fonts)},
            ...{...this.getFontCSSClassesFromFonts(defaultTheme.themeCreator.fonts)}
        }

        let stylesParsed = ThemeManagerUtils.jsonToCss(stylesObject);
        let stylesTag = document.createElement("style");
        let dateID = `${Date.now()}`
        themeInterface.theme.sheetSelector = `#${dateID}`
        stylesTag.id = `${dateID}`
        stylesTag.innerHTML = stylesParsed;
        document.head.appendChild(stylesTag)
    }


    private populateThemeVars(theme: ThemeManagerInterface) {
        // VARS
        theme.theme.themeVars = {} as typeof theme.theme.themeVars
        Object.values(theme.singleLayerTheme || {}).forEach((value) => {
            ThemeManagerUtils.populateObjectValue(theme.theme.themeVars || {},Array.from(value.routeSet),`var(${value.varName})`)
        });
        // OVERRIDERS
        (theme.theme.themeVars as any)["overriders"] = {}
        Object.entries({...defaultTheme.themeCreator.overriders,...theme.theme.themeCreator.overriders}|| {}).forEach(([ovCategory,overridersObject]) => {
            let overriderClasses : {oType : string,className: string }[] = Object.keys(overridersObject || {} ).map((type) => {
                return {
                    oType : type,
                    className : `${ovCategory}${this.separator}${type}`
                }
            });
        

            let overriderClassesArrray = overriderClasses.map((a) => a.className);

            ThemeManagerUtils.populateObjectValue(theme.theme.themeVars?.overriders || {},[ovCategory,"removeOverriders"], (element?: HTMLElement) => {
                let classes = overriderClassesArrray
                if (element!= undefined) {
                    classes.forEach((test) => element.classList.remove(test))
                    return
                }
                classes.forEach((ovName) =>  {
                    let found = document.querySelectorAll("." + ovName)
                    found.forEach((el) => el.classList.remove(ovName))
                })
            })
            ThemeManagerUtils.populateObjectValue(theme.theme.themeVars?.overriders || {},[ovCategory,"switch"], (base:boolean = false,element: HTMLElement = document.body) => {
                let classes = overriderClassesArrray
                if (base) {classes = [...classes,""]}
                this.switchOveriderOnElement(classes,element)
            })
            overriderClasses.forEach((ov) => {
                ThemeManagerUtils.populateObjectValue(theme.theme.themeVars?.overriders || {},[ovCategory,ov.oType,"className"],ov.className)
                ThemeManagerUtils.populateObjectValue(theme.theme.themeVars?.overriders || {},[ovCategory,ov.oType,"apply"], (element: HTMLElement = document.body) => {
                    let classes = overriderClassesArrray
                    this.loadOveriderOnElement(ov.className,classes,element)
                })
                ThemeManagerUtils.populateObjectValue(theme.theme.themeVars?.overriders || {},[ovCategory,ov.oType,"remove"], (element: HTMLElement = document.body) => {
                    element.classList.remove(ov.className)
                })
            })  
        })
        var storeFonts: ((fontName:string,className:string) => void) | undefined = (fontName,className) => {
            (theme.theme.themeVars?.fonts as any)[fontName]["class"] = className
        }
        this.getFontCSSClassesFromFonts(defaultTheme.themeCreator.fonts,storeFonts)
        this.getFontCSSClassesFromFonts(theme.theme.themeCreator.fonts,storeFonts)
        storeFonts = undefined;
    }

    switchOveriderOnElement(overriderTypes: string[],element: HTMLElement = document.body) {
        if (overriderTypes.length <= 0) {return}
        let classes = element.classList
        var foundClass = ""
        for (var x = 0; x <= overriderTypes.length; x++) {
            let current = overriderTypes[x]
            if (classes.contains(current)) {
                foundClass = current;
                break;
            }
        }
        let indexOfClass = overriderTypes.indexOf(foundClass)
        let newOverrider = overriderTypes[(indexOfClass + 1) % overriderTypes.length]
        overriderTypes.forEach((c) => {c != "" ? element.classList.remove(c) : console.log()})
        if (newOverrider == "") {return}
        element.classList.add(newOverrider)
    }

    loadOveriderOnElement(overriderClass: string,overriderTypes: string[],element: HTMLElement = document.body) {
        overriderTypes.forEach((c) => element.classList.remove(c))
        element.classList.add(overriderClass)
    }



    private nameReplacer = {
        size : "font-size",
        weight: "font-weight",
        family : "font-family",
        lineHeight : "line-height"
    }
    
    getFontCSSClassesFromFonts(fonts?: any,inter?: (fontName: string,className: string) => void) : Record<string,Record<string,string>> {
        if (!fonts) {return {}}
        let fontClasses: Record<string,Record<string,string>> = {}
 
        Object.entries(fonts).forEach(([fontName,fontvalues]) => {
            let name = `fonts${this.separator}${fontName}`;
            let className = "." + name
            let varName = "--" + name
            inter?.(fontName,name)
            fontClasses[ className] = Object.entries(fontvalues || {} ).reduce((acc,[key,value]) => {
                let fontAttrVar = `var(${varName}${this.separator}${key})`;
                let keyName : string = `${((this.nameReplacer as any)[key] || "")}`
                return {...acc,[keyName] : fontAttrVar}
            },{})
        })
        return fontClasses
    }   
   

    
    // MARK: SINGLE LAYER OBJECT
    private transformMultilayerObject(route = "", object: object) : SingleLayerObject {
        return Object.entries(object).reduce((accumulator, [currentKey, currentValue]) => {
            const newRoute = route ? `${route}${this.separator}${currentKey}` : currentKey;
            if (typeof currentValue === 'object' && !Array.isArray(currentValue) && currentValue !== null  && currentValue !== undefined) {
                return {
                    ...accumulator,
                    ...this.transformMultilayerObject(newRoute, currentValue)
                };
            } else {
               
                let value : SingleLayerObjectValue = {
                                            routeSet : new Set(newRoute.split(this.separator)),
                                            value: currentValue,
                                            varName : `--${newRoute}`
                }
                return { ...accumulator,
                         [newRoute]: value};
            }
        }, {});
    }

    private getElementsFromSingleLayerObject(
        objectHas: SingleLayerSearch,
        object: SingleLayerObject
      ): Record<string, SingleLayerObject> {
          let returnObject: Record<string, SingleLayerObject> = {};
          // Iterate over each theme element
          Object.entries(object).forEach(([key, objectValue]) => {
              // Iterate over each search criterion
              Object.entries(objectHas).forEach(([searchObjectKey, value]) => {
                  // Determine if the current theme element's route set matches the search criterion
                  let containsRoute = value.route.every(routeValue => objectValue.routeSet.has(routeValue));
                  // Initialize the sub-object if it doesn't exist
                  if (!returnObject[searchObjectKey]) {
                      returnObject[searchObjectKey] = {};
                  }
                  // Include the theme element if it matches the inclusion/exclusion criterion
                  if ((containsRoute && value.contains) || (!containsRoute && !value.contains)) {
                      returnObject[searchObjectKey][key] = objectValue;
                  }
              });
          });
          return returnObject;
      }



    // MARK: SINGLE LAYER OBJECT PARSERS
    private getSingleLayerComposedTheme(theme: ThemeInterface<{}> ) : any {
        let defTheme = structuredClone(defaultTheme.themeCreator)
        let creator = structuredClone(theme.themeCreator)
        ThemeManagerUtils.transformColorsRecursive(defTheme)
        ThemeManagerUtils.transformColorsRecursive(creator)
        let singleLayerDefault = this.transformMultilayerObject(undefined,defTheme);
        let singleLayerTheme = this.transformMultilayerObject(undefined,creator)
        Object.entries(singleLayerTheme).forEach(([key,value]) => {
            (singleLayerDefault as any)[key] = value
        })
        return singleLayerDefault
    }

    private setSingleLayerThemeAndOverriders(theme : ThemeManagerInterface) {
        let subObjects = this.getElementsFromSingleLayerObject({
            noOverriders : {
                contains : false,
                route : ["overriders"]
            },
            overriders : {
                contains : true,
                route : ["overriders"]
            }
        },theme.composedTheme || {})
        theme.singleLayerTheme = subObjects["noOverriders"]
        let storedOverriders : Record<string,SingleLayerObject> = {}
        Object.entries(subObjects["overriders"]).forEach(([key,value]) => {
            let overriderRoute = Array.from(value.routeSet)
            if (overriderRoute[0] == "overriders") {
                let overriderKey = `${overriderRoute[1]}${this.separator}${overriderRoute[2]}`
                if (!storedOverriders[overriderKey]) {
                    storedOverriders[overriderKey] = {}
                }
                let newKey = ThemeManagerUtils.splitAtOccurrence(key,this.separator,3)[1] || ""
                value.routeSet = new Set(newKey.split(this.separator))
                value.varName = `--${newKey}`
                value.overriderRoute = [overriderRoute[0],overriderRoute[1]]
                storedOverriders[overriderKey][newKey] = value
            }
        })
        theme.overriders = storedOverriders;
        console.log(storedOverriders)
    }   

 
    private getVariablesFrom(object?: SingleLayerObject,extra: string = "") : Record<string,string> {
        if (object == undefined) {return {}}
        let vars : Record<string,string> = {} 
        return Object.entries(object).reduce((accumulator,[key,value]) => {
            return {...accumulator,[value.varName] : `${value.value}${extra}`}
        },vars)
    } 




}
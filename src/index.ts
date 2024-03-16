import { themeExample } from "./example"
import { ThemeManager } from "./manager"

export * from "./manager"
export * from "./types" 
export * from "./utils" 
export * from "./default-theme" 

ThemeManager.shared.populateTheme(themeExample)

document.querySelector("#yolo")?.addEventListener("click",() => {
    themeExample.themeVars?.overriders.colorOverriders?.switch(true)
})


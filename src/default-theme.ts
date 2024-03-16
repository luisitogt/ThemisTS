import { ThemeInterface } from "./types";


export let defaultTheme : ThemeInterface<{}> = {
    themeCreator : {
    themeType : "dark",
    colors : {
        primary: "#212221", // Updated dark primary background color
        secondary: "#262626", // Dark grey for card background
        primaryText: "#E6E6E6", // Updated for text on dark backgrounds
        secondaryText: "#A7A6A6", // Updated for secondary information
        accent: "#4e81ee", // Updated blue accent color
        contrary: "#000000", // Updated for elements that need to contrast against the dark theme
        border: "#A7A6A6", // Updated for subtle borders
        success: "#30D158", // Assuming no change, or update if you have a new success color
        error: "#DF5953", // Updated red for errors
        warning: "#F5F566", // Updated amber for warnings
      },
      fonts : {
        body: { size: "16px", weight: "400" },
        callout: { size: "14px", weight: "400" },
        caption1: { size: "12px", weight: "400" },
        caption2: { size: "11px", weight: "400" },
        footNote: { size: "12px", weight: "400" },
        headLine: { size: "24px", weight: "700" },
        subHead: { size: "18px", weight: "400" },
        largeTitle: { size: "32px", weight: "700" },
        title1: { size: "28px", weight: "600" },
        title2: { size: "24px", weight: "600" },
        title3: { size: "20px", weight: "600" },
      },
      overriders : {
        colorOverriders : {
            light : {
              themeType : "light",
              colors : {
                  primary: "#FFFFFF",
                  secondary: "#E5E5EA",
                  primaryText: "#000000",
                  secondaryText: "#6D6D72",
                  accent: "#007AFF",
                  contrary: "#FFFFFF",
                  border: "#A7A6A6",
                  success: "#34C_759",
                  error: "#FF3B30",
                  warning : "#F5F566"
              },
            },
        },
      }
    }
}


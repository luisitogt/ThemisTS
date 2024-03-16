import { ThemeManager } from "./manager";
import { ThemeInterface } from "./types";

export let themeExample: ThemeInterface<{
    colors: "primary" | "secondary" | "background";
    fonts: "body" | "heading";
    componentStyle: "spacing";
    viewportDistribution : "gridRows" | "gridColums",
    overriders: {
      componentOverriders: "compact" | "spacious";
      colorOverriders: "light" | "dark" | "red",
      viewportDistribution :  "phone" | "tablet"
    };
  }> = {
    themeCreator: {
      themeType: "dark",
      colors: {
        primary: "#212121",
        secondary: "#424242",
        background: "black",
      },
      fonts: {
        body: {
          size: "16px",
          weight: "400",
        },
        heading: {
          size: "24px",
          weight: "600",
        },
      },
      componentStyle: {
        spacing: "16px",
      },
      viewportDistribution : {
        gridColums : "1fr auto 1fr",
        gridRows : "1fr 1fr 1fr"
      },
      overriders: {
        componentOverriders: {
          compact: {
            componentStyle: {
              spacing: "8px",
            },
          },
          spacious: {
            componentStyle: {
              spacing: "24px",
            },
          },
        },
        colorOverriders: {
          light: {
            themeType: "light",
            colors: {
              primary: "#ffffff",
              secondary: "#f0f0f0",
              background: "#f5f5f5",
            },
          },
          dark : {
            themeType: "dark",
            colors: {
              primary: "black",
              secondary: "#f0f0f0",
              background: "#f5f5f5",
            },
          },
          red : {
            themeType : "neutral",
            colors : {
                primary : "red"
            }
          }
        },
        viewportDistribution : {
            phone :  {
                viewportDistribution : {
                    gridColums : "0px auto 1fr",
                    gridRows : "1fr auto 1fr"
                  },
            }, 
            tablet : {
                viewportDistribution : {
                    gridColums : "1fr 1fr 1fr",
                    gridRows : "1fr 1fr auto"
                  },
            }
        }
      },
    },
  };


 
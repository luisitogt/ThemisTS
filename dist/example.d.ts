import { ThemeInterface } from "./types";
export declare let themeExample: ThemeInterface<{
    colors: "primary" | "secondary" | "background";
    fonts: "body" | "heading";
    componentStyle: "spacing";
    viewportDistribution: "gridRows" | "gridColums";
    overriders: {
        componentOverriders: "compact" | "spacious";
        colorOverriders: "light" | "dark" | "red";
        viewportDistribution: "phone" | "tablet";
    };
}>;


## ThemisTS

### Theming and Styling Framework for TypeScript

This is a powerful and flexible framework for managing themes and styles in TypeScript applications. Leveraging the full capabilities of TypeScript's advanced type system, it provides a robust and type-safe solution for defining, composing, and applying styles across your application.

#### Key Features

- **Strong Typing**: Extensive use of TypeScript's advanced type system ensures type safety and catches errors at compile-time, providing a solid foundation for large-scale and collaborative development.

- **Extensibility**: Easily extend the theme structure with custom properties beyond colors, fonts, utilities, etc, tailoring the theme to your application's specific needs.

- **Theming and Style Management**: Comprehensive support for managing themes, styles, and CSS variables, enabling consistent styling and easier style updates and overrides.

- **Overriders**: Granular control over overriding specific styles or theme properties at different levels or for different components.

#### Theme Creation Example

```typescript
import { ThemeManager } from "./theme-manager";

// Define your theme interface
export let myTheme: ThemeInterface<{
  colors: "primary" | "secondary" | "background";
  fonts: "body" | "heading";
  componentStyle: "spacing";
  overriders: {
    componentOverriders: "compact" | "spacious";
    colorOverriders: "light" | "dark";
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
      },
    },
  },
};
```

#### Populate the theme

```jsx
// Populate the theme
ThemeManager.shared.populateTheme(myTheme);
```

#### Usage Example

```jsx
import React from 'react';
import { myTheme } from './theme';

const MyComponent = () => {
  const primaryColor = myTheme.themeVars?.colors.primary.normal._100;
  const bodyFont = `${myTheme.themeVars?.fonts.body.size} ${myTheme.themeVars?.fonts.body.weight}`;
  const spacing = myTheme.themeVars?.utils.spacing;

  return (
    <div style={{ color: primaryColor, fontFamily: bodyFont, padding: spacing }}>
      <h1 className={`${myTheme.themeVars?.fonts.heading.class}`}>
        Welcome to My Component
      </h1>
      <p>This component uses the theme variables for colors, fonts, and spacing.</p>

      <div id="compact-container">
        <h2>Compact Container</h2>
        <p>This container uses the compact layout overrider.</p>
      </div>
    </div>
  );
};

export default MyComponent;
```

#### Overriders showcase

```jsx 
// Apply the light color overrider to the body to change the colors of the web application.
myTheme.themeVars?.overriders.colorOverriders.light.apply();

// You can set the element where you apply the overrider, by default it is the document.body
....apply(document.body);

// Apply the compact layout overrider to change the spacing on the specific component
myTheme.themeVars?.overriders.componentOverriders.compact.apply();

// Or change it to spacious in case you need it.
myTheme.themeVars?.overriders.componentOverriders.spacious.apply();

```

When we then apply the `compact` layout overrider using `myTheme.themeVars?.overriders.componentOverriders.compact.apply();`.

The `compact` layout overrider changes the `spacing` utility value to `8px`, which will affect the padding and margins of elements that use the spacing var changing the `MyComponent` padding and margings. This showcases how you can selectively apply layout overriders to specific parts of your application while keeping the rest of the app unaffected.

By combining the color overrider applied to the `document.body` and the layout overrider, you can see how this framework allows you to easily override both color and layout styles or any overrider you create at different levels, chaining overridders to accomplis a strucured and flexible theme at viewport or component level, providing granular control over the theming and styling of your application.
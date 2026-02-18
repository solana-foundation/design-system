import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
import "../src/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
    options: {
      storySort: {
        order: [
          "Tokens",
          ["Colors", "Typography", "Spacing"],
          "Primitives",
          "Components",
          "Patterns",
          "*",
        ],
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
    (Story) => (
      <div className="bg-background text-foreground min-h-[100px] w-full grid place-items-center p-8">
        <Story />
      </div>
    ),
  ],
};

export default preview;

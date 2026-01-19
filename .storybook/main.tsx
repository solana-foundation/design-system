import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  docs: { autodocs: "tag" },

  viteFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@tokens": path.resolve(__dirname, "../src/tokens"),
        "@primitives": path.resolve(__dirname, "../src/primitives"),
        "@components": path.resolve(__dirname, "../src/components"),
        "@patterns": path.resolve(__dirname, "../src/patterns"),
        "@hooks": path.resolve(__dirname, "../src/hooks"),
        "@utils": path.resolve(__dirname, "../src/utils"),
        "@story-components": path.resolve(__dirname, "../src/story-components"),
      };
    }

    // Add Tailwind CSS v4 Vite plugin
    config.plugins = config.plugins || [];
    config.plugins.push(tailwindcss());

    return config;
  },

  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
};
export default config;

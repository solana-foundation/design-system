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
        hooks: path.resolve(__dirname, "../src/ui/hooks"),
        primitives: path.resolve(__dirname, "../src/ui/primitives"),
        utils: path.resolve(__dirname, "../src/ui/utils"),
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

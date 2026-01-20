import type { Meta, StoryObj } from "@storybook/react";
import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { Button } from "../button";
import { AnimatedIcon } from "./index";

const meta: Meta<typeof AnimatedIcon> = {
  title: "Primitives/AnimatedIcon",
  component: AnimatedIcon,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Animates icon transitions with blur + scale effect. Pass any icon and a unique iconKey—when the key changes, the animation triggers.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Click to toggle between Play and Pause icons.
 */
export const Default: Story = {
  render: () => {
    const [playing, setPlaying] = useState(false);
    return (
      <Button
        iconLeft={
          <AnimatedIcon
            icon={
              playing ? (
                <Pause fill="currentColor" size={16} />
              ) : (
                <Play fill="currentColor" size={16} />
              )
            }
            iconKey={playing ? "pause" : "play"}
          />
        }
        onClick={() => setPlaying(!playing)}
        variant="secondary"
      >
        {playing ? "Pause" : "Play"}
      </Button>
    );
  },
};

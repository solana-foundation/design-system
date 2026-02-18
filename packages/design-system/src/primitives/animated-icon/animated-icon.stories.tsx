import { PauseIcon, PlayIcon } from "@heroicons/react/24/outline";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../button";
import { AnimatedIcon } from "./index";

const meta: Meta<typeof AnimatedIcon> = {
  title: "Primitives/Animated Icon",
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
                <PauseIcon fill="currentColor" height={16} width={16} />
              ) : (
                <PlayIcon fill="currentColor" height={16} width={16} />
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

import type { Meta, StoryObj } from "@storybook/react";
import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import { Spinner } from "./index";

const meta: Meta<typeof Spinner> = {
  title: "Primitives/Spinner",
  component: Spinner,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof meta>;

const SpinnerDemo = () => {
  const [playing, setPlaying] = useState(true);
  const spinnersRef = useRef<(SVGSVGElement | null)[]>([]);

  const updateSpeed = (fast: boolean) => {
    for (const el of spinnersRef.current) {
      if (el) {
        const animation = el.getAnimations()[0];
        if (animation) {
          animation.updatePlaybackRate(fast ? 1 : 0.35);
        }
      }
    }
  };

  const handleToggle = () => {
    const newState = !playing;
    setPlaying(newState);
    updateSpeed(newState);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-end gap-6">
        {(["xl", "lg", "md", "sm"] as const).map((size, i) => (
          <div className="flex flex-col items-center gap-3" key={size}>
            <Spinner
              ref={(el) => {
                spinnersRef.current[i] = el;
              }}
              size={size}
            />
            <span className="text-text-low text-xs">{size.toUpperCase()}</span>
          </div>
        ))}
      </div>
      <button
        className="flex items-center gap-2 rounded-lg border border-border-medium px-3 py-1.5 text-sm text-text-high hover:bg-gray-100 dark:hover:bg-gray-200"
        onClick={handleToggle}
        type="button"
      >
        {playing ? <Pause size={14} /> : <Play size={14} />}
        {playing ? "Pause" : "Play"}
      </button>
    </div>
  );
};

export const Default: Story = {
  render: () => <SpinnerDemo />,
};

import type { Meta, StoryObj } from "@storybook/react";

const displayTitles = [
  {
    class: "text-display",
    name: "Display",
    size: "48px",
    mobileSize: "36px",
    weight: 500,
    lineHeight: "1.1",
    tracking: "-1%",
  },
  {
    class: "text-title-xl",
    name: "Title XL",
    size: "36px",
    mobileSize: "28px",
    weight: 500,
    lineHeight: "1.1",
    tracking: "-1%",
  },
  {
    class: "text-title-lg",
    name: "Title LG",
    size: "28px",
    mobileSize: "22px",
    weight: 500,
    lineHeight: "1.1",
    tracking: "-1%",
  },
  {
    class: "text-title-md",
    name: "Title MD",
    size: "24px",
    mobileSize: "19px",
    weight: 500,
    lineHeight: "1.1",
    tracking: "-1%",
  },
  {
    class: "text-title-sm",
    name: "Title SM",
    size: "19px",
    mobileSize: "16px",
    weight: 500,
    lineHeight: "24px",
    tracking: "-1%",
  },
];

const headlines = [
  {
    class: "text-headline-lg",
    name: "Headline LG",
    size: "16px",
    weight: 600,
    lineHeight: "1.1",
    tracking: "-1%",
  },
  {
    class: "text-headline-md",
    name: "Headline MD",
    size: "14px",
    weight: 600,
    lineHeight: "1.1",
    tracking: "-1%",
  },
];

const bodyText = [
  {
    class: "text-body-lg",
    name: "Body LG",
    size: "16px",
    weight: 450,
    lineHeight: "1.5",
    tracking: "0",
  },
  {
    class: "text-body-lg-bold",
    name: "Body LG Bold",
    size: "16px",
    weight: 550,
    lineHeight: "1.5",
    tracking: "0",
  },
  {
    class: "text-body-md",
    name: "Body MD",
    size: "14px",
    weight: 450,
    lineHeight: "1.5",
    tracking: "-1%",
  },
  {
    class: "text-body-md-bold",
    name: "Body MD Bold",
    size: "14px",
    weight: 550,
    lineHeight: "1.5",
    tracking: "-1%",
  },
  {
    class: "text-body-sm",
    name: "Body SM",
    size: "12px",
    weight: 450,
    lineHeight: "1.25",
    tracking: "0",
  },
  {
    class: "text-body-sm-bold",
    name: "Body SM Bold",
    size: "12px",
    weight: 550,
    lineHeight: "1.25",
    tracking: "0",
  },
];

const buttonText = [
  {
    class: "text-button-xl",
    name: "Button XL",
    size: "16px",
    weight: 550,
    lineHeight: "1",
    tracking: "0",
  },
  {
    class: "text-button-lg",
    name: "Button LG",
    size: "15px",
    weight: 550,
    lineHeight: "1",
    tracking: "-1%",
  },
  {
    class: "text-button-md",
    name: "Button MD",
    size: "14px",
    weight: 550,
    lineHeight: "1",
    tracking: "0",
  },
  {
    class: "text-button-sm",
    name: "Button SM",
    size: "13px",
    weight: 550,
    lineHeight: "1",
    tracking: "0",
  },
];

function StyleRow({
  className,
  name,
  size,
  mobileSize,
  weight,
  lineHeight,
  tracking,
  sampleText = "The quick brown fox jumps over the lazy dog",
}: {
  className: string;
  name: string;
  size: string;
  mobileSize?: string;
  weight: number;
  lineHeight: string;
  tracking: string;
  sampleText?: string;
}) {
  return (
    <div className="border-border-light border-b py-4 last:border-b-0">
      <div className="mb-2 flex items-baseline gap-4">
        <code className="rounded border border-border-medium px-2 py-1 font-mono text-text-medium text-xs">
          .{className}
        </code>
        <span className="text-body-sm text-text-low">
          {mobileSize ? `${mobileSize} → ${size}` : size} · {weight} ·{" "}
          {lineHeight} · {tracking}
        </span>
      </div>
      <p className={`${className} text-text-extra-high`}>{sampleText}</p>
    </div>
  );
}

function Overview() {
  return (
    <div className="max-w-4xl p-8">
      <div className="mb-8">
        <h1 className="mb-2 text-display text-text-extra-high">Typography</h1>
        <p className="text-body-lg text-text-medium">
          Inter Variable with fluid responsive scaling. Display and title sizes
          scale between 768px and 1440px viewport widths.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-headline-lg text-text-high uppercase tracking-wider">
            Display & Titles
          </h2>
          <div className="rounded-lg border border-border-medium p-6">
            {displayTitles.map((style) => (
              <StyleRow
                className={style.class}
                key={style.class}
                lineHeight={style.lineHeight}
                mobileSize={style.mobileSize}
                name={style.name}
                sampleText="Build the future of finance"
                size={style.size}
                tracking={style.tracking}
                weight={style.weight}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-headline-lg text-text-high uppercase tracking-wider">
            Headlines
          </h2>
          <div className="rounded-lg border border-border-medium p-6">
            {headlines.map((style) => (
              <StyleRow
                className={style.class}
                key={style.class}
                lineHeight={style.lineHeight}
                name={style.name}
                sampleText="Section heading"
                size={style.size}
                tracking={style.tracking}
                weight={style.weight}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-headline-lg text-text-high uppercase tracking-wider">
            Body Text
          </h2>
          <div className="rounded-lg border border-border-medium p-6">
            {bodyText.map((style) => (
              <StyleRow
                className={style.class}
                key={style.class}
                lineHeight={style.lineHeight}
                name={style.name}
                size={style.size}
                tracking={style.tracking}
                weight={style.weight}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-headline-lg text-text-high uppercase tracking-wider">
            Button Text
          </h2>
          <div className="rounded-lg border border-border-medium p-6">
            {buttonText.map((style) => (
              <StyleRow
                className={style.class}
                key={style.class}
                lineHeight={style.lineHeight}
                name={style.name}
                sampleText="Get Started"
                size={style.size}
                tracking={style.tracking}
                weight={style.weight}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function DisplayTitles() {
  return (
    <div className="max-w-4xl p-8">
      <div className="mb-6">
        <h2 className="mb-2 text-text-extra-high text-title-lg">
          Display & Titles
        </h2>
        <p className="text-body-md text-text-medium">
          Fluid typography that scales between 768px and 1440px viewport widths.
          Uses Inter Variable at weight 500.
        </p>
      </div>
      <div className="rounded-lg border border-border-medium p-6">
        {displayTitles.map((style) => (
          <StyleRow
            className={style.class}
            key={style.class}
            lineHeight={style.lineHeight}
            mobileSize={style.mobileSize}
            name={style.name}
            sampleText="Build the future of finance"
            size={style.size}
            tracking={style.tracking}
            weight={style.weight}
          />
        ))}
      </div>
    </div>
  );
}

function Headlines() {
  return (
    <div className="max-w-3xl p-8">
      <div className="mb-6">
        <h2 className="mb-2 text-text-extra-high text-title-lg">Headlines</h2>
        <p className="text-body-md text-text-medium">
          Static sizes for section headings and labels. Uses Inter Variable at
          weight 600.
        </p>
      </div>
      <div className="rounded-lg border border-border-medium p-6">
        {headlines.map((style) => (
          <StyleRow
            className={style.class}
            key={style.class}
            lineHeight={style.lineHeight}
            name={style.name}
            sampleText="Section heading"
            size={style.size}
            tracking={style.tracking}
            weight={style.weight}
          />
        ))}
      </div>
    </div>
  );
}

function BodyText() {
  return (
    <div className="max-w-3xl p-8">
      <div className="mb-6">
        <h2 className="mb-2 text-text-extra-high text-title-lg">Body Text</h2>
        <p className="text-body-md text-text-medium">
          Static sizes for paragraphs and UI text. Regular weight (450) and bold
          variant (550).
        </p>
      </div>
      <div className="rounded-lg border border-border-medium p-6">
        {bodyText.map((style) => (
          <StyleRow
            className={style.class}
            key={style.class}
            lineHeight={style.lineHeight}
            name={style.name}
            size={style.size}
            tracking={style.tracking}
            weight={style.weight}
          />
        ))}
      </div>
    </div>
  );
}

function ButtonText() {
  return (
    <div className="max-w-3xl p-8">
      <div className="mb-6">
        <h2 className="mb-2 text-text-extra-high text-title-lg">Button Text</h2>
        <p className="text-body-md text-text-medium">
          Static sizes for button labels. Uses Inter Variable at weight 550 with
          line-height 1.
        </p>
      </div>
      <div className="rounded-lg border border-border-medium p-6">
        {buttonText.map((style) => (
          <StyleRow
            className={style.class}
            key={style.class}
            lineHeight={style.lineHeight}
            name={style.name}
            sampleText="Get Started"
            size={style.size}
            tracking={style.tracking}
            weight={style.weight}
          />
        ))}
      </div>
    </div>
  );
}

function FluidDemo() {
  return (
    <div className="max-w-4xl p-8">
      <div className="mb-6">
        <h2 className="mb-2 text-text-extra-high text-title-lg">
          Fluid Scaling Demo
        </h2>
        <p className="mb-4 text-body-md text-text-medium">
          Resize your browser window between 768px and 1440px to see the fluid
          scaling in action.
        </p>
        <div className="inline-block rounded border border-border-medium px-4 py-2 text-body-sm text-text-low">
          Current viewport:{" "}
          <span className="font-mono" id="viewport-width">
            calculating...
          </span>
        </div>
      </div>

      <div className="space-y-6 rounded-lg border border-border-medium p-8">
        <div>
          <p className="mb-1 text-body-sm text-text-low">
            .text-display (36px → 48px)
          </p>
          <p className="text-display text-text-extra-high">Display heading</p>
        </div>
        <div>
          <p className="mb-1 text-body-sm text-text-low">
            .text-title-xl (28px → 36px)
          </p>
          <p className="text-text-extra-high text-title-xl">
            Title extra large
          </p>
        </div>
        <div>
          <p className="mb-1 text-body-sm text-text-low">
            .text-title-lg (22px → 28px)
          </p>
          <p className="text-text-extra-high text-title-lg">Title large</p>
        </div>
        <div>
          <p className="mb-1 text-body-sm text-text-low">
            .text-title-md (19px → 24px)
          </p>
          <p className="text-text-extra-high text-title-md">Title medium</p>
        </div>
        <div>
          <p className="mb-1 text-body-sm text-text-low">
            .text-title-sm (16px → 19px)
          </p>
          <p className="text-text-extra-high text-title-sm">Title small</p>
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
        function updateWidth() {
          const el = document.getElementById('viewport-width');
          if (el) el.textContent = window.innerWidth + 'px';
        }
        updateWidth();
        window.addEventListener('resize', updateWidth);
      `,
        }}
      />
    </div>
  );
}

function WeightScale() {
  const weights = [
    { value: 100, name: "Thin" },
    { value: 200, name: "ExtraLight" },
    { value: 300, name: "Light" },
    { value: 400, name: "Regular" },
    { value: 450, name: "Regular (Design System)" },
    { value: 500, name: "Medium (Design System)" },
    { value: 550, name: "Bold (Design System)" },
    { value: 600, name: "SemiBold (Design System)" },
    { value: 700, name: "Bold" },
    { value: 800, name: "ExtraBold" },
    { value: 900, name: "Black" },
  ];

  return (
    <div className="max-w-3xl p-8">
      <div className="mb-6">
        <h2 className="mb-2 text-text-extra-high text-title-lg">
          Weight Scale
        </h2>
        <p className="text-body-md text-text-medium">
          Inter Variable supports weights 100-900. The design system uses 450,
          500, 550, and 600.
        </p>
      </div>
      <div className="space-y-3 rounded-lg border border-border-medium p-6">
        {weights.map((w) => (
          <div className="flex items-center gap-4" key={w.value}>
            <span
              className="w-64 font-sans text-2xl text-text-extra-high"
              style={{ fontWeight: w.value }}
            >
              The quick brown fox
            </span>
            <code className="font-mono text-text-medium text-xs">
              {w.value}
            </code>
            <span
              className={`text-body-sm ${w.name.includes("Design System") ? "text-text-high" : "text-text-low"}`}
            >
              {w.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Tokens/Typography",
  component: Overview,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const AllStyles: Story = {
  render: () => <Overview />,
};

export const Titles: Story = {
  render: () => <DisplayTitles />,
};

export const HeadlineStyles: Story = {
  render: () => <Headlines />,
};

export const Body: Story = {
  render: () => <BodyText />,
};

export const Buttons: Story = {
  render: () => <ButtonText />,
};

export const FluidScaling: Story = {
  render: () => <FluidDemo />,
};

export const Weights: Story = {
  render: () => <WeightScale />,
};

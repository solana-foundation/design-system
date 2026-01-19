import type { Meta, StoryObj } from "@storybook/react";

const displayTitles = [
  { class: "text-display", name: "Display", size: "48px", mobileSize: "36px", weight: 500, lineHeight: "1.1", tracking: "-1%" },
  { class: "text-title-xl", name: "Title XL", size: "36px", mobileSize: "28px", weight: 500, lineHeight: "1.1", tracking: "-1%" },
  { class: "text-title-lg", name: "Title LG", size: "28px", mobileSize: "22px", weight: 500, lineHeight: "1.1", tracking: "-1%" },
  { class: "text-title-md", name: "Title MD", size: "24px", mobileSize: "19px", weight: 500, lineHeight: "1.1", tracking: "-1%" },
  { class: "text-title-sm", name: "Title SM", size: "19px", mobileSize: "16px", weight: 500, lineHeight: "24px", tracking: "-1%" },
];

const headlines = [
  { class: "text-headline-lg", name: "Headline LG", size: "16px", weight: 600, lineHeight: "1.1", tracking: "-1%" },
  { class: "text-headline-md", name: "Headline MD", size: "14px", weight: 600, lineHeight: "1.1", tracking: "-1%" },
];

const bodyText = [
  { class: "text-body-lg", name: "Body LG", size: "16px", weight: 450, lineHeight: "1.5", tracking: "0" },
  { class: "text-body-lg-bold", name: "Body LG Bold", size: "16px", weight: 550, lineHeight: "1.5", tracking: "0" },
  { class: "text-body-md", name: "Body MD", size: "14px", weight: 450, lineHeight: "1.5", tracking: "-1%" },
  { class: "text-body-md-bold", name: "Body MD Bold", size: "14px", weight: 550, lineHeight: "1.5", tracking: "-1%" },
  { class: "text-body-sm", name: "Body SM", size: "12px", weight: 450, lineHeight: "1.25", tracking: "0" },
  { class: "text-body-sm-bold", name: "Body SM Bold", size: "12px", weight: 550, lineHeight: "1.25", tracking: "0" },
];

const buttonText = [
  { class: "text-button-xl", name: "Button XL", size: "16px", weight: 550, lineHeight: "1", tracking: "0" },
  { class: "text-button-lg", name: "Button LG", size: "15px", weight: 550, lineHeight: "1", tracking: "-1%" },
  { class: "text-button-md", name: "Button MD", size: "14px", weight: 550, lineHeight: "1", tracking: "0" },
  { class: "text-button-sm", name: "Button SM", size: "13px", weight: 550, lineHeight: "1", tracking: "0" },
];

function StyleRow({
  className,
  name,
  size,
  mobileSize,
  weight,
  lineHeight,
  tracking,
  sampleText = "The quick brown fox jumps over the lazy dog"
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
    <div className="py-4 border-b border-border-light last:border-b-0">
      <div className="flex items-baseline gap-4 mb-2">
        <code className="text-xs font-mono text-text-medium bg-gray-100 px-2 py-1 rounded">.{className}</code>
        <span className="text-body-sm text-text-low">
          {mobileSize ? `${mobileSize} → ${size}` : size} · {weight} · {lineHeight} · {tracking}
        </span>
      </div>
      <p className={`${className} text-text-extra-high`}>{sampleText}</p>
    </div>
  );
}

function Overview() {
  return (
    <div className="p-8 bg-gray-50 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-display text-text-extra-high mb-2">Typography</h1>
        <p className="text-body-lg text-text-medium">
          Inter Variable with fluid responsive scaling. Display and title sizes scale between 768px and 1440px viewport widths.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-headline-lg text-text-high mb-4 uppercase tracking-wider">Display & Titles</h2>
          <div className="bg-gray-100 rounded-lg border border-border-light p-6">
            {displayTitles.map((style) => (
              <StyleRow
                key={style.class}
                className={style.class}
                name={style.name}
                size={style.size}
                mobileSize={style.mobileSize}
                weight={style.weight}
                lineHeight={style.lineHeight}
                tracking={style.tracking}
                sampleText="Build the future of finance"
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-headline-lg text-text-high mb-4 uppercase tracking-wider">Headlines</h2>
          <div className="bg-gray-100 rounded-lg border border-border-light p-6">
            {headlines.map((style) => (
              <StyleRow
                key={style.class}
                className={style.class}
                name={style.name}
                size={style.size}
                weight={style.weight}
                lineHeight={style.lineHeight}
                tracking={style.tracking}
                sampleText="Section heading"
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-headline-lg text-text-high mb-4 uppercase tracking-wider">Body Text</h2>
          <div className="bg-gray-100 rounded-lg border border-border-light p-6">
            {bodyText.map((style) => (
              <StyleRow
                key={style.class}
                className={style.class}
                name={style.name}
                size={style.size}
                weight={style.weight}
                lineHeight={style.lineHeight}
                tracking={style.tracking}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-headline-lg text-text-high mb-4 uppercase tracking-wider">Button Text</h2>
          <div className="bg-gray-100 rounded-lg border border-border-light p-6">
            {buttonText.map((style) => (
              <StyleRow
                key={style.class}
                className={style.class}
                name={style.name}
                size={style.size}
                weight={style.weight}
                lineHeight={style.lineHeight}
                tracking={style.tracking}
                sampleText="Get Started"
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
    <div className="p-8 bg-gray-50 max-w-4xl">
      <div className="mb-6">
        <h2 className="text-title-lg text-text-extra-high mb-2">Display & Titles</h2>
        <p className="text-body-md text-text-medium">
          Fluid typography that scales between 768px and 1440px viewport widths. Uses Inter Variable at weight 500.
        </p>
      </div>
      <div className="bg-gray-100 rounded-lg border border-border-light p-6">
        {displayTitles.map((style) => (
          <StyleRow
            key={style.class}
            className={style.class}
            name={style.name}
            size={style.size}
            mobileSize={style.mobileSize}
            weight={style.weight}
            lineHeight={style.lineHeight}
            tracking={style.tracking}
            sampleText="Build the future of finance"
          />
        ))}
      </div>
    </div>
  );
}

function Headlines() {
  return (
    <div className="p-8 bg-gray-50 max-w-3xl">
      <div className="mb-6">
        <h2 className="text-title-lg text-text-extra-high mb-2">Headlines</h2>
        <p className="text-body-md text-text-medium">
          Static sizes for section headings and labels. Uses Inter Variable at weight 600.
        </p>
      </div>
      <div className="bg-gray-100 rounded-lg border border-border-light p-6">
        {headlines.map((style) => (
          <StyleRow
            key={style.class}
            className={style.class}
            name={style.name}
            size={style.size}
            weight={style.weight}
            lineHeight={style.lineHeight}
            tracking={style.tracking}
            sampleText="Section heading"
          />
        ))}
      </div>
    </div>
  );
}

function BodyText() {
  return (
    <div className="p-8 bg-gray-50 max-w-3xl">
      <div className="mb-6">
        <h2 className="text-title-lg text-text-extra-high mb-2">Body Text</h2>
        <p className="text-body-md text-text-medium">
          Static sizes for paragraphs and UI text. Regular weight (450) and bold variant (550).
        </p>
      </div>
      <div className="bg-gray-100 rounded-lg border border-border-light p-6">
        {bodyText.map((style) => (
          <StyleRow
            key={style.class}
            className={style.class}
            name={style.name}
            size={style.size}
            weight={style.weight}
            lineHeight={style.lineHeight}
            tracking={style.tracking}
          />
        ))}
      </div>
    </div>
  );
}

function ButtonText() {
  return (
    <div className="p-8 bg-gray-50 max-w-3xl">
      <div className="mb-6">
        <h2 className="text-title-lg text-text-extra-high mb-2">Button Text</h2>
        <p className="text-body-md text-text-medium">
          Static sizes for button labels. Uses Inter Variable at weight 550 with line-height 1.
        </p>
      </div>
      <div className="bg-gray-100 rounded-lg border border-border-light p-6">
        {buttonText.map((style) => (
          <StyleRow
            key={style.class}
            className={style.class}
            name={style.name}
            size={style.size}
            weight={style.weight}
            lineHeight={style.lineHeight}
            tracking={style.tracking}
            sampleText="Get Started"
          />
        ))}
      </div>
    </div>
  );
}

function FluidDemo() {
  return (
    <div className="p-8 bg-gray-50 max-w-4xl">
      <div className="mb-6">
        <h2 className="text-title-lg text-text-extra-high mb-2">Fluid Scaling Demo</h2>
        <p className="text-body-md text-text-medium mb-4">
          Resize your browser window between 768px and 1440px to see the fluid scaling in action.
        </p>
        <div className="text-body-sm text-text-low bg-gray-100 px-4 py-2 rounded inline-block">
          Current viewport: <span className="font-mono" id="viewport-width">calculating...</span>
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg border border-border-light p-8 space-y-6">
        <div>
          <p className="text-body-sm text-text-low mb-1">.text-display (36px → 48px)</p>
          <p className="text-display text-text-extra-high">Display heading</p>
        </div>
        <div>
          <p className="text-body-sm text-text-low mb-1">.text-title-xl (28px → 36px)</p>
          <p className="text-title-xl text-text-extra-high">Title extra large</p>
        </div>
        <div>
          <p className="text-body-sm text-text-low mb-1">.text-title-lg (22px → 28px)</p>
          <p className="text-title-lg text-text-extra-high">Title large</p>
        </div>
        <div>
          <p className="text-body-sm text-text-low mb-1">.text-title-md (19px → 24px)</p>
          <p className="text-title-md text-text-extra-high">Title medium</p>
        </div>
        <div>
          <p className="text-body-sm text-text-low mb-1">.text-title-sm (16px → 19px)</p>
          <p className="text-title-sm text-text-extra-high">Title small</p>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        function updateWidth() {
          const el = document.getElementById('viewport-width');
          if (el) el.textContent = window.innerWidth + 'px';
        }
        updateWidth();
        window.addEventListener('resize', updateWidth);
      `}} />
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
    <div className="p-8 bg-gray-50 max-w-3xl">
      <div className="mb-6">
        <h2 className="text-title-lg text-text-extra-high mb-2">Weight Scale</h2>
        <p className="text-body-md text-text-medium">
          Inter Variable supports weights 100-900. The design system uses 450, 500, 550, and 600.
        </p>
      </div>
      <div className="bg-gray-100 rounded-lg border border-border-light p-6 space-y-3">
        {weights.map((w) => (
          <div key={w.value} className="flex items-center gap-4">
            <span
              className="text-2xl text-text-extra-high w-64 font-sans"
              style={{ fontWeight: w.value }}
            >
              The quick brown fox
            </span>
            <code className="text-xs font-mono text-text-medium">{w.value}</code>
            <span className={`text-body-sm ${w.name.includes('Design System') ? 'text-text-high' : 'text-text-low'}`}>
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

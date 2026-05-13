const FORMA_BRIDGE_SOURCE = "forma-storybook-preview-bridge";
const FORMA_PARENT_SOURCE = "forma-preview-parent";
const SUPPORTED_CONTROL_TYPES = new Set([
  "boolean",
  "number",
  "range",
  "text",
  "color",
  "date",
  "object",
  "select",
  "multi-select",
  "radio",
  "inline-radio",
  "check",
  "inline-check",
]);

function readGlobalState() {
  const globalWindow = typeof window === "undefined" ? null : window;
  if (!globalWindow) {
    return {
      updateArgsByStoryId: new Map(),
      listenerInstalled: false,
    };
  }
  const state = globalWindow.__FORMA_STORYBOOK_BRIDGE__ ?? {
    updateArgsByStoryId: new Map(),
    listenerInstalled: false,
  };
  globalWindow.__FORMA_STORYBOOK_BRIDGE__ = state;
  return state;
}

function serializeValue(value) {
  if (value === undefined) return null;
  try {
    JSON.stringify(value);
    return value;
  } catch {
    return null;
  }
}

function normalizeControlType(argType) {
  const rawControl = typeof argType?.control === "string" ? argType.control : argType?.control?.type;
  if (typeof rawControl === "string" && SUPPORTED_CONTROL_TYPES.has(rawControl)) {
    return rawControl;
  }
  const typeName = typeof argType?.type === "object" ? argType.type?.name : null;
  if (typeName === "boolean") return "boolean";
  if (typeName === "number") return "number";
  if (typeName === "string") return Array.isArray(argType?.options) ? "select" : "text";
  if (typeName === "enum" && Array.isArray(argType?.options)) return "select";
  if (typeName === "array" || typeName === "object") return "object";
  return null;
}

function normalizeControl(name, argType, value) {
  if (!argType || argType.control === false || argType.table?.disable === true) {
    return null;
  }
  const type = normalizeControlType(argType);
  if (!type || type === "file") {
    return null;
  }
  const serializedValue = serializeValue(value);
  if (serializedValue === null && value !== null) {
    return null;
  }
  const options = Array.isArray(argType.options)
    ? argType.options
        .map((option) => serializeValue(option))
        .filter((option) => option !== null || option === null)
    : undefined;
  return {
    name,
    label: typeof argType.name === "string" ? argType.name : name,
    description: typeof argType.description === "string" ? argType.description : null,
    type,
    value: serializedValue,
    options,
    min: typeof argType.control?.min === "number" ? argType.control.min : null,
    max: typeof argType.control?.max === "number" ? argType.control.max : null,
    step: typeof argType.control?.step === "number" ? argType.control.step : null,
  };
}

function postPreviewState(context, args) {
  if (typeof window === "undefined" || !window.parent || window.parent === window) {
    return;
  }
  const argTypes = context?.argTypes ?? {};
  const controls = Object.entries(argTypes)
    .map(([name, argType]) => normalizeControl(name, argType, args?.[name]))
    .filter(Boolean);
  window.parent.postMessage(
    {
      source: FORMA_BRIDGE_SOURCE,
      kind: "preview.story.state",
      storyId: context?.id ?? null,
      controls,
    },
    "*",
  );
}

function ensureMessageListener() {
  if (typeof window === "undefined") {
    return;
  }
  const state = readGlobalState();
  if (state.listenerInstalled) {
    return;
  }
  state.listenerInstalled = true;
  window.addEventListener("message", (event) => {
    const payload = event?.data;
    if (!payload || payload.source !== FORMA_PARENT_SOURCE || payload.kind !== "preview.args.update") {
      return;
    }
    const updateArgs = state.updateArgsByStoryId.get(payload.storyId);
    if (typeof updateArgs !== "function" || !payload.args || typeof payload.args !== "object") {
      return;
    }
    updateArgs(payload.args);
  });
}

const formaPreviewBridgeDecorator = (Story, context) => {
  ensureMessageListener();
  const hookTuple = typeof context?.hooks?.useArgs === "function" ? context.hooks.useArgs() : null;
  const args = hookTuple?.[0] ?? context.args ?? {};
  const updateArgs = typeof hookTuple?.[1] === "function" ? hookTuple[1] : null;
  const state = readGlobalState();
  if (updateArgs) {
    state.updateArgsByStoryId.set(context.id, updateArgs);
  }
  Promise.resolve().then(() => {
    postPreviewState(context, args);
  });
  return Story();
};

export const decorators = [formaPreviewBridgeDecorator];

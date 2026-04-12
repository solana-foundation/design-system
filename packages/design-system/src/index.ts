// Solana Design System

// Components (molecules)
// (none yet; keeping the folder for future expansion)

// Patterns (templates)
// (none yet; keeping the folder for future expansion)

// Utilities
export { cn } from './utils/cn';
export { Slot, type SlotProps } from './utils/slot';

// Hooks
export { useCopyToClipboard, type CopyToClipboardResult } from './hooks/use-copy-to-clipboard';

// Primitives (atoms)
export { Badge, type BadgeProps } from './primitives/badge';
export { Button, type ButtonProps } from './primitives/button';
export {
    CodeBlock,
    CodeBlockInner,
    type CodeBlockInnerProps,
    type CodeBlockProps,
    CodeBlockProvider,
    type CodeBlockTheme,
} from './primitives/code-block';
export {
    CodeBlockGroup,
    type CodeBlockGroupItem,
    type CodeBlockGroupProps,
} from './primitives/code-block/code-block-group';
export { CopyButton, type CopyButtonProps } from './primitives/copy-button';
export { InlineCode, type InlineCodeProps } from './primitives/inline-code';
export {
    SegmentedControl,
    type SegmentedControlItem,
    type SegmentedControlProps,
} from './primitives/segmented-control';
export {
    Select,
    SelectGroup,
    SelectGroupLabel,
    type SelectGroupLabelProps,
    type SelectGroupProps,
    SelectItem,
    type SelectItemProps,
    type SelectProps,
    SelectSeparator,
    type SelectSeparatorProps,
} from './primitives/select';
export { Spinner, type SpinnerProps } from './primitives/spinner';
export {
    Table,
    TableBody,
    type TableBodyProps,
    TableCaption,
    type TableCaptionProps,
    TableCell,
    TableCellCopyable,
    type TableCellCopyableProps,
    type TableCellProps,
    TableFooter,
    type TableFooterProps,
    TableHead,
    TableHeader,
    type TableHeaderProps,
    type TableHeadProps,
    type TableProps,
    TableRow,
    type TableRowProps,
} from './primitives/table';
export {
    Tab,
    TabList,
    type TabListProps,
    TabPanel,
    type TabPanelProps,
    type TabProps,
    Tabs,
    type TabsProps,
} from './primitives/tabs';
export {
    AddonSelect,
    type AddonSelectOption,
    type AddonSelectProps,
    TextInput,
    type TextInputProps,
} from './primitives/text-input';
export { Tooltip, type TooltipProps, TooltipProvider, type TooltipProviderProps } from './primitives/tooltip';

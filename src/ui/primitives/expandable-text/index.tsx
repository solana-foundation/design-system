"use client";

import DOMPurify from "dompurify";
import { ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";
import { cn } from "../../utils";

export interface ExpandableTextProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The HTML text content to display */
  text: string;
  /** Maximum number of lines to show when collapsed */
  maxLines?: number;
}

/**
 * Expandable text component with HTML sanitization and read more/less functionality
 */
const ExpandableText = React.forwardRef<HTMLDivElement, ExpandableTextProps>(
  ({ text, maxLines = 7, className, ...props }, ref) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [isTruncated, setIsTruncated] = React.useState(false);
    const textRef = React.useRef<HTMLDivElement>(null);

    // Sanitize HTML content
    const sanitizedHtml = React.useMemo(() => {
      if (typeof window === "undefined") return text;

      const clean = DOMPurify.sanitize(text, {
        ALLOWED_TAGS: [
          "p",
          "br",
          "strong",
          "b",
          "em",
          "i",
          "a",
          "ul",
          "ol",
          "li",
          "span",
        ],
        ALLOWED_ATTR: ["href", "target", "rel", "class"],
      });
      return clean;
    }, [text]);

    React.useLayoutEffect(() => {
      const el = textRef.current;
      if (!el) return;

      const checkTruncation = () => {
        const isOverflowing = el.scrollHeight > el.clientHeight + 1;
        const estimatedLines = text.length / 80;
        const likelyTruncated = estimatedLines > maxLines;
        setIsTruncated(isOverflowing || likelyTruncated);
      };

      requestAnimationFrame(() => {
        checkTruncation();
      });

      window.addEventListener("resize", checkTruncation);
      return () => window.removeEventListener("resize", checkTruncation);
    }, [text, maxLines]);

    return (
      <div ref={ref} {...props}>
        <div className="relative">
          <div
            className={cn(
              "text-[15px] text-sand-900 leading-[1.7]",
              "[&>p:last-child]:mb-0 [&>p]:mb-4",
              "[&>br]:mb-2 [&>br]:block",
              "[&_a]:text-sand-1000 [&_a]:underline [&_a]:underline-offset-2",
              "[&_a:hover]:text-sand-1500",
              "[&_b]:font-semibold [&_strong]:font-semibold",
              "[&_em]:italic [&_i]:italic",
              "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5",
              "[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5",
              "[&_li]:mb-1",
              className
            )}
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            ref={textRef}
            style={
              isExpanded
                ? undefined
                : {
                    display: "-webkit-box",
                    WebkitLineClamp: maxLines,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }
            }
          />

          {isTruncated && !isExpanded && (
            <div
              className="pointer-events-none absolute right-0 bottom-0 left-0 h-20"
              style={{
                background:
                  "linear-gradient(to top, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0.95) 30%, rgba(255, 255, 255, 0) 100%)",
              }}
            />
          )}
        </div>

        {isTruncated && (
          <button
            className="mt-4 inline-flex items-center gap-1.5 font-diatype-medium text-[13px] text-sand-600 transition-colors hover:text-sand-1500"
            onClick={() => setIsExpanded(!isExpanded)}
            type="button"
          >
            {isExpanded ? (
              <>
                Show less
                <ChevronUp className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                Read more
                <ChevronDown className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        )}
      </div>
    );
  }
);
ExpandableText.displayName = "ExpandableText";

export { ExpandableText };

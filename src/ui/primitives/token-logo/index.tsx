import * as React from "react";
import { cn } from "../../utils";

export interface TokenLogoProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number;
  height?: number;
}

/**
 * Token logo component with Solana branding
 */
const TokenLogo = React.forwardRef<SVGSVGElement, TokenLogoProps>(
  ({ className, width = 32, height = 32, ...props }, ref) => {
    return (
      <svg
        className={cn("", className)}
        fill="none"
        height={height}
        ref={ref}
        viewBox="0 0 106 106"
        width={width}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <g filter="url(#filter0_ddd_261_1589)">
          <path
            d="M9 35C9 23.799 9 18.1984 11.1799 13.9202C13.0973 10.1569 16.1569 7.09734 19.9202 5.17987C24.1984 3 29.799 3 41 3H65C76.201 3 81.8016 3 86.0798 5.17987C89.843 7.09734 92.9027 10.1569 94.8201 13.9202C97 18.1984 97 23.799 97 35V59C97 70.201 97 75.8016 94.8201 80.0798C92.9027 83.843 89.843 86.9027 86.0798 88.8201C81.8016 91 76.201 91 65 91H41C29.799 91 24.1984 91 19.9202 88.8201C16.1569 86.9027 13.0973 83.843 11.1799 80.0798C9 75.8016 9 70.201 9 59V35Z"
            fill="url(#paint0_radial_261_1589)"
          />
          <path
            d="M41 3.75H65C70.6129 3.75 74.7778 3.75012 78.0752 4.01953C81.3636 4.28822 83.7236 4.82068 85.7393 5.84766C89.3614 7.69322 92.3068 10.6386 94.1523 14.2607C95.1793 16.2764 95.7118 18.6364 95.9805 21.9248C96.2499 25.2222 96.25 29.3871 96.25 35V59C96.25 64.6129 96.2499 68.7778 95.9805 72.0752C95.7118 75.3636 95.1793 77.7236 94.1523 79.7393C92.3068 83.3614 89.3614 86.3068 85.7393 88.1523C83.7236 89.1793 81.3636 89.7118 78.0752 89.9805C74.7778 90.2499 70.6129 90.25 65 90.25H41C35.3871 90.25 31.2222 90.2499 27.9248 89.9805C24.6364 89.7118 22.2764 89.1793 20.2607 88.1523C16.6386 86.3068 13.6932 83.3614 11.8477 79.7393C10.8207 77.7236 10.2882 75.3636 10.0195 72.0752C9.75012 68.7778 9.75 64.6129 9.75 59V35C9.75 29.3871 9.75012 25.2222 10.0195 21.9248C10.2882 18.6364 10.8207 16.2764 11.8477 14.2607C13.6932 10.6386 16.6386 7.69322 20.2607 5.84766C22.2764 4.82068 24.6364 4.28822 27.9248 4.01953C31.2222 3.75012 35.3871 3.75 41 3.75Z"
            stroke="url(#paint1_linear_261_1589)"
            strokeWidth="1.5"
          />
          <path
            d="M41 3.75H65C70.6129 3.75 74.7778 3.75012 78.0752 4.01953C81.3636 4.28822 83.7236 4.82068 85.7393 5.84766C89.3614 7.69322 92.3068 10.6386 94.1523 14.2607C95.1793 16.2764 95.7118 18.6364 95.9805 21.9248C96.2499 25.2222 96.25 29.3871 96.25 35V59C96.25 64.6129 96.2499 68.7778 95.9805 72.0752C95.7118 75.3636 95.1793 77.7236 94.1523 79.7393C92.3068 83.3614 89.3614 86.3068 85.7393 88.1523C83.7236 89.1793 81.3636 89.7118 78.0752 89.9805C74.7778 90.2499 70.6129 90.25 65 90.25H41C35.3871 90.25 31.2222 90.2499 27.9248 89.9805C24.6364 89.7118 22.2764 89.1793 20.2607 88.1523C16.6386 86.3068 13.6932 83.3614 11.8477 79.7393C10.8207 77.7236 10.2882 75.3636 10.0195 72.0752C9.75012 68.7778 9.75 64.6129 9.75 59V35C9.75 29.3871 9.75012 25.2222 10.0195 21.9248C10.2882 18.6364 10.8207 16.2764 11.8477 14.2607C13.6932 10.6386 16.6386 7.69322 20.2607 5.84766C22.2764 4.82068 24.6364 4.28822 27.9248 4.01953C31.2222 3.75012 35.3871 3.75 41 3.75Z"
            stroke="url(#paint2_linear_261_1589)"
            strokeWidth="1.5"
          />
          <g filter="url(#filter1_iii_261_1589)">
            <path
              d="M75.2177 56.043C75.8855 56.043 76.22 56.8501 75.748 57.3223L68.5029 64.5615C68.2218 64.8422 67.8405 65 67.4433 65H30.7812C30.1135 65 29.779 64.1928 30.2509 63.7207L37.496 56.4814C37.7771 56.2007 38.1584 56.043 38.5556 56.043H75.2177ZM67.4433 42.4355C67.8405 42.4355 68.2218 42.5934 68.5029 42.874L75.748 50.1133C76.2201 50.5854 75.8855 51.3926 75.2177 51.3926H38.5556C38.1583 51.3926 37.7771 51.2349 37.496 50.9541L30.2509 43.7158C29.7785 43.2437 30.1133 42.4355 30.7812 42.4355H67.4433ZM75.2177 29C75.8855 29 76.22 29.8072 75.748 30.2793L68.5029 37.5186C68.2218 37.7992 67.8405 37.957 67.4433 37.957H30.7812C30.1133 37.957 29.7785 37.1488 30.2509 36.6768L37.496 29.4385C37.7771 29.1578 38.1583 29 38.5556 29H75.2177Z"
              fill="url(#paint3_radial_261_1589)"
            />
          </g>
        </g>
        <defs>
          <filter
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            height="106"
            id="filter0_ddd_261_1589"
            width="106"
            x="0"
            y="0"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dy="0.399006" />
            <feGaussianBlur stdDeviation="0.299255" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0646228 0"
            />
            <feBlend
              in2="BackgroundImageFix"
              mode="normal"
              result="effect1_dropShadow_261_1589"
            />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dy="1.34018" />
            <feGaussianBlur stdDeviation="1.00513" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0953772 0"
            />
            <feBlend
              in2="effect1_dropShadow_261_1589"
              mode="normal"
              result="effect2_dropShadow_261_1589"
            />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset dy="6" />
            <feGaussianBlur stdDeviation="4.5" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0"
            />
            <feBlend
              in2="effect2_dropShadow_261_1589"
              mode="normal"
              result="effect3_dropShadow_261_1589"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect3_dropShadow_261_1589"
              mode="normal"
              result="shape"
            />
          </filter>
          <filter
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            height="36"
            id="filter1_iii_261_1589"
            width="45.9391"
            x="30.0298"
            y="29"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              in="SourceGraphic"
              in2="BackgroundImageFix"
              mode="normal"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feMorphology
              in="SourceAlpha"
              operator="erode"
              radius="1.5"
              result="effect1_innerShadow_261_1589"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="0.45" />
            <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.964706 0 0 0 0 0.945098 0 0 0 0 0.933333 0 0 0 1 0"
            />
            <feBlend
              in2="shape"
              mode="normal"
              result="effect1_innerShadow_261_1589"
            />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feMorphology
              in="SourceAlpha"
              operator="erode"
              radius="1.5"
              result="effect2_innerShadow_261_1589"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="0.9" />
            <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.964706 0 0 0 0 0.945098 0 0 0 0 0.933333 0 0 0 1 0"
            />
            <feBlend
              in2="effect1_innerShadow_261_1589"
              mode="normal"
              result="effect2_innerShadow_261_1589"
            />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feMorphology
              in="SourceAlpha"
              operator="erode"
              radius="1.5"
              result="effect3_innerShadow_261_1589"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="0.9" />
            <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.964706 0 0 0 0 0.945098 0 0 0 0 0.933333 0 0 0 1 0"
            />
            <feBlend
              in2="effect2_innerShadow_261_1589"
              mode="normal"
              result="effect3_innerShadow_261_1589"
            />
          </filter>
          <radialGradient
            cx="0"
            cy="0"
            gradientTransform="translate(53 3) rotate(90) scale(88)"
            gradientUnits="userSpaceOnUse"
            id="paint0_radial_261_1589"
            r="1"
          >
            <stop stopColor="#1C1B1B" />
            <stop offset="1" stopColor="#3C3633" />
          </radialGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="paint1_linear_261_1589"
            x1="9"
            x2="53"
            y1="3"
            y2="47"
          >
            <stop stopColor="white" stopOpacity="0.16" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="paint2_linear_261_1589"
            x1="97"
            x2="53"
            y1="91"
            y2="47"
          >
            <stop stopColor="white" stopOpacity="0.16" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <radialGradient
            cx="0"
            cy="0"
            gradientTransform="translate(52.9998 29) rotate(90) scale(36 45.9391)"
            gradientUnits="userSpaceOnUse"
            id="paint3_radial_261_1589"
            r="1"
          >
            <stop stopColor="#F6F1EE" />
            <stop offset="1" stopColor="#F6F1EE" stopOpacity="0.72" />
          </radialGradient>
        </defs>
      </svg>
    );
  }
);
TokenLogo.displayName = "TokenLogo";

export { TokenLogo };

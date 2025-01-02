import { SVGProps, Ref, forwardRef } from 'react'
const SvgComponent = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" width={39} height={44} fill="none" ref={ref} {...props}>
    <path
      fill="#CBD5E1"
      d="M22.586.586a2 2 0 0 1 2.828 0l12.728 12.728a2 2 0 0 1-2.828 2.828L26 6.828V17.5c0 14.36-11.641 26-26 26v-4c12.15 0 22-9.85 22-22V6.828l-9.314 9.314a2 2 0 1 1-2.828-2.828L22.586.586Z"
    />
  </svg>
)
export const Arrow = forwardRef(SvgComponent)

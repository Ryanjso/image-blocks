import { SVGProps, Ref, forwardRef } from 'react'
const SvgComponent = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" width={26} height={42} fill="none" ref={ref} {...props}>
    <path fill="#CBD5E1" d="M26 0v4C13.85 4 4 13.85 4 26v16H0V26C0 11.64 11.64 0 26 0Z" />
  </svg>
)
export const Curve = forwardRef(SvgComponent)

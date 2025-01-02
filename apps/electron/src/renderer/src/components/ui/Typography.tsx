import { cn } from '@renderer/lib/utils'
import React from 'react'

export const H1 = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <h1
      className={cn(
        'scroll-m-20 text-4xl font-black tracking-tight text-foreground lg:text-5xl',
        className
      )}
    >
      {children}
    </h1>
  )
}

export const H2 = ({
  children,
  className,
  withBorder = false
}: {
  children: React.ReactNode
  className?: string
  withBorder?: boolean
}) => {
  return (
    <h2
      className={cn(
        'scroll-m-20  text-3xl font-bold tracking-tight text-foreground first:mt-0 lg:text-4xl',
        withBorder ? 'border-b pb-2' : '',
        className
      )}
    >
      {children}
    </h2>
  )
}

export const H3 = ({ children }: { children: React.ReactNode }) => {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-foreground">
      {children}
    </h3>
  )
}

export const H4 = ({ children }: { children: React.ReactNode }) => {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-foreground">{children}</h4>
  )
}

export const H5 = ({ children }: { children: React.ReactNode }) => {
  return (
    <h5 className="scroll-m-20 text-lg font-semibold tracking-tight text-foreground">{children}</h5>
  )
}

export const H6 = ({ children }: { children: React.ReactNode }) => {
  return (
    <h6 className="scroll-m-20 text-base font-semibold tracking-tight text-foreground">
      {children}
    </h6>
  )
}

export const P = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <p className={cn('leading-7 text-foreground [&:not(:first-child)]:mt-6', className)}>
      {children}
    </p>
  )
}

export const Lead = ({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <p className={cn('text-lg text-muted-foreground lg:text-xl', className)}>{children}</p>
}

export const Muted = ({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>
}

export const FormError = ({ children }: { children?: React.ReactNode }) => {
  return <p className="text-sm text-destructive">{children}</p>
}

export const Code = ({ children }: { children: React.ReactNode }) => {
  return (
    <code className="relative rounded bg-primary/20 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground">
      {children}
    </code>
  )
}

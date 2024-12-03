import { initTRPC } from '@trpc/server'

export const t = initTRPC.create({ isServer: true })

export const router = t.router
export const procedure = t.procedure

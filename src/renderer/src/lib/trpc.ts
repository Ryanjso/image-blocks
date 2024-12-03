import { createTRPCReact, inferReactQueryProcedureOptions } from '@trpc/react-query'
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { AppRouter } from 'src/main/ipc/api'

export const trpc = createTRPCReact<AppRouter>()

export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>
export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>

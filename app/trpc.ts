import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "./server";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// ...
		},
	},
});

export const trpcClient = createTRPCClient<AppRouter>({
	links: [httpBatchLink({ url: "/trpc" })],
});

export const trpcNew = createTRPCOptionsProxy<AppRouter>({
	client: trpcClient,
	queryClient,
});

export const trpcOld = createTRPCReact<AppRouter>();

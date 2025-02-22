import * as ReactDOMClient from "react-dom/client";
import * as React from "react";
import { QueryClientProvider, QueryClient, useQuery } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "./server";

const queryClient = new QueryClient();
const trpcClient = createTRPCClient<AppRouter>({ links: [httpBatchLink({ url: "/trpc" })] });
const trpcNew = createTRPCOptionsProxy<AppRouter>({ client: trpcClient, queryClient });
const trpcOld = createTRPCReact<AppRouter>();

function Counter() {
	const utils = trpcOld.useUtils();

	/**
	 * Query with the new package
	 */
	const count = useQuery(trpcNew.count.queryOptions());

	/**
	 * Mutation with the old package
	 */
	const increment = trpcOld.increment.useMutation({
		onSuccess: () => {
			/**
			 * Invalidate the query with the new package
			 */
			queryClient.invalidateQueries(trpcNew.count.queryFilter());
			// or the old
			utils.count.invalidate();
		},
	});

	return (
		<div>
			<p>Count: {count.data?.count}</p>
			<button onClick={() => increment.mutate()}>Increment</button>
		</div>
	);
}

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<trpcOld.Provider client={trpcClient} queryClient={queryClient}>
				<Counter />
			</trpcOld.Provider>
		</QueryClientProvider>
	);
}

ReactDOMClient.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);

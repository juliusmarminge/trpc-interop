import {
	QueryClientProvider,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { queryClient, trpcClient, trpcNew, trpcOld } from "./trpc";

function Counter() {
	const queryClient = useQueryClient();
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

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);

/// <reference types="bun-types" />

import { Database } from "bun:sqlite";
import { initTRPC } from "@trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import app from "./index.html";

const t = initTRPC.create();

const publicProcedure = t.procedure;
const router = t.router;

const db = new Database(":memory:");
db.run(`CREATE TABLE IF NOT EXISTS counters (id INTEGER PRIMARY KEY AUTOINCREMENT, count INTEGER)`);
db.run(`INSERT INTO counters (count) VALUES (0)`);

const appRouter = router({
	count: publicProcedure.query(() => {
		const counter = db.query(`SELECT count FROM counters where id = 1`).get();

		return counter as { id: number; count: number };
	}),
	increment: publicProcedure.mutation(() => {
		db.run("UPDATE counters SET count = count + 1 where id = 1");
	}),
});

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;

const server = Bun.serve({
	routes: {
		"/": app,
		"/trpc/*": (req) =>
			fetchRequestHandler({
				endpoint: "/trpc",
				req,
				router: appRouter,
				createContext: () => ({}),
			}),
	},
	development: true,
});

console.log(`Listening on ${server.url}`);

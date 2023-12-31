#!/usr/bin/env npx -y tsx watch

import {
	Board,
	KitConstructor,
	LogProbe,
	NodeValue,
} from "@google-labs/breadboard";
import { KitBuilder } from "@google-labs/breadboard/kits";
import { ListInput, HeadTailOutputs } from "./types";

const kitBuilder: KitConstructor<any> = new KitBuilder({
	url: "npm:iterator",
}).build({
	popAndRest: async function <T extends NodeValue>(
		inputs: ListInput<T>
	): Promise<HeadTailOutputs<T>> {
		const { list } = inputs as ListInput<T>;
		if (list == undefined || list.length == 0) {
			return { output: [] };
		}
		return {
			output: list.pop(),
			list,
		};
	},
});

////////////////////////////////////////////////////////////////////////////////

const board: Board = new Board({
	title: "Iterator",
});
const input = board.input();

const output = board.output();

const kit = board.addKit(kitBuilder);
const pop = kit.popAndRest();

input.wire("*", pop);
pop.wire("list", pop);
pop.wire("output", output);

////////////////////////////////////////////////////////////////////////////////

const demo = async () => {
	for await (const stop of board.run({
		probe: new LogProbe(),
	})) {
		if (stop.type === "input") {
			stop.inputs = {
				list: [1, 2, 3, 3, 4],
			};
		} else if (stop.type === "output") {
			console.log(stop.outputs, "\n\n----\n");
		}
	}

	/////////////////////////////////////////////

	for await (const stop of board.run({
		probe: new LogProbe(),
	})) {
		if (stop.type === "input") {
			stop.inputs = {
				list: ["a", "b", "c", "d", "e"],
			};
		} else if (stop.type === "output") {
			console.log(stop.outputs, "\n\n----\n");
		}
	}
};

////////////////////////////////////////////////////////////////////////////////

export default {
	kit: kitBuilder,
	board,
	demo,
};

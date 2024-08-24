export const crafts = [
	{ inputs: [{ type: "paper", count: 16 }], output: { type: "book", count: 1 }, id: "book", time: 5000, type: "item" },
	{
		inputs: [{ type: "compost", count: 12 }],
		output: { type: "fertilizer", count: 1 },
		id: "fertilizer",
		time: 5000,
		type: "item",
	},
	{
		inputs: [
			{ type: "filter", count: 6 },
			{ type: "components", count: 12 },
		],
		output: { type: "container", count: 1 },
		id: "container",
		time: 8000,
		type: "item",
	},
	{
		inputs: [
			{ type: "filter", count: 16 },
			{ type: "components", count: 32 },
		],
		output: { type: "container", count: 4 },
		id: "container",
		time: 24000,
		type: "item",
	},
	{ inputs: [{ type: "vegetation", count: 6 }], output: { type: "meal", count: 1 }, id: "tastymeal", time: 4500, type: "item" },
	{ inputs: [{ type: "meal", count: 1 }, { type: "container", count: 1 }], output: { type: "pmeal", count: 1 }, id: "pmeal", time: 2000, type: "item" },
	{ inputs: [{ type: "metal", count: 8 }], output: { type: "components", count: 4 }, id: "metalcomponents", time: 1500, type: "item" },
	{ inputs: [{ type: "metal", count: 16 }, { type: "filter", count: 4 }], output: { type: "components", count: 12 }, id: "metalcomponents2", time: 2500, type: "item" },
	{
		inputs: [
			{ type: "plastic", count: 4 },
			{ type: "paper", count: 2 },
		],
		output: { type: "filter", count: 1 },
		id: "filter",
		time: 500,
		type: "item",
	},
	{
		inputs: [
			{ type: "components", count: 16 },
			{ type: "container", count: 1 },
		],
		output: "autocollector",
		id: "autocollector",
		time: 5000,
		type: "machine",
	},
	{
		inputs: [
			{ type: "filter", count: 8 },
			{ type: "plastic", count: 4 },
			{ type: "paper", count: 12 },
		],
		output: "recycling",
		id: "recycling",
		time: 5000,
		type: "machine",
	},
	{
		inputs: [
			{ type: "filter", count: 8 },
			{ type: "components", count: 32 },
			{ type: "container", count: 1 },
		],
		output: "craft",
		id: "craft",
		time: 5000,
		type: "machine",
	},
	{
		inputs: [
			{ type: "money", count: 500 },
			{ type: "paper", count: 64 },
		],
		output: "propaganda",
		id: "propaganda",
		time: 10000,
		type: "machine",
	},
	{
		inputs: [
			{ type: "money", count: 100 },
			{ type: "paper", count: 12 },
		],
		output: "bookwriter",
		id: "bookwriter",
		time: 500,
		type: "machine",
	},
	{
		inputs: [
			{ type: "money", count: 125 },
			{ type: "book", count: 4 },
		],
		output: "bookseller",
		id: "bookseller",
		time: 500,
		type: "machine",
	},
	{
		inputs: [
			{ type: "money", count: 140 },
			{ type: "metal", count: 12 },
		],
		output: "metalworker",
		id: "metalworker",
		time: 500,
		type: "machine",
	},
	{
		inputs: [
			{ type: "money", count: 100 },
			{ type: "container", count: 1 },
		],
		output: "farmer",
		id: "farmer",
		time: 500,
		type: "machine",
	},
	{
		inputs: [
			{ type: "money", count: 200 },
			{ type: "filter", count: 20 },
			{ type: "container", count: 1 },
		],
		output: "sheetpresser",
		id: "sheetpresser",
		time: 500,
		type: "machine",
	},
	{
		inputs: [
			{ type: "money", count: 250 },
			{ type: "fertilizer", count: 12 },
			{ type: "container", count: 4 },
			{ type: "components", count: 8 },
			{ type: "vegetation", count: 4 },
		],
		output: "composter",
		id: "composter",
		time: 4500,
		type: "machine",
	},
	{
		inputs: [
			{ type: "money", count: 400 },
			{ type: "meal", count: 10 },
			{ type: "container", count: 8 },
		],
		output: "chef",
		id: "chef",
		time: 500,
		type: "machine",
	},
	{
		inputs: [
			{ type: "money", count: 10000 },
			{ type: "structuralblock", count: 20 },
			{ type: "insulation", count: 50 },
		],
		output: "autocollector2",
		id: "autocollector2",
		time: 60000,
		type: "machine",
	},
	{
		inputs: [
			{ type: "filter", count: 10 },
			{ type: "glass", count: 40 },
			{ type: "rubber", count: 20 },
		],
		output: {
			type: "insulation",
			count: 1
		},
		id: "insulation",
		time: 40000,
		type: "item",
	},
	{
		inputs: [
			{ type: "insulation", count: 8 },
			{ type: "container", count: 4 },
			{ type: "components", count: 32 },
		],
		output: {
			type: "structuralblock",
			count: 1
		},
		id: "structuralblock",
		time: 80000,
		type: "item",
	},
	{
		inputs: [
			{ type: "structuralblock", count: 1 },
			{ type: "components", count: 64 },
			{ type: "insulation", count: 16 },
			{ type: "filter", count: 16 }
		],
		output: {
			type: "machinecasing",
			count: 1
		},
		id: "machinecasing",
		time: 100000,
		type: "item",
	},
	{
		inputs: [
			{ type: "money", count: 10000 },
			{ type: "machinecasing", count: 1 },
			{ type: "container", count: 16 },
			{ type: "components", count: 32 },
		],
		output: "plasticpackager",
		id: "plasticpackager",
		time: 200000,
		type: "machine",
	},
] as const;

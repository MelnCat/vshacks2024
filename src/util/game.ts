import { useLocalStorage } from "usehooks-ts";

export const areas = [
	{ id: "sidewalk", name: "", frequency: 750, max: 100, multiplier: 1 },
	{
		id: "neglected",
		name: "The Neglected District",
		cost: [
			{ type: "money", count: 25000 },
			{ type: "pmeal", count: 64 },
			{ type: "container", count: 100 },
			{ type: "book", count: 50 }
		],
		description: "A town full of garbage and waste.",
		frequency: 100,
		max: 300,
		multiplier: 0.5,
	},
];

export const useGame = () => {
	const [recyclingEfficiency, setRecyclingEfficiency] = useLocalStorage("recyclingEfficiency", 0.25);
	const [addAmount, setAddAmount] = useLocalStorage("addAmount", 1);
	const [craftingSpeed, setCraftingSpeed] = useLocalStorage("craftingSpeed", 1);
	const [area, setArea] = useLocalStorage("area", "sidewalk");
	return {
		recyclingEfficiency,
		setRecyclingEfficiency,
		addAmount,
		setAddAmount,
		craftingSpeed,
		setCraftingSpeed,
		area,
		setArea,
		areaNumber: areas.findIndex(x => x.id === area)
	};
};

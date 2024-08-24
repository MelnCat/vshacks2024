import { Dispatch, SetStateAction } from "react";
import { sample } from "remeda";
import { useLocalStorage } from "usehooks-ts";
import { useGame } from "./game";

export interface UseData {
	count: number;
	inventory: Record<string, number>;
	setInventory: Dispatch<SetStateAction<Record<string, number>>>;
	addItem(key: string, count: number): void;
	garbage: {
		id: number;
		type: string;
		x: number;
		y: number;
	}[];
	setGarbage: Dispatch<
		SetStateAction<
			{
				id: number;
				type: string;
				x: number;
				y: number;
			}[]
		>
	>;
	collectGarbage(id: number): void;
	machines: Record<string, number>;
	setMachines: Dispatch<SetStateAction<Record<string, number>>>;
	game: ReturnType<typeof useGame>;
}

export const machineOrder = [] as string[];

export class Machine {
	constructor(
		public id: string,
		public name: string,
		public description: string,
		public buy?: (data: UseData) => void,
		public sell?: (data: UseData) => void,
		public timePer?: number,
		private use?: (data: UseData) => void
	) {}

	private lastUse = 0;
	tryUse(data: UseData) {
		if (!this.timePer || !this.use) return;
		if (Date.now() - this.lastUse < this.timePer) return;
		this.lastUse = Date.now();
		this.use(data);
	}

	register() {
		machineRegistry[this.id] = this;
		machineOrder.push(this.id);
	}
}

export const machineRegistry = {} as Record<string, Machine>;

export const useMachines = () => {
	const [machines, setMachines] = useLocalStorage("machines", {} as Record<string, number>);
	return [
		machines,
		setMachines,
		(machine: string, count: number) => {
			setMachines(x => ({ ...x, [machine]: (machine in x ? x[machine] : 0) + count }));
		},
	] as const;
};

new Machine("autocollector", "Auto-Collector", "Automatically picks up litter from the ground.", undefined, undefined, 800, data => {
	const per5Sec = data.count / 5;
	const sampled = sample(data.garbage, Math.floor(per5Sec) + ((Math.random() / 2) < per5Sec % 1 ? 1 : 0));
	for (const d of sampled) data.collectGarbage(d.id);
}).register();

new Machine(
	"recycling",
	"Pure Recyclates",
	"Improves recycling efficiency.",
	data => {
		data.game.setRecyclingEfficiency(x => Math.min(Math.sqrt(x), x + 0.1));
	},
	data => {
		data.game.setRecyclingEfficiency(x => Math.max(x ** 2, x - 0.1));
	}
).register();
new Machine(
	"craft",
	"Empowered Tools",
	"Increases crafting speed.",
	data => {
		data.game.setCraftingSpeed(x => Math.min(x + 0.25));
	},
	data => {
		data.game.setCraftingSpeed(x => x - 0.25);
	}
).register();

new Machine(
	"propaganda",
	"Littering Propaganda",
	"Increases the rate of littering.",
	data => {
		data.game.setAddAmount(x => x + 1);
	},
	data => {
		data.game.setAddAmount(x => x - 1);
	}
).register();

new Machine("bookwriter", "Book Writer", "Hires writers to make books efficiently.", undefined, undefined, 5000, data => {
	const amount = Math.floor(data.inventory.paper / 12);
	if (isNaN(amount) || amount <= 0) return;
	data.addItem("paper", -12 * Math.min(amount, data.count));
	data.addItem("book", Math.min(amount, data.count));
}).register();
new Machine("bookseller", "Bookseller", "Hires workers to sell books.", undefined, undefined, 5000, data => {
	const amount = data.inventory.book;
	if (isNaN(amount) || amount <= 0) return;
	data.addItem("book", -Math.min(amount, data.count));
	data.addItem("money", 10 * Math.min(amount, data.count));
}).register();
new Machine("farmer", "Farmer", "Hires farmers to use fertilizer to grow crops.", undefined, undefined, 5000, data => {
	const amount = Math.floor(data.inventory.fertilizer);
	if (isNaN(amount) || amount <= 0) return;
	data.addItem("fertilizer", -Math.min(amount, data.count));
	data.addItem("vegetation", Math.min(amount, data.count) * 4);
}).register();
new Machine(
	"nutrients",
	"Improved Nutrition",
	"Increases crafting speed with the power of nutritious meals.",
	data => {
		data.game.setCraftingSpeed(x => Math.min(x + 0.50));
	},
	data => {
		data.game.setCraftingSpeed(x => x - 0.50);
	}
).register();

new Machine("metalworker", "Metalworker", "Hires metalworkers to forge nails.", undefined, undefined, 5000, data => {
	const amount = Math.floor(data.inventory.metal);
	if (isNaN(amount) || amount <= 0) return;
	data.addItem("metal", -Math.min(amount, data.count));
	data.addItem("components", Math.min(amount, data.count) * 2);
}).register();

new Machine("sheetpresser", "Sheet Press", "Presses plastic and paper into sheets.", undefined, undefined, 2000, data => {
	const amount = Math.floor(data.inventory.plastic / 8);
	const paper = Math.floor(data.inventory.paper / 4);
	if (isNaN(amount) || isNaN(paper) || paper <= 0 || amount <= 0) return;
	data.addItem("paper", -Math.min(amount, paper, data.count) * 4);
	data.addItem("plastic", -Math.min(amount, paper, data.count) * 8);
	data.addItem("filter", Math.min(amount, paper, data.count) * 2);
}).register();

new Machine("composter", "Composter", "Turns composter into fertilizer.", undefined, undefined, 5000, data => {
	const amount = Math.floor(data.inventory.compost / 10);
	if (isNaN(amount) || amount <= 0) return;
	data.addItem("compost", -10 * Math.min(amount, data.count));
	data.addItem("fertilizer", Math.min(amount, data.count));
}).register();

new Machine("chef", "Chef", "Hires chefs to cook meals.", undefined, undefined, 5000, data => {
	const amount = Math.floor(data.inventory.vegetation / 3);
	if (isNaN(amount) || amount <= 0) return;
	data.addItem("vegetation", -3 * Math.min(amount, data.count));
	data.addItem("meal", Math.min(amount, data.count));
}).register();


let currentLine = 0;
let lineDirection = 1;

new Machine("autocollector2", "Linear Collector", "Automatically picks up litter from the ground extremely quickly.", undefined, undefined, 100, data => {
	if (currentLine > 1) lineDirection = -1;
	if (currentLine < 0) lineDirection = 1;
	currentLine += lineDirection * 0.01;
	const found = data.garbage.filter(x => Math.abs(x.x - currentLine) < 0.05);
	const sampled = sample(found, data.count);
	for (const s of sampled) data.collectGarbage(s.id);
}).register();

new Machine("plasticpackager", "Plastic Packager", "Efficiently packages plastic and nails into containers.", undefined, undefined, 1000, data => {
	const amount = Math.floor(data.inventory.plastic / 16);
	const nail = Math.floor(data.inventory.components / 8);
	if (isNaN(amount) || isNaN(nail) || nail <= 0 || amount <= 0) return;
	data.addItem("plastic", -Math.min(amount, amount, data.count) * 16);
	data.addItem("components", -Math.min(amount, nail, data.count) * 8);
	data.addItem("container", Math.min(amount, nail, data.count));
}).register();


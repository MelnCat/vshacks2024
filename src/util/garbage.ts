import { useLocalStorage } from "usehooks-ts";
import { itemRegistry, useInventory } from "./item";
import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { useGame } from "./game";

export class Garbage {
	constructor(public id: string, public drops: Record<string, number>) {}
	register() {
		garbageRegistry[this.id] = this;
	}
	get image() {
		return `/img/garbage/${this.id}.png`;
	}
}

export const garbageRegistry: Record<string, Garbage> = {};

new Garbage("bottle", { plastic: 4 }).register();
new Garbage("can", { metal: 6 }).register();
new Garbage("newspaper", { paper: 10 }).register();
new Garbage("paperball", { paper: 3 }).register();
new Garbage("plasticbag", { plastic: 6 }).register();

export const useGarbage = () => {
	const [inventory, setInventory, addItem] = useInventory();
	const [garbage, setGarbage] = useLocalStorage("garbage", [] as { id: number; type: string; x: number; y: number }[]);
	const game = useGame();
	return [
		garbage,
		setGarbage,
		(id: number) => {
			const x = garbage.find(x => x.id === id);
			if (!x) return;
			setGarbage(y => y.filter(z => z.id !== x.id));
			for (const [k, v] of Object.entries(garbageRegistry[x.type].drops)) addItem(k, Math.ceil(v * game.recyclingEfficiency));
			const popup = document.createElement("div");
			popup.classList.add("popup");
			const elem = garbageElements[x.id];
			delete garbageElements[x.id];
			const bound = elem?.getBoundingClientRect();
			popup.style.left = `${bound?.x + bound?.width / 2}px`;
			popup.style.top = `${bound?.y + bound?.height / 2}px`;
			for (const [k, v] of Object.entries(garbageRegistry[x.type].drops)) {
				const line = document.createElement("p");
				line.innerText = `+${Math.ceil(v * game.recyclingEfficiency)} ${itemRegistry[k].name}`;
				line.style.color = itemRegistry[k].color;
				popup.append(line);
			}
			document.getElementById("overlays")?.append(popup);
			let time = 0;
			const interval = setInterval(() => {
				popup.style.opacity = String(1 - time / 70);
				popup.style.transform = `translateY(-${time / 2}px)`;
				time++;
				if (time > 70) {
					clearInterval(interval);
					popup.remove();
				}
			}, 10);
		},
	] as const;
};

export const garbageElements = {} as Record<number, HTMLElement>;

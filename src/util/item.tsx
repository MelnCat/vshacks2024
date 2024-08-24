import { useLocalStorage } from "usehooks-ts";

export const enum ItemCategory {
	RESOURCE,
	PART,
}

export class Item {
	constructor(public id: string, public name: string, public category: ItemCategory, public color: string, public shape: string = "") {}
	register() {
		itemRegistry[this.id] = this;
		itemOrder.push(this.id);
	}
	get image() {
		return `/img/item/${this.id}.png`;
	}
	get icon() {
		return <span className="icon" style={{ backgroundColor: this.color, clipPath: this.shape }} />;
	}
}

export const itemRegistry: Record<string, Item> = {};
export const itemOrder: string[] = [];

new Item("paper", "Paper", ItemCategory.RESOURCE, "#ffffff").register();
new Item("plastic", "Plastic", ItemCategory.RESOURCE, "#90d1d6", "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)").register();
new Item("metal", "Metal", ItemCategory.RESOURCE, "#a3a3a3", "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)").register();
new Item(
	"components",
	"Gear",
	ItemCategory.PART,
	"#a3a3a3",
	"polygon(0% 0%, 20% 50%, 0% 100%, 50% 80%, 100% 100%, 80% 48%, 100% 0%, 50% 20%)"
).register();

export const useInventory = () => {
	const [inventory, setInventory] = useLocalStorage("inventory", {} as Record<string, number>);
	return [
		inventory,
		setInventory,
		(item: string, count: number) => {
			setInventory(x => ({ ...x, [item]: (item in x ? x[item] : 0) + count }));
		},
	] as const;
};

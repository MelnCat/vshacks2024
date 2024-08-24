import { useLocalStorage } from "usehooks-ts";

export const enum ItemCategory {
	RESOURCE,
	PART,
	PRODUCT,
	MONEY
}

export class Item {
	sellCost: number = 0;
	constructor(public id: string, public name: string, public category: ItemCategory, public color: string, public shape: string = "") {}
	register() {
		itemRegistry[this.id] = this;
		itemOrder.push(this.id);
	}
	cost(cost: number) {
		this.sellCost = cost;
		return this;
	}
	get image() {
		return `/img/item/${this.id}.png`;
	}
	get icon() {
		return <span className="icon" style={{ backgroundColor: this.color, clipPath: this.shape }} />;
	}
}
export class MoneyItem extends Item {
	constructor() {
		super("money", "", ItemCategory.MONEY, "", "");
	}
	override get icon() {
		return <span style={{marginRight: "-0.1em"}}>$</span>;
	}
}

export const itemRegistry: Record<string, Item> = {};
export const itemOrder: string[] = [];

new Item("paper", "Paper", ItemCategory.RESOURCE, "#ffffff").register();
new Item("plastic", "Plastic", ItemCategory.RESOURCE, "#ade7eb", "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)").register();
new Item("metal", "Metal", ItemCategory.RESOURCE, "#a3a3a3", "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)").register();
new Item("compost", "Compost", ItemCategory.RESOURCE, "#70563d", "circle(50% at 50% 50%)").register();
new Item("glass", "Glass", ItemCategory.RESOURCE, "#f0e2e2", "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)").register();
new Item("rubber", "Rubber", ItemCategory.RESOURCE, "#2b2929", "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)").register();
new Item(
	"components",
	"Nail",
	ItemCategory.PART,
	"#a3a3a3",
	"polygon(35% 25%, 0 0, 35% 0%, 65% 0%, 100% 0, 66% 27%, 65% 50%, 65% 50%, 65% 100%, 35% 100%, 35% 50%, 35% 52%)"
).register();
new Item(
	"filter",
	"Laminated Sheet",
	ItemCategory.PART,
	"#c7d8f0",
	"polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)"
).register();
new Item(
	"container",
	"Plastic Container",
	ItemCategory.PRODUCT,
	"#6e7886",
	"polygon(0% 0%, 0% 100%, 25% 100%, 25% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 100%, 100% 100%, 100% 0%)"
).cost(50).register();
new Item(
	"book",
	"Book",
	ItemCategory.PRODUCT,
	"#99604f",
	"polygon(15% 0, 100% 0%, 85% 100%, 0% 100%)"
).cost(10).register();
new Item(
	"fertilizer",
	"Fertilizer",
	ItemCategory.PRODUCT,
	"#4b352e",
	"polygon(0 20%, 100% 20%, 100% 80%, 0 80%)"
).cost(25).register();
new Item(
	"vegetation",
	"Vegetables",
	ItemCategory.PART,
	"#c58634",
	"polygon(50% 100%, 0 0, 100% 0)"
).cost(10).register();
new MoneyItem().register();
new Item(
	"meal",
	"Restaurant Meal",
	ItemCategory.PRODUCT,
	"#dd6536",
	"polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)"
).cost(150).register();
new Item(
	"pmeal",
	"Packaged Meal",
	ItemCategory.PRODUCT,
	"#b4ac88",
	"polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)"
).cost(250).register();
new Item(
	"insulation",
	"Insulation Panel",
	ItemCategory.PART,
	"#383838",
	"polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)"
).register();
new Item(
	"structuralblock",
	"Structural Block",
	ItemCategory.PRODUCT,
	"#242424",
	"polygon(0% 0%, 0% 100%, 25% 100%, 25% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 100%, 100% 100%, 100% 0%)"
).cost(2500).register();
new Item(
	"machinecasing",
	"Machine Casing",
	ItemCategory.PART,
	"#585858",
	"polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%)"
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

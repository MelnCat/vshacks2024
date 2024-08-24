import { useLocalStorage } from "usehooks-ts";

export class Machine {
	constructor(public id: string, public name: string, public timePer: number, public use: () => void) {}

	register() {
		machineRegistry[this.id] = this;
	}
}

export const machineRegistry = {} as Record<string, Machine>;

export const useMachines = () => {
	const [machines, setMacines] = useLocalStorage("inventory", {} as Record<string, number>);
	return [
		inventory,
		setInventory,
		(item: string, count: number) => {
			setInventory(x => ({ ...x, [item]: (item in x ? x[item] : 0) + count }));
		},
	] as const;
};

new Machine("")
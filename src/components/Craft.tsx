import { useEffect, useState } from "react";
import { crafts } from "../util/craft";
import { useGarbage } from "../util/garbage";
import { ItemCategory, itemRegistry, useInventory } from "../util/item";
import { machineRegistry, useMachines } from "../util/machine";
import { areas, useGame } from "../util/game";

export const Craft = ({ right }: { right?: boolean }) => {
	const [inventory, setInventory, addItem] = useInventory();
	const [garbage, setGarbage, collectGarbage] = useGarbage();
	const [craftProgress, setCraftProgress] = useState([] as { id: string; totalTime: number; time: number }[]);
	const [machines, setMachines, addMachine] = useMachines();
	const game = useGame();
	const nextArea = areas[areas.findIndex(x => x.id === game.area) + 1];
	useEffect(() => {
		const delta = 10;
		const interval = setInterval(() => {
			setCraftProgress(x => x.map(y => ({ ...y, time: y.time + delta * game.craftingSpeed })));
		}, delta);
		return () => clearInterval(interval);
	}, [game.craftingSpeed, setCraftProgress]);
	useEffect(() => {
		const done = craftProgress.filter(x => x.time >= x.totalTime);
		if (!done.length) return;
		for (const d of done) {
			const recipe = crafts.find(x => x.id === d.id)!;
			if (recipe.type === "item") addItem(recipe.output.type, recipe.output.count);
			else {
				addMachine(recipe.output, 1);
				machineRegistry[recipe.output]?.buy?.({
					count: 1,
					inventory,
					setInventory,
					garbage,
					setGarbage,
					collectGarbage,
					machines,
					setMachines,
					addItem,
					game,
				});
			}
		}
		setCraftProgress(x => x.filter(y => !done.some(z => z.id === y.id)));
	}, [addItem, addMachine, collectGarbage, craftProgress, game, garbage, inventory, machines, setGarbage, setInventory, setMachines]);
	if (right)
		return (
			<section className="crafting">
				<h1>Upgrades</h1>

				<section className="craft-list" style={{flexGrow:"1"}}>
					{crafts
						.filter(x => x.inputs.every(y => y.type in inventory))
						.filter(x => x.type === "machine")
						.map(x => (
							<section
								className="craft"
								key={x.id}
								style={{
									backgroundImage: craftProgress.some(y => y.id === x.id)
										? (() => {
												const found = craftProgress.find(y => y.id === x.id)!;
												return `linear-gradient(90deg, #00880044, #00880044 ${(found.time / found?.totalTime) * 100}%, transparent ${
													(found.time / found?.totalTime) * 100
												}%)`;
										  })()
										: "",
								}}
							>
								<button
									className="craft-button"
									disabled={craftProgress.some(y => y.id === x.id) || x.inputs.some(y => inventory[y.type] < y.count)}
									onClick={() => {
										if (craftProgress.some(y => y.id === x.id) || x.inputs.some(y => inventory[y.type] < y.count)) return;
										setCraftProgress(y => y.concat({ id: x.id, time: 0, totalTime: x.time }));
										setInventory(inv => {
											const copy = structuredClone(inv);
											for (const input of x.inputs) copy[input.type] -= input.count;
											return copy;
										});
									}}
								>
									Craft
								</button>
								<div className="craft-details">
									<p className="craft-title">{machineRegistry[x.output].name}</p>
									<p className="craft-description">{machineRegistry[x.output].description}</p>
									<p className="craft-cost">
										Costs:{" "}
										{x.inputs.map((y, i) => (
											<span key={i} style={{ color: inventory[y.type] >= y.count ? "" : "red" }}>
												{itemRegistry[y.type].icon} {y.count} {itemRegistry[y.type].name}
												{y.type === "money" && x.inputs.length > 1 ? <span style={{ marginLeft: "-0.2em" }}>, </span> : ""}
											</span>
										))}
									</p>
								</div>
							</section>
						))}
				</section>
			</section>
		);
	return (
		<>
			<section className="crafting">
				<h1>Crafting</h1>
				<section className="craft-list">
					{crafts
						.filter(x => x.inputs.every(y => y.type in inventory))
						.filter(x => x.type === "item")
						.map(x => (
							<section
								className="craft"
								key={x.id}
								style={{
									backgroundImage: craftProgress.some(y => y.id === x.id)
										? (() => {
												const found = craftProgress.find(y => y.id === x.id)!;
												return `linear-gradient(90deg, #00880044, #00880044 ${(found.time / found?.totalTime) * 100}%, transparent ${
													(found.time / found?.totalTime) * 100
												}%)`;
										  })()
										: "",
								}}
							>
								<button
									className="craft-button"
									disabled={craftProgress.some(y => y.id === x.id) || x.inputs.some(y => inventory[y.type] < y.count)}
									onClick={() => {
										if (craftProgress.some(y => y.id === x.id) || x.inputs.some(y => inventory[y.type] < y.count)) return;
										setCraftProgress(y => y.concat({ id: x.id, time: 0, totalTime: x.time }));
										setInventory(inv => {
											const copy = structuredClone(inv);
											for (const input of x.inputs) copy[input.type] -= input.count;
											return copy;
										});
									}}
								>
									Craft
								</button>
								<div className="craft-details">
									<p className="craft-title">
										{itemRegistry[x.output.type].icon} {itemRegistry[x.output.type].name}
										{x.output.count === 1 ? "" : ` (x${x.output.count})`}
									</p>
									{itemRegistry[x.output.type].category === ItemCategory.PRODUCT ? (
										<p className="craft-description">Sells for ${itemRegistry[x.output.type].sellCost}</p>
									) : null}
									<p className="craft-cost">
										Costs:{" "}
										{x.inputs.map((y, i) => (
											<span key={i} style={{ color: inventory[y.type] >= y.count ? "" : "red" }}>
												{itemRegistry[y.type].icon} {y.count} {itemRegistry[y.type].name}
												{(y.type as string) === "money" && x.inputs.length > 1 ? <span style={{ marginLeft: "-0.2em" }}>, </span> : ""}
											</span>
										))}
									</p>
								</div>
							</section>
						))}
				</section>
			</section>
			{nextArea ? (
				<section className="move">
					<button
						disabled={nextArea.cost!.some(x => !(x.type in inventory) || inventory[x.type] < x.count)}
						onClick={() => {
							if (nextArea.cost!.every(x => inventory[x.type] >= x.count)) {
								for (const c of nextArea.cost!) addItem(c.type, -c.count);
								game.setArea(nextArea.id);
							}
						}}
					>
						Move to {nextArea.name}
					</button>
					<p className="craft-description">{nextArea.description}</p>
					<p className="craft-cost">
						Costs:{" "}
						{nextArea.cost!.map((y, i) => (
							<span key={i} style={{ color: inventory[y.type] >= y.count ? "" : "red" }}>
								{itemRegistry[y.type].icon} {y.count} {itemRegistry[y.type].name}
								{y.type === "money" && nextArea.cost!.length > 1 ? <span style={{ marginLeft: "-0.2em" }}>, </span> : ""}
							</span>
						))}
					</p>
				</section>
			) : null}
		</>
	);
};

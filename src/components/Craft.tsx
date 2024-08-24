import { useEffect, useState } from "react";
import { crafts } from "../util/craft";
import { useGarbage } from "../util/garbage";
import { itemRegistry, useInventory } from "../util/item";

export const Craft = () => {
	const [inventory, setInventory, addItem] = useInventory();
	const [garbage, setGarbage, clean] = useGarbage();
	const [craftProgress, setCraftProgress] = useState([] as { id: string; totalTime: number; time: number }[]);
	useEffect(() => {
		const delta = 10;
		const interval = setInterval(() => {
			setCraftProgress(x => x.map(y => ({ ...y, time: y.time + delta })));
		}, delta);
		return () => clearInterval(interval);
	}, [setCraftProgress]);
	useEffect(() => {
		const done = craftProgress.filter(x => x.time >= x.totalTime);
		if (!done.length) return;
		for (const d of done) {
			const recipe = crafts.find(x => x.id === d.id);
			addItem(recipe!.output.type, recipe!.output.count);
		}
		setCraftProgress(x => x.filter(y => !done.some(z => z.id === y.id)));
	}, [addItem, craftProgress]);
	return (
		<section className="crafting">
			<h1>Crafting</h1>
			{crafts
				.filter(x => x.inputs.every(y => y.type in inventory))
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
							<p className="craft-cost">
								Costs:{" "}
								{x.inputs.map((y, i) => (
									<span key={i}>
										{i !== 0 ? ", " : ""}
										{itemRegistry[y.type].icon} {y.count} {itemRegistry[y.type].name}
									</span>
								))}
							</p>
						</div>
					</section>
				))}
		</section>
	);
};

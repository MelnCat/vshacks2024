import { useEffect } from "react";
import { sample } from "remeda";
import { garbageElements, garbageRegistry, useGarbage } from "../util/garbage";
import { useInventory } from "../util/item";
import "./Sidewalk.scss";
import { useInterval } from "usehooks-ts";
import { areas, useGame } from "../util/game";

export const Sidewalk = () => {
	const [garbage, setGarbage, collect] = useGarbage();
	const game = useGame();
	const [inventory, setInventory, addItem] = useInventory();
	useInterval(() => {
		if (garbage.length > areas.find(x => x.id === game.area)!.max) return;
		for (let i = 0; i < game.addAmount * areas.find(x => x.id === game.area)!.multiplier; i++)
			setGarbage(x =>
				x.concat({
					id: Math.random(),
					type: sample(
						Object.entries(garbageRegistry).filter(x => x[1].area <= areas.findIndex(y => y.id === game.area)).map(x => x[0]),
						1
					)[0]!,
					x: Math.random(),
					y: Math.random(),
				})
			);
	}, areas.find(x => x.id === game.area)!.frequency);
	return (
		<section className="sidewalk" style={{ backgroundImage: `url(/img/${game.area}.png)` }}>
			<div className="garbage-area">
				{garbage.map(x => (
					<img
						ref={r => {
							garbageElements[x.id] = r!;
						}}
						className="garbage"
						alt="Garbage"
						src={`${garbageRegistry[x.type].image}`}
						key={`${x.type}:${x.x},${x.y}`}
						style={{ "--x": x.x, "--y": x.y, zIndex: Math.floor(x.y * 100) }}
						onClick={e => {
							collect(x.id);
						}}
					/>
				))}
			</div>
		</section>
	);
};

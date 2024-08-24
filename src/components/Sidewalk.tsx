import { useEffect } from "react";
import { sample } from "remeda";
import { garbageElements, garbageRegistry, useGarbage } from "../util/garbage";
import { useInventory } from "../util/item";
import "./Sidewalk.scss";

export const Sidewalk = () => {
	const [garbage, setGarbage, collect] = useGarbage();
	const [inventory, setInventory, addItem] = useInventory();
	useEffect(() => {
		const interval = setInterval(() => {
			if (garbage.length > 100) return;
			if (Math.random() > 0.8) return;
			setGarbage(garbage.concat({ id: Math.random(), type: sample(Object.keys(garbageRegistry), 1)[0]!, x: Math.random(), y: Math.random() }));
		}, 1000 - (Date.now() % 1000));
		return () => clearInterval(interval);
	}, [garbage, setGarbage]);
	return (
		<section className="sidewalk">
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

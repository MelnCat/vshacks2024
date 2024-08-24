import { useContext, useRef, useState } from "react";
import "./App.scss";
import { Sidewalk } from "./components/Sidewalk";
import { ItemCategory, itemOrder, itemRegistry, useInventory } from "./util/item";
import { useGarbage } from "./util/garbage";
import { useGame } from "./util/game";
import { crafts } from "./util/craft";
import { Craft } from "./components/Craft";

function App() {
	const [inventory, setInventory] = useInventory();
	const [garbage, setGarbage, clean] = useGarbage();
	const game = useGame();
	return (
		<>
			<section className="overlays" id="overlays"></section>
			<main>
				<article className="left">
					<section className="info">
						<h1>Info</h1>
						<p className="info-line">
							<b>Recycling Efficiency</b>: {game.recyclingEfficiency * 100}%
						</p>
					</section>
					<Craft />
				</article>
				<article className="right">
					<section className="controls">
						<section className="col">
							<h1>Resources</h1>
							{Object.entries(inventory)
								.filter(x => itemRegistry[x[0]].category === ItemCategory.RESOURCE)
								.sort((a, b) => itemOrder.indexOf(a[0]) - itemOrder.indexOf(b[0]))
								.map(x => (
									<p key={x[0]}>
										{itemRegistry[x[0]].icon}
										{itemRegistry[x[0]].name} <span className="count">{x[1]}</span>
									</p>
								))}
						</section>
						<section className="col">
							<h1>Parts</h1>
							{Object.entries(inventory)
								.filter(x => itemRegistry[x[0]].category === ItemCategory.PART)
								.sort((a, b) => itemOrder.indexOf(a[0]) - itemOrder.indexOf(b[0]))
								.map(x => (
									<p key={x[0]}>
										{itemRegistry[x[0]].icon}
										{itemRegistry[x[0]].name} <span className="count">{x[1]}</span>
									</p>
								))}
						</section>
					</section>
					<Sidewalk />
				</article>
			</main>
		</>
	);
}

export default App;

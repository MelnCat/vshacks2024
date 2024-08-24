import { useContext, useRef, useState } from "react";
import "./App.scss";
import { Sidewalk } from "./components/Sidewalk";
import { ItemCategory, itemOrder, itemRegistry, useInventory } from "./util/item";
import { useGarbage } from "./util/garbage";
import { useGame } from "./util/game";
import { crafts } from "./util/craft";
import { Craft } from "./components/Craft";
import { machineOrder, machineRegistry, useMachines } from "./util/machine";
import { useInterval } from "usehooks-ts";

function App() {
	const [inventory, setInventory, addItem] = useInventory();
	const [garbage, setGarbage, collectGarbage] = useGarbage();
	const [machines, setMachines, addMachine] = useMachines();
	const game = useGame();
	useInterval(() => {
		for (const [k, v] of Object.entries(machines))
			machineRegistry[k]?.tryUse({
				count: v,
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
	}, 100);
	return (
		<>
			<section className="overlays" id="overlays"></section>
			<main>
				<article className="left">
					<section className="balance">
						<h1>${inventory.money ?? 0}</h1>
					</section>
					<section className="info">
						<h1>Info</h1>
						<p className="info-line">
							<b>Recycling Efficiency</b>: {(game.recyclingEfficiency * 100).toFixed(1)}%
						</p>
						<p className="info-line">
							<b>Crafting Speed</b>: {(game.craftingSpeed * 100).toFixed(0)}%
						</p>
						<p className="info-line">
							<b>Littering Rate</b>: {game.addAmount * 60}/min
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
						<section className="col" style={{ width: "18em" }}>
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
						<section className="col" style={{ width: "20em" }}>
							<h1>Products</h1>
							{Object.entries(inventory)
								.filter(x => itemRegistry[x[0]].category === ItemCategory.PRODUCT)
								.sort((a, b) => itemOrder.indexOf(a[0]) - itemOrder.indexOf(b[0]))
								.map(x => (
									<p key={x[0]}>
										{itemRegistry[x[0]].icon}
										{itemRegistry[x[0]].name} <span className="count">{x[1]}</span>{" "}
										<button
											className="sell"
											disabled={x[1] === 0}
											onClick={e => {
												if (x[1] === 0) return;
												addItem(x[0], -1);
												addItem("money", itemRegistry[x[0]].sellCost);
												const popup = document.createElement("div");
												popup.classList.add("popup");
												popup.style.left = `${e.pageX}px`;
												popup.style.top = `${e.pageY}px`;
												const line = document.createElement("p");
												line.innerText = `+$${itemRegistry[x[0]].sellCost}`;
												line.style.color = "green";
												popup.append(line);
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
											}}
										>
											Sell
										</button>
									</p>
								))}
						</section>
						<section className="col" style={{ width: "15em" }}>
							<h1>Upgrades</h1>
							{Object.entries(machines)
								.sort((a, b) => machineOrder.indexOf(a[0]) - machineOrder.indexOf(b[0]))
								.map(x => (
									<p key={x[0]}>
										{machineRegistry[x[0]].name} <span className="count">{x[1]}</span>
										<button
											className="sell"
											disabled={x[1] <= 0}
											onClick={e => {
												if (x[1] <= 0) return;
												addMachine(x[0], -1);
											}}
										>
											-
										</button>
									</p>
								))}
						</section>
					</section>
					<Sidewalk />
				</article>
				<article className="left">
					<Craft right />
				</article>
			</main>
		</>
	);
}

export default App;

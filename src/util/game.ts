import { useLocalStorage } from "usehooks-ts"

export const useGame = () => {
	const [recyclingEfficiency, setRecyclingEfficiency] = useLocalStorage("recyclingEfficiency", 0.25);
	return {
		recyclingEfficiency,
		setRecyclingEfficiency
	}
}
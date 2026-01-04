import {useState, useEffect, useRef} from "react";
import { ChevronDown } from "lucide-react";

export default function Search({onGuess, artifacts, disabled}) {
	const [input, setInput] = useState(""); // Initialise input
	const [suggestions, setSuggestions] = useState([]); // Initialise the list of suggested artifact sets
	const [showSuggestions, setShowSuggestions] = useState(false);
	const containerRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (containerRef.current && !containerRef.current.contains(event.target)) { // If the user clicks outside of the search bar and suggestions list
				setShowSuggestions(false); // Hide the suggestions
				setInput(""); // Reset the input
			}
		};
		document.addEventListener("mousedown", handleClickOutside); // Start listening for clicks and call handleClickOutside when one is detected
		return () => document.removeEventListener("mousedown", handleClickOutside); // Remove the listener when the component is unmounted
	}, []);

	const handleChange = (e) => {
		const value = e.target.value;
		setInput(value);

		if (value.trim() === "") { // Rest the suggestions if the input is empty
			setSuggestions(artifacts);
			return;
		}
		const matches = artifacts.filter(
			(a) => a.name.toLowerCase().startsWith(value.toLowerCase()) // Find suggestions starting with the current input
		);
		setSuggestions(matches);
	};

	const handleSearchClick = () => { // Show suggestions when the search bar is clicked
		setShowSuggestions(true);
		setSuggestions(artifacts);
	};

	const handleButtonClick = () => { // Show/hide suggestions when the dropdown button is clicked
		if (showSuggestions)
			setShowSuggestions(false)
		else
			setShowSuggestions(true)
	}

	const handleSelect = (artifact) => { // Send a guess to GameContainer.jsx, reset the input and hide the suggestions after selecting an artifact set
		onGuess(artifact);
		setInput("");
		setShowSuggestions(false);
	};

	return (
		<div ref={containerRef} className="relative flex flex-col items-center w-full mt-10">

			<input type="text" name="fake-name" style={{display: "none"}} /> {/* Dummy field to stop safari autofill */}
			<input type="password" name="fake-password" style={{display: "none"}} /> {/* Dummy field to stop safari autofill */}
			<div className="relative w-3/4">
				<input type="text" name="artifact-search" placeholder="Enter character name..." autoComplete="off" value={input} onClick={handleSearchClick} onChange={handleChange} disabled={disabled} className="focus:outline-0 p-2.5 bg-neutral-800 rounded w-full"/>{/* Search bar */}
				<button onClick={handleButtonClick}>
				<ChevronDown
					size={20}
					className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 transition-transform duration-300 cursor-pointer ${
						showSuggestions ? "-rotate-180" : "rotate-0"
					}`}
				/>
				</button>
				{showSuggestions &&
					suggestions.length > 0 && ( // Show the list of suggestions when at least 1 exists and showSuggestions is true
						<ul className="absolute top-full left-0 right-0 max-h-115 overflow-y-auto bg-neutral-700 border border-gray-400 rounded w-full z-10 cursor-pointer">
							{suggestions.map(
								(
									artifact // Create each suggestion as an li
								) => (
									<li key={artifact.name} onClick={() => handleSelect(artifact)} className="p-4 border border-gray-500 flex flex-row items-center justify-between">
										<img src={artifact.icon} className="h-20 w-20 "></img>
										<span className="flex-1 text-center text-2xl">{artifact.name}</span>
									</li>
								)
							)}
						</ul>
					)}
				</div>
		</div>
	);
}
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import Icon from "./Icon";

export default function Search({ onGuess, candidates, guessed, disabled }) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  const q = input.trim().toLowerCase();
  const suggestions = candidates.filter(
    (c) => !guessed.includes(c.id) && (!q || c.name.toLowerCase().includes(q))
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
        setInput("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    listRef.current?.children[cursor]?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  const select = (c) => {
    onGuess(c);
    setInput("");
    setCursor(0);
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setCursor((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && open && suggestions[cursor]) {
      e.preventDefault();
      select(suggestions[cursor]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative flex flex-col items-center w-full mt-6">
      {/* Dummy fields to stop Safari autofill */}
      <input type="text" name="fake-name" style={{ display: "none" }} />
      <input type="password" name="fake-password" style={{ display: "none" }} />
      <div className="relative w-full sm:w-3/4">
        <input
          type="text"
          name="character-search"
          placeholder={disabled ? "Finished" : "Enter character name..."}
          autoComplete="off"
          value={input}
          onClick={() => setOpen(true)}
          onChange={(e) => {
            setInput(e.target.value);
            setCursor(0);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          disabled={disabled}
          role="combobox"
          aria-expanded={open}
          aria-controls="suggestions"
          className="focus:outline-0 p-2.5 bg-neutral-800 rounded w-full disabled:opacity-60"
        />
        <button
          onClick={() => setOpen((v) => !v)}
          disabled={disabled}
          aria-label="Show characters"
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <ChevronDown
            size={20}
            className={`text-gray-300 transition-transform duration-300 cursor-pointer ${
              open ? "-rotate-180" : "rotate-0"
            }`}
          />
        </button>
        {open && !disabled && suggestions.length > 0 && (
          <ul
            id="suggestions"
            ref={listRef}
            role="listbox"
            className="absolute top-full left-0 right-0 max-h-80 overflow-y-auto bg-neutral-700 border border-gray-400 rounded w-full z-20 cursor-pointer text-left"
          >
            {suggestions.map((c, i) => (
              <li
                key={c.id}
                role="option"
                aria-selected={i === cursor}
                onClick={() => select(c)}
                onMouseEnter={() => setCursor(i)}
                className={`p-2 border-b border-gray-500 flex flex-row items-center gap-4 ${
                  i === cursor ? "bg-neutral-600" : ""
                }`}
              >
                <Icon char={c} className="h-14 w-14 rounded" />
                <span className="flex-1 text-lg sm:text-xl">{c.name}</span>
              </li>
            ))}
          </ul>
        )}
        {open && !disabled && suggestions.length === 0 && (
          <div className="absolute top-full left-0 right-0 bg-neutral-700 border border-gray-400 rounded p-3 z-20">
            No character matches that.
          </div>
        )}
      </div>
    </div>
  );
}

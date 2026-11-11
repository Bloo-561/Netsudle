# Netsudle notes (11 November 2026)

## Parked: name spellings
Not changed anywhere yet. The game uses the spellings already in `netsu.json` until these are decided.

| In Netsudle | Elsewhere (wiki / art folders) |
|---|---|
| Gideon Rosenberg | Rosenburg |
| Elaneer Lockett | Locket |
| Yubel Hawtt | Hawth |
| Vane Brando | Barndo |
| Heuey Engandar | Enganar |
| Taffeta Bonbon | Tafetta |
| Sister Lina | Lena |
| Elizabeth Bernadotte | Bernadote |
| Vivian / Linde / Harvey Pattisier' / Patissier' | Patissier |
| Barreta Xander | Barretta |
| Ivanah Muwah | Ivana / Ivannah |

Each character has a fixed `id` in `netsu.json`, so a spelling can be corrected later by editing only the `name`.

## Decided
- Dawn and Melia are the same person: one entry, `Melia "Dawn"`.
- Reinfield and Salene Reise Arnor are the king and queen.

## Open questions
- Henry Reise Arnor III and Beatrix Reise Arnor are in Netsudle; Reinfield and Salene are not. Are they the same two people under other names, or four different royals?
- Is the Man in Black confirmed to be Heuey? Lore currently treats them as one.
- Who is Lucia ("Rucia" in the Netsu iF card files)? Her eight cards are left out of Card mode because she has no Netsudle entry.

## Added in this pass
- Haseritt (icon from Tier List V3). Region and age are set to Unknown.
- Emily Thatcher (icon was already in the assets). Age is set to Unknown.

## Characters still to add
They have art, but need an icon in the tier-list style and their attributes (gender, region, weapon, affiliation, age):
ZERO, Althea, Roman Reise Arnor, Reinfield Reise Arnor, Salene Reise Arnor, Ronnie (Nord), Bill, Jill, Dill, Tommy, Nathan, Mr. Flufflekins, the Septian nun in Trista (icon exists as `Trista/Nun.png`).

No art anywhere: Violet, Liz, Jazelle, Becky Wickets, Sergei, Millisent, Lucia (Netsu iF art only).

## Things to check
- **Debut season** was guessed: a character counts as Season I if they have a card in the "Guess Who V2 / Netsu 1" deck, otherwise Season II. This drives the Season I only switch and the Debut column. Fix any wrong ones via `debut` in `netsu.json`.
- **Lore clues** were pulled from the wiki automatically (124 characters). Some are short or awkward; edit `src/data/lore.json` freely. Clues are listed hardest first.
- **Splash** covers 134 characters. Missing or too small to use: Captain Flufflekins, Emily Thatcher, Samwell Owayne, Tobias, Zak Satyr, and everyone without a Character Art folder.
- **Card** uses 121 Netsu iF cards from 13 characters. Swimsuit variants and unowned cards (Artes and so on) are left out.
- Classic is still light on clues for townsfolk: 97 characters have weapon N/A and 25 have age Unknown.

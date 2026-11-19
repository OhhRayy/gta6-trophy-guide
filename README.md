# Leonida Platinum — GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/OhhRayy/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/OhhRayy/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline, open-source guide and tracker for all **55 PlayStation 5 trophies** of
Grand Theft Auto VI, built for the
[make.fun gta6-trophy-guide-01 bounty](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01).

## What is inside

- **The full official list:** all 55 names, descriptions and grades exactly as
  PlayStation publishes them (1 platinum, 2 gold, 6 silver, 46 bronze),
  checked against the
  [Exophase list](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/)
  and the
  [PSNProfiles list](https://psnprofiles.com/trophies/43531-grand-theft-auto-vi)
  on 19 November 2026 — the two lists agree on every name, description and grade.
- **A guide for each trophy in our own words**, with its sources named beside it.
  Where an official description names no place, person or method, the guide says
  so plainly instead of inventing one.
- **A tracker:** tick trophies off, track PSN counters (42 Shooting Range golds,
  100 WAiNK spots, 52 areas…), write your own notes. Progress saves in the
  browser (localStorage) and can be exported to a file and imported back.
- **Filters** by kind (story, missable, collectibles, activities, online), grade
  and search, plus a **spoiler setting** that hides story trophies until earned.
- **A roadmap to the platinum** in five stages, and **20 missable trophies
  flagged** — built from the official descriptions alone.
- **A "Next up" planner** that puts your easiest unearned trophies first.

## Run it

Static files, no build step, no network:

```sh
node serve.ts
# open http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the vendored make.fun library.

## License

MIT — see [LICENSE](LICENSE). No Rockstar Games artwork is used anywhere in
this guide; the look is our own.

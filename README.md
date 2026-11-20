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
  on 20 November 2026 — the two lists agree on every name, description and grade.
- **A guide for each trophy in our own words**, with its method taken from the
  [PowerPyx trophy guide & roadmap](https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/)
  and named beside it, source by source. Where no method is verified yet
  (Bad Luck, I Guess), the guide says so plainly instead of inventing one.
- **A tracker:** tick trophies off, track PSN counters (42 Shooting Range golds,
  100 WAiNK spots, 52 areas…), write your own notes. Progress saves in the
  browser (localStorage) and can be exported to a file and imported back.
- **Filters** by kind (story, missable, hidden, collectibles, activities, online),
  grade and search, plus a **spoiler setting** that hides story trophies until earned.
- **A roadmap to the platinum** in five stages, and a **"Next up" planner** that
  puts your easiest unearned trophies first.

## The three numbers that matter

- **1 missable trophy.** Only Positive Mental Attitude can be missed: its first
  meditation happens once, in Chapter 1, on the balcony of Jason's house the
  morning after the mission Down to Earth — Lucia walks out, you follow and
  accept, and after Chapter 1 that moment is gone for good. It is still
  unconfirmed whether the trophy needs it, so do it while you can. All 12 story
  trophies unlock automatically, and every stranger and partner quest giver
  returns after the story. Corroborated by
  [KeenGamer](https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/).
- **28 hidden on PSN.** Twenty-eight of the 55 stay hidden until earned — the
  12 story trophies plus 16 side and one-off feats — and the guide tags each one
  in its row, its detail pane and the header count, with a Hidden filter chip.
  The split follows
  [HowToVideoGame](https://howtovideogame.com/gta-6-trophies/).
- **About 200 hours.** PowerPyx puts the platinum at roughly 200 hours,
  difficulty 4/10, one playthrough, no online trophies, no glitched trophies.
  The story takes 60–80 hours; the rest is the 100% completion checklist and
  cleanup. Cheats switch trophies and saving off, so leave them alone.

## No mission replay — save by hand

GTA VI has **no mission replay** and free-roam stays open after the story, so
the guide's safety net is manual saves: **15 manual slots plus 1 autosave**.
Keep one at the start and one at the end of each chapter (10 saves), then rotate
the remaining 5 for free-roam cleanup. That is the only backup for the Chapter 1
meditation — there is no way back to it once Chapter 1 ends.

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

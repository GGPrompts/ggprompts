# Compose custom tower defense chiptune theme

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-t3q` |
| **Status** | closed |
| **Priority** | 1 |
| **Labels** | ready |
| **Created** | 2026-02-26 03:02:38 |
| **Updated** | 2026-02-26 03:23:07 |

## Description

Compose a purpose-built chiptune song for Arcane Bastion with distinct sections: a calmer build phase melody and an intense combat phase. Should feel fantasy/arcane themed to match the game's aesthetic. Use the chiptune composer skill to create the JSON song file.

## Worker Prompt & Notes

## prepared.prompt

## Context
Arcane Bastion is a fantasy tower defense game that currently has no background music — only synthesized SFX. It needs a custom chiptune theme composed in the audio tracker JSON format.

## Task
Use the `/chiptune-composer` skill to compose a full-length (~1.5 minute) chiptune song for Arcane Bastion. The song should have:
- A calmer, mysterious build phase section (first ~30s)
- An intense, driving combat section that loops
- Fantasy/arcane aesthetic — think dark crystal caverns, magical energy
- BPM around 130-150 (moderate to high energy)
- 5-7 instruments: bass, lead, arpeggios, percussion, pads
- D minor or E minor key for dark fantasy feel

Save the song JSON to `music/audio-tracker/songs/arcane-bastion.json`.
Add an entry to `music/audio-tracker/songs/index.json` with category "original".

## Key Files
- `music/audio-tracker/songs/index.json` (add entry)
- `music/audio-tracker/songs/crystal-caverns.json` (reference for fantasy style)
- `music/audio-tracker/songs/boss-battle.json` (reference for intense combat)
- `music/CLAUDE.md` (instrument recipes, DO NOT use "pluck" wave — use "fm")

## When Done
Close issue: bd close htmlstyleguides-t3q --reason="Composed arcane-bastion.json chiptune theme"

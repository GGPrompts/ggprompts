# Add shortEndSeq markers to all long songs (57 songs)

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-l5k` |
| **Status** | closed |
| **Priority** | 2 |
| **Labels** | ready |
| **Created** | 2026-02-22 21:55:17 |
| **Updated** | 2026-02-22 22:12:48 |

## Description

Using the output from the calculation script, add the 'shortEndSeq' field to all 57 song JSON files that are over 90 seconds. The field goes at the top level of the song JSON alongside bpm, rpb, loopStartSeq, loopEndSeq. Format: '"shortEndSeq": N' where N is the sequence index. This is a bulk edit task — for each song file in music/audio-tracker/songs/, add the field. Verify by spot-checking a few songs that the proposed shortEndSeq gives a duration close to 90 seconds. Songs range from 91s (Megabyte Menace) to 312s (Through the Fire and Flames).

## Worker Prompt & Notes

## prepared.prompt

## Context
57 songs need shortEndSeq markers added to their JSON files. The calc script (htmlstyleguides-j52) provides the optimal values.

## Task
1. Run: node music/audio-tracker/songs/calc-short-end.js to get the recommended shortEndSeq values
2. For each song in the output, add "shortEndSeq": N to the top-level JSON object
3. Place it near loopStartSeq/loopEndSeq if those exist, otherwise near bpm/rpb
4. Spot-check 5 songs to verify the short duration is reasonable (~80-100 seconds)
5. Songs that are only slightly over 90 seconds (90-100s) can be skipped or given a value very close to their full length

This is a bulk edit of 57 JSON files in music/audio-tracker/songs/. Can be done with a script that reads the calc output and patches each file.

## Key Files
- music/audio-tracker/songs/*.json (57 files to edit)
- music/audio-tracker/songs/calc-short-end.js (run first for values)

## When Done
Close issue: bd close htmlstyleguides-l5k --reason "shortEndSeq added to all 57 long songs"

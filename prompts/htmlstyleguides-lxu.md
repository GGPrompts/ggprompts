# Landing page: convert ticker into sticky jump-link nav

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-lxu` |
| **Status** | closed |
| **Priority** | 1 |
| **Labels** | ready |
| **Created** | 2026-02-22 03:39:05 |
| **Updated** | 2026-02-22 04:25:55 |

## Description

After the spaceship marquee reveal animation completes, the ticker bar should become a sticky nav pinned to the top of the viewport. The scrolling ticker text transforms into clickable jump links (Press Start 2P pixel font) that anchor to major sections below. Consider either replacing the ticker content with nav links post-reveal, or adding a second sticky bar beneath it.

## Worker Prompt & Notes

## prepared.prompt

## Context
landing.html has a marquee ticker bar that gets revealed by a spaceship animation. Once the reveal completes, the ticker just scrolls decorative text forever. It should become a sticky nav with jump links to all major sections — both existing and the upcoming "Dispatches from My Forge" projects section.

## Task
Convert the marquee ticker bar into a sticky jump-link navigation after the spaceship reveal animation completes.

### Implementation Details

**File:** `landing.html` (2946 lines, single file)

**CSS changes (~line 99-132):**
- Add `position: sticky; top: 0; z-index: 100;` to `.marquee-bar` (activates after reveal)
- Create `.marquee-bar.nav-mode` styles — replace scrolling text with a horizontal row of clickable jump links
- Style links in `Press Start 2P` pixel font (already loaded), gold color matching existing palette
- Add hover glow effect using `var(--gold-bright)` / `var(--purple-glow)`
- Ensure nav bar has the same dark `var(--purple-deep)` background with gold borders

**JS changes (~line 2844-2851, the "done" phase):**
- After `marqueeBar.classList.add("revealed")`, set a short delay (~1-2s) then:
  - Add `.nav-mode` class to marquee bar
  - Replace `.marquee-track` innerHTML with anchor links: `<a href="#section-id">LABEL</a>`
- Nav links should include: Style Guides, Music, Games, Tech Guides, Stories, Guestbook, and placeholder slots for "The Terminal" and "The Interface" zones (upcoming)
- Add smooth scroll behavior (already set on `html`)

**Section IDs to add to existing HTML (~lines 1896-1976):**
- Add `id="style-guides"` to the cards grid or a wrapper
- Add IDs to individual card sections if they dont have them
- Guestbook already has `id="guestbook"`

**Session-skip path (~line 2887-2894):**
- When intro is skipped (returning visitor), the nav should appear immediately in nav-mode (no ticker scroll phase)

### Key Lines
- Marquee CSS: lines 99-132
- Marquee HTML: lines 1806-1810
- Section cards: lines 1896-1961
- Guestbook: lines 1969-1976
- Spaceship "done" phase: lines 2844-2851
- Session-skip path: lines 2887-2894

## When Done
Close issue: bd close htmlstyleguides-lxu --reason "Ticker converts to sticky jump-link nav after reveal"

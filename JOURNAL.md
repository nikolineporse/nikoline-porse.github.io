# Development Journal

This file is the running record of *why* the site looks and works the way
it does — not just *what* changed (that's what `git log` is for), but the
reasoning, the things that were tried and rejected, and the traps that cost
time the first time around. It exists so that any developer — human or AI —
picking this project up cold can get oriented in five minutes instead of
re-deriving decisions from scratch or re-triggering bugs that are already
solved.

**How to use this file:** read top to bottom for the full story, or jump to
the dated section you care about. Each entry describes the state of the
world *at that point*, including ideas that were later reversed — later
entries supersede earlier ones where they conflict. The "Current State"
section at the very bottom is the only part guaranteed to reflect *today's*
site; everything above it is history.

**On `.gitignore`:** this file is deliberately **tracked in git, not
ignored.** The entire point is for it to travel with the repo so a fresh
clone (or a fresh Claude/Cursor/Copilot session with no memory of this
conversation) has it immediately. Gitignoring a handoff doc would defeat its
own purpose.

---

## Project basics

- **What it is:** Nikoline Porse's personal PR/communications portfolio
  site. Plain HTML/CSS/JS, no framework, no build step, no package.json.
  Every page is hand-written HTML that links `css/style.css` and
  `js/main.js` directly.
- **Hosting:** GitHub Pages, repo `nikolineporse/nikoline-porse.github.io`,
  serving the custom domain `nikoline.com` (see `CNAME`). **Pages only
  deploys from `main`** — nothing on any other branch is ever live.
- **Branch workflow (established early and used for almost every change
  since):** all design/content work happens on a branch called
  `design_experiment`. Changes are committed and pushed there first, and
  merged into `main` (fast-forward, no conflicts expected since `main` is
  never edited directly) only once the user has seen a preview and approved
  it. After merging, the working branch is switched back to
  `design_experiment` so it's always the active branch at the start of the
  next task. If a task doesn't specify a branch, default to this pattern
  rather than committing straight to `main`.
- **Pages:** `index.html` (home), `about.html`, `experience.html`,
  `work.html`, `contact.html`. Nav is identical across all five.
- **Assets:** `assets/nikoline-porse-resume.pdf` (the downloadable resume,
  linked from every page), `assets/press/*.pdf` (scanned press clips, one
  per placement on the Work page), `assets/work/*.jpg` (event photos for
  the "Where I've Been" interactive grid).

## Design system reference (current)

Defined as CSS custom properties at the top of `css/style.css`:

- `--paper: #FFFFFF` — base page white, used for the site-wide content
  boxes (masthead, hero, sections, footer).
- `--card: #EDD2E1` — the credential-card surface. This is **not** a raw
  hex someone picked; it's `#D69BBD` (a dustier mauve) blended 55% with
  white, the same "wash" ratio used everywhere else on the site to soften
  a bold color into something text can sit on. If asked to change this
  color again, ask what the *raw* target color is, then blend it the same
  way rather than pasting the raw hex straight into `--card`.
- `--ink`, `--oxblood`, `--oxblood-deep`, `--brass`, `--slate`: all
  `#000000`. The site used to have a warm oxblood/brass accent-color
  system; every one of those tokens was later set to pure black at the
  user's request (see "Everything goes black" below) but the *names* were
  kept so the CSS didn't need a mass find-and-replace. Don't assume a
  variable named `--oxblood` is actually oxblood-colored — check first.
- `--slate-light: #DCD5C6` — the one surviving non-black/white neutral,
  used only for hairline rule/border colors, never for text.
- `--pattern-stripe-a: #C2E8B1` (green) / `--pattern-stripe-b: #73B0BB`
  (teal) — the background pinstripe colors. See the pattern-background
  saga below before touching these; they went through several complete
  redesigns.
- Fonts: `--font-script` is `Beth Ellen` (Google Font, cursive) and is used
  **only** for the "Nikoline Porse" wordmark and the Beth-Ellen-styled
  section headings (the `<h2 class="section-title">` script headings like
  "Currently," "About," "Work"). Every other font variable
  (`--font-display`, `--font-body`, `--font-mono`) resolves to `Spectral`
  (also Google Fonts) at different weights — they used to be three
  different typefaces (Fraunces, Work Sans, IBM Plex Mono) before a full
  site-wide font unification (see below). Body text defaults to
  `font-weight: 300`.
- `--max-width: 1080px` — the content column width used by `.wrap`.

The signature UI component is `.credential` — a bordered card styled like
a press/event credential badge, used for every job entry, press placement,
and event. It originally had an "ACCESS: ___" eyebrow label and a small
circular "punch-hole" decoration in the corner (like a laminated badge);
both were removed in an Aug 8 session that predates this journal's
authorship (see "Gaps in this record" below) — the CSS rules
(`.credential-access`, `.credential::before`) are still present but now
empty/hidden rather than deleted, presumably to keep the diff small and
reversible. `work.html`'s cards still pass an access-style label
(e.g. "Press Placement," "Freelance Activation") as the *role category*,
which is a different, intentional usage from the old "Access: Current
Role" wording.

## Chronological log

### 2026-07-03 — Initial build and first content pass
Site scaffolded (Fraunces/Work Sans/IBM Plex Mono, warm cream background,
oxblood/brass accents — the "press credential / media kit" concept that's
still the bones of the design today). Beth Ellen added as the script
wordmark font. Background flattened from cream to white. A hero pull-quote
was tried on the homepage and then removed.

### 2026-07-03 (later) — `.nojekyll`
Added an empty `.nojekyll` file at the repo root. This is a static
HTML/CSS/JS site with zero Jekyll dependency; without this file GitHub
Pages runs everything through Jekyll by default, which was flagged as an
unnecessary and likely source of build flakiness.

### 2026-07-06 — Real contact info
Replaced placeholder contact fields with the real ones: email
(nikolineporse@me.com), LinkedIn, Instagram. **Explicit, standing
constraint: no phone number anywhere on the site or in the resume PDF** —
this was checked and confirmed clean at the time and should stay that way.
Typography switched from the placeholder warm-cream/serif look to
black-and-white with a serif body font (this is the point where the
oxblood/brass tokens started their march toward pure black, finished
later — see below).

### 2026-07-07 — Drop the number markers
Removed the little `01` / `02` / `03` and `§` glyphs that sat next to
every script-font section heading (About, Experience, Contact, Currently).
Purely a "this looks unfinished" call — no functional reason, just visual
cleanup.

### Font & color unification (undated in commit log, folded into the above era)
Two related, larger changes belong in this window:
1. **All fonts became one family.** The original plan was to switch every
   non-script font to *Publico Headline Light* — a real, specific,
   **paid/commercial** typeface (Commercial Type foundry, used by The
   Guardian). It is not available on Google Fonts or any free CDN, so
   rather than license it, the user chose a free lookalike: **Spectral**,
   a Google Font with a genuine light weight and a similar
   editorial-serif character. Fraunces, Work Sans, and IBM Plex Mono were
   all retired in favor of Spectral at different weights (300 body / 400
   / 500 / 600 semibold). Beth Ellen was explicitly exempted — it stays
   script/cursive everywhere.
2. **Everything became black.** The oxblood-garnet and brass-gold accent
   colors were retired; every text/accent color token now resolves to
   `#000000`. This was a direct, explicit request ("make everything
   black") — not a subtle "reduce contrast" ask. If a task ever calls for
   reintroducing an accent color, don't assume the old oxblood/brass hex
   values are still meaningful; they're placeholders now.

### 2026-07-12 — Homepage redesign + the "Work" page's naming odyssey
The user showed a screenshot of an agency site ("LIO Agency") as visual
inspiration: bold nav, centered hero copy, a numbered image grid. The
homepage hero was recentered to match that feel (this stuck). The numbered
grid did **not** stick — it went through several names and forms before
being cut entirely:
- First built as a homepage section called **"Highlights"** with three
  placeholder image tiles (no real photos existed yet).
- Renamed to **"Projects"** at the user's request, with a real new page
  added at `projects.html` (Press / Events subsections).
- The user then said she didn't want "the projects part" — this turned
  out to mean the *homepage grid specifically*, not the separate page; a
  clarifying question resolved the ambiguity mid-task.
- The separate page survived the grid's removal, got renamed one more
  time to **`work.html`** with subsections **"Where I've Been"** (events)
  and **"What I've Placed"** (press) — the final naming, still in place.
- The homepage grid itself was fully removed and never rebuilt; the
  homepage went back to a simple hero + "Currently" role card.
- Same commit also removed the "As seen at / placements secured" strip
  from the homepage (a plain-text list of client/press names) as
  redundant now that Work existed as a real destination.

**Lesson for next time:** when a user says "get rid of X" after several
renames, X may refer to the newest surface form of a feature, not the
underlying feature itself. Ask before deleting the whole thing.

### 2026-08-04 — The Work page gets real content (single long session)
This was the day `work.html` went from skeleton to fully populated. In
order:
- Resume PDF swapped for a revised 2026 version (same filename, so no
  links needed updating).
- **Financial Times** press placement added (client: A La Vieille Russie,
  Winter Show 55th-anniversary coverage), with the actual scanned PDF
  clip saved to `assets/press/` and linked.
- Oxford commas removed **site-wide**, then one specific instance
  restored at the user's request in the homepage hero copy — i.e., this
  is a *stylistic default*, not an absolute rule; check with the user
  before assuming every comma decision is final.
- **Interior Design Magazine** placement added, covering two different
  clients in the same Spring 2026 Market Tabloid issue (Maison Gerard's
  represented artists, and Donzella Ltd.'s Eidos Glass piece) — one
  credential card, two bullet points, because it was one press hit
  covering both.
- **The Art Newspaper** placement added (Peter Pap Rugs / Frank Stella
  Navajo textile collection exhibit), including both a link to the live
  article and the PDF clip.
- **Established convention, saved to persistent memory:** press
  placement cards on `work.html` must always be ordered **most recent
  first**. This was explicit and forward-looking ("moving forward, please
  ensure...") — any new press card must be inserted in date order, not
  appended at the end.
- **Antiques Trade Gazette** placement added (another Peter Pap Rugs
  profile, older than Financial Times), inserted below Financial Times
  per the above ordering rule.
- "Print feature" labels added to the Financial Times and Interior Design
  Magazine cards' meta lines, matching the style already used on the
  other two.
- The Assouline "Client Advisor" role added to the homepage "Currently"
  section, alongside Social Media Manager — previously the homepage only
  showed one of her two concurrent current roles.
- The About page bio was substantially rewritten for a stronger,
  punchier voice (this had several rounds — see next entry).

### 2026-08-04–05 — About page bio, in detail
The About paragraph went through many small, real-content-accuracy
passes, not just tone edits. Corrections made, roughly in order:
- Fixed the LA→NYC timeline: born in Los Angeles, moved to New York
  *about a year after* graduating University of Oregon (not immediately
  after).
- Reframed Aviator Nation as her *first full-time role in New York*
  (previously implied it came after other jobs).
- The personal-assistant gig and the CLD PR internship were concurrent
  side work, not sequential — and the user asked for the personal
  assistant line to have "some fun flirty flair since it was a fling" —
  it's phrased as "a short-lived fling as a personal assistant."
- Tooling correction: she used **MuckRack** at CLD PR (not Cision);
  **Cision** was Stacy McLaughlin-only. An early draft conflated the two.
- Softened "ran event activations" to "helped run" — she didn't want it
  to read like she single-handedly ran them.
- The Assouline event list was expanded significantly beyond what
  `experience.html` lists: added Derrick Rose's *Rose's Flower Shop*
  Valentine's Day signing, the *Carbone* book launch, *The Mark Hotel*
  book launch, and Alain Elkann's Q&A/second-volume release — none of
  these appear anywhere else on the site, they're About-page-only detail.
- The Stacy McLaughlin Communications paragraph was corrected twice: she
  does **not** manage content for the full client roster — she produces
  content for Stacy's own PR Instagram, gives social-media guidance to
  clients, and *occasionally* shoots content for them. An earlier draft
  overstated her scope.
- Repeated craft passes: cut down repeated sentence openers ("There,"
  appeared twice — one was changed to "After Aviator Nation, she landed
  the opportunity to..."), split up a run-on sentence into two, and
  reduced em-dash density by rewording two sentences to use commas or
  parentheses instead.

**Lesson for next time:** the About page bio carries factual detail
(specific tools used at specific jobs, exact event names) that isn't
duplicated anywhere else on the site. Don't treat it as filler copy safe
to casually rewrite — verify specifics against what's already been
confirmed here before changing them.

### Background pattern saga (spans several sessions — read this whole section before touching the background)
This was the single most-iterated area of the whole project. Rough order
of events:

1. **Cheetah/leopard print, take one.** User sent a screenshot of a
   generic Etsy stock-pattern listing (SouthForkSVG) as a style reference
   and asked for something similar. Rather than replicate that specific
   (paid, copyrighted) artwork, the pattern was generated from scratch —
   procedurally drawn irregular "blob" spots on a canvas, tileable, in
   several original colorways. Iterated on spot density/size (too sparse
   at first, then too cheetah-photographic; settled on denser fused
   clusters closer to a decor/fashion cheetah print) and added softer
   "ivory & charcoal" and "soft black & white" colorways since the user
   didn't want harsh pure black-on-white.
2. **Zebra print.** User pivoted directly from cheetah to zebra, again
   with a copyrighted reference image (a specific Pixels/Cassie Peters
   illustration) that was **not** reproduced — an original wavy-stripe
   generator was built instead. First attempt read as a blobby mass, not
   stripes, because thickness was too high relative to row spacing
   (~60–75% coverage); fixed by tuning stripe thickness down and adding a
   proper taper envelope so stripes pinch to points rather than running
   as solid ribbons.
3. **Neither animal print shipped.** After seeing a bold mockup, the user
   said it "hurts my eyes" — this is the point where the project pivoted
   away from animal print entirely toward a curated set of "cuter"
   options: polka dot, gingham, scallop, confetti sparkle, fine
   pinstripe.
4. **Confetti Sparkle** was the immediate favorite, but the first version
   visibly tiled — small repeating squares with hard seams, described as
   looking "cut up into four different squares." Root cause: random dot
   placement within a small tile with no edge-wrapping. Fixed two
   different ways at different points: first by adding proper edge-wrap
   (drawing every dot at a 3×3 grid of offsets so anything crossing a
   tile boundary reappears correctly on the opposite edge), then
   superseded by a better fix — abandoning tiling altogether in favor of
   one large, evenly-distributed field per area using a **jittered
   grid** (one item per grid cell, nudged randomly within the cell) so
   there's no repeat at all, just one continuous scatter. The polka dot
   pattern got the same fix applied to it on request.
5. **Polka Dot — Blush & Black shipped to the real site first**, not
   Confetti Sparkle. This is where structural experimentation happened:
   - *Attempt A:* bold/vivid polka dot as the full page background, with
     every section wrapped in its own white rounded-corner floating card
     (visible pattern in the gaps between cards). User's reaction:
     "the polka dots are noisy to read on the About and Contact pages" —
     i.e. fine on the homepage's short hero text, bad on long-paragraph
     pages.
   - Four fix options were mocked up as an Artifact (fainter dots, bigger
     sparser dots, a soft white gradient behind the text column, pattern
     pushed to the margins with a solid reading column). **Option D**
     (pattern-in-margins-only, solid white reading column) was chosen —
     but only briefly.
   - The user then asked to drop the white boxes entirely and instead
     just fade the pattern itself down so text could sit directly on it.
     This produced the structural pattern the site still uses: the
     pattern covers the whole page at a *very low opacity* (a pale
     near-white ground color plus dots drawn at ~16% fill-opacity), and
     text/sections have **no background box at all** — they read
     directly against the faded pattern. This is a real reversal from
     the floating-card approach and is the reason the CSS doesn't have
     per-section background colors for hero/hero-adjacent content.
   - Mobile-specific density: the polka dot tile was shrunk via a
     `@media (max-width: 640px)` override so more, smaller dots show on
     narrow screens instead of a few oversized ones (dots looked "too
     sparse" on the phone otherwise).
6. **Pinstripe, green/teal — the pattern that's live today.** The user
   pivoted one more time, from polka dot to a striped pattern, specific
   colors requested (`#79CF54` green / `#73B0BB` teal). Implementation
   choices, in order:
   - First pass was 45°-diagonal, fairly wide (22px) bands — visually
     more "candy stripe" than the "pinstripe" the user actually wanted.
   - Changed to **90° vertical**, **thin (4px)** alternating stripes —
     this is the geometry that stuck.
   - Implemented as a pure CSS `repeating-linear-gradient` rather than an
     SVG data URI — lighter weight, and trivially seamless since a
     gradient has no tiling-seam problem the way a raster/SVG tile does.
   - Green was tuned twice on request: `#79CF54` → `#91DD70` → final
     `#C2E8B1`. Teal (`#73B0BB`) never changed.
   - Same white-box-removal treatment as polka dot: text sits directly on
     the pattern, no floating cards.
   - Finally faded for eye comfort by layering a
     `rgba(255,255,255,0.55)` translucent gradient *on top of* the
     stripe gradient (two stacked `background-image` layers) — this
     keeps the underlying stripe colors as the "true" values in the CSS
     variables while visually softening them, same philosophy as the
     `--card` mauve blend described above. **If asked to change the
     stripe colors again, remember the visible color is the raw variable
     blended through this 55% white overlay — pick the raw value, don't
     eyeball the on-screen color.**
7. **Black borders replace the cloud idea.** A separate request asked for
   a hand-drawn "doodle cloud" speech-bubble border around the homepage
   hero content, referencing a clip-art-style scalloped cloud outline.
   This was built for real — a Python script procedurally generated a
   closed Bézier/arc path with irregular rounded "bumps" (several
   iterations to get bumps that read as rounded lobes rather than sharp
   spikes or a blobby star — the working recipe was points-on-an-ellipse
   connected by outward-bulging arcs, not a smooth Catmull-Rom curve
   through alternating peak/valley radii, which produced a spiky
   "sea-mine" shape instead). It was wired into the homepage hero as an
   inline SVG stretched via `preserveAspectRatio="none"` to fill the
   content box. **It was rejected outright** ("i do not like the cloud
   bubble") before any responsive/mobile work was finished — a portrait
   mobile version of the cloud was half-built and never completed. The
   user's actual ask underneath the rejection was simpler: just put a
   visible border on every white content box. That shipped instead — a
   plain `2px solid black` border on the hero/section/footer wraps.
   **The cloud code was fully reverted; there is no leftover trace of it
   in the shipped HTML/CSS.**

**Lesson for next time:** this project's owner iterates fast and reverses
direction often — cheetah → zebra → (reject animal print) → polka dot →
pinstripe, and floating-cards → margins-only → no-boxes-at-all, and
cloud-border → plain-border. Always demo before committing (she asks for
this explicitly and often), keep changes easy to fully revert, and don't
assume the most recent mockup shown is the one that will ship — confirm.

### 2026-08-07 — Masthead cleanup
Removed the "Public Relations & Communications — New York, NY" tagline
from the masthead entirely, and centered the site name + nav menu (was
previously left-aligned name / right-aligned tagline). Simple, stuck
immediately, no iteration needed.

### 2026-08-07 — Credential card color: mauve
The credential card background went from the original warm cream
(`#FBF8F1`) through a pink `#FFA8DE`-blended value before landing on the
current `#D69BBD`-blended mauve (`#EDD2E1` as the actual rendered value —
see the design-system note above for why those two numbers differ).

### 2026-08-07 — Education page text size
The "Minors in Philosophy & Sociology · Eugene, OR · ..." line under
Education was set in a smaller mono font-size that read inconsistently
tiny next to the Skills section's body-sized descriptions. Fixed by
dropping the font-size/font-family override entirely so it just inherits
the standard body text size, matching Skills.

### 2026-08-08 (not covered by this journal's authoring conversation — see "Gaps in this record")
Two pieces of real, live work landed on this date that the conversation
this journal was written from did not include:
- **Removed the "ACCESS: ___" labels and the punch-hole corner detail**
  from the Currently/Experience credential cards (`index.html`,
  `experience.html`). The CSS rules are still present but emptied out
  rather than deleted (`.credential::before { display: none; }`).
- **Turned "Where I've Been" into a fully interactive, data-driven photo
  grid.** This is a real architecture change worth understanding before
  touching `work.html` or `js/main.js`:
  - All event data now lives in a single `WORK_EVENTS` array at the top
    of `js/main.js` — each record has `id`, `access`, `role`, `org`,
    `dateDisplay`, `description` (array of bullet strings), and `images`
    (array of `{ src, alt }`).
  - `renderWorkEvents()` splits events into two buckets: any event **with
    at least one image** renders as a clickable tile in a photo grid
    (`.work-grid`); any event **with an empty `images` array** falls back
    to a plain `.credential` card, rendered *after* the photo grid. This
    means an event's position in the `WORK_EVENTS` array does **not**
    fully control its on-page position once it has a photo — photo
    events always cluster together ahead of photo-less ones, regardless
    of array order. Keep the array in chronological order anyway for
    maintainability, but don't expect reordering it alone to reorder a
    mixed photo/no-photo display.
  - Clicking a tile opens a lightbox-style modal (`openEventModal`)
    showing the full image, role/org/date, and bullet list.
  - Three of the four pre-existing events got real photos added this same
    session (Roger Federer, Derrick Rose, NYFW Gifting Suites);
    Cosmic Desert Party already had one.

### 2026-08-09 — Point of View Beauty Pop-Up + a real `sips` bug
Added a fifth "Where I've Been" event: a freelance activation with Point
of View Beauty (skincare brand fronted by TikTok beauty influencer Mikayla
Nogueira), July 25–26, 2025 — brand storytelling, on-site education,
checkout support, and event production (setup/breakdown, foot-traffic
flow). Not previously documented anywhere else on the site.

The photo for this event (supplied as a phone photo, found via the user's
Desktop) surfaced a genuine, non-obvious tooling bug worth remembering in
detail:

**The bug:** `sips -r <degrees>` (macOS's built-in image CLI) does not
reliably bake a physical pixel rotation into its output. In this case it
appears to only set orientation *metadata* — something Apple's own
ImageIO-based tools (Preview.app, and the Read tool used to inspect images
in this environment) honor and display "correctly," creating the
convincing illusion that the rotation worked. But **Chrome (and by
extension any standards-based browser, including the one on the user's
phone) does not reliably honor that metadata for PNG output**, and in
several tested cases not even for re-encoded JPEG output — so the image
would have shipped sideways to actual site visitors while looking
perfectly fine in every "did I do this right" check performed with
Apple's own tools. This is a **verification blind spot**, not just an
image bug: the natural way to check "is this rotated correctly" (open it
and look) gave a false positive repeatedly, across `-r` alone, `-r`
combined with `-Z`, `-r` then a separate `-Z` resize call, resize-then-
rotate, and a PNG round-trip — every combination looked right in Preview
and wrong in Chrome.

**The fix:** wrote a small Swift script
(`rotate_resize.swift` — not committed, lived only in the scratch
directory during the session) using Core Graphics directly: load the
source `CGImage`, draw it into a freshly-created `CGContext` with an
explicit rotation + scale transform applied via `CGContext` matrix calls,
then export that context's image. Because the output image is built pixel
by pixel from a transform matrix rather than copied-with-a-flag from the
source, there's no metadata to lose or misinterpret — what you draw is
what's in the file. Verified this time by loading the actual output file
directly in the Chrome browser pane (not just the Read/Preview-style
inspector) before shipping it.

**Takeaway for future work:** if any future task needs to rotate, flip, or
reorient an image programmatically on this Mac, **do not trust
`sips -r`** for anything that will be viewed in a browser. Either use the
Core Graphics/Swift approach above, or at minimum verify the *final*
output by loading it in an actual browser engine, not just Preview or an
image inspector that might be EXIF-aware. This cost significant back-
and-forth the first time; it shouldn't a second time.

The final asset is `assets/work/point-of-view-beauty-pop-up-01.jpg`
(~230KB, 1050×1400, in line with the site's other event photos).

### 2026-08-09 — Larger "Where I've Been" photos on desktop
Increased the minimum tile width in the interactive event grid from 160px to
200px at computer-sized widths (900px and above), so the event photography is
easier to see. The smaller-screen layout is intentionally unchanged. With the
current five events, the wider desktop grid wraps naturally onto a second row
rather than squeezing all five into one row.

### 2026-08-09 — About page rewritten in Nikoline's voice
Replaced the third-person career-summary bio with a first-person narrative based
on a long writing sample from Nikoline. The approved direction is playful,
candid and self-aware while still confidently showing off her range. It opens
with her name pronunciation and Danish background, then includes her Southern
California upbringing, University of Oregon education, post-grad role at
Vanguard Logistics and five-suitcase move to New York. The career story now
connects Aviator Nation, CLD PR, Assouline and Stacy McLaughlin Communications
with specific accomplishments across media pitching, luxury client relations,
Coachella, NYFW, celebrity book events, social content and major press
placements. It closes with a concise statement of her professional range and a
personal paragraph about travel, restaurants, hot yoga, learning Danish and
vintage/sustainable shopping. A previewed draft briefly used the word "dansk"
in the opening; Nikoline approved the rewrite after asking for that word to be
removed.

### 2026-08-13 — Experience removed from the visible site journey
Removed Experience from the shared navigation because the page largely repeated
the downloadable resume without adding the personality of About or the proof of
Work. The homepage's primary button now says "View My Work," its career-timeline
link now points to Work, and About's former "View Full Experience" button now
points to Work as well. Resume downloads remain prominent on Home, About and
Contact. `experience.html` was deliberately preserved in the repository, with
its navigation updated to match the four-item site menu, so the page can be
restored easily if Nikoline wants to rethink or republish it later.

### 2026-08-13 — Unboxed entries + Nikoline's hand-drawn star bullets
Removed the mauve fill, inner border, rounded corners and shadow from every
`.credential` entry after Nikoline flagged the heavy "box inside a box" effect.
The entries now sit directly on the white section surface, separated by open
space, while the black outer section borders remain.

Several decorative directions were previewed before landing here. First, the
mauve card became a flat editorial entry with a mauve left rule. Next, an
original Victorian/English botanical embroidery motif was generated from
historical needlework references and tried both as a spacer between entries and
as an all-black trim replacing the outer section borders. Nikoline loved the
motif but found its placement awkward, so it was removed from the live design
and deliberately preserved at `assets/decor/victorian-lace-trim-1.png` under
the name **Victorian Lace Trim 1** for a future use.

The final personality detail came from Nikoline's own marker-drawn five-point
star. A cleaned version preserves its irregular strokes, rounded ends and open
center while remaining legible at bullet size; it lives at
`assets/decor/nikoline-star-bullet.png`. It replaces standard round bullets only
in the homepage "Currently" entries and Work's "What I've Placed" entries.
Other lists keep their normal markers. All active ornament is black for now.

### 2026-08-13 — Press placement labels removed
Removed the repeated "Press Placement" category label above all four entries in
"What I've Placed." The section heading already establishes that context, so
the publication name now leads each entry directly. A bright purple
`#B500FF` outer-border color was also previewed immediately beforehand and
rejected; the approved black section borders remain unchanged.

### 2026-08-13 — Contact resume block simplified
Removed the redundant "Access: Resume" eyebrow and the dated "Updated 2026"
meta line from the Contact page's resume block. It now leads directly with
"Full Career Resume," followed by "PDF Download" and the download button.

### 2026-08-13 — Resume accents removed site-wide
Standardized all visible uses of "resume" to the unaccented spelling across
Home, About, Contact and the preserved Experience page. Documentation follows
the same convention. The existing PDF filename remains unchanged so its links
continue to work.

### 2026-08-13 — Pantone-inspired pinstripe palette
Changed the shared vertical pinstripe background from green and teal to the
web approximations of Pantone 19-2047 TCX Sangria (`#982551`) and Pantone
18-4048 TCX Nebulas Blue (`#2E62A3`). The existing 55% white overlay remains
in place, keeping the saturated pairing soft behind the white content panels.

### 2026-08-13 — Sun-Dried Tomato frame and CTA demo
After first previewing bright green frames, replaced that experiment with the
web approximation of Pantone 19-1531 TCX Sun-Dried Tomato (`#752329`). The
color now accents the outer borders around major white content panels and the
CTA button boxes, including filled primary buttons and outlined secondary
buttons. Other controls and modal borders remain black.

### 2026-08-13 — Desktop Contact resume alignment
Centered the Full Career Resume heading, PDF Download label and download button
within their desktop grid column. The rule begins above the existing 720px
mobile breakpoint, so the iOS/mobile placement remains exactly as it was.

### 2026-08-13 — Contact introduction rewritten
Replaced the formal New York availability line with warmer, more confident
language that echoes the personality of the About page while retaining the
same focus on public relations, social strategy and events.

### 2026-08-13 — Mobile resume invitation moved first
On screens at or below the existing 720px mobile breakpoint, moved the resume
download block above Email, LinkedIn and Instagram without changing its desktop
position. Replaced the stiff "Full Career Resume" heading with the direct
label "RESUME:" and removed the redundant "PDF Download" line above the existing
"Download PDF" button.

### 2026-08-13 — Mobile resume group centered
Centered the complete resume group on iOS/mobile so the `RESUME:` label shares
the exact horizontal center of the Download PDF button beneath it. Desktop
alignment remains unchanged. The mobile group uses one compact centered stack
and removes the credential heading's standard right-side spacing so the label
and button align by their actual dimensions.

### 2026-08-13 — Desktop resume CTA promoted
For a local desktop demo, moved the resume CTA directly beneath the Contact
introduction and above the other contact methods. After previewing a horizontal
row and then a centered stack, aligned the final stacked label and button to the
same left edge as the introductory paragraph, Email, LinkedIn and Instagram.
The approved centered iOS layout remains unchanged.

### 2026-08-13 — About portrait added
Added Nikoline's supplied portrait beside the opening About paragraph in a
restrained editorial two-column layout. The image keeps its full vertical
proportions at a modest width and uses a thin Sun-Dried Tomato frame. On mobile,
it moves above the introduction and centers so the text remains comfortable.

### 2026-08-13 — About introduction tightened and signed
Moved the Southern California paragraph into the portrait's adjoining text
column, eliminating the empty space beneath the short opening paragraph. After
previewing Nikoline's hand-drawn star as a small signature, removed it and
shifted the portrait to the right. The opening copy now wraps naturally around
the image in an editorial treatment rather than sitting in a rigid column. The
full About narrative shares one continuous flow container so paragraphs hug the
portrait until they naturally clear it, without a forced transition or gap. The
desktop portrait was then enlarged slightly for stronger presence; mobile keeps
its existing restrained size.

### 2026-08-13 — Croatian name wording clarified
Rephrased the opening About anecdote to say directly that Nikoline learned the
name is Croatian too during her 2018 trip, replacing the more awkward phrasing
that the name simply "exists there."

### 2026-08-13 — Early New York roles distinguished
Reworded the About narrative so Nikoline's brief personal-assistant role and
CLD PR internship are clearly presented as two separate jobs that she held at
the same time, rather than a single blended position.

### 2026-08-13 — About closing flourish centered
Centered the View My Work and Download Resume buttons at the end of the About
page. Added three small instances of Nikoline's hand-drawn star between the
final paragraph and the buttons as a restrained closing signature.

### 2026-08-13 — About role wording refined
Removed "out front" from the CLD PR events sentence and updated the social
content reference from "Stacy's PR Instagram" to "the SMC PR Instagram."

### 2026-08-13 — Assouline event list streamlined
Replaced the detailed list of individual Assouline events with a concise summary
of limited-edition publication launches, celebrity signings and cultural events.
The About page now conveys range while leaving the Work page to show specifics.

### 2026-08-13 — Achille Salvagni launch added to Work
Added "An Evening with Achille Salvagni" to Where I've Been with Nikoline's
supplied event photo. The entry describes the May 13, 2026 Assouline monograph
launch at 817 Madison Avenue and focuses on her role as an on-site Assouline
ambassador: welcoming and educating guests, sharing details about the release
and answering questions throughout the reception. Added the comma after
"gallerists" in the attendee list for clarity. Refreshed the Work page's
script cache marker so the new event appears immediately for returning visitors.
The Where I've Been gallery now sorts all event records newest to oldest using
dedicated sortable dates, independent of how each date is presented to visitors.

### 2026-08-13 — Achille Salvagni carousel added
Added two more supplied photos to the Achille Salvagni event. Multi-photo event
details now show one image at a time with original hand-drawn-style arrow
controls, a current-photo count, keyboard left/right navigation, and touch swipe
support on mobile. Single-photo events continue to display without controls.
Gallery images are capped relative to the browser height and use a full-image
fit, so portrait and landscape media can be viewed without scrolling through
an oversized crop.

### 2026-08-13 — Icy blue surface-color demo
Initially previewed icy blue `#D8F9FA` in place of the shared white surface,
then softened it to a more muted mint-blue `#DDEFEA`. The revised color keeps
the site visibly colorful while relating more naturally to Avocado Oil and the
vintage-inspired palette. The shared token updates the masthead, content panels,
footer, modal, light buttons and other formerly white interface areas.

### 2026-08-13 — Avocado Oil stripe demo
Replaced the Nebulas Blue half of the pinstripe background with the web
approximation of Pantone 16-0640 TCX Avocado Oil (`#9B892F`). Sangria remains
the alternating stripe, paired with mint-blue content surfaces and Sun-Dried
Tomato frames and CTA accents.

### 2026-08-13 — Palette simplified to three colors
After previewing and publishing the mint-blue, Sangria and Avocado Oil palette,
returned the site to white surfaces and simplified the pinstripes to Sun-Dried
Tomato (`#752329`) and Nebulas Blue (`#2E62A3`). Sun-Dried Tomato continues to
frame the content panels and accent CTA buttons, keeping the active palette to
white plus the two Pantone-inspired colors.

## Gaps in this record

This journal was authored retroactively, reconstructed from one long
Claude Code conversation plus the git commit history. Two commits
(2026-08-08, "Remove access labels and punch-hole detail from credential
cards" and the interactive-photo-grid work) reflect real, shipped changes
that happened in a *different* session not visible to whoever wrote this
file — they're documented above based on the commit messages and reading
the resulting code, not from a first-hand account of the design
discussion behind them. If you're picking this project up and something
about those two areas seems to contradict this journal, trust the code
over this document, and consider adding a corrected entry here.

Going forward, **add a new dated entry to this file whenever a session
does non-trivial design or content work** — especially anything that was
tried and reverted, since that's the hardest context to reconstruct after
the fact from git history alone (reverted work often leaves no trace in
`git log` at all if it was undone before committing).

### 2026-08-13 — Derrick Rose gallery expanded

- Added two supplied event photos to the Derrick Rose book-signing gallery.
- Kept the existing signing photo as the cover image.
- Reused the fitted gallery, arrow controls, keyboard navigation, and iOS swipe behavior established for the Achille Salvagni event.
- Renamed the event “Derrick Rose: The Poohprint” and expanded the description to highlight event-flow management, guest education and direct support for Derrick Rose.
- Styled the complete book title in bold italics wherever it appears in the event tile and details.
- Kept the event copy distinct: one bullet focuses on operations while another focuses on guest-facing book education.

## Current state (as of 2026-08-13)

- **Background:** Sun-Dried Tomato/Nebulas Blue vertical pinstripe
  (`--pattern-stripe-a` / `--pattern-stripe-b`), faded with a 55% white
  overlay, visible in the space between white content boxes.
- **Content boxes:** every major block (masthead, hero, each section,
  footer) has a white background; hero, section and footer frames use
  `2px solid #752329` while CTA buttons use the same accent,
  no rounded corners, no drop shadow.
- **Credential entries:** unboxed and transparent, with no inner border,
  rounded corners, shadow or mauve fill. Currently/Experience have no access
  label or punch-hole; Work retains its category tags. Nikoline's hand-drawn
  black star is the list marker in Currently and What I've Placed only.
- **Fonts:** Beth Ellen (script wordmark + section headings) + Spectral
  (everything else, weight 300 default).
- **Colors:** pure black for all text and active ornament; white content
  surfaces; Sun-Dried Tomato/Nebulas Blue background pattern with Sun-Dried
  Tomato frames and CTAs. The mauve token and archived lace
  asset remain available but mauve is not currently used in the interface.
- **Nav:** Home / About / Work / Contact, centered under a centered masthead
  name, no tagline. `experience.html` is preserved but not visibly linked.
- **Work page:** "Where I've Been" (interactive photo grid + fitted,
  swipeable galleries for multi-image events, 6 events) and "What I've
  Placed" (4 press placements, most-recent-first, each with a real scanned
  PDF clip).
- **Git:** `design_experiment` and `main` are in sync as of the last
  commit in the log above.

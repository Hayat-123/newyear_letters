# Zemenay Enkutatash

A one-page new year note sent to partner companies ahead of Meskerem 1, 2019 E.C.
(11 September 2026). It never names the company reading it, so the same URL goes
to the whole list.

```bash
npm run dev
```

Runs on http://localhost:4500 via the project launch config, or port 3000 with a
plain `npm run dev`.

## What still needs filling in

### 1. The projects

Edit `app/data/projects.ts`. Six entries are seeded as placeholders. Add or
remove freely, the grid reflows for any count.

Drop a photo for each into `public/projects/` and point `image` at it. The photo
is centre-cropped, so keep the subject away from the very edges. The first entry
renders as the wide feature card at the top of the grid and crops to 16:9, so
give that one a landscape shot; the rest crop to 4:5 and suit portrait or square
originals.

Any card without a usable photo falls back to its index numeral at full bleed
and names the file it is waiting for, so a half-filled deck still looks
deliberate rather than broken.

### 2. The services list

`app/data/services.ts` holds the six offerings shown under "what we do", with
copy and links tracking the live pages on zemenaytech.com. Nothing to add here
unless the offering set changes.

### 3. The presenter video

The clip is composited straight onto the blue, so it needs a real alpha channel.
Two encodings are required, because Safari cannot decode alpha WebM and Chrome
cannot decode HEVC:

| File | Codec | Plays in |
| --- | --- | --- |
| `public/media/pm-intro.webm` | VP9 or AV1 with alpha | Chrome, Edge, Firefox |
| `public/media/pm-intro.mov` | HEVC with alpha (`hvc1`) | Safari |
| `public/media/pm-poster.png` | still frame, optional | before playback starts |

Until both exist the section shows a panel saying so rather than a broken
player.

### 4. TAN Nimbus

The hero word is meant to be set in TAN Nimbus, a licensed face from TAN Type
that cannot be committed here. Put the file at `public/fonts/TAN-NIMBUS.woff2`
(or `.otf`) and it takes over on the next load, no code change needed. Until
then the stack falls through to Righteous, which carries a similar retro-deco
weight.

## The artwork

`public/art/` is generated, not hand-made. `npm run art` rebuilds every file in
it from two source folders: the announcement graphic in `D:/site_pics`
(override with `ART_SRC`) and the illustration pack in
`D:/Telegram Desktop/Adeweb Developer Africa` (override with `ART_PACK`).

- **`fist-left.png` / `fist-right.png`** are cut out of the announcement graphic
  by flood-filling the charcoal background inward from the border, then split on
  the seam where the two fists meet. Butting them edge to edge rebuilds the
  original drawing, which is how the hero assembles.
- **`adey.png` / `adey-blue.png`** are the falling flower in its own yellow and
  in Zemenay blue. The page hard-cuts between the two behind a white flash
  rather than running a CSS `hue-rotate`, which drags a saturated yellow through
  green on the way out and overshoots into violet on the way in.
- **`meadow-grow.webp`** is the field at the foot of the page, assembled wide
  from one tall cut-out by flipping and rescaling copies. Its ragged top edge is
  the whole point: stems and heads break into the open green so the field grows
  out of the page rather than being a rectangle of photograph pasted across the
  bottom.
- **`woman.webp`** stands in that field, behind the band so the front row of
  flowers crosses her skirt.
- **`blue-drift.webp`** is the drift of small blue flowers behind the services
  list, and **`bloom-blur.webp`** is the close-up cluster thrown out of focus
  behind the presenter video.

## Brand

Colours and the Degular Display heading face come from the marketing site
(`Zemenay-Revamped-2026`), not from the internal workspace app, so this reads as
Zemenay rather than as one product inside it. The page sits at the dark end of
the same palette because the cut-out fists and the glowing petals need a dark
ground. Tokens live at the top of `app/globals.css`.

## Motion

Every entrance is CSS keyframes over server-rendered markup, so the opening
plays on the first painted frame with no hydration wait and no animation
library. Under `prefers-reduced-motion` the scroll reveals resolve to their end
state, the petal layer slows to a drift and stops spinning, and the hover lifts
come off. The opening itself still plays: on this page the fist bump is the
content, not decoration around it, and Windows reports that preference for
anyone who has simply switched animation effects off.

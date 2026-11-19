# Cubewise

A website that solves a user's scrambled cube from the colours they enter, and teaches them to solve it themselves.

## Language

### The cube

**Face**:
One of the six sides of the cube.
_Avoid_: Side, layer (a layer is the slice that turns, not the surface)

**Front face**:
The face currently turned towards the user, which is the only face they paint at any moment.
_Avoid_: Active face, current side

**Sticker**:
One coloured square on a face; a 3×3 face has nine.
_Avoid_: Mini square, facelet, tile, square

**Sticker number**:
The 1–9 label of a sticker on the front face, read left-to-right, top-to-bottom.
_Avoid_: Index, position, slot

**Centre**:
The middle sticker (number 5) of a face; it never moves relative to the other centres, so it decides which colour that face is solved to.
_Avoid_: Middle, centre piece

**Colour scheme**:
Which colour each centre has; the standard scheme is white top, green front, but a user's cube may differ.
_Avoid_: Colour layout, palette

**Net**:
The cube unfolded flat into six faces, showing every sticker at once.
_Avoid_: Map, flat view, unfolded cube

### Entering colours

**Colour key**:
The single letter that paints a sticker a colour: W, Y, R, O, B, G.
_Avoid_: Colour shortcut, colour hotkey

### Solving and learning

**Move**:
One turn of a single face, by a quarter or a half, written in standard notation (`R`, `U2`, `F'`).
_Avoid_: Turn, rotation

**Solution**:
The sequence of moves that takes the entered cube to solved.
_Avoid_: Answer, result

**Short solution**:
A solution aimed at the fewest moves (about 20), with no stages a human could follow.
_Avoid_: Optimal solution, fast solve, computer solution

**Method solution**:
A solution that follows one method, grouped by stage and described in the user's own colour scheme. The **beginner solution** is the one that follows the beginner method.
_Avoid_: Teach-me solution, guided solve, long solution

**Method**:
A named way of solving the cube, made up of ordered stages.
_Avoid_: Technique, strategy

**Beginner method**:
The layer-by-layer method taught in the lessons.
_Avoid_: LBL, easy method

**Stage**:
One part of a method with its own goal, such as the cross or the first-layer corners; its name never mentions a colour.
_Avoid_: Phase, part (a step is one move, not a stage)

**Sequence**:
A fixed series of moves, taught in a lesson, that does one job such as placing a corner.
_Avoid_: Algorithm, alg, formula, trigger

**Case**:
One situation within a stage that calls for a particular sequence, such as "white faces right".
_Avoid_: Scenario, pattern, variant

**Slot**:
In the first two layers, a corner place of the first layer together with the edge place above it, filled by a corner-edge pair.
_Avoid_: Using "slot" for a sticker number

**Whole-cube turn**:
Turning the entire cube in the hands to look at another side, written `x`, `y` or `z` (the way R, U or F turns); no piece changes place, so it is not a move.
_Avoid_: Rotation, cube rotation, reorientation

**Wide turn**:
A face turned together with the middle layer behind it, written with a small letter (`r`, `u`).
_Avoid_: Double-layer turn, fat turn

**Slice turn**:
A middle layer turned alone, written `M`, `E` or `S` (the way L, D or F turns).
_Avoid_: Middle turn, inner turn

**Turn**:
Anything written in notation: a move, a wide turn, a slice turn or a whole-cube turn. In code, method solvers work in turns; a move stays one face only.
_Avoid_: Using "move" for wide, slice or whole-cube turns

**Step**:
One thing the user does while following a solution: one turn.
_Avoid_: Action, instruction

**View**:
The cube as the user sees it at one moment of a solution, after any whole-cube, wide or slice turns: a piece counts as home when it matches the centres as they are now held.
_Avoid_: Frame, perspective

**Lesson**:
A page that teaches one stage of a method, with cube pictures alongside the explanation. Its address is `/learn/<method>/<stage>`.
_Avoid_: Tutorial, guide, chapter

## Translations

One word per term in each language of the site. Notation (`R U R' F2`, `x`, `M`), the face letters and the names CFOP, Roux, ZZ, Petrus, OLL, PLL and F2L are never translated.

| English | French | Arabic |
|---|---|---|
| Face | face | وجه |
| Front face | face avant | الوجه الأمامي |
| Sticker | autocollant | ملصق |
| Centre | centre | مركز |
| Colour scheme | schéma de couleurs | نظام الألوان |
| Net | patron | شبكة المكعب |
| Colour key | touche de couleur | مفتاح اللون |
| Piece, edge, corner | pièce, arête, coin | قطعة، حافة، زاوية |
| Layer | couche | طبقة |
| Move | mouvement | حركة |
| Turn | rotation | دورة |
| Quarter turn, half turn | quart de tour, demi-tour | ربع دورة، نصف دورة |
| Whole-cube turn | rotation du cube entier | تدوير المكعب كاملاً |
| Wide turn | rotation large | دورة عريضة |
| Slice turn | rotation de tranche | دورة الشريحة |
| Step | pas | خطوة |
| Solution, short solution | solution, solution courte | الحل، الحل القصير |
| Solver | solveur | أداة الحل |
| Method | méthode | طريقة |
| Beginner method | méthode débutant | طريقة المبتدئين |
| Stage | étape | مرحلة |
| Lesson | leçon | درس |
| Sequence | séquence | متتالية |
| Case | cas | حالة |
| Slot | emplacement | خانة |
| Pair, block | paire, bloc | زوج، كتلة |
| View | vue | منظور |
| Cross, daisy, petal | croix, marguerite, pétale | صليب، أقحوانة، بتلة |
| Orient, permute | orienter, permuter | توجيه، تبديل المواضع |
| Scrambled | mélangé | مخلوط |
| Home (a piece) | à sa place | في مكانها الصحيح |
| Speedsolvers | speedcubeurs | ممارسو الحل السريع |

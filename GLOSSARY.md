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

**Solution**:
The sequence of moves that takes the entered cube to solved.
_Avoid_: Answer, result

**Short solution**:
A solution aimed at the fewest moves (about 20), with no stages a human could follow.
_Avoid_: Optimal solution, fast solve, computer solution

**Beginner solution**:
A solution that follows the beginner method, grouped by stage and described in the user's own colour scheme.
_Avoid_: Teach-me solution, guided solve, long solution

**Method**:
A named way of solving the cube, made up of ordered stages.
_Avoid_: Technique, strategy

**Beginner method**:
The layer-by-layer method taught in the lessons.
_Avoid_: LBL, easy method

**Stage**:
One step of a method with its own goal, such as the cross or the first-layer corners; its name never mentions a colour.
_Avoid_: Step, phase

**Lesson**:
A page that teaches one stage of a method, with cube pictures alongside the explanation.
_Avoid_: Tutorial, guide, chapter

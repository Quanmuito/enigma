# Enigma Flow Diagram

## Overall Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                       Enigma Component                        │
│                        (index.tsx)                            │
└───────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼────────────────────┐
        │                     │                    │
        ▼                     ▼                    ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Message    │      │   Machine    │      │   Generator  │
│   State      │────> │   Config     |────> │   Builder    │
│   (Input)    │      │   (Props)    │      │              │
└──────────────┘      └──────────────┘      └──────────────┘
        │                                          │
        └───────────────────┬──────────────────────┘
                            │
                            ▼
                    ┌──────────────────┐
                    │   Encryption     │
                    │     Process      │
                    └──────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Encrypted   │    │   Machine    │    │    Node      │
│   Message    │    │    State     │    │  Positions   │
│              │    │              │    │  (Signal     │
│              │    │              │    │    Path)     │
└──────────────┘    └──────────────┘    └──────────────┘
        │                                       │
        │                                       ▼
        │                              ┌──────────────────┐
        │                              │  Visualization   │
        │                              │    Components    │
        │                              └──────────────────┘
        │                                       │
        └───────────────────────────────────────┘
                            │
                            ▼
                  ┌─────────────────────┐
                  │   Rendered UI       │
                  │ (Sections + Lines)  │
                  └─────────────────────┘
```

## Encryption Signal Flow

```
INPUT: Character "E"
│
├─▶ Plugboard (Forward)
│   └─▶ Swap if paired (e.g., E → K)
│
├─▶ Rotor 3 (Forward)
│   └─▶ Map through wiring (K → M)
│
├─▶ Rotor 2 (Forward)
│   └─▶ Map through wiring (M → Q)
│
├─▶ Rotor 1 (Forward)
│   └─▶ Map through wiring (Q → T)
│
├─▶ Reflector
│   └─▶ Reflect signal (T → B)
│
├─▶ Rotor 1 (Backward)
│   └─▶ Reverse mapping (B → Y)
│
├─▶ Rotor 2 (Backward)
│   └─▶ Reverse mapping (Y → W)
│
├─▶ Rotor 3 (Backward)
│   └─▶ Reverse mapping (W → F)
│
├─▶ Plugboard (Backward)
│   └─▶ Swap back if paired (F → F)
│
└─▶ OUTPUT: Character "F"
```

## Component Hierarchy

```
Enigma (index.tsx)
│
├─▶ Output Container
│   └─▶ Displays encrypted message
│
├─▶ Rotor Step Container
│   ├─▶ Rotor 1 position (rotor1.ingang[0])
│   ├─▶ Rotor 2 position (rotor2.ingang[0])
│   └─▶ Rotor 3 position (rotor3.ingang[0])
│
├─▶ Visual Container
│   │
│   ├─▶ Section: Reflector
│   │   ├─▶ CharacterColumn (Left: ingang)
│   │   ├─▶ CharacterColumn (Right: engang)
│   │   └─▶ Lines (internal connections)
│   │
│   ├─▶ Line: Reflector ↔ Rotor1
│   │   ├─▶ Forward line (lineFwReflectorRotor1)
│   │   └─▶ Backward line (lineBwReflectorRotor1)
│   │
│   ├─▶ Section: Rotor1
│   │   ├─▶ CharacterColumn (Left: ingang)
│   │   ├─▶ CharacterColumn (Right: engang)
│   │   ├─▶ Notch indicator
│   │   └─▶ Lines (internal connections)
│   │
│   ├─▶ Line: Rotor1 ↔ Rotor2
│   │
│   ├─▶ Section: Rotor2
│   │   ├─▶ CharacterColumn (Left: ingang)
│   │   ├─▶ CharacterColumn (Right: engang)
│   │   ├─▶ Notch indicator
│   │   └─▶ Lines (internal connections)
│   │
│   ├─▶ Line: Rotor2 ↔ Rotor3
│   │
│   ├─▶ Section: Rotor3
│   │   ├─▶ CharacterColumn (Left: ingang)
│   │   ├─▶ CharacterColumn (Right: engang)
│   │   ├─▶ Notch indicator
│   │   └─▶ Lines (internal connections)
│   │
│   ├─▶ Line: Rotor3 ↔ Plugboard
│   │
│   ├─▶ Section: Plugboard
│   │   ├─▶ CharacterColumn (Left: engang)
│   │   ├─▶ CharacterColumn (Right: ingang)
│   │   └─▶ Lines (internal connections)
│   │
│   ├─▶ Line: Plugboard ↔ Keyboard
│   │
│   └─▶ Section: Keyboard
│       ├─▶ CharacterColumn (Left: KEYBOARD)
│       └─▶ CharacterColumn (Right: KEYBOARD)
│
└─▶ Input Container
    └─▶ Input field for message
```

## Data Flow: Visualization

```
1. User types message
   │
   ▼
2. Message state updates
   │
   ▼
3. Generator encrypts message
   │   └─▶ For each character:
   │       ├─▶ Track signal through all components
   │       ├─▶ Collect node positions (signal path)
   │       └─▶ Update machine state (rotor rotation)
   │
   ▼
4. Return: [encryptedMessage, machineState, nodePositions]
   │
   ▼
5. useCharacterRef creates refs at nodePositions
   │   └─▶ Maps positions to character spans
   │       ├─▶ lNode1, lNode2 (left column nodes)
   │       └─▶ rNode1, rNode2 (right column nodes)
   │
   ▼
6. redrawLines() connects refs
   │   └─▶ Uses connect() utility to draw lines
   │       ├─▶ Between sections (inter-section)
   │       └─▶ Within sections (intra-section)
   │
   ▼
7. Lines rendered in DOM
   │   └─▶ SVG-like div elements with calculated:
   │       ├─▶ Position (top, left)
   │       ├─▶ Width (distance)
   │       └─▶ Rotation (angle)
   │
   ▼
8. Visual representation shows signal path
```

## Hook Flow

```
useCharacterRef(nodePositions, positions)
│
├─▶ Creates refs for 4 nodes (lNode1, rNode1, lNode2, rNode2)
├─▶ Maps nodePositions array indices to actual positions
└─▶ Returns object with { id, ref } for each node
    └─▶ Used to attach refs to specific character spans

useLineRef()
│
└─▶ Returns [forwardLineRef, backwardLineRef]
    └─▶ Refs for drawing lines between sections

useLineRedraw(redrawCallback)
│
├─▶ Listens for window resize/scroll events
├─▶ Debounces redraw calls (250ms)
└─▶ Automatically redraws lines when needed

connect(leftRef, rightRef, lineRef)
│
├─▶ Gets bounding rectangles of character spans
├─▶ Calculates line start/end positions
├─▶ Computes distance and angle
└─▶ Applies styles to line element (width, position, rotation)
```

## State Management Flow

```
Initial Props: configedMachine
│
▼
useMemo: buildGenerator(configedMachine)
│
▼
Generator Function (closure over initial machine)
│
▼
User Input: message state updates
│
▼
useMemo: generator(message)
│   │
│   ├─▶ Creates copy of machine state
│   ├─▶ Splits message into characters
│   ├─▶ For each character:
│   │   ├─▶ Checks rotor notches
│   │   ├─▶ Rotates rotors (double-step if needed)
│   │   ├─▶ Applies signal sequence
│   │   └─▶ Tracks node positions (last character only)
│   │
│   └─▶ Returns: [encryptedMessage, finalMachineState, nodePositions]
│
▼
State Updates:
├─▶ encryptedMessage → Displayed in output
├─▶ machine → Used for rotor position indicators
└─▶ nodePositions → Used for visualization refs
```

## Line Drawing System

```
Section Internal Lines:
┌─────────────────────────────┐
│  Left Column  │  Right Col  │
│               │             │
│   A    ●──────┼───●  A      │
│   B           │      B      │
│   C    ●──────┼───●  C      │
│   ...         │     ...     │
└─────────────────────────────┘
   ↑             ↑
   lNode1        rNode1
   lNode2        rNode2

Inter-Section Lines:
┌─────────┐         ┌─────────┐
│ Section │ ────>   │ Section │
│    A    │ ────>   │    B    │
└─────────┘         └─────────┘
     rNode1             lNode1
     rNode2             lNode2
   (Right side)     (Left side)
```

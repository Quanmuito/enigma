### Project: EnigmaI simulator
##### Version: 1.0.3

#### Description:
A simulator of `EnigmaI` machine with simple UI and default setting.

### Credit

This project was inspired by [Jared Owen](https://www.youtube.com/@JaredOwen) with the video [How did the Enigma Machine work?](https://www.youtube.com/watch?v=ybkkiGtJmkM).

Thanks to Mike Koss with [Enigma Machine Simulator](https://mckoss.com/enigma-simulator-js/) so I can check my result.

Information source:
* [Enigma machine - Wikipedia](https://en.wikipedia.org/wiki/Enigma_machine)
* [Enigma rotor details - Wikipedia](https://en.wikipedia.org/wiki/Enigma_rotor_details)
* [Enigma wiring - Cryptomuseum](https://www.cryptomuseum.com/crypto/enigma/wiring.htm)
* [How does the ring settings of enigma change wiring tables? - Stackexchange Forum](https://crypto.stackexchange.com/questions/29315/how-does-the-ring-settings-of-enigma-change-wiring-tables/48659#48659)

### Principle explained and example

##### Rotate:

```
- Principle: Move each element from start of array to the end.
- Example:
Given an array: ['A', 'B', 'C', 'D', 'E', 'F']
Rotate 1 round => ['B', 'C', 'D', 'E', 'F', 'A']
Rotate 2 rounds => ['C', 'D', 'E', 'F', 'A', 'B']

- Implement: Take number of rounds as a cut point, separate into 2 array then change the order before merge them back
- Example:
Given an array: ['A', 'B', 'C', 'D', 'E', 'F'], rotate 2 rounds
Slice into 2 arrays with cut point at element with index 2 (excluded) => ['A', 'B'] and ['C', 'D', 'E', 'F']
Change the order => ['C', 'D', 'E', 'F'] and ['A', 'B']
Merge them back => ['C', 'D', 'E', 'F', 'A', 'B']

- Rotate backward apply the same principle but in reversed and the cut point is the length of array minus number of rounds
- Example:
Given an array: ['C', 'D', 'E', 'F', 'A', 'B'], rotate backward 2 rounds
Slice into 2 arrays with cut point at element with index 6 - 2 = 4 (excluded) => ['C', 'D', 'E', 'F'] and ['A', 'B']
Change the order => ['A', 'B'] and ['C', 'D', 'E', 'F']
Merge them back => ['A', 'B', 'C', 'D', 'E', 'F']
```

##### Shifted letters

Below is my visual explanation on how ring setting and shifting work.

The table below shows how ring settings affect rotor wiring. Each column group represents a different ring setting:
- **C1, C2, C3**: Ring setting **A** (input position, wiring offset, output position)
- **C4, C5, C6**: Ring setting **B** (input position, wiring offset, output position)
- **C7, C8, C9**: Ring setting **A** after backward rotation (input position, wiring offset, output position)

**How it works:**
Each character on the alphabet ring has an ordinal number, starting with **A|0** (in programming language today) all the way to **Z|25** (shown in C1, C4, C7).
The 'wiring' is a set of rules which define how many steps will be added to the ordinal number to point to a different character (C2, C5, C8). If the new ordinal number exceeds 25, we use modulo 26 (wraps around), shown as "X->Y" (e.g., `E|30->4` means 30 mod 26 = 4).
The **EnigmaI - rotor I** with ring setting **A** produces the scrambled output shown in C3.
When the ring setting is **B**, the ring moves up by 1 position, the calculation is performed, and the output is shown in C6.
Rotating backward until letter **A** reaches the beginning of the list produces the mapping shown in C9.

```
C1      C2     C3                          C4      C5     C6                                C7      C8     C9

A|0     +4     E|4            =>           B|1     +4     F|5                =>             A|0     +10    K|10
B|1     +9     K|10           =>           C|2     +9     L|11               =>             B|1     +4     F|5
C|2     +10    M|12           =>           D|3     +10    N|13               =>             C|2     +9     L|11
D|3     +2     F|5            =>           E|4     +2     G|6                =>             D|3     +10    N|13
E|4     +7     L|11           =>           F|5     +7     M|12               =>             E|4     +2     G|6
F|5     +1     G|6            =>           G|6     +1     H|7                =>             F|5     +7     M|12
G|6     +23    D|3            =>           H|7     +23    E|30->4            =>             G|6     +1     H|7
H|7     +9     Q|16           =>           I|8     +9     R|17               =>             H|7     +23    E|30->4
I|8     +13    V|21           =>           J|9     +13    V|21               =>             I|8     +9     R|17
J|9     +16    Z|25           =>           K|10    +16    A|26->0            =>             J|9     +13    V|21
K|10    +3     N|13           =>           L|11    +3     O|14               =>             K|10    +16    A|26->0
L|11    +8     T|19           =>           M|12    +8     U|20               =>             L|11    +3     O|14
M|12    +2     O|14           =>           N|13    +2     P|15               =>             M|12    +8     U|20
N|13    +9     W|22           =>           O|14    +9     X|23               =>             N|13    +2     P|15
O|14    +10    Y|24           =>           P|15    +10    Z|25               =>             O|14    +9     X|23
P|15    +18    H|7            =>           Q|16    +18    I|8                =>             P|15    +10    Z|25
Q|16    +7     X|23           =>           R|17    +7     Y|24               =>             Q|16    +18    I|8
R|17    +3     U|20           =>           S|18    +3     V|21               =>             R|17    +7     Y|24
S|18    +0     S|18           =>           T|19    +0     T|19               =>             S|18    +3     V|21
T|19    +22    P|15           =>           U|20    +22    Q|42->16           =>             T|19    +0     T|19
U|20    +6     A|0            =>           V|21    +6     B|27->1            =>             U|20    +22    Q|42->16
V|21    +13    I|8            =>           W|22    +13    J|35->10           =>             V|21    +6     B|27->1
W|22    +5     B|1            =>           X|23    +5     C|28->2            =>             W|22    +13    J|35->10
X|23    +20    R|17           =>           Y|24    +20    S|44->18           =>             X|23    +5     C|28->2
Y|24    +4     C|2            =>           Z|25    +4     D|29->3            =>             Y|24    +20    S|44->18
Z|25    +10    J|9            =>           A|0     +10    K|10               =>             Z|25    +4     D|29->3
```
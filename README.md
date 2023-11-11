### Project: EnigmaI simulator
##### Version: 1.0

#### Description: 
A simulator of `EnigmaI` machine with simple UI and default setting.

#### Techstack: 
React, Typescript, Docker

#### Test coverage
- Run `yarn test` or `npm test` to run all tests and get coverage report

File           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------|---------|----------|---------|---------|-------------------
All files      |     100 |      100 |     100 |     100 |
 App.tsx       |     100 |      100 |     100 |     100 |
 enigma.ts     |     100 |      100 |     100 |     100 |
 reducer.ts    |     100 |      100 |     100 |     100 |
 validation.ts |     100 |      100 |     100 |     100 |

### How to setup project locally
Clone this repository to your local machine.

##### Run with Node.js
- Install [Node.js](https://nodejs.org/en/). Recommend version: 20.9.0.

- Open a terminal on the project directory.

- Run command `yarn install` or `npm install` to install packages.

- Run command `yarn start` or `npm start` to start the project.

- Access at [localhost:3000/enigma](localhost:3000/enigma)

##### Run with Docker
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).

- In the project directory, change `.env.example` to `.env`.

- You can run the project in either `develop` or `production` environment by copy either `docker-compose-dev.yml` or `docker-compose-prod.yml` to `docker-compose.yml`.:
    - Develop envirionment: Anychange you made to the project will be apply after refresh the page.
    - Production environment: The project will be built to static and running with nginx, mimic the production environment.

- Open a terminal on the project directory.

- Run `docker-compose up` or `docker-compose up -d`
    - NOTE! It might take a while until composer completes installing the packages.
    - NOTE! If using Mac and errors occur during the `docker-compose up` run, try to add resources to Docker. Go to Preferences -> Resources and set CPUs: 6 and Memory: 8 GB.

- Edit your `/etc/hosts` file (OSX/Linux) or `C:\Windows\System32\drivers\etc\hosts` file (Windows), add a line below (or choose whatever name you want)
```
127.0.0.1 my-enigma.local
```

- Access:
    - Develop envirionment: [my-enigma.local:3000/enigma](my-enigma.local/enigma)
    - Production environment: [my-enigma.local/enigma](my-enigma.local/enigma)
    

### Deploy
- Make a commit to `develop` to fix the version with message `RELEASE vx.x.x`.

- Make a pull request from `develop` and point to `master`, name the pull request `RELEASE vx.x.x`

- Merge pull request.

- Pull the lastest changes from `master`, run `yarn deploy` or `npm deploy`

- Create a new [Release](https://github.com/Quanmuito/enigma/releases)
    - Tag: vx.x.x
    - Title: vx.x.x (dd-mm-yyyy)
    - Content:
    ```
    ### Content
    - Change in [#PRNUMBER](PR url)
    ```

- Access at [Enigma I simulator](https://quanmuito.github.io/enigma/)

### Credit

This project was inspired by [Jared Owen](https://www.youtube.com/@JaredOwen) with the video [How did the Enigma Machine work?](https://www.youtube.com/watch?v=ybkkiGtJmkM).

Thanks to Mike Koss with [Enigma Machine Simulator](https://mckoss.com/enigma-simulator-js/) so I can check my result.

Information source:
* [Enigma machine - Wikipedia](https://en.wikipedia.org/wiki/Enigma_machine)
* [Enigma rotor details - Wikipedia](https://en.wikipedia.org/wiki/Enigma_rotor_details)
* [Enigma wiring - Cryptomuseum](https://www.cryptomuseum.com/crypto/enigma/wiring.htm)
* [How does the ring settings of enigma change wiring tables? - Stackexchange Forum](https://crypto.stackexchange.com/questions/29315/how-does-the-ring-settings-of-enigma-change-wiring-tables/48659#48659)

And below is my visually exlaination on how ring setting and shifting work. 
Each position on the alphabet ring has a ordinal number, start with `A|0` (in programming language today) all the way to `Z|25` (Column 1). 
The wiring will add a defined number to the position respectively (Column 2) and make a "scrambled output", column 3 is the output of the `EnigmaI` - rotor `I` when the ring setting is set to `A`. 
If the ring setting is set to `B`, we just simply move the ring up by 1 (Column 4), do the math and the output is `EnigmaI` - rotor `I` - ring `B`.

```
A|0     +4     ->    E|4     =>    B|1     +4     ->    F|5
B|1     +9     ->    K|10    =>    C|2     +9     ->    L|11
C|2     +10    ->    M|12    =>    D|3     +10    ->    N|13
D|3     +2     ->    F|5     =>    E|4     +2     ->    G|6
E|4     +7     ->    L|11    =>    F|5     +7     ->    M|12
F|5     +1     ->    G|6     =>    G|6     +1     ->    H|7
G|6     +23    ->    D|3     =>    H|7     +23    ->    E|30->4
H|7     +9     ->    Q|16    =>    I|8     +9     ->    R|17
I|8     +13    ->    V|21    =>    J|9     +13    ->    V|21
J|9     +16    ->    Z|25    =>    K|10    +16    ->    A|26->0
K|10    +3     ->    N|13    =>    L|11    +3     ->    O|14
L|11    +8     ->    T|19    =>    M|12    +8     ->    U|20
M|12    +2     ->    O|14    =>    N|13    +2     ->    P|15
N|13    +9     ->    W|22    =>    O|14    +9     ->    X|23
O|14    +10    ->    Y|24    =>    P|15    +10    ->    Z|25
P|15    +18    ->    H|7     =>    Q|16    +18    ->    I|8
Q|16    +7     ->    X|23    =>    R|17    +7     ->    Y|24
R|17    +3     ->    U|20    =>    S|18    +3     ->    V|21
S|18    +0     ->    S|18    =>    T|19    +0     ->    T|19
T|19    +22    ->    P|15    =>    U|20    +22    ->    Q|42->16
U|20    +6     ->    A|0     =>    V|21    +6     ->    B|27->1
V|21    +13    ->    I|8     =>    W|22    +13    ->    J|35->10
W|22    +5     ->    B|1     =>    X|23    +5     ->    C|28->2
X|23    +20    ->    R|17    =>    Y|24    +20    ->    S|44->18
Y|24    +4     ->    C|2     =>    Z|25    +4     ->    D|29->3
Z|25    +10    ->    J|9     =>    A|0     +10    ->    K|10
```
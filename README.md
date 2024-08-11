# Shazam Pacman

Shazam Pacman is a decentralized Pacman game built using React and Solidity. The project integrates Web3 authentication through Web3Auth, and users can interact with the game on the blockchain, tracking their scores and retrieving top users via Blockscout.

## Features

- **Pacman Game**: Enjoy a Pacman game experience powered by the `@platzh1rsch/pacman-canvas` package.
- **Web3 Authentication**: Users can log in with popular Web3 wallets using Web3Auth.
- **Blockchain Integration**: Player scores and enemy positions are stored on the Ethereum blockchain.
- **Leaderboard**: Retrieve top users and their scores directly from the blockchain.

## Demo

You can play the game and see it in action at [pacman.shahryarbhm.com](https://pacman.shahryarbhm.com).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Smart Contract](#smart-contract)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/shahryarbhm/shazam-pacman.git
   cd shazam-pacman
   ```

2. **Install Dependencies**

Ensure you have Node.js and npm or pnpm installed. Run the following command to install the required dependencies:

```bash
pnpm install
```

3. **Build for Production**

To build the project for production, run:


```bash
pnpm build
```

### Play the Game

Log in using your Web3 wallet via Web3Auth.
Start a new game by pressing the start game button.
Play the Pacman game and try to achieve the highest score.
Your score will be recorded on the blockchain, and you can check the leaderboard to see how you rank against other players.
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PacmanEnemyPosition {
    // Grid dimensions for the Pacman game
    uint256 public gridWidth;
    uint256 public gridHeight;


    // Number of enemies
    uint256 constant numEnemies = 4;

    // Store the current positions of enemies
    mapping(uint256 => Position) public enemyPositions;

    // Structure to represent a 2D position
    struct Position {
        uint256 x;
        uint256 y;
    }

    // Structure to represent a user and their score
    struct User {
        address userAddress;
        uint256 score;
        bool hasActiveGame;

    }

    // Event to emit when a new position is generated
    event NewPosition(uint256 indexed enemyId, uint256 x, uint256 y);

    // Event to emit when a new score is updated
    event ScoreUpdated(address userAddress, uint256 score,bool hasActiveGame);

    // Store user scores
    mapping(address => User) public users;
    // Array to store top-ranked users
    User[] public topUsers;
    uint256 public maxTopUsers;

    // Constructor to initialize player's name and grid dimensions
    constructor(uint256 _width, uint256 _height, uint256 _maxTopUsers) {
        gridWidth = _width;
        gridHeight = _height;
        maxTopUsers = _maxTopUsers;
    }

    // Function to generate a pseudo-random number based on block data
    function random(uint256 seed) internal view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, seed)));
    }

    // Function to generate a new random position for a specific enemy
    function generateRandomPosition(uint256 enemyId) public {
        require(enemyId < numEnemies, "Invalid enemy ID");
        
        uint256 randomNumber = random(enemyId);
        uint256 newX = randomNumber % gridWidth;
        uint256 newY = (randomNumber / gridWidth) % gridHeight;

        // Update the enemy's position
        enemyPositions[enemyId] = Position(newX, newY);

        // Emit an event with the new position
        emit NewPosition(enemyId, newX, newY);
    }

    // Function to get the current position of an enemy
    function getEnemyPosition(uint256 enemyId) external view returns (uint256, uint256) {
        require(enemyId < numEnemies, "Invalid enemy ID");
        
        Position memory pos = enemyPositions[enemyId];
        return (pos.x, pos.y);
    }

   // Function to update a user's score only if the new score is higher
    function updateScore(uint256 newScore) public {
        User storage user = users[msg.sender];
        require(user.hasActiveGame,"User Does not have an active game");
        user.hasActiveGame = false;
        if (newScore > user.score) {
            user.score = newScore;
            emit ScoreUpdated(user.userAddress, newScore,false);
            _updateTopUsers(user.userAddress, newScore);
        }
    }

    // Internal function to update the list of top-ranked users
    function _updateTopUsers(address  userAddress, uint256 score) internal {
        bool userExists = false;
        for (uint256 i = 0; i < topUsers.length; i++) {
            if (keccak256(abi.encodePacked(topUsers[i].userAddress)) == keccak256(abi.encodePacked(userAddress))) {
                userExists = true;
                if (score > topUsers[i].score) {
                    topUsers[i].score = score;
                }
                break;
            }
        }
        if (!userExists) {
            if (topUsers.length < maxTopUsers) {
                topUsers.push(User(userAddress, score,false));
            } else {
                for (uint256 i = 0; i < topUsers.length; i++) {
                    if (score > topUsers[i].score) {
                        topUsers[i] = User(userAddress, score,false);
                        break;
                    }
                }
            }
        }
        // Sort the topUsers array by score in descending order
        for (uint256 i = 0; i < topUsers.length; i++) {
            for (uint256 j = i + 1; j < topUsers.length; j++) {
                if (topUsers[j].score > topUsers[i].score) {
                    User memory temp = topUsers[i];
                    topUsers[i] = topUsers[j];
                    topUsers[j] = temp;
                }
            }
        }
    }


    // Function to get the top-ranked users
    function getTopUsers() external view returns (User[] memory) {
        return topUsers;
    }
    
    function createGame() public returns (Position[] memory) {
        address userAddress = msg.sender;
        User storage user = users[userAddress];

        // Ensure the user doesn't already have an active game
        require(!user.hasActiveGame, "User already has an active game");

        // Set the user details and mark as active
        user.userAddress = userAddress;
        user.score = 0;
        user.hasActiveGame = true;

        // Generate random positions for all enemies
        for (uint256 i = 0; i < numEnemies; i++) {
            generateRandomPosition(i);
        }

        // Return the initial positions of all enemies
        Position[] memory initialPositions = new Position[](numEnemies);
        for (uint256 i = 0; i < numEnemies; i++) {
            initialPositions[i] = enemyPositions[i];
        }

        return initialPositions;
    }
}

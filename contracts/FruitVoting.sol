//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

/// @title A voting system for strings
/// @notice You can use this contract for only the most basic rating system
/// @custom:demo This is a demo contract.
contract FruitVoting {
    mapping(string => uint256) public fruitVotes;

    event FruitVoted(string fruit, uint256 votes);

    /// @notice this function increases the vote integer for a string
    /// @dev it does not need to check whether it is the first vote
    /// @param fruit the key representing a fruit name
    function voteForFruit(string memory fruit) public {
        fruitVotes[fruit]++;
        emit FruitVoted(fruit, fruitVotes[fruit]);
    }

    /// @notice this function returns the number of times a fruit has been voted
    /// @param fruit the key representing a fruit name
    /// @return Number of votes for the fruit
    function getVotesForFruit(string memory fruit) public view returns (uint) {
        return fruitVotes[fruit];
    }
}

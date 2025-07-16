// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract InkiiStaking {
    address private owner; // My address for onlyOwner function
    uint256 public rewardPercentage;
    uint256 public stakingDuration; // staking duration in seconds

    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 finishTime;
        uint256 reward;
    }

    // Mappings
    mapping(address => Stake[]) private stakes;

    // Event definitions
    event Staked(
        address indexed user,
        uint256 amount,
        uint256 startTime,
        uint256 finishDate
    );
    event Unstaked(address indexed user, uint256 amount, uint256 reward);
    event RewardPercentageChanged(uint256 newRewardPercentage);
    event StakingDurationChanged(uint256 newDuration);

    constructor(uint256 _rewardPercentage, uint256 _stakingDuration) {
        owner = msg.sender;
        rewardPercentage = _rewardPercentage;
        stakingDuration = _stakingDuration;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // Change reward percentage
    function setRewardPercentage(uint256 _newPercentage) external onlyOwner {
        rewardPercentage = _newPercentage;
        emit RewardPercentageChanged(_newPercentage);
    }

    // Change Staking duration
    function setStakingDuration(uint256 _newDuration) external onlyOwner {
        stakingDuration = _newDuration;
        emit StakingDurationChanged(_newDuration);
    }

    // Calculate Reward
    function calculateReward(uint256 _startTime) public view returns (uint256) {
        uint256 stakedTime = block.timestamp - _startTime; // Know the difference between those dates (in seconds)

        // Number of full periods (staking duration is a the desired days in seconds)
        uint256 fullPeriods = stakedTime / stakingDuration;

        // Reward is rewardPercentage (in integer) tokens per stakingDuration days, so we multiply by 10 to avoid decimals
        // Total reward is reward per period * number of full periods
        return (fullPeriods * rewardPercentage) / 100;
    }

    // Make stake
    function stake() external payable {
        require(msg.value > 0, "Amount should be greater than 0");

        // Calculate the values
        uint256 startTime = block.timestamp;
        uint256 stakeValue = msg.value;
        uint256 finishTime = startTime + stakingDuration;
        uint256 reward = calculateReward(startTime);

        // Save the sender's staking
        stakes[msg.sender].push(
            Stake(stakeValue, startTime, finishTime, reward)
        );
        emit Staked(msg.sender, stakeValue, startTime, finishTime);
    }

    // Receive staked values and rewards
    function unstake(uint80 stakePosition) external {
        Stake memory userStake = stakes[msg.sender][stakePosition];
        require(userStake.amount > 0, "No active stake");
        require(
            block.timestamp >= userStake.finishTime,
            "Staking period not completed"
        );

        // Calculate the amount to be sent
        uint256 totalAmount = userStake.amount + userStake.reward;

        // Delete user from staking list (zero value in mappings is zero)
        stakes[msg.sender][stakePosition].amount = 0;

        // Send the staked value and reward
        payable(msg.sender).transfer(totalAmount);

        emit Unstaked(msg.sender, userStake.amount, userStake.reward);
    }

    function getAvailableWithdrawals(
        address wallet
    ) external view returns (uint256[] memory) {
        Stake[] memory userStakes = stakes[wallet];
        uint256[] memory availablePositions = new uint256[](userStakes.length);
        uint256 availableCount = 0;

        // Iterar sobre las posiciones y verificar si los stakes ya están disponibles
        for (uint256 i = 0; i < userStakes.length; i++) {
            if (block.timestamp >= userStakes[i].finishTime) {
                availablePositions[availableCount] = i;
                availableCount++;
            }
        }

        return availablePositions;
    }

    // Get the user's staking info
    function getStakingInfo(
        address wallet
    ) external view returns (Stake[] memory) {
        return stakes[wallet];
    }
}

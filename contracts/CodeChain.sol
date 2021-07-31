pragma solidity >=0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CodeChain is ERC20 {
    constructor() ERC20("CodeChain", "XCH") {}

    function mintRewardCodeChain() public {
        _mint(msg.sender, 200);
    }
}
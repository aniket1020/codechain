// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import '@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol';

contract CodeChain is ERC20Mintable, ERC20Detailed {
    constructor() ERC20Detailed("CodeChain", "XCH", 18) public {
      _mint(msg.sender, 10000 * (10 ** 18));
    }
    function faucet (uint amount) external {
      _mint(msg.sender, amount);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "fhevm/lib/TFHE.sol";

/*
  Nicrypt Sovereign Layer - Encrypted Settlement (Inco)
  Logic: Uses Fully Homomorphic Encryption to manage balances that are never revealed on-chain.
*/

contract NicryptVault {
    // Encrypted balances: User Address -> Encrypted Value (euint32)
    mapping(address => euint32) private balances;

    // Events
    event Deposit(address indexed user, uint32 amount); // Amounts here are public for deposits (on-ramp)
    event EncryptedTransfer(address indexed from, address indexed to);

    // 1. Deposit (Public -> Private)
    // In a real flow, this might take a proof to mint private tokens.
    function deposit(bytes calldata encryptedAmount, bytes calldata inputProof) public {
        euint32 amount = TFHE.asEuint32(encryptedAmount, inputProof);
        euint32 currentBalance = balances[msg.sender];
        
        // Homomorphic Addition: Encrypted(A) + Encrypted(B) = Encrypted(A + B)
        balances[msg.sender] = TFHE.add(currentBalance, amount);
        
        // Emit logic omitted for privacy
    }

    // 2. Transfer (Private -> Private)
    // Moves encrypted value from Sender to Receiver without decrypting it.
    function transfer(address to, bytes calldata encryptedAmount, bytes calldata inputProof) public {
        euint32 amount = TFHE.asEuint32(encryptedAmount, inputProof);
        euint32 senderBalance = balances[msg.sender];

        // Ensure Sender has enough funds (Encrypted Comparison)
        // TFHE.le (Less or Equal) returns an encrypted boolean (ebool)
        ebool canSend = TFHE.le(amount, senderBalance);
        
        // Conditional Logic using TFHE.select to prevent state leakage
        euint32 amountToSend = TFHE.select(canSend, amount, TFHE.asEuint32(0));
        
        // Update Balances
        balances[msg.sender] = TFHE.sub(senderBalance, amountToSend);
        balances[to] = TFHE.add(balances[to], amountToSend);

        emit EncryptedTransfer(msg.sender, to);
    }

    // 3. View Balance (Decrypts only for the owner)
    // Requires a signature/re-encryption key from the view() caller
    function getBalance(bytes32 publicKey) public view returns (bytes memory) {
        return TFHE.reencrypt(balances[msg.sender], publicKey);
    }
}

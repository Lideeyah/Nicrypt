// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.20;

import "fhevm/lib/TFHE.sol";

/**
 * @title EncryptedStorage
 * @dev A minimal FHE contract for the Inco Rivest Testnet.
 *      Demonstrates: storing an encrypted integer (euint32) on-chain.
 */
contract EncryptedStorage {
    // Mapping from user address to their encrypted balance/data
    mapping(address => euint32) internal encryptedValues;

    event ValueStored(address indexed user, uint256 timestamp);

    /**
     * @notice Stores an encrypted integer.
     * @param encryptedAmount The cipher text (einput) from the client.
     * @param proof The ZK-PoK proving the client knows the plaintext.
     */
    function store(bytes calldata encryptedAmount, bytes calldata proof) public {
        // Convert input bytes to FHE type
        euint32 value = TFHE.asEuint32(encryptedAmount, proof);
        
        // Store it (Replaces old value)
        encryptedValues[msg.sender] = value;
        
        emit ValueStored(msg.sender, block.timestamp);
    }

    /**
     * @notice Retrieves the encrypted value (Re-encryption for view).
     * @param publicKey The client's public key for re-encryption.
     * @param signature The signature authorizing the view.
     * @return The re-encrypted cipher text for the client.
     */
    function retrieve(bytes32 publicKey, bytes memory signature) public view returns (bytes memory) {
        // Access Control (Simplistic for demo - Inco uses EIP-712 usually)
        // For this demo, we assume the caller is authorized via msg.sender context in a real app
        
        euint32 value = encryptedValues[msg.sender];
        
        // Re-encrypt the on-chain value for the user's specific key
        return TFHE.reencrypt(value, publicKey, signature);
    }
}

import hashlib
import json
from datetime import datetime
from typing import Dict, Any, Optional

class Block:
    """Individual block in the blockchain"""
    
    def __init__(
        self,
        index: int,
        timestamp: str,
        data: Dict[str, Any],
        previous_hash: str,
        nonce: int = 0
    ):
        self.index = index
        self.timestamp = timestamp
        self.data = data
        self.previous_hash = previous_hash
        self.nonce = nonce
        self.hash = self.calculate_hash()
    
    def calculate_hash(self) -> str:
        """Calculate SHA-256 hash of block"""
        block_string = json.dumps({
            "index": self.index,
            "timestamp": self.timestamp,
            "data": self.data,
            "previous_hash": self.previous_hash,
            "nonce": self.nonce
        }, sort_keys=True)
        
        return hashlib.sha256(block_string.encode()).hexdigest()
    
    def mine_block(self, difficulty: int) -> None:
        """Mine block with Proof-of-Work"""
        target = "0" * difficulty
        
        while self.hash[:difficulty] != target:
            self.nonce += 1
            self.hash = self.calculate_hash()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert block to dictionary"""
        return {
            "index": self.index,
            "timestamp": self.timestamp,
            "data": self.data,
            "previous_hash": self.previous_hash,
            "nonce": self.nonce,
            "hash": self.hash
        }
    
    @classmethod
    def from_dict(cls, block_dict: Dict[str, Any]) -> 'Block':
        """Create block from dictionary"""
        block = cls(
            index=block_dict["index"],
            timestamp=block_dict["timestamp"],
            data=block_dict["data"],
            previous_hash=block_dict["previous_hash"],
            nonce=block_dict["nonce"]
        )
        block.hash = block_dict["hash"]
        return block
    
    def is_valid(self) -> bool:
        """Verify block hash is correct"""
        return self.hash == self.calculate_hash()
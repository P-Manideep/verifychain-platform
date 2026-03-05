from datetime import datetime
from typing import List, Dict, Any, Optional
from .block import Block
import json

class Blockchain:
    """Main blockchain implementation"""
    
    def __init__(self, difficulty: int = 4):
        self.chain: List[Block] = []
        self.difficulty = difficulty
        self.pending_transactions: List[Dict[str, Any]] = []
        
        # Create genesis block
        self.create_genesis_block()
    
    def create_genesis_block(self) -> None:
        """Create the first block in the chain"""
        genesis_block = Block(
            index=0,
            timestamp=datetime.utcnow().isoformat(),
            data={"message": "Genesis Block"},
            previous_hash="0"
        )
        genesis_block.mine_block(self.difficulty)
        self.chain.append(genesis_block)
    
    def get_latest_block(self) -> Block:
        """Get the last block in the chain"""
        return self.chain[-1]
    
    def add_block(self, data: Dict[str, Any]) -> Block:
        """Add a new block to the chain"""
        new_block = Block(
            index=len(self.chain),
            timestamp=datetime.utcnow().isoformat(),
            data=data,
            previous_hash=self.get_latest_block().hash
        )
        
        # Mine the block
        new_block.mine_block(self.difficulty)
        
        # Add to chain
        self.chain.append(new_block)
        
        return new_block
    
    def is_chain_valid(self) -> bool:
        """Verify the entire blockchain is valid"""
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]
            
            # Check if current block's hash is correct
            if not current_block.is_valid():
                return False
            
            # Check if previous hash matches
            if current_block.previous_hash != previous_block.hash:
                return False
        
        return True
    
    def get_block_by_index(self, index: int) -> Optional[Block]:
        """Get block by index"""
        if 0 <= index < len(self.chain):
            return self.chain[index]
        return None
    
    def get_block_by_hash(self, block_hash: str) -> Optional[Block]:
        """Get block by hash"""
        for block in self.chain:
            if block.hash == block_hash:
                return block
        return None
    
    def get_blocks(self, limit: int = 10, offset: int = 0) -> List[Block]:
        """Get blocks with pagination"""
        start = max(0, len(self.chain) - offset - limit)
        end = len(self.chain) - offset
        return list(reversed(self.chain[start:end]))
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert blockchain to dictionary"""
        return {
            "length": len(self.chain),
            "difficulty": self.difficulty,
            "chain": [block.to_dict() for block in self.chain]
        }
    
    def get_chain_info(self) -> Dict[str, Any]:
        """Get blockchain statistics"""
        return {
            "total_blocks": len(self.chain),
            "difficulty": self.difficulty,
            "latest_block_hash": self.get_latest_block().hash,
            "is_valid": self.is_chain_valid()
        }
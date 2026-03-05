from typing import Dict, Any, List
from ..blockchain.blockchain import Blockchain
from ..blockchain.block import Block

class BlockchainManager:
    """Singleton manager for blockchain instance"""
    
    _instance = None
    _blockchain = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._blockchain = Blockchain(difficulty=4)
        return cls._instance
    
    @property
    def blockchain(self) -> Blockchain:
        return self._blockchain
    
    def add_document(self, document_data: Dict[str, Any]) -> Block:
        """Add document to blockchain"""
        return self._blockchain.add_block(document_data)
    
    def get_info(self) -> Dict[str, Any]:
        """Get blockchain info"""
        return self._blockchain.get_chain_info()
    
    def get_blocks(self, limit: int = 10, offset: int = 0) -> List[Block]:
        """Get blocks with pagination"""
        return self._blockchain.get_blocks(limit, offset)
    
    def validate(self) -> bool:
        """Validate blockchain"""
        return self._blockchain.is_chain_valid()

# Global instance
blockchain_manager = BlockchainManager()
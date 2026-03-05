from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from ..schemas.schemas import BlockResponse, BlockchainInfo
from ..auth import get_current_active_user
from ..models.models import User
from ..core.blockchain_manager import blockchain_manager

router = APIRouter()

@router.get("/info", response_model=BlockchainInfo)
def get_blockchain_info(current_user: User = Depends(get_current_active_user)):
    """Get blockchain information"""
    return blockchain_manager.get_info()

@router.get("/blocks", response_model=List[BlockResponse])
def get_blocks(
    limit: int = 10,
    offset: int = 0,
    current_user: User = Depends(get_current_active_user)
):
    """Get blocks with pagination"""
    blocks = blockchain_manager.get_blocks(limit, offset)
    return [block.to_dict() for block in blocks]

@router.get("/block/{index}", response_model=BlockResponse)
def get_block_by_index(
    index: int,
    current_user: User = Depends(get_current_active_user)
):
    """Get block by index"""
    block = blockchain_manager.blockchain.get_block_by_index(index)
    
    if not block:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Block not found"
        )
    
    return block.to_dict()

@router.get("/validate")
def validate_blockchain(current_user: User = Depends(get_current_active_user)):
    """Validate entire blockchain"""
    is_valid = blockchain_manager.blockchain.is_chain_valid()
    
    return {
        "is_valid": is_valid,
        "message": "Blockchain is valid" if is_valid else "Blockchain is corrupted",
        "total_blocks": len(blockchain_manager.blockchain.chain)
    }
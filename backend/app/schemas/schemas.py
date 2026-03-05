from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Document Schemas
class DocumentUpload(BaseModel):
    filename: str

class DocumentResponse(BaseModel):
    id: int
    filename: str
    file_hash: str
    file_size: int
    block_hash: Optional[str]
    block_index: Optional[int]
    uploaded_at: datetime
    is_verified: bool
    
    class Config:
        from_attributes = True

class DocumentVerify(BaseModel):
    file_hash: str

# Blockchain Schemas
class BlockResponse(BaseModel):
    index: int
    timestamp: str
    data: Dict[str, Any]
    previous_hash: str
    hash: str
    nonce: int

class BlockchainInfo(BaseModel):
    total_blocks: int
    difficulty: int
    latest_block_hash: str
    is_valid: bool
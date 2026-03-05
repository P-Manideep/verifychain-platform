from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    documents = relationship("Document", back_populates="owner")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    file_hash = Column(String, unique=True, index=True, nullable=False)
    file_size = Column(Integer, nullable=False)
    block_hash = Column(String, index=True)
    block_index = Column(Integer)
    user_id = Column(Integer, ForeignKey("users.id"))
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    is_verified = Column(Boolean, default=False)
    
    owner = relationship("User", back_populates="documents")

class BlockchainState(Base):
    __tablename__ = "blockchain_state"
    
    id = Column(Integer, primary_key=True, index=True)
    chain_data = Column(Text, nullable=False)
    last_updated = Column(DateTime, default=datetime.utcnow)
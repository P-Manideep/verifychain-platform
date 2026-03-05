from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import json

from ..database import get_db
from ..models.models import User, Document
from ..schemas.schemas import DocumentResponse, DocumentVerify
from ..auth import get_current_active_user
from ..services.document_service import DocumentService
from ..core.blockchain_manager import blockchain_manager

router = APIRouter()

@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Upload and hash document to blockchain"""
    
    # Read file
    file_content = await file.read()
    file_size = len(file_content)
    
    # Hash file
    from io import BytesIO
    file_hash = DocumentService.hash_file(BytesIO(file_content))
    
    # Check if document already exists
    existing_doc = db.query(Document).filter(Document.file_hash == file_hash).first()
    if existing_doc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document already exists in blockchain"
        )
    
    # Create document record for blockchain
    doc_data = DocumentService.create_document_record(
        filename=file.filename,
        file_hash=file_hash,
        file_size=file_size,
        uploader=current_user.username
    )
    
    # Add to blockchain
    block = blockchain_manager.add_document(doc_data)
    
    # Save to database
    db_document = Document(
        filename=file.filename,
        file_hash=file_hash,
        file_size=file_size,
        block_hash=block.hash,
        block_index=block.index,
        user_id=current_user.id,
        is_verified=True
    )
    
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    
    return db_document

@router.post("/verify")
async def verify_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Verify document against blockchain"""
    
    # Read and hash file
    file_content = await file.read()
    from io import BytesIO
    file_hash = DocumentService.hash_file(BytesIO(file_content))
    
    # Check in database
    document = db.query(Document).filter(Document.file_hash == file_hash).first()
    
    if not document:
        return {
            "verified": False,
            "message": "Document not found in blockchain",
            "file_hash": file_hash
        }
    
    # Verify in blockchain
    block = blockchain_manager.blockchain.get_block_by_hash(document.block_hash)
    
    if not block:
        return {
            "verified": False,
            "message": "Block not found in chain",
            "file_hash": file_hash
        }
    
    # Check if hash matches
    if block.data.get("hash") == file_hash:
        return {
            "verified": True,
            "message": "Document is authentic and verified",
            "file_hash": file_hash,
            "filename": document.filename,
            "uploaded_at": document.uploaded_at.isoformat(),
            "uploader": block.data.get("uploader"),
            "block_index": block.index,
            "block_hash": block.hash
        }
    
    return {
        "verified": False,
        "message": "Document hash mismatch",
        "file_hash": file_hash
    }

@router.get("/my-documents", response_model=List[DocumentResponse])
def get_my_documents(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current user's documents"""
    documents = db.query(Document).filter(Document.user_id == current_user.id).all()
    return documents

@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get document by ID"""
    document = db.query(Document).filter(Document.id == document_id).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    if document.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this document"
        )
    
    return document
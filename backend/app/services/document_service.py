import hashlib
from typing import BinaryIO, Dict, Any
from datetime import datetime

class DocumentService:
    """Handle document hashing and verification"""
    
    @staticmethod
    def hash_file(file: BinaryIO) -> str:
        """Generate SHA-256 hash of file"""
        sha256_hash = hashlib.sha256()
        
        # Read file in chunks for memory efficiency
        for byte_block in iter(lambda: file.read(4096), b""):
            sha256_hash.update(byte_block)
        
        return sha256_hash.hexdigest()
    
    @staticmethod
    def hash_content(content: str) -> str:
        """Generate SHA-256 hash of content"""
        return hashlib.sha256(content.encode()).hexdigest()
    
    @staticmethod
    def create_document_record(
        filename: str,
        file_hash: str,
        file_size: int,
        uploader: str
    ) -> Dict[str, Any]:
        """Create document record for blockchain"""
        return {
            "type": "document",
            "filename": filename,
            "hash": file_hash,
            "size": file_size,
            "uploader": uploader,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    @staticmethod
    def verify_document(file: BinaryIO, blockchain_hash: str) -> bool:
        """Verify document against blockchain hash"""
        current_hash = DocumentService.hash_file(file)
        return current_hash == blockchain_hash
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import engine, Base
from .models.models import User, Document, BlockchainState
from .routes import auth_routes, document_routes, blockchain_routes
from .config import settings

# Create tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    print("🚀 VerifyChain Backend Starting...")
    print(f"📦 Total Blocks: {len(blockchain_manager.blockchain.chain)}")
    
    yield
    
    # Shutdown
    print("👋 VerifyChain Backend Shutting Down...")

# Initialize FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Enterprise Blockchain Document Verification Platform",
    lifespan=lifespan
)

# CORS middleware
# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://verifychain-backend.onrender.com",
        "https://*.vercel.app",
        "https://verifychain-platform-3723u03fk-ms-projects-d438349c.vercel.app"  # ✅ NO /login
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Import blockchain manager
from .core.blockchain_manager import blockchain_manager

# Include routers
app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
app.include_router(document_routes.router, prefix="/documents", tags=["Documents"])
app.include_router(blockchain_routes.router, prefix="/blockchain", tags=["Blockchain"])

@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "VerifyChain API",
        "version": settings.app_version,
        "blockchain_info": blockchain_manager.get_info()
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "blockchain_valid": blockchain_manager.validate(),
        "total_blocks": len(blockchain_manager.blockchain.chain)
    }
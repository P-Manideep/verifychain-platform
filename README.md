**# VerifyChain - Enterprise Blockchain Document Verification Platform**



**> A production-grade blockchain platform for secure document verification with custom Proof-of-Work consensus and SHA-256 hashing.**



**\[!\[Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)**

**\[!\[FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)**

**\[!\[License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)**



**---**



**## 🎯 Overview**



**VerifyChain is a microservices-based blockchain platform that enables secure, immutable document verification. Built from scratch with custom blockchain implementation, it provides cryptographic proof of document authenticity through SHA-256 hashing and Proof-of-Work consensus.**



**### Key Features**



**- ✅ \*\*Custom Blockchain\*\* - Built from scratch with Proof-of-Work consensus**

**- ✅ \*\*Document Verification\*\* - SHA-256 hashing for tamper-proof verification**

**- ✅ \*\*Secure Authentication\*\* - JWT-based user authentication**

**- ✅ \*\*RESTful API\*\* - 15+ endpoints with comprehensive documentation**

**- ✅ \*\*Real-time Mining\*\* - Block mining with adjustable difficulty**

**- ✅ \*\*Blockchain Validation\*\* - Complete chain integrity verification**

**- ✅ \*\*Microservices Ready\*\* - Scalable architecture**



**---**



**## 🛠 Tech Stack**



**### Backend**

**- \*\*FastAPI\*\* - High-performance async web framework**

**- \*\*Python 3.11+\*\* - Core language**

**- \*\*SQLAlchemy\*\* - ORM for database operations**

**- \*\*SQLite/PostgreSQL\*\* - Database (development/production)**

**- \*\*JWT\*\* - Secure authentication**

**- \*\*bcrypt\*\* - Password hashing**

**- \*\*Pydantic\*\* - Data validation**



**### Blockchain**

**- \*\*Custom Implementation\*\* - Built from scratch**

**- \*\*SHA-256\*\* - Cryptographic hashing**

**- \*\*Proof-of-Work\*\* - Mining consensus mechanism**

**- \*\*Block Validation\*\* - Chain integrity verification**



**---**



**## 🚀 Getting Started**



**### Prerequisites**

**- Python 3.11 or higher**

**- pip (Python package manager)**



**### Installation**



**1. \*\*Clone the repository\*\***

**```bash**

**git clone https://github.com/P-Manideep/verifychain-platform.git**

**cd verifychain-platform/backend**

**```**



**2. \*\*Create virtual environment\*\***

**```bash**

**python -m venv venv**

**source venv/bin/activate  # On Windows: venv\\Scripts\\activate**

**```**



**3. \*\*Install dependencies\*\***

**```bash**

**pip install -r requirements.txt**

**```**



**4. \*\*Set up environment variables\*\***

**```bash**

**# Create .env file**

**DATABASE\_URL=sqlite:///./verifychain.db**

**SECRET\_KEY=your-secret-key-min-32-characters-long**

**ALGORITHM=HS256**

**ACCESS\_TOKEN\_EXPIRE\_MINUTES=30**

**```**



**5. \*\*Run the server\*\***

**```bash**

**uvicorn app.main:app --reload**

**```**



**The API will be available at `http://localhost:8000`**



**---**



**## 📚 API Documentation**



**### Interactive Documentation**

**- \*\*Swagger UI\*\*: http://localhost:8000/docs**

**- \*\*ReDoc\*\*: http://localhost:8000/redoc**



**### Key Endpoints**



**#### Authentication**

**```**

**POST   /auth/register        - Register new user**

**POST   /auth/login           - Login and get JWT token**

**GET    /auth/me              - Get current user info**

**```**



**#### Documents**

**```**

**POST   /documents/upload     - Upload and hash document to blockchain**

**POST   /documents/verify     - Verify document authenticity**

**GET    /documents/my-documents - Get user's documents**

**GET    /documents/{id}       - Get document by ID**

**```**



**#### Blockchain**

**```**

**GET    /blockchain/info      - Get blockchain statistics**

**GET    /blockchain/blocks    - Get blocks with pagination**

**GET    /blockchain/block/{index} - Get specific block**

**GET    /blockchain/validate  - Validate entire blockchain**

**```**



**---**



**## 🔬 How It Works**



**### 1. Document Upload**

**```python**

**# User uploads document**

**→ File hashed with SHA-256**

**→ Document record created**

**→ New block mined with Proof-of-Work**

**→ Block added to blockchain**

**→ Hash stored in database**

**```**



**### 2. Document Verification**

**```python**

**# User uploads document for verification**

**→ File hashed with SHA-256**

**→ Hash compared with blockchain records**

**→ If match found: Document verified ✅**

**→ If no match: Document not found ❌**

**```**



**### 3. Blockchain Structure**

**```python**

**Block {**

    **index: int**

    **timestamp: str**

    **data: {**

        **filename: str**

        **hash: str (SHA-256)**

        **uploader: str**

        **...**

    **}**

    **previous\_hash: str**

    **hash: str (SHA-256)**

    **nonce: int (Proof-of-Work)**

**}**

**```**



**---**



**## 🧪 Testing**



**### Quick Test Flow**



**1. \*\*Register User\*\***

**```bash**

**curl -X POST http://localhost:8000/auth/register \\**

  **-H "Content-Type: application/json" \\**

  **-d '{"username":"testuser","email":"test@example.com","password":"test123"}'**

**```**



**2. \*\*Login\*\***

**```bash**

**curl -X POST http://localhost:8000/auth/login \\**

  **-d "username=testuser\&password=test123"**

**```**



**3. \*\*Upload Document\*\***

**```bash**

**curl -X POST http://localhost:8000/documents/upload \\**

  **-H "Authorization: Bearer YOUR\_TOKEN" \\**

  **-F "file=@document.pdf"**

**```**



**4. \*\*Verify Document\*\***

**```bash**

**curl -X POST http://localhost:8000/documents/verify \\**

  **-F "file=@document.pdf"**

**```**



**---**



**## 📊 Project Structure**

**```**

**verifychain-platform/**

**├── backend/**

**│   ├── app/**

**│   │   ├── blockchain/**

**│   │   │   ├── block.py              # Block class**

**│   │   │   └── blockchain.py         # Blockchain logic**

**│   │   ├── core/**

**│   │   │   └── blockchain\_manager.py # Singleton manager**

**│   │   ├── models/**

**│   │   │   └── models.py             # Database models**

**│   │   ├── routes/**

**│   │   │   ├── auth\_routes.py        # Authentication**

**│   │   │   ├── blockchain\_routes.py  # Blockchain endpoints**

**│   │   │   └── document\_routes.py    # Document endpoints**

**│   │   ├── schemas/**

**│   │   │   └── schemas.py            # Pydantic schemas**

**│   │   ├── services/**

**│   │   │   └── document\_service.py   # Document hashing**

**│   │   ├── auth.py                   # JWT authentication**

**│   │   ├── config.py                 # Configuration**

**│   │   ├── database.py               # Database setup**

**│   │   └── main.py                   # FastAPI app**

**│   ├── .env                          # Environment variables**

**│   └── requirements.txt              # Dependencies**

**└── README.md**

**```**



**---**



**## 🔒 Security Features**



**- ✅ \*\*JWT Authentication\*\* - Secure token-based auth**

**- ✅ \*\*Password Hashing\*\* - bcrypt with salt**

**- ✅ \*\*SHA-256 Hashing\*\* - Cryptographic document verification**

**- ✅ \*\*Proof-of-Work\*\* - Tamper-resistant blockchain**

**- ✅ \*\*Input Validation\*\* - Pydantic schema validation**

**- ✅ \*\*CORS Protection\*\* - Configurable CORS middleware**



**---**



**## 🎯 Features**



**### Current Features ✅**

**- Custom blockchain implementation**

**- Document upload and verification**

**- User authentication (JWT)**

**- Block mining (Proof-of-Work)**

**- Blockchain validation**

**- RESTful API with Swagger docs**

**- SQLite/PostgreSQL support**



**### Upcoming Features 🚧**

**- React TypeScript frontend**

**- WebSocket real-time updates**

**- IPFS decentralized storage**

**- Redis caching layer**

**- Docker containerization**

**- Kubernetes deployment**



**---**



**## 📈 Performance**



**- \*\*Block Mining\*\*: ~2-5 seconds (difficulty: 4)**

**- \*\*Document Hashing\*\*: < 100ms**

**- \*\*API Response\*\*: < 50ms (cached)**

**- \*\*Blockchain Validation\*\*: O(n) where n = number of blocks**



**---**



**## 🤝 Contributing**



**Contributions are welcome! Please feel free to submit a Pull Request.**



**---**



**## 📄 License**



**This project is licensed under the MIT License.**



**---**



**## 👨‍💻 Author**



**\*\*Manideep Pothkan\*\***  

**Full-Stack Developer | Blockchain Engineer**



**---**



**## 🙏 Acknowledgments**



**- FastAPI for the amazing framework**

**- Python community for excellent libraries**

**- Blockchain technology pioneers**



**---**



**<div align="center">**

  **<sub>Built with ❤️ by Manideep Pothkan</sub>**

**</div>**


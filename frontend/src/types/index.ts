export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface Document {
  id: number;
  filename: string;
  file_hash: string;
  file_size: number;
  block_hash: string;
  block_index: number;
  uploaded_at: string;
  is_verified: boolean;
}

export interface Block {
  index: number;
  timestamp: string;
  data: any;
  previous_hash: string;
  hash: string;
  nonce: number;
}

export interface BlockchainInfo {
  total_blocks: number;
  difficulty: number;
  latest_block_hash: string;
  is_valid: boolean;
}
```

**Save and close.**

---

## 📂 **FINAL FOLDER STRUCTURE:**
```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/          (Login, Register components)
│   │   ├── dashboard/     (Dashboard components)
│   │   ├── documents/     (Upload, Verify components)
│   │   ├── blockchain/    (Explorer components)
│   │   └── common/        (Shared components)
│   ├── pages/             (Page containers)
│   ├── services/          (API calls)
│   │   └── api.ts ✅
│   ├── contexts/          (React contexts)
│   │   └── AuthContext.tsx ✅
│   ├── types/             (TypeScript types)
│   │   └── index.ts ✅
│   └── utils/             (Helper functions)
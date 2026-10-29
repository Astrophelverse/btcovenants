# BTCovenants — Bitcoin-Native Escrow

Trustless escrow for services and delivery. Built on Bitcoin.

## Stack
- **Frontend**: React + Vite + TypeScript + Tailwind v4
- **Backend**: Python + FastAPI
- **Bitcoin**: bitcoinlib, python-bitcoinlib, coincurve
- **APIs**: Blockstream Esplora, Mempool.space, CoinGecko

## Project Structure
```
btcovenants/
├── frontend/       # React app
└── backend/        # FastAPI server
```

## Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env      # fill in your values
uvicorn src.main:app --reload --port 3001
```

### Frontend
```bash
cd frontend
npm install
npm run dev               # runs on http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register + generate wallet |
| POST | /api/auth/login | Login |
| GET  | /api/auth/check-username/:name | Check availability |
| GET  | /api/wallet/price | Live BTC/USD |
| GET  | /api/wallet/fees | Network fees from mempool.space |
| GET  | /api/wallet/balance/:address | BTC balance via Esplora |
| POST | /api/wallet/estimate-fees | Full fee breakdown |
| POST | /api/tickets/create | Create deal ticket |
| GET  | /api/tickets/:id | Get ticket + messages |
| POST | /api/tickets/:id/join | Join as provider |
| POST | /api/tickets/:id/sign | Sign deal |
| POST | /api/tickets/:id/mark-done | Mark as done |
| POST | /api/tickets/:id/message | Send message |
| POST | /api/escrow/create | Create multisig escrow address |
| GET  | /api/deals/completed | All completed deals |

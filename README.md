# Preqin Full-Stack Interview Task

A tiny two-tier app (FastAPI + React) that shows investors, their total commitments and a per-investor drill-down with optional filtering by Asset Class.

## Stack
| Layer          | Tech | Notes |
|----------------|------|-------|
| Data           | **SQLite** | lightweight file DB, populated from `data.csv` on first run |
| Backend API    | **Python 3.12 + FastAPI** | simple REST, async-ready, auto-docs via OpenAPI |
| Front-End      | **React 18 + TypeScript** | functional components, React-Router, hooks |

## Quick start (≈2 min)

```bash
# 1. clone & move in
git clone https://github.com/mikali19/preqin-task.git && cd preqin-task

# 2. backend --------------------------------------------------
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt          # fastapi, uvicorn, pandas, sqlalchemy etc... (pip freeze used for creation)
python init_db.py                       # one-off: creates data.db from data.csv
uvicorn main:app --reload                # runs on :8000

# 3. frontend -------------------------------------------------
cd ../frontend
npm install
npm start                             # start server on :3000

# Done: open http://localhost:3000

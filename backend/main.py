from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Query
from fastapi import HTTPException
from sqlalchemy import create_engine
import pandas as pd

app = FastAPI()

# CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# load database (on startup)
engine = create_engine("sqlite:///data.db")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Preqin Task API"}

@app.get("/investors")
def get_investors():
    # Get all unique investors with their details
    df = pd.read_sql("""
        SELECT DISTINCT 
            investor_name,
            investor_type,
            investor_country,
            date_added,
            last_updated
        FROM commitments
    """, engine)
    return df.to_dict(orient="records")

@app.get("/investors/{investor_name}/commitments")
def get_commitments(investor_name: str):
    # Get all commitments for an investor with full details
    df = pd.read_sql("""
        SELECT 
            asset_class,
            commitment_amount,
            currency,
            date_added,
            last_updated
        FROM commitments 
        WHERE investor_name = ?
    """, engine, params=(investor_name,))
    
    if df.empty:
        raise HTTPException(status_code=404, detail="Investor or commitments not found.")
    
    return df.to_dict(orient="records")

@app.get("/investors/{investor_name}/details")
def get_investor_details(investor_name: str):
    # Get investor metadata
    df = pd.read_sql("""
        SELECT DISTINCT
            investor_name,
            investor_type,
            investor_country,
            date_added,
            last_updated
        FROM commitments
        WHERE investor_name = ?
        LIMIT 1
    """, engine, params=(investor_name,))
    
    if df.empty:
        raise HTTPException(status_code=404, detail="Investor not found.")
    
    return df.iloc[0].to_dict()

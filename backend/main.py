from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
import pandas as pd

app = FastAPI()

# load database (on startup)
engine = create_engine("sqlite:///data.db")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Preqin Task API"}

@app.get("/investors")
def get_investors():
    # read from database
    df = pd.read_sql("SELECT investor_name, SUM(commitment_amount) as total_commitment FROM commitments GROUP BY investor_name", engine)
    # convert to list of dicts
    return df.to_dict(orient="records")
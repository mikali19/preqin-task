import pandas as pd
from sqlalchemy import create_engine

# read CSV file
df = pd.read_csv("data.csv")

# extract required columns and rename
df = df.rename(columns={
    "Investor Name": "investor_name",
    "Commitment Asset Class": "asset_class",
    "Commitment Amount": "commitment_amount"
})

# keep only required columns
df = df[["investor_name", "asset_class", "commitment_amount"]]

# create database 
engine = create_engine("sqlite:///data.db")
df.to_sql("commitments", con=engine, if_exists="replace", index=False)

print("Database successfully loaded with:", len(df), "records.")

import pandas as pd
from sqlalchemy import create_engine

# read CSV file
df = pd.read_csv("data.csv")

# rename columns to consistent format
df = df.rename(columns={
    "Investor Name": "investor_name",
    "Investory Type": "investor_type", 
    "Investor Country": "investor_country",
    "Investor Date Added": "date_added",
    "Investor Last Updated": "last_updated",
    "Commitment Asset Class": "asset_class",
    "Commitment Amount": "commitment_amount",
    "Commitment Currency": "currency"
})

# convert date columns to datetime
df['date_added'] = pd.to_datetime(df['date_added'])
df['last_updated'] = pd.to_datetime(df['last_updated'])

# create database 
engine = create_engine("sqlite:///data.db")
df.to_sql("commitments", con=engine, if_exists="replace", index=False)

print("Database successfully loaded with:", len(df), "records.")

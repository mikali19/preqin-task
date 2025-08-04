from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from main import app

# Connect to the same database as in main.py
engine = create_engine("sqlite:///data.db", connect_args={"check_same_thread": False})

# Create the table if it doesn't exist, and insert test data if it's empty
with engine.begin() as conn:
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS commitments (
            investor_name TEXT,
            investor_type TEXT,
            investor_country TEXT,
            asset_class TEXT,
            commitment_amount REAL,
            currency TEXT,
            date_added TEXT,
            last_updated TEXT
        )
    """))
    result = conn.execute(text("SELECT COUNT(*) FROM commitments"))
    if result.scalar() == 0:
        conn.execute(text("""
            INSERT INTO commitments VALUES (
                'Ioo Gryffindor fund', 'Pension Fund', 'UK',
                'Infrastructure', 1000000, 'USD',
                '2023-01-01', '2024-01-01'
            )
        """))

# Starting FastAPI test client
client = TestClient(app)

# Test functions
def test_get_investors():
    response = client.get("/investors")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert "investor_name" in data[0]

def test_get_commitments_valid():
    response = client.get("/investors/Ioo Gryffindor fund/commitments")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert "asset_class" in data[0]

def test_get_commitments_filtered():
    response = client.get("/investors/Ioo Gryffindor fund/commitments?asset_class=Infrastructure")
    assert response.status_code == 200
    data = response.json()
    assert all(item["asset_class"] == "Infrastructure" for item in data)

def test_get_commitments_invalid_investor():
    response = client.get("/investors/Nonexistent Investor/commitments")
    assert response.status_code == 404

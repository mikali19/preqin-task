from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_investors():
    response = client.get("/investors")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert "investor_name" in response.json()[0]

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

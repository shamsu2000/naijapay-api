from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import joblib
import pandas as pd
import asyncio
import random
import uuid

# Import our new database setup
from database import SessionLocal, TransactionLog

app = FastAPI(title="Financial Inclusion API")

print("Loading AI Fraud Detection Model...")
ai_model = joblib.load('fraud_model.joblib')

class Transaction(BaseModel):
    sender_id: str
    receiver_id: str
    amount: float
    channel: str  
    hour: int      
    velocity: int  

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def simulate_paystack_flutterwave(amount: float, receiver: str):
    await asyncio.sleep(1.5) 
    outcome = random.random()
    if outcome < 0.8:
        return {"status": True, "message": "Transfer successful", "data": {"gateway_reference": f"TXL-{uuid.uuid4().hex[:8].upper()}"}}
    elif outcome < 0.95:
        return {"status": False, "message": "Gateway Error: Insufficient Funds"}
    else:
        return {"status": False, "message": "Gateway Error: Destination Bank Timeout"}

@app.post("/transfer/")
async def process_transfer(transaction: Transaction, db: Session = Depends(get_db)):
    
    # Prepare the log entry
    log_entry = TransactionLog(
        sender_id=transaction.sender_id,
        receiver_id=transaction.receiver_id,
        amount=transaction.amount,
        channel=transaction.channel,
        is_fraud_flagged=False,
        gateway_success=False
    )
    
    # 1. AI FRAUD CHECK
    input_data = pd.DataFrame([{'amount': transaction.amount, 'hour': transaction.hour, 'velocity': transaction.velocity}])
    prediction = ai_model.predict(input_data)[0]
    
    if prediction == -1:
        log_entry.is_fraud_flagged = True
        log_entry.error_message = "Blocked by AI"
        db.add(log_entry)
        db.commit() # Save the blocked attempt to the database
        raise HTTPException(status_code=400, detail="Transaction blocked: Suspicious activity detected by AI.")

    # 2. PAYMENT GATEWAY INTEGRATION
    gateway_response = await simulate_paystack_flutterwave(transaction.amount, transaction.receiver_id)
    
    if not gateway_response["status"]:
        log_entry.error_message = gateway_response["message"]
        db.add(log_entry)
        db.commit() # Save the failed gateway attempt to the database
        raise HTTPException(status_code=502, detail=gateway_response["message"])

    # 3. SUCCESSFUL COMPLETION
    log_entry.gateway_success = True
    log_entry.gateway_receipt = gateway_response["data"]["gateway_reference"]
    db.add(log_entry)
    db.commit() # Save the successful transaction!
    
    return {
        "status": "Success",
        "message": f"₦{transaction.amount} transferred to {transaction.receiver_id}",
        "gateway_receipt": log_entry.gateway_receipt
    }

# 4. NEW ENDPOINT: View your data!
@app.get("/logs/")
def get_transaction_logs(db: Session = Depends(get_db)):
    logs = db.query(TransactionLog).order_by(TransactionLog.timestamp.desc()).limit(10).all()
    return logs
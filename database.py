from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base
import datetime

# Create a local SQLite database file named 'transactions.db'
SQLALCHEMY_DATABASE_URL = "sqlite:///./transactions.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Define the schema for our table
class TransactionLog(Base):
    __tablename__ = "transaction_logs"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(String, index=True)
    receiver_id = Column(String)
    amount = Column(Float)
    channel = Column(String)
    
    # We want to log the AI's decision and the gateway's final status for future analysis
    is_fraud_flagged = Column(Boolean)
    gateway_success = Column(Boolean)
    error_message = Column(String, nullable=True)
    gateway_receipt = Column(String, nullable=True)
    
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

# Create the table in the database
Base.metadata.create_all(bind=engine)
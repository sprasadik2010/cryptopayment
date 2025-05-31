from database import Base
from sqlalchemy import Column, Integer, String, Boolean, DateTime, func, Numeric, BigInteger, Date

class Member(Base):
    __tablename__ = 'member'

    id = Column(Integer, primary_key=True, autoincrement=True)
    membername = Column(String, nullable=True)
    email = Column(String, nullable=False, unique=True)
    username = Column(String, nullable=True)
    password = Column(String, nullable=False)
    parentid = Column(Integer, nullable=True)
    side = Column(String(1), nullable=False) 
    is_verified = Column(Boolean, default=False)
    verification_token = Column(String, nullable=True)
    is_active = Column(Boolean, default=False)
    createdby = Column(Integer, nullable=True)
    createdon = Column(DateTime(timezone=True), server_default=func.now())    
    parentname = Column(String, nullable=True)    
    createdbyname = Column(String, nullable=True)   
    role = Column(String, nullable=False, server_default='user')  
    activationhistory = Column(String, nullable=True)    
    paid = Column(Boolean, default=False)
    paidamount = Column(Numeric(19, 4), nullable=False)
    paymentdate = Column(DateTime(timezone=True), server_default=func.now())   
    paymentproof = Column(String, nullable=True)
    phone = Column(String, nullable=True)

class ProfitClub(Base):
    __tablename__ = 'profitclub'

    id = Column(Integer, primary_key=True, autoincrement=True)
    releasedate = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    amount = Column(Numeric(19, 4), nullable=False)
    
class Withdrawals(Base):
    __tablename__ = 'withdrawals'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    userid = Column(BigInteger, nullable=False)
    date = Column(Date, nullable=False, server_default=func.now())
    amount = Column(Numeric(10, 2), nullable=False)
    is_approved = Column(Boolean, nullable=False, server_default="false")
    approvaldate = Column(Date, nullable=True)
    


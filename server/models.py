from database import Base
from sqlalchemy import Column, Integer, String, Boolean, DateTime, func

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

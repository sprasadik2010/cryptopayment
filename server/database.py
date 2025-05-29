from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# DATABASE_LOCAL_URL = "postgresql://postgres:1q2w3e4r@localhost:5432/crypto"
DATABASE_REMOTE_URL = "postgresql://xfx2025:OAg0tocVgxBkg98JDWA4EUp60M4D48r4@dpg-d0j2pladbo4c73bvhjhg-a.oregon-postgres.render.com/crypto_l5ku"

# engine = create_engine(DATABASE_LOCAL_URL)
engine = create_engine(DATABASE_REMOTE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

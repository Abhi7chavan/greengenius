from sqlalchemy.ext.declarative import declarative_base
import base64

from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine ,MetaData
from configobj import ConfigObj
import os 
def decode_password(encoded_password):
    return base64.b64decode(encoded_password).decode()
current_directory = os.path.dirname(os.path.abspath(__file__))
config_file_path = os.path.join(current_directory,'config.ini')
config= ConfigObj(config_file_path)
username = config['database']['username']
databasename = config['database']['databasename']
decoded_password = decode_password(config['database']['password'])
ipaddress = config['database']['ip']
schema_name = config['database']['schema']
DATABASE_URL = f"postgresql+psycopg2://{username}:{decoded_password}@{ipaddress}/{databasename}"

engine = create_engine(DATABASE_URL)
metadata = MetaData(bind=engine)
engine.execute(f"CREATE SCHEMA IF NOT EXISTS {schema_name}")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

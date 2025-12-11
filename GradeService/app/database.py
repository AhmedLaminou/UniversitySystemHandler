from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/grade_db")

client = AsyncIOMotorClient(MONGO_URI)
database = client.get_database()
grades_collection = database.get_collection("grades")

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt, JWTError
import logging

logging.basicConfig(
    filename="app.log",
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Taskio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

fake_db: dict[str, str] = {}

class UserCredentials(BaseModel):
    username: str
    password: str

def create_token(username: str) -> str:
    return jwt.encode({"sub": username}, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(authorization: str = Header(...)) -> str:
    try:
        token = authorization.split("Bearer ")[-1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["sub"]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/register")
def register(user: UserCredentials):
    logger.info(f"Register attempt: {user.username}")
    if user.username in fake_db:
        raise HTTPException(status_code=400, detail="User already exists")
    fake_db[user.username] = pwd_context.hash(user.password)
    logger.info(f"Registered: {user.username}")
    return {"message": "User created successfully"}

@app.post("/login")
def login(user: UserCredentials):
    logger.info(f"Login attempt: {user.username}")
    hashed = fake_db.get(user.username)
    if not hashed or not pwd_context.verify(user.password, hashed):
        logger.warning(f"Failed login: {user.username}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token(user.username)
    logger.info(f"Login success: {user.username}")
    return {"token": token}

@app.get("/protected")
def protected(username: str = Depends(verify_token)):
    logger.info(f"Protected accessed by: {username}")
    return {"message": f"Welcome to Taskio, {username}!"}
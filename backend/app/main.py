from fastapi import FastAPI
from app import models
from app.db import engine
from app.routes import user_routes , event_routes , swap_routes
from fastapi.middleware.cors import CORSMiddleware
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SlotSwapper API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(user_routes.router)
app.include_router(event_routes.router)
app.include_router(swap_routes.router)
@app.get("/")
def root():
    return {"message": "SlotSwapper Backend is running 🚀"}

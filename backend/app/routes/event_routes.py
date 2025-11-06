from fastapi import APIRouter , Depends, HTTPException, status , Query
from app import schemas, models
from app.dependencies import get_db, get_current_user
from sqlalchemy.orm import session
router = APIRouter(prefix="/events", tags=["Events"])


@router.post(
    "/",
    response_model=schemas.event_schema.EventResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_event(
    event: schemas.EventCreate,
    db: session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    new_event = models.event_model.Event(**event.dict(), user_id=current_user.id)
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event


@router.get("/", response_model=list[schemas.event_schema.EventResponse])
def get_my_events(db: session = Depends(get_db), current_user = Depends(get_current_user)):
    my_events = db.query(models.event_model.Event).filter(models.event_model.Event.user_id == current_user.id).all()
    return my_events


@router.get(
    "/{event_id}",
    response_model=schemas.event_schema.EventResponse,
    status_code=status.HTTP_200_OK,
)
def get_event_by_id(event_id: int, db: session = Depends(get_db)):
    event = (
        db.query(models.event_model.Event)
        .filter(models.event_model.Event.id == event_id)
        .first()
    )
    return event


@router.put(
    "/{event_id}",
    response_model=schemas.event_schema.EventResponse,
    status_code=status.HTTP_201_CREATED,
)
def update_event(
    event_id: int, Event: schemas.EventCreate, db: session = Depends(get_db)
):
    event = (
        db.query(models.event_model.Event)
        .filter(models.event_model.Event.id == event_id)
        .first()
    )
    event.title = Event.title
    event.start_time = Event.start_time
    event.end_time = Event.end_time
    event.status = Event.status
    db.commit()
    db.refresh(event)
    return event


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: int, db: session = Depends(get_db)):
    event = (
        db.query(models.event_model.Event)
        .filter(models.event_model.Event.id == event_id)
        .first()
    )
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(event)
    db.commit()
    return None

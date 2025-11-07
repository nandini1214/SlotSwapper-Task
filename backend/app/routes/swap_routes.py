from fastapi import APIRouter, Depends, HTTPException, status , Query
from sqlalchemy.orm import Session , joinedload
from app import models, schemas
from app.dependencies import get_db, get_current_user
from app.models.event_model import EventStatus
from app.models.swap_model import SwapStatus

router = APIRouter(prefix="/api", tags=["Swaps"])

# 1️⃣ Get all swappable slots (except current user's)
@router.get("/swappable-slots", response_model=list[schemas.event_schema.EventResponse])
def get_swappable_slots(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    slots = db.query(models.Event).options(joinedload(models.Event.user)).filter(
        models.Event.status == EventStatus.SWAPPABLE,
        models.Event.user_id != current_user.id
    ).all()
    if len(slots) <= 0:
        raise HTTPException(status_code=200, detail="No slots available for you")
    return slots


# 2️⃣ Create a swap request
@router.post("/swap-request", status_code=status.HTTP_201_CREATED)
def create_swap_request(request: schemas.swap_schema.SwapCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    my_slot = db.query(models.Event).filter(models.Event.id == request.my_slot_id, models.Event.user_id == current_user.id).first()
    their_slot = db.query(models.Event).filter(models.Event.id == request.their_slot_id).first()

    if not my_slot or not their_slot:
        raise HTTPException(status_code=404, detail="One or both slots not found")
    if my_slot.status != EventStatus.SWAPPABLE or their_slot.status != EventStatus.SWAPPABLE:
        raise HTTPException(status_code=400, detail="Both slots must be swappable")

    new_request = models.SwapRequest(
        requester_id=current_user.id,
        receiver_id=their_slot.user_id,
        my_slot_id=my_slot.id,
        their_slot_id=their_slot.id
    )

    my_slot.status = EventStatus.SWAP_PENDING
    their_slot.status = EventStatus.SWAP_PENDING

    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request


@router.get("/swap-requests", response_model=list[schemas.swap_schema.SwapShow])
def get_all_requests(
    type: str = Query("incoming", regex="^(incoming|outgoing)$"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Get swap requests for the current user.
    type=incoming -> requests where user is receiver
    type=outgoing -> requests where user is requester
    """
    if type == "incoming":
        requests = db.query(models.SwapRequest).filter(models.SwapRequest.receiver_id == current_user.id).all()
    else: 
        requests = db.query(models.SwapRequest).filter(models.SwapRequest.requester_id == current_user.id).all()
    
    return requests



# 3️⃣ Respond to a swap request (accept/reject)
@router.post("/swap-response/{request_id}")
def respond_swap_request(request_id: int, response: schemas.swap_schema.SwapResponse, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    swap_req = db.query(models.SwapRequest).filter(models.SwapRequest.id == request_id).first()

    if not swap_req:
        raise HTTPException(status_code=404, detail="Swap request not found")
    if swap_req.receiver_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized to respond to this request")
    if swap_req.status != SwapStatus.PENDING:
        raise HTTPException(status_code=400, detail="This request has already been handled")

    my_slot = db.query(models.Event).filter(models.Event.id == swap_req.my_slot_id).first()
    their_slot = db.query(models.Event).filter(models.Event.id == swap_req.their_slot_id).first()

    if response.accept:
        # Swap ownership
        my_slot.user_id, their_slot.user_id = their_slot.user_id, my_slot.user_id
        my_slot.status = EventStatus.BUSY
        their_slot.status = EventStatus.BUSY
        swap_req.status = SwapStatus.ACCEPTED
    else:
        # Revert to swappable
        my_slot.status = EventStatus.SWAPPABLE
        their_slot.status = EventStatus.SWAPPABLE
        swap_req.status = SwapStatus.REJECTED

    db.commit()
    db.refresh(swap_req)
    return {"status": swap_req.status}

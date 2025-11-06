# SlotSwapper

## Overview

**SlotSwapper** is a peer-to-peer time-slot scheduling application that allows users to exchange busy calendar slots with other users. Users can mark their events as **swappable**, view other users’ available slots, and request swaps. The swap logic ensures transactional integrity: accepted swaps automatically update both users’ calendars, while rejected swaps revert the slots back to swappable status.

**Design Choices:**

* **Frontend:** React + TypeScript + TailwindCSS for type safety and responsive UI.
* **State Management:** Redux Toolkit ensures dynamic updates across the dashboard, notifications, and marketplace views.
* **Backend:** FastAPI with SQLite handles the swap logic and JWT-based authentication.
* **Tabs for Requests:** Separate **Received** and **Sent** requests in the notifications view for clarity.

---

## Features

### **User Authentication**

* Sign Up and Log In using email and password.
* JWT tokens used for authenticated API requests.

### **Calendar & Events**

* Create, read, update, and delete events.
* Events have:

  * `title`
  * `startTime` and `endTime`
  * `status` (`BUSY`, `SWAPPABLE`, `SWAP_PENDING`)
  * `owner` (user ID)

### **Swap Logic**

* `GET /api/swappable-slots`: Returns all swappable slots from **other users**.
* `POST /api/swap-request`: Request a swap between one of your swappable slots and another user’s swappable slot.
* `POST /api/swap-response/{requestId}`: Accept or reject an incoming swap request. Status updates and calendar updates happen automatically.

### **Frontend Views**

* **Dashboard:** View your events and mark them as swappable.
* **Marketplace:** Browse swappable slots from other users and request swaps.
* **Notifications/Requests:** View incoming and outgoing requests with accept/reject functionality.

---

## Technology Stack

| Layer      | Technology                       |
| ---------- | -------------------------------- |
| Frontend   | React + TypeScript + TailwindCSS |
| Backend    | FastAPI + Python                 |
| Database   | SQLite                           |
| State Mgmt | Redux Toolkit                    |

---

## Getting Started

### Prerequisites

* Node.js 18+
* npm or yarn
* Python 3.10+

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev        
```

* Default URL: `http://localhost:5173` (Vite dev server)

---

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Linux/macOS
venv\Scripts\activate         # Windows
pip install -r requirements.txt
```

1. Create a `.env` file with:

```
DATABASE_URL=sqlite:///./slotswapper.db
SECRET_KEY=your_jwt_secret
```

> The SQLite database file (`slotswapper.db`) will be created automatically in the backend directory.

2. Run database migrations:

```bash
alembic upgrade head
```

3. Start FastAPI server:

```bash
uvicorn main:app --reload
```

* API docs available at `http://localhost:8000/docs`

---

## API Endpoints

| Endpoint                         | Method | Description                            | Parameters                           |
| -------------------------------- | ------ | -------------------------------------- | ------------------------------------ |
| `/api/swappable-slots`           | GET    | Fetch swappable slots from other users | None                                 |
| `/api/swap-request`              | POST   | Request a swap                         | `my_slot_id`, `their_slot_id`        |
| `/api/swap-requests`             | GET    | Fetch incoming or outgoing requests    | `type`: `"incoming"` or `"outgoing"` |
| `/api/swap-response/{requestId}` | POST   | Accept or reject swap                  | `accept`: true/false                 |
| `/auth/register`                 | POST   | Register a new user                    | `name`, `email`, `password`          |
| `/auth/login`                    | POST   | Log in a user                          | `email`, `password`                  |

> Optional: Use a Postman collection for easier testing.

---

## Assumptions & Challenges

**Assumptions:**

* A user cannot swap a slot that is not marked as `SWAPPABLE`.
* Swap actions are transactional: both slot ownerships must be exchanged on accept.

**Challenges:**

* Maintaining dynamic state across multiple components (calendar, notifications, marketplace).
* Handling edge cases where multiple users may request the same swappable slot simultaneously.
* Ensuring proper JWT authentication for all protected endpoints.




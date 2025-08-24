# Pixella AI Backend – API Documentation

Pixella AI Backend is a TypeScript, Express, and Prisma-based server offering secure chat, message, and user management APIs.  
**Base URL:** `/api/v1`

---

## Authentication

### Register  
**POST** `/auth/register`  
Register a new user.

**Request Body:**
```
{
"username": "string", // 3-30 chars, only [a-zA-Z0-9_]
"email": "string", // valid email
"password": "string" // min 8 chars
}
```
**Responses:**
- `201 Created` — Success
- `400 Bad Request` — Invalid or missing fields
- `409 Conflict` — User exists

---

### Login  
**POST** `/auth/login`  
Login with email or username.

**Request Body:**
```
{
"identifier": "string", // email or username
"password": "string"
}
```
**Responses:**
- `200 OK` — Returns `{ userId, username, email, token }`
- `400/404/500` — For errors

---

### Token  
All protected routes require  
`Authorization: Bearer <token>`

---

## Users

### Get All Users  
**GET** `/user/getAllUsers`  
- Requires Auth
- Returns: Array of user objects (for development/testing)

---

### Get Current User  
**GET** `/user`
- Requires Auth
- Returns: Current user's info

---

### Get User by ID  
**GET** `/user/:user_id`
- Params: `user_id` (string)
- Requires Auth
- Returns: User object or 404

---

### Update User  
**PATCH** `/user/:user_id`
- Params: `user_id`
- Body: Partial user object (only updatable fields)
- Requires Auth; must be account owner

---

### Delete User  
**DELETE** `/user/:user_id`
- Params: `user_id`
- Requires Auth; only account owner
- Returns deleted user or 404

---

## Chats

### Start New Chat  
**POST** `/chat`
- Requires Auth  
- Body: `{ title?: "string" }` *(optional)*
- Returns created chat object

---

### Get Chat History  
**GET** `/chat/:chat_id/:limit?`
- Params: `chat_id` (required), `limit` (optional, default: all)
- Requires Auth
- Returns: Array of messages in chat (up to `limit` most recent if specified)

---

### Rename Chat  
**PATCH** `/chat/:chat_id`
- Params: `chat_id`
- Body: `{ title: "string" }`
- Requires Auth

---

### Delete Chat  
**DELETE** `/chat/:chat_id`
- Requires Auth
- Returns: 204 No Content or 404

---

## Messages

### Start New Chat & AI Response  
**POST** `/message`
- Requires Auth
- Body: 
```
{
"text": "string" // required
}
```
- Returns: `{ chat, messages: [userMsg, aiMsg] }`

---

### Send Message in Existing Chat  
**POST** `/message/:chat_id`
- Params: chat_id
- Body: `{ text: "string" }`
- Returns: `{ messages: [userMsg, aiMsg] }`

---

### Regenerate Previous AI Response  
**POST** `/message/regenerate/:message_id`
- Params: message_id
- Returns: New AI response

---

### Change User Message & Regenerate  
**PATCH** `/message/change-prompt/:message_id`
- Params: message_id
- Body:  
```
{
    "newText": "string" 
}
```
- Returns: Regenerated AI response

---

### Delete Message  
**DELETE** `/message/delete-message/:message_id`
- Params: message_id

---

## Status & Error Codes

| Code | Meaning                        |
|------|--------------------------------|
| 200  | Success                        |
| 201  | Created                        |
| 204  | No Content                     |
| 400  | Bad Request (input/validation) |
| 401  | Unauthorized                   |
| 403  | Forbidden (ownership)          |
| 404  | Not Found                      |
| 409  | Conflict (duplicate)           |
| 500  | Internal Server Error          |

---

## Sample Auth Flow

1. **Register**  
 POST `/auth/register` → Success `201`
2. **Login**  
 POST `/auth/login` → Receive JWT token
3. **Authenticated Requests**  
 Add `Authorization: Bearer <token>` header to every protected request

---

## Notes

- All routes requiring authentication will reject requests without or with an invalid token.
- Most routes validate route ID params (must be valid UUID or object id).
- Input validation errors return 400 with reason.
- All date/times in ISO 8601.
- On error:  
```
{
    "error": "Message here" 
}
```
- See controller code for additional business logic and security checks.

---

**Pixella AI Backend** is suited for rapid chat-centric web applications, providing secure and modular REST endpoints.  
_Read the repo for full implementation, models, and customization!_

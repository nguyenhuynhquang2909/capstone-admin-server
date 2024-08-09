## Auth API Specification

### Overview

The `/auth` API provides endpoints for user authentication and profile retrieval. It includes login with OTP, verification of OTP, and retrieval of user profile information.

---

### Endpoints

#### 1. **Login**

- **URL:** `/auth/login`
- **Method:** `POST`
- **Description:** Initiates the login process by generating an OTP for a user based on their phone number.
- **Request Body:**

    ```json
    {
      "phone": "string"
    }
    ```

- **Response:**

    **Success (200 OK):**

    ```json
    {
      "message": "Login successful",
      "otp": "string"
    }
    ```

    **Error (404 Not Found):**

    ```json
    {
      "statusCode": 404,
      "message": "User not found"
    }
    ```

#### 2. **Verify**

- **URL:** `/auth/verify`
- **Method:** `POST`
- **Description:** Verifies the OTP and generates a JWT token upon successful verification.
- **Request Body:**

    ```json
    {
      "phone": "string",
      "otp": "string"
    }
    ```

- **Response:**

    **Success (200 OK):**

    ```json
    {
      "message": "Verification successful"
    }
    ```

    **Error (400 Bad Request):**

    ```json
    {
      "statusCode": 400,
      "message": "OTP expired or invalid"
    }
    ```

    **Error (404 Not Found):**

    ```json
    {
      "statusCode": 404,
      "message": "User not found"
    }
    ```

#### 3. **Get Profile**

- **URL:** `/auth/profile`
- **Method:** `GET`
- **Description:** Retrieves the profile information of the authenticated user.
- **Headers:**

    ```plaintext
    Authorization: Bearer <JWT Token>
    ```

- **Response:**

    **Success (200 OK):**

    ```json
    {
      "id": 3,
      "name": "Khang Nguyen",
      "phone": "0903999938",
      "email": null,
      "password": null,
      "role_id": 1,
      "created_at": "2024-07-21T04:55:48.045Z",
      "updated_at": "2024-07-21T04:55:48.045Z",
      "students": [
        {
          "id": 3,
          "name": "Student 3",
          "school_id": 1,
          "parent_id": 3,
          "created_at": "2024-07-21T04:55:48.047Z",
          "updated_at": "2024-07-21T04:55:48.047Z"
        }
      ]
    }
    ```

    **Error (401 Unauthorized):**

    ```json
    {
      "statusCode": 401,
      "message": "Authorization header is missing or invalid"
    }
    ```

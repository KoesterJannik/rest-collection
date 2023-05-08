# Rest Collection
This is a collection of various languages and frameworks with the implementation of a REST API with JSON Web Token (JWT) authentication.
Things each implemenations includes:
- Register and Login /api/auth/register /api/auth/login
- Verification route of the jwt token /api/auth/verify
- Refresh token route /api/auth/refresh
- protected endpoint to get user details /api/auth/me
- environment variables for configuration
- dockerfile for containerization
- logger for logging
- postgres as database(no orm because someone has to learn the specific orm first)


# Frontend Collection
This is a collection of various languages and frameworks with the implementation of a frontend application that consumes the REST API.
Things each implemenations includes:
- Register and Login
- protected endpoint to get user details
- environment variables for configuration
- dockerfile for containerization
- E2E tests with playwright
- Example Unit test with Vitest
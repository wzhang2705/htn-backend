# Hack the North 2021 Backend Challenge: REST Express Server with SQLite

This is a REST Express app on Node that connects to a SQL Database.

## Install Dependencies
```bash
    npm install
```
## Set Up Application / Server
To initialize the database correctly, you will need to run two scripts (The first creates the database and tables, the second inserts the json data into the tables):

```bash
    node initializedb.js
    node initializedata.js
```
## Run server
Next, to start the server
```bash
    npm start
```
The current directory is mounted as a volume under `/src/app` so
that you do not have to rebuild the image every time (along with `node_modules`).

Building and running the image will start the Express server on port
5000.

## Available REST API Endpoints
---
### ***All Users Endpoint***
---
```
GET localhost:5000/users/
```
Response will return a list of json objects with the each user's data.

### ***User Information By Id Endpoint***
---
In order to uniquely identify each user, each user is given a specific hackerid, UUID to uniquely identify a user and their data. When querying a specific user, to ensure that the identification is unique, we use the hackerid of the user.

```
GET localhost:5000/users/id
```

**where id is the hackerid (UUID) in the hackerdata table of the database.**

```
ex: GET localhost:5000/users/80f7d038-93f2-4e07-938c-d73785a1817f
```

In many cases, this may be enough to call on the users. However, depending on the use case, it may be unreasonable to expect a frontend interface to have access to specific hackerids. In this case, I have added another endpoint to get user information by name, which returns all user data, including a user's hackerid. The returned hackerid can then be used for any subsequent calls on the user, such as updating their user information.

```
GET localhost:5000/users/byname/name
```
**where name is the name of the hacker in the database.**
```
ex: GET localhost:5000/users/byname/Dora%20Schultz
```

This way, unique identifiers are maintained for each users, and we can still lookup users by name if necessary, to get specific user hackerids. By using hackerids, we ensure that the user we are getting from the database is unique.

Also, this lookup can be easily extended to search for users by other information, such as their email, phone, company, picture, etc.

### ***Update User Information By Id***
---

```
PUT localhost:5000/users/id
```
**where id is the hackerid (UUID) in the hackerdata table of the database.**

with a request body of form similar to:

```
{
    "phone": "+1 (555) 123 4567"
    "skills": [{ "name": "Java", "rating": "3"}]
}
```
should update the database with the needed columns. Note, not all columns have to be specified in the request body, just the ones you need updated. In this case, if the skill is not present, it should add the skill. Otherwise, update the rating.

**Note**: there is a small bug with this API in that the response it returns may not be updated data for the skills, even though the database is updated correctly (likely with an async issue in the query). To better test this API, you can run the "User Information By Id Endpoint" after running this API to check that the user information has been updated, or just run the same API again and it should query the right updated data.

### ***Skills Frequency***
---
```
GET localhost:5000/skills/?min_frequency=min&max_frequency=max
```
**where min and max are replaced by the minimum and maximum frequency amounts needed from the database.**

```
ex: localhost:5000/skills/?min_frequency=180&max_frequency=190
```
This API returns the list of skills in the database with the number of users that have that skill for all skills that have a number of users between the minimum and maximum frequency (inclusive).




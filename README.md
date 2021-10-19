<p align="center">
  <a href="http://bluelink.co.za:3000/apidoc/" target="blank"><img src="https://miro.medium.com/max/1400/0*jwIPb4cdMgMSVIKt" width="320" alt="Nest Logo" /></a>
</p>

## Description

[Dinopark](http://bluelink.co.za:3000/apidoc) Dino Park.

Our team divides the park into a 26 by 16 grid of zones. The letters A-Z represent the
columns and the numbers 0-15 represent the rows. For example, A13 is the first column and
the 14 th row.

* Each zone in the grid needs maintenance every 30 days.

* Maintenance staff can only perform maintenance in a zone when it is safe to do so

> * Safe means: No carnivores are in a zone or all carnivores in the zone are still
digesting their last meal (all dinosaurs in the park have an estimated digestion time
which is logged when the animal is first moved into the park)


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# Intergration tests
$ npm run test
```
## Database Setup
Create a postgress database and allow connection to your defined user on the .env file.

### Tables
You do not need to add tables, Typeorm will create necessary tables when applications start and will persist once created.

.env defaults (You can change this to match your db and server)
```
ZONE_MAINTANACE_INTERVAL=30
DB_USER=root
DB_PASS=root
DB_NAME=dinopark
DB_HOST="0.0.0.0"
```

#### Database setup

The application used Postgres

You need to create two databases. Live and Testing database. The live database can be a name of choice.

##### Posgres create new databases
```
create database dinopark;
create database dinopark_test;
```
The connection details can be managed on the .env file

## API References 

<details>
  <summary>Create new dino</summary>
  
##### Request

```
curl -X 'POST' \
  'http://0.0.0.0:3000/api/dinos' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '
  {
    "name": "McGroggity Test 1",
    "species": "Tyrannosaurus Test 1",
    "gender": "male",
    "digestion_period_in_hours": 2,
    "herbivore": false,
    "location": "A3",
    "park_id": 1
  }'
```

#### Response body
```
{
  "id": 1,
  "name": "McGroggity Test 1",
  "species": "Tyrannosaurus Test 1",
  "gender": "male",
  "digestion_period_in_hours": 2,
  "herbivore": false,
  "location": "A3",
  "park_id": 1,
  "kind": "dino_added"
}
```
</details>

<details>
  <summary>Get all dinos</summary>

#### Request
```
curl -X 'GET' \
  'http://0.0.0.0:3000/api/dinos' \
  -H 'accept: application/json'
```

#### Response
```
[
  {
    "id": 1,
    "name": "McGroggity Test 1",
    "species": "Tyrannosaurus Test 1",
    "gender": "male",
    "digestion_period_in_hours": 2,
    "herbivore": false,
    "location": "A3",
    "park_id": 1
  },
  {
    "id": 2,
    "name": "McGroggity Test 2",
    "species": "Tyrannosaurus Test 2",
    "gender": "male",
    "digestion_period_in_hours": 2,
    "herbivore": false,
    "location": "A3",
    "park_id": 1
  }
]
```
</details>
  
<details>
  <summary>Update dino location</summary>

#### Request
```
curl -X 'PATCH' \
  'http://0.0.0.0:3000/api/dinos/25' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "location": "A0",
  "park_id": 1
}'
```
  
#### Response
```
{
  "location": "A0",
  "park_id": 1,
  "kind": "dino_location_updated",
  "dinosaur_id": 25,
  "time": "2021-10-15T03:26:39.898Z"
}
```
</details>

<details>
  <summary>Feed dino</summary>

#### Request 
```
curl -X 'PATCH' \
  'http://0.0.0.0:3000/api/dinos/feed/25' \
  -H 'accept: application/json'
```
  
#### Response
```
{
  "location": "A0",
  "park_id": 1,
  "kind": "dino_fed",
  "dinosaur_id": 25,
  "time": "2021-10-15T03:28:07.577Z"
}
```
</details>

<details>
  <summary>Zone maintanance</summary>

#### Request
```
curl -X 'POST' \
  'http://0.0.0.0:3000/api/dinos/maintanance' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "location": "A0",
  "park_id": 1
}'
```

#### Response
```
{
  "location": "A0",
  "park_id": 1,
  "kind": "maintenance_performed",
  "time": "2021-10-15T03:31:20.212Z"
}
```
</details>

<details>
  <summary>Log feed </summary>

#### Request
```
curl -X 'GET' \
  'http://0.0.0.0:3000/api/logs/feed' \
  -H 'accept: */*'
```

#### Response
```
[
  {
    "name": "McGroggity Test 1",
    "species": "Tyrannosaurus Test 1",
    "gender": "male",
    "digestion_period_in_hours": 2,
    "location": "A3",
    "park_id": 1,
    "kind": "dino_added",
    "dinosaur_id": 22,
    "time": "2021-10-14T16:28:45.722Z"
  },
  {
    "name": "McGroggity Test 2",
    "species": "Tyrannosaurus Test 2",
    "gender": "male",
    "digestion_period_in_hours": 2,
    "location": "A3",
    "park_id": 1,
    "kind": "dino_added",
    "dinosaur_id": 23,
    "time": "2021-10-14T16:28:57.601Z"
  }
]
```
</details>

## Questions/Feedback 

[Questions and Feedback](https://docs.google.com/document/d/1FwF9jZfKJM_SS7eTi_S98sEn4uhX7QG9kR7mevcKWmQ)

## Support

if you have any questions please send me an email thabelo@gmail.com

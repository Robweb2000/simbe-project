# Simbe Robotics Sample Project
This project implements an IoT datastore API in node.js.  The prompted constraints are:
-   REST API to receive telemetry from multiple devices.(just one value over time to simplify)
-   Ingest data into Postgres.
-   Deamon simulating sending telemetry on this API from multiple devices at the same time, at random intervals for each, and therefore populating the db.
-   Simple API to query this data : in SQL, how to get the value for all devices at any point in time

## Process
The project is centered around the Swagger API definition in swagger.yaml.  The base code originates from this, using swagger-node-codegen.  This provided function signatures, that I then implemented using the Express framework.

I added *knex* to provide a convenient Query Builder for postgresql.  It allows one to write code that's very analogous to the actual SQL queries, without having to resort to direct string manipulation (which is also prone to security risks like SQL injection).

knex provides convenient console scripts for migration and database seeding as well.  Initializing my dev database was as simple as `knex migrate:latest`.

Finally, the demo client daemon submits a battery of randomly-generated samples from 5 endpoint_ids simultaneously.

## Usage
- Install Javascript package dependencies: `npm install`
- Download the postgres container: `docker pull postgres`
- Start a postgres server for development: `docker run --rm --name pg-simbe-dev -e POSTGRES_PASSWORD=docker -d -p 5432:5432 postgres`
- Create the db tables: `knex migrate:latest`
- Manually validate db schema: `psql -h localhost -U postgres -d postgres -c "TABLE samples;"`
- Start the API server: `node src/bin/www`
- Manually insert an IoT sample: 
```
curl --user robbie:basic --request POST \
> --url http://localhost:3000/v1/sample \
> --header 'content-type: application/json' \
> --data '{"ts": 1582691428, "endpoint_id": 1234, "value": 42.7}'
```
- start the endpoint simulator daemon: `node src/client/demo.js`
- Test the read API: `curl --request GET --url http://localhost:3000/v1/sample/1582691428 --header 'api_key: qwertyuiop'`

## Limitations
Due to the limited scope of this exercise, and my introductory node.js experience, this project will need to be enhanced to be considered professional grade.  I've workshopped several of these without implementing them in the codebase.

### Code Style
Codebase should be compliant with [npm-coding-style](https://docs.npmjs.com/misc/coding-style.html), and configured to validate easily with JSLint.  Code Style standards reduce idiosyncratic practices, making codebases easier to comprehend and improve collaboration.

### Unit Tests
There is not much "business" logic in this simple CRUD API as it stands.  However, node.js has a pretty useful framework for functional testing of ExpressJS endpoints -- [supertest](https://www.npmjs.com/package/supertest).  This would be readily useful in the dev environment.  Implementing this is CI/CD would require the project to have a `docker-compose` that included the postgres server.

### Authentication
In swagger. spec'd two different authentication schemes: basicAuth for IoT endpoints, and an API key for the data retrieval.  Both of these auths are validated against hard-coded credentials from [config/common.yaml](config/common.yaml).   This should be migrated to `users` and `secrets` tables in postgresql, accordingly.

### Deployment
I workshopped deploying this to Heroku, which provides easy setup for node.js and postgres projects.  A more versatile deployment would be defining a `Dockerfile` to containerize the node.js server.  This would allow the server to be run versatilely by developers, staging, CI, and production.
Defining a `docker-compose` would also make it easy for developers to share an identical global environment with the CI/CD system.  
Since the global `api_key` isn't particularly secure, it should only be exposed in production to other services inside your VPC -- it can't be exposed like the IoT endpoint route.  One solution would be to use a reverse proxy like `nginx` to route these paths to different external ports.  Then set up your instance security groups to block incoming traffic to the port that redirects to the route validated by `api_key`. 

### Refactor
Since this project example was very simple, I implemented all business logic in [routes/samples.js](routes/samples.js).  When the  API needs to be expanded, it would be wise to adopt a design pattern that separates code for persistence, API implementation, and business logic.  MVC is a good strategy -- business logic could be put in a `service` package, persistence in a `model` package with `IoTSample` and `FleetSample` objects, etc.

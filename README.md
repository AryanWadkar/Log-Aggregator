# Log-Aggregator
An Express server that serves as a basic log aggregator service, helping aggregate logs from various sources using opentelemetry for trace collection.

## Setup
1. Clone the repo, install dependencies with npm install
2. npm run start

## ENV File configurations:
CLOUD_ID=' ' (Elastic Search Deploy Cloud ID)\
UN=' ' (Elastic Search Deploy Username)\
PASS=' ' (Elastic Search Deploy Password)\
AGG_URL='http://localhost:3000/recievelog' (Endpoint for aggregator server, to be put into services that want to log events)


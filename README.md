# Log-Aggregator
A set of services that serve as a scalable system to collect, aggregate, process, and view logs via a react app.

## Setup
1. Clone the repo, and install dependencies with npm run build;
2. To start the visualizer: npm run vis (spins up a load balancer[port 3000], and 3 aggregator server instance[port 3001,3002 and 3003])
3. To start the aggregator: npm run agg (spins up a load balancer[port 8000], and 2 visualizer server instance[port 8001 and 8002])
4. To start two dummy emitters: npm run emm (spins up two express servers that emit traces to the aggregator[port 5001,5002])

## ENV File configurations:
CLOUD_ID=' ' (Elastic Search Deploy Cloud ID)\
UN=' ' (Elastic Search Deploy Username)\
PASS=' ' (Elastic Search Deploy Password)\
AGG_URL='http://localhost:3000/recievelog' (Endpoint for aggregator server, to be put into services that want to log events, changing this requires changing port for aggregator load balancer as well)\
REDIS_URL=' ' (Redis DB url for BullMQ)\
REDIS_PASS=' ' (Redis DB pass for BullMQ)\
*Do not forget to update the port number under aggregator/index-agg.js line: 8

## Video Explanation and demonstration
https://drive.google.com/file/d/15TTMtrgGMYRaU76I8QxAOTpb8YhdAXM8/view?usp=sharing\

## Routes available:

### Aggregator
3000/ : Shows port of current aggregator you are being served from \
3000/recievelog : endpoint to recieve logs

### Visualizer
8000/check : Shows port of current visualizer you are being served from\
8000/getall : Retrive first 1000 documents available\
8000/mappings : Retrive all the parameters you can search from\
8000/ : Visualizer website is served

### Emitter
5001/ : Shows emitter 1 status\
5002/ : Shows emitter 2 status

## System Design Schema
![LogAgg](https://github.com/AryanWadkar/Log-Aggregator/assets/85237273/d65121c4-136c-4989-997e-3384def321ac)

## Hosted on EC2
![Screenshot (140)](https://github.com/AryanWadkar/Log-Aggregator/assets/85237273/c6ff1b94-1ff1-4930-98de-f017059e2781)
![Screenshot (141)](https://github.com/AryanWadkar/Log-Aggregator/assets/85237273/2adc06e2-7721-4a87-9c5f-3974c1bda8e2)
![Screenshot (142)](https://github.com/AryanWadkar/Log-Aggregator/assets/85237273/b0147d57-a3b5-4aff-a989-bd4eedccee04)



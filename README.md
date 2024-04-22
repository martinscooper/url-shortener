# URL shortener

## Stack

- Backend: nodejs + express
- Frontend: pure html + js
- Database: mongodb
- Cache: redis
- Queue: bull.js
- Node version: v20.12.2 (must accept `--node-env` parameter)

## Stress test

```bash
node stress_test.js
```

## Express server

### Local

Single server:

```bash
npm run start 
```

Cluser mode: starts as many severs as cpus available.

```bash
npm run cluster
```

### Production

Single pod:

```bash
docker build -t image-name .
docker push image-name
kubectl apply deployment/express-deployment
```

NodePort service to make the pod accesible from outside of the cluster:

```bash
kubectl apply deployment/express-service
```

## Redis

Used as a cache for hash-url search and as a queue for visit count storage.

### Local

```bash
redis-server
```

### Production

Single redis pod:

```bash
kubectl apply deployment/redis-deployment
```

Helm chart

```bash
helm install my-redis bitnami/redis
```

## Mongodb

Using a free Atlas cluster.

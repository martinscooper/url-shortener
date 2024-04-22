docker build -t 38831760/url-shortener:0.3.0 .
docker push 38831760/url-shortener:0.3.0
kubectl apply -f deployment/redis-deployment.yaml
kubectl apply -f deployment/redis-service.yaml
kubectl apply -f deployment/express-deployment.yaml
kubectl apply -f deployment/express-service.yaml
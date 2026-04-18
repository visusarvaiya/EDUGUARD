# AcadWatch - Deployment Guide

## 🌍 Production Deployment

### Environment Comparison

| Aspect | Local | Staging | Production |
|--------|-------|---------|------------|
| **Database** | Local MongoDB | MongoDB Atlas | MongoDB Atlas Enterprise |
| **Cache** | Local Redis | Redis Cloud | Redis Cloud Premium |
| **Email** | Gmail App Password | SendGrid | SendGrid Pro |
| **Frontend** | http:// | https:// | https:// CDN |
| **Backend** | Node cluster | Multi-node | Kubernetes |
| **Monitoring** | Console logs | Sentry | Datadog + Sentry |

---

## 🚀 Heroku Deployment (Easiest)

### Prerequisites
```bash
npm install -g heroku
heroku login
```

### Backend Deployment

```bash
cd backend

# Create Heroku app
heroku create acadwatch-backend

# Set environment variables
heroku config:set \
  MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/acadwatch?retryWrites=true&w=majority" \
  REDIS_URL="redis://:password@host:port" \
  JWT_SECRET="your-super-secret-key" \
  SMTP_HOST="smtp.sendgrid.net" \
  SMTP_PORT="587" \
  SMTP_USER="apikey" \
  SMTP_PASS="your-sendgrid-api-key" \
  NODE_ENV="production"

# Deploy
git push heroku main

# View logs
heroku logs --tail

# Check app status
heroku ps:scale web=1
```

### Frontend Deployment (Vercel)

```bash
cd frontend

# Create Vercel account at https://vercel.com

# Deploy
npm install -g vercel
vercel

# During deployment, set:
# REACT_APP_API_URL = https://acadwatch-backend.herokuapp.com/api

# View deployment
vercel --prod
```

---

## 🐳 Docker Containerization

### Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src ./src

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start server
CMD ["node", "src/index.js"]
```

### Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN REACT_APP_API_URL=https://api.acadwatch.com npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose (Local Multi-Container)

```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://admin:password@mongodb:27017/acadwatch?authSource=admin
      REDIS_URL: redis://redis:6379
      JWT_SECRET: dev-secret
      SMTP_HOST: smtp.mailtrap.io
      SMTP_PORT: 465
      SMTP_USER: ${SMTP_USER}
      SMTP_PASS: ${SMTP_PASS}
    depends_on:
      - mongodb
      - redis
    volumes:
      - ./backend/src:/app/src

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://backend:5000/api
    depends_on:
      - backend

volumes:
  mongo_data:
  redis_data:
```

### Run Docker Compose
```bash
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all
docker-compose down
```

---

## ☸️ Kubernetes Deployment (Advanced)

### Prerequisites
- Docker Hub account
- Kubernetes cluster (GKE, EKS, AKS)
- kubectl installed

### Build & Push Images

```bash
# Build images
docker build -t yourusername/acadwatch-backend:1.0.0 ./backend
docker build -t yourusername/acadwatch-frontend:1.0.0 ./frontend

# Push to Docker Hub
docker push yourusername/acadwatch-backend:1.0.0
docker push yourusername/acadwatch-frontend:1.0.0
```

### Kubernetes Manifests

```yaml
# k8s/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: acadwatch-backend
  labels:
    app: acadwatch
spec:
  replicas: 3
  selector:
    matchLabels:
      app: acadwatch-backend
  template:
    metadata:
      labels:
        app: acadwatch-backend
    spec:
      containers:
      - name: backend
        image: yourusername/acadwatch-backend:1.0.0
        ports:
        - containerPort: 5000
        env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: acadwatch-secrets
              key: mongodb-uri
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: acadwatch-secrets
              key: redis-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: acadwatch-secrets
              key: jwt-secret
        livenessProbe:
          httpGet:
            path: /api/health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 5000
          initialDelaySeconds: 10
          periodSeconds: 5
        resources:
          requests:
            cpu: 250m
            memory: 512Mi
          limits:
            cpu: 1000m
            memory: 1Gi

---
apiVersion: v1
kind: Service
metadata:
  name: acadwatch-backend-service
spec:
  selector:
    app: acadwatch-backend
  type: LoadBalancer
  ports:
  - protocol: TCP
    port: 80
    targetPort: 5000
```

### Deploy to Kubernetes

```bash
# Create secrets
kubectl create secret generic acadwatch-secrets \
  --from-literal=mongodb-uri="mongodb+srv://..." \
  --from-literal=redis-url="redis://..." \
  --from-literal=jwt-secret="your-secret"

# Apply manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get deployments
kubectl get pods
kubectl get svc

# View logs
kubectl logs -f deployment/acadwatch-backend

# Scale up
kubectl scale deployment acadwatch-backend --replicas=5
```

---

## 🔒 Production Security Checklist

### Environment & Secrets
- [ ] Use environment-specific `.env` files
- [ ] Store secrets in secure vault (HashiCorp Vault, AWS Secrets Manager)
- [ ] Never commit `.env` to git
- [ ] Rotate JWT secret annually
- [ ] Use strong SMTP credentials

### API Security
- [ ] Enable CORS for frontend domain only
- [ ] Implement rate limiting (10 req/min per IP)
- [ ] Add request size limits (50MB max)
- [ ] Validate all inputs on backend
- [ ] Use HTTPS only (enforce in nginx)
- [ ] Add security headers (via helmet.js)

### Database Security
- [ ] Enable MongoDB authentication
- [ ] Use IP whitelist for database connections
- [ ] Enable MongoDB Atlas encryption at rest
- [ ] Regular automated backups (daily)
- [ ] Test backup restoration procedures

### Application Monitoring
- [ ] Enable access logging
- [ ] Monitor error rates in Sentry
- [ ] Track performance with APM tools
- [ ] Set up CPU/memory alerts
- [ ] Monitor database query performance

### Compliance & Auditing
- [ ] Log all user authentication events
- [ ] Maintain intervention audit trail
- [ ] Implement data retention policies
- [ ] Handle GDPR right-to-be-forgotten requests
- [ ] Regular security penetration testing

---

## 📈 Performance Optimization for Production

### Frontend Optimization
```javascript
// Code splitting
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));

// Image optimization
<img src="image.webp" alt="..." loading="lazy" />

// Service worker for offline support
workbox.precachAndRoute(self.__WB_MANIFEST);

// Minify all assets
npm run build  // Creates /build with minified files
```

### Backend Optimization
```javascript
// Response compression
const compression = require('compression');
app.use(compression());

// Database query optimization
// Use lean() for read-only queries
Student.find().lean();

// Connection pooling
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  minPoolSize: 5,
});

// Request timeout
app.use(timeout('5s'));
```

### Nginx Configuration (Production)
```nginx
upstream backend {
  server backend1:5000;
  server backend2:5000;
  server backend3:5000;
}

server {
  listen 443 ssl http2;
  server_name api.acadwatch.com;

  ssl_certificate /etc/ssl/certs/certificate.crt;
  ssl_certificate_key /etc/ssl/private/key.key;

  # Security headers
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "DENY" always;

  # Rate limiting
  limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
  limit_req zone=api burst=20;

  # Caching
  location ~* \.(js|css|png|jpg)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
  }

  # Proxy to backend
  location /api {
    proxy_pass http://backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy AcadWatch

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker images
        run: |
          docker build -t acadwatch-backend:latest ./backend
          docker build -t acadwatch-frontend:latest ./frontend

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        env:
          HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
        run: |
          heroku container:push web -a acadwatch-backend
          heroku container:release web -a acadwatch-backend
```

---

## 📊 Monitoring & Logging

### Logging Stack (ELK)
```javascript
// Elasticsearch, Logstash, Kibana setup
const winston = require('winston');
const ElasticsearchTransport = require('winston-elasticsearch');

logger.add(new ElasticsearchTransport({
  level: 'info',
  clientOpts: { host: 'elasticsearch:9200' },
  index: 'acadwatch-logs',
}));
```

### Metrics to Monitor
- API response times (target: < 200ms)
- Error rate (target: < 0.5%)
- Database query performance
- Memory usage (alert: > 80%)
- CPU usage (alert: > 75%)
- Disk space (alert: > 85%)
- Alert email delivery rate

---

## 🆘 Disaster Recovery

### Backup Strategy
```bash
# Daily MongoDB backup
mongodump --uri="mongodb+srv://user:pass@..." --out=/backups/daily/$(date +%Y%m%d)

# Weekly full backup
tar -czf /backups/weekly/acadwatch-full-$(date +%Y%m%d).tar.gz /backups/daily/

# Store in S3 (30 days retention)
aws s3 sync /backups s3://acadwatch-backups/
```

### Recovery Procedure
1. Assess damage scope
2. Restore from latest clean backup
3. Verify data integrity
4. Perform transaction replay if needed
5. Update users of incident
6. Run post-mortem analysis

---

## 📋 Pre-Launch Checklist

- [ ] All environment variables configured
- [ ] SSL certificates installed
- [ ] Database backups automated & tested
- [ ] Monitoring & alerts set up
- [ ] Rate limiting enabled
- [ ] CORS configured for frontend domain
- [ ] Security headers enabled
- [ ] Email service tested
- [ ] Load testing completed (target: 1000 concurrent users)
- [ ] Rollback plan documented
- [ ] Health checks passing
- [ ] Database indexes verified
- [ ] Redis cache verified
- [ ] Logging aggregation working
- [ ] Team trained on deployment

---

**Deploy with confidence! 🚀**

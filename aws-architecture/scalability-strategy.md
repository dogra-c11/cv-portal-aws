## 1.4 Scalability Strategy

In this section, I’ve described how I plan to handle system growth and sudden traffic spikes, without making the setup too complex.

---

###  Traffic Spikes

**How I handle it:**

* I’ve used **ECS Fargate** for the backend because it can automatically scale the containers up or down based on traffic.
* For file uploads, **S3** easily handles large bursts without any setup.
* If the Lambda (CV processing) gets a sudden spike, it automatically scales up to handle parallel events.
* I’ll also set up **auto-scaling policies** on ECS based on CPU/memory usage so it adjusts to load smoothly.

---

###  Data Growth

**How I handle it:**

* The database (RDS MySQL) supports vertical and horizontal scaling. I’ll start with a general-purpose instance, and upgrade as data grows.
* For large-scale growth, I’ll look into **read replicas** to split read traffic.
* I’ll also **archive old CVs** to S3 Glacier if needed for long-term storage to reduce costs.

---

###  Global Users

**How I handle it:**

* Using **CloudFront**, my frontend and CV assets are cached and delivered globally with low latency.
* If needed later, I can move to **multi-region deployment** with read replicas closer to users.
* But initially, I’ll keep things simple and centralized in one AWS region (probably ap-south-1 or us-east-1) for cost and simplicity.

---

###  Cost Optimization

**What I’m doing:**

* I use **Fargate and Lambda**, which are both serverless and only charge for usage — this keeps costs low when the system is idle.
* Static frontend on S3 + CloudFront is almost free at low scale.
* I’ll enable **RDS storage auto-scaling** and **set up budgets and alerts** to track costs.
* I’ll also use **CloudWatch alarms** to catch abnormal usage early.

---
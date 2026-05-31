# DetectVision GPU Service (Placeholder)

GPU inference service — deploy on Google Cloud Run with GPU later. Not included in `docker-compose.yml` (VM has no GPU).

## What this is

A FastAPI stub built on `nvidia/cuda:12.4.1-runtime-ubuntu22.04` that exposes:

- `GET /health` — liveness probe
- `POST /infer` — placeholder inference endpoint that returns deterministic mock detections

It mirrors the contract the real YOLO/torch service will expose once trained weights are wired in.

## Why it's NOT in docker-compose

The Wikolabs VM has no GPU. Running this image on the VM would either fail (no NVIDIA runtime) or fall back to CPU, defeating the purpose. It is built and deployed separately to Google Cloud Run GPU (L4 / T4) when the model is ready.

## Future deploy (Cloud Run GPU)

```
gcloud builds submit --tag gcr.io/<project>/detectvision-gpu ./gpu-service
gcloud run deploy detectvision-gpu \
  --image gcr.io/<project>/detectvision-gpu \
  --region us-central1 \
  --gpu 1 --gpu-type nvidia-l4 \
  --no-cpu-throttling \
  --allow-unauthenticated
```

The CPU backend (`../backend`) will then call this service via its Cloud Run URL.

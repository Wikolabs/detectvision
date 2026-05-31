"""DetectVision GPU inference service — placeholder for Cloud Run GPU.

This is the stub that will host the real YOLO/torch inference workload once
deployed on Google Cloud Run GPU (L4 / T4). It is intentionally NOT included
in the project docker-compose.yml because the VM has no GPU. Build and deploy
it separately via gcloud / Cloud Build when ready.
"""
from typing import List, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="DetectVision GPU Inference (Placeholder)",
    description="Stub GPU service intended for Google Cloud Run GPU deployment.",
    version="0.0.1",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class InferRequest(BaseModel):
    image_url: Optional[str] = Field(None, description="Public image URL or GCS signed URL.")
    image_b64: Optional[str] = Field(None, description="Base64-encoded image as fallback.")
    sku: Optional[str] = Field(None, max_length=50)
    threshold: float = Field(0.5, ge=0.0, le=1.0)


class Detection(BaseModel):
    class_name: str = Field(..., alias="class")
    confidence: float
    bbox: List[int]

    class Config:
        populate_by_name = True


class InferResponse(BaseModel):
    detections: List[Detection]
    device: str
    model: str
    note: str


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "detectvision-gpu-placeholder",
        "device": "cuda:0 (placeholder — deploy on Cloud Run GPU)",
    }


@app.post("/infer", response_model=InferResponse)
def infer(req: InferRequest) -> InferResponse:
    """Placeholder inference endpoint.

    On Cloud Run GPU this would load a custom-trained YOLO weights file,
    run torch inference on the CUDA device, and return real detections.
    For now it returns deterministic mock detections so the contract is
    stable for the rest of the system to integrate against.
    """
    return InferResponse(
        detections=[
            Detection(**{"class": "scratch", "confidence": 0.95, "bbox": [142, 87, 64, 12]}),
            Detection(**{"class": "missing_fastener", "confidence": 0.92, "bbox": [410, 250, 28, 28]}),
            Detection(**{"class": "discoloration", "confidence": 0.77, "bbox": [88, 510, 220, 18]}),
        ],
        device="cuda:0 (placeholder — deploy on Cloud Run GPU)",
        model="yolov8-custom-placeholder",
        note="This is a placeholder response. Real GPU inference will run when this service is deployed on Cloud Run GPU.",
    )

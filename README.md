# DetectVision — Détection d'objets et inspection visuelle par IA (YOLO custom)

> Fine-tuning sur vos données. 97% de précision dès 500 images. Déployé en 1 heure.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org)
[![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-FF6B35?style=flat)](https://ultralytics.com)
[![OpenCV](https://img.shields.io/badge/OpenCV-4.9-5C3EE8?style=flat)](https://opencv.org)

---

## Vue d'ensemble

DetectVision est une plateforme de détection d'objets et d'inspection visuelle basée sur YOLOv8 fine-tuné. Elle permet d'annoter des images, d'entraîner un modèle YOLO personnalisé sur les données métier (produits, EPI, défauts qualité), et de déployer un endpoint d'inférence temps réel. Applications : contrôle qualité industriel, surveillance EPI, détection d'anomalies.

**Domaine :** Computer Vision / Quality Control / Industrial AI  
**Port VM :** 3021 | **Sous-domaine :** detectvision.wikolabs.com

---

## Stack technique

| Couche | Technologie | Rôle |
|--------|------------|------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS | Annotation images, training dashboard, demo |
| Backend | FastAPI (Python 3.11), Uvicorn | API inférence, training, annotation |
| Detection | **YOLOv8** (Ultralytics) | Object detection + instance segmentation |
| Image Processing | OpenCV 4.9 | Preprocessing, augmentation |
| Training | PyTorch + Ultralytics | Fine-tuning YOLO sur dataset custom |
| Annotation | Label Studio (embedded) | Interface annotation images |
| Storage | Minio (S3-compatible) | Images, models, annotations |
| Queue | Celery + Redis | Training async |
| Infra | Docker Compose, Nginx | VM mono-repo (port 3021) |

### backend/requirements.txt
```
fastapi==0.111.0
uvicorn[standard]==0.29.0
ultralytics==8.2.0
opencv-python-headless==4.9.0.80
torch==2.3.0
torchvision==0.18.0
celery==5.4.0
redis==5.0.4
asyncpg==0.29.0
sqlalchemy[asyncio]==2.0.30
pydantic==2.7.1
boto3==1.34.0
numpy==1.26.4
pillow==10.3.0
```

---

## Architecture mono-repo

```
detectvision/
├── frontend/
│   ├── src/app/
│   │   ├── page.tsx              # Dashboard modèles + détections
│   │   ├── annotate/             # Interface annotation images
│   │   ├── train/                # Configuration + suivi training
│   │   ├── detect/               # Demo détection live (upload image)
│   │   └── models/[id]/          # Métriques modèle + classes
│   └── src/components/
│       ├── AnnotationCanvas.tsx  # Canvas annotation bounding boxes
│       ├── TrainingProgress.tsx  # Loss curve, mAP en temps réel
│       ├── DetectionResult.tsx   # Image avec bboxes + labels + scores
│       ├── ConfusionMatrix.tsx   # Matrice de confusion par classe
│       └── ClassMetrics.tsx      # Precision/Recall par classe
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── detect.py         # POST /detect (image → detections)
│   │   │   ├── train.py          # POST /train (dataset → model)
│   │   │   └── annotations.py    # CRUD annotations COCO format
│   │   ├── services/
│   │   │   ├── yolo_inference.py # YOLOv8 predict
│   │   │   ├── trainer.py        # Ultralytics fine-tuning
│   │   │   ├── augmentor.py      # OpenCV augmentation
│   │   │   └── metrics.py        # mAP, precision, recall
│   │   └── models/
│   │       └── detection_model.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
└── .github/workflows/deploy.yml
```

---

## Diagrammes UML

### Architecture système

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#1e3a8a', 'primaryTextColor': '#fff', 'primaryBorderColor': '#1e40af', 'lineColor': '#374151', 'secondaryColor': '#eff6ff'}}}%%
flowchart TB
    subgraph VM["🖥️ VM — Docker Compose (port 3021)"]
        NEXT["Next.js 14\nVision Platform"]
        API["FastAPI"]
        CELERY["Celery Workers\nTraining async"]

        subgraph CV["👁️ Vision Engine"]
            YOLO["YOLOv8\nObject detection"]
            TRAIN["Ultralytics\nFine-tuning custom"]
            AUGMENT["OpenCV\nData augmentation"]
        end

        MINIO[("Minio S3\nImages + Models")]
        REDIS[("Redis\nTraining queue")]
    end

    IMAGES["Training Images\n+ Annotations (COCO)"] --> MINIO
    MINIO --> TRAIN
    PROD["Production Camera\nImages/Video"] --> YOLO
```

### Séquence — Fine-tuning d'un modèle custom

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#1e3a8a', 'primaryTextColor': '#fff', 'lineColor': '#374151'}}}%%
sequenceDiagram
    participant USER as ML Engineer
    participant API as FastAPI
    participant MINIO as Minio
    participant CELERY as Celery
    participant AUGMENT as Augmentor
    participant TRAIN as Ultralytics
    participant WS as WebSocket

    USER->>API: POST /train {dataset_id, classes: ["defect", "ok"], epochs: 50, base_model: "yolov8m"}

    API->>MINIO: load_dataset(images, annotations_coco)
    MINIO-->>API: 500 images, 1200 annotations

    API->>CELERY: enqueue_training(config)
    API-->>USER: {job_id: "tr_xyz", status: "queued"}

    CELERY->>AUGMENT: augment(dataset, flips=true, brightness_var=0.2, rotation=15)
    AUGMENT-->>CELERY: dataset augmenté × 3 = 1500 images

    CELERY->>TRAIN: model.train(data, epochs=50, imgsz=640, batch=16)

    loop chaque époque
        TRAIN->>WS: stream {epoch, loss, mAP50}
        WS-->>USER: progress update
    end

    TRAIN-->>CELERY: best_model.pt, mAP50=0.971, mAP50-95=0.843

    CELERY->>MINIO: save_model(best_model.pt)
    CELERY->>API: training_complete(job_id, model_id, mAP=0.971)
    API-->>USER: {model_id: "m_xyz", mAP50: 0.971, status: "ready"}
```

### Modèle de données (ER)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#1e3a8a', 'primaryTextColor': '#fff', 'lineColor': '#374151'}}}%%
erDiagram
    DETECTION_MODEL {
        uuid id PK
        string name
        string base_model
        string[] classes
        float map50
        float map50_95
        string model_s3_key
        string status
        timestamp trained_at
    }
    TRAINING_JOB {
        uuid id PK
        uuid model_id FK
        int epochs_completed
        int total_epochs
        float current_loss
        float best_map50
        string status
        text error_log
        timestamp started_at
    }
    DATASET {
        uuid id PK
        string name
        int image_count
        int annotation_count
        string[] classes
        float train_split
        float val_split
    }
    DETECTION_RESULT {
        uuid id PK
        uuid model_id FK
        string image_s3_key
        jsonb bboxes
        float inference_ms
        timestamp detected_at
    }

    DETECTION_MODEL ||--o{ TRAINING_JOB : "trained_with"
    DETECTION_MODEL }o--|| DATASET : "trained_on"
    DETECTION_MODEL ||--o{ DETECTION_RESULT : "produces"
```

---

## PRD

### Problème
Les applications de vision par ordinateur nécessitaient des experts Deep Learning pour développer et déployer des modèles. Les inspections qualité manuelles en industrie sont lentes, coûteuses, et sujettes à la fatigue humaine (15% des défauts manqués en fin de shift).

### Solution
DetectVision permet à des ingénieurs qualité sans expertise ML de fine-tuner YOLO sur leurs images en 500 exemples annotés, d'obtenir 97%+ de précision, et de déployer en production en 1 heure. L'annotation, l'entraînement et le déploiement sont gérés dans une seule interface.

### Utilisateurs cibles
| Persona | Besoin |
|---------|--------|
| Ingénieur Qualité | Détecter les défauts sur ligne de production |
| Responsable HSE | Vérification EPI (casque, gilet, lunettes) |
| ML Engineer | Fine-tuner et déployer des modèles YOLO custom |

### OKRs
- mAP50 > 95% sur classes métier après fine-tuning
- Inférence < 50ms par image (GPU) / < 200ms (CPU)
- Zéro défaut manqué (recall = 1.0) sur classes critiques

---

## User Stories

```
US-01 [QA] En tant qu'ingénieur qualité,
      je veux annoter 500 images de pièces (defect / ok)
      et obtenir un modèle YOLO entraîné avec mAP > 95%
      afin de déployer l'inspection automatique sur ma ligne.

US-02 [HSE] En tant que responsable HSE,
      je veux détecter en temps réel si les ouvriers portent leur casque
      depuis les caméras IP de l'usine
      afin d'émettre une alerte immédiate en cas de non-conformité.

US-03 [ML Engineer] En tant que ML Engineer,
      je veux suivre en temps réel les métriques d'entraînement
      (loss, mAP50, mAP50-95) par époque
      afin d'arrêter tôt si le modèle diverge.

US-04 [QA] En tant qu'ingénieur qualité,
      je veux voir la matrice de confusion de mon modèle
      afin d'identifier quelles classes sont confondues et où améliorer.

US-05 [Prod] En tant que responsable production,
      je veux uploader une image ou un flux vidéo
      et voir les détections en overlay en temps réel
      afin de démonter le système avant achat.
```

---

## Règles métier

| # | Règle | Description | Simulable UI |
|---|-------|-------------|-------------|
| R1 | Minimum dataset | 500 images minimum par classe pour fine-tuning | ✅ Dataset checker |
| R2 | Augmentation auto | Flip H/V, rotation ±15°, brightness ±20%, mosaic | ✅ Augment preview |
| R3 | Seuil confiance | Détections < 0.5 confidence ignorées par défaut | ✅ Conf slider |
| R4 | NMS | Non-maximum suppression IoU=0.45 | ✅ NMS config |
| R5 | Classes custom | Jusqu'à 50 classes par modèle | ✅ Class list |
| R6 | mAP alert | mAP50 < 0.80 après 50 époques → notification | ✅ mAP badge |
| R7 | Versioning | Chaque training = version immuable du modèle | ✅ Version list |
| R8 | Model comparison | Comparer mAP de plusieurs versions | ✅ Comparison table |
| R9 | Export formats | ONNX, TorchScript, CoreML pour déploiement edge | ✅ Export options |
| R10 | Batch inférence | Upload batch 100 images → résultats JSON | ✅ Batch detect |

---

## Spécification API

**Base URL :** `http://detectvision.wikolabs.com/api/v1`

### POST /detect
```
Content-Type: multipart/form-data
image: product.jpg, model_id: m_xyz, confidence: 0.5
// Response: {"detections": [{"class": "defect", "confidence": 0.97, "bbox": [120, 45, 230, 180]}], "inference_ms": 18}
```

### POST /train
```json
{"dataset_id": "ds_xyz", "classes": ["defect", "ok"], "epochs": 50, "base_model": "yolov8m", "imgsz": 640}
// Response: {"job_id": "tr_xyz", "status": "queued", "eta_minutes": 45}
```

### GET /models/{id}/metrics
```json
// Response: {"map50": 0.971, "map50_95": 0.843, "precision": 0.963, "recall": 0.978, "by_class": {"defect": {"ap50": 0.981}, "ok": {"ap50": 0.961}}}
```

---

## Simulation UI

| Composant | Description |
|-----------|-------------|
| **Annotation Canvas** | Image avec bounding boxes dessinables, labels assignables |
| **Training Dashboard** | Loss curve + mAP50 en temps réel via WebSocket |
| **Detection Demo** | Upload image → overlay bboxes + confidence coloré |
| **Confusion Matrix** | Heatmap classes × classes pour analyse erreurs |
| **Model Comparison** | Tableau côte-à-côte des métriques de plusieurs modèles |

---

## Déploiement

```yaml
version: "3.9"
services:
  postgres:
    image: postgres:16-alpine
    environment: {POSTGRES_DB: detectvision, POSTGRES_USER: dv_user, POSTGRES_PASSWORD: "${POSTGRES_PASSWORD}"}
  redis:
    image: redis:7-alpine
  minio:
    image: minio/minio
    command: server /data
    environment: {MINIO_ROOT_USER: "${MINIO_USER}", MINIO_ROOT_PASSWORD: "${MINIO_PASSWORD}"}
  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql+asyncpg://dv_user:${POSTGRES_PASSWORD}@postgres/detectvision
      MINIO_URL: "http://minio:9000"
    depends_on: [postgres, redis, minio]
    expose: ["8000"]
  worker:
    build: ./backend
    command: celery -A app.worker worker --loglevel=info
    depends_on: [redis]
  frontend:
    build: ./frontend
    expose: ["3000"]
  nginx:
    image: nginx:alpine
    ports: ["3021:80"]
volumes:
  pg_data:
  minio_data:
```

---

## Roadmap

### Phase 1 — MVP
- [ ] YOLOv8 fine-tuning sur dataset custom
- [ ] Endpoint inférence REST
- [ ] Dashboard métriques

### Phase 2 — Annotation
- [ ] Interface annotation intégrée
- [ ] Augmentation automatique
- [ ] Batch inference

### Phase 3 — Production
- [ ] Export ONNX/TorchScript pour edge
- [ ] Streaming vidéo temps réel
- [ ] Intégration EdgesAI (détection sur Jetson)

---

*Un produit [Wikolabs](https://wikolabs.com) — Intelligence artificielle appliquée aux métiers*

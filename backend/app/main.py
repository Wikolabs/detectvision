"""DetectVision demo backend — production-ready POC.

In production: this CPU-only service orchestrates inspection requests and
delegates heavy inference to a GPU service (see ../gpu-service/) deployed
on Google Cloud Run GPU. For the demo: it only invokes the LLM and returns
a simulated YOLO inspection report.
"""
from datetime import datetime, timezone
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .llm import chat, is_configured

app = FastAPI(
    title="DetectVision Demo Backend",
    description="POC backend — Groq/Gemini LLM. No third-party connections.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────────────────────
# Prompts
# ─────────────────────────────────────────────────────────────────────────────
SYSTEM_PROMPT_FR = """Tu es DetectVision, un moteur de vision par ordinateur YOLO custom pour controle qualite industriel et inspection visuelle. A partir d'une description de scene (image upload simulee, ligne de production, SKU produit), tu generes un rapport d'inspection comme si tu avais analyse une image reelle.

Format de sortie exact en MARKDOWN :
**🎯 Resultat d'inspection**
- [Verdict global : CONFORME / NON CONFORME / A REINSPECTER, confiance globale en %]
- [SKU analyse + nombre de zones de detection]

**🔍 Defauts detectes**
- [3 a 5 defauts avec : type (rayure, manque de matiere, EPI manquant, decoloration), coordonnees bounding box (x,y,w,h), confiance %, severite (mineur/majeur/critique)]

**📋 Conformite et regles metier**
- [3 puces : regles ISO 9001 ou regle metier appliquee, seuils, statut conformite]

**⚡ Actions recommandees**
- [2 puces : ecartement de la piece, alerte qualite, declenchement MES, recommandations operateur]

Tu DOIS inventer un rapport realiste pour la demo (jamais "je n'ai pas access a l'image"). Tu joues le modele YOLO custom qui a deja analyse le frame. Style ingenieur qualite industriel, technique. Maximum 320 mots."""

SYSTEM_PROMPT_EN = """You are DetectVision, a custom YOLO computer vision engine for industrial quality control and visual inspection. From a scene description (simulated image upload, production line, product SKU), you generate an inspection report as if you had analyzed a real image.

Exact MARKDOWN output format:
**🎯 Inspection result**
- [Overall verdict: PASS / FAIL / REINSPECT, overall confidence %]
- [Analyzed SKU + number of detection zones]

**🔍 Detected defects**
- [3 to 5 defects with: type (scratch, missing material, missing PPE, discoloration), bounding box coords (x,y,w,h), confidence %, severity (minor/major/critical)]

**📋 Compliance and business rules**
- [3 bullets: applied ISO 9001 or business rule, thresholds, compliance status]

**⚡ Recommended actions**
- [2 bullets: part rejection, quality alert, MES trigger, operator recommendations]

You MUST invent a realistic report for the demo (never "I have no image access"). You play the custom YOLO model that has already analyzed the frame. Industrial quality engineer tone, technical. Maximum 320 words."""


# ─────────────────────────────────────────────────────────────────────────────
# Models
# ─────────────────────────────────────────────────────────────────────────────
class GenerateRequest(BaseModel):
    sku: str = Field(..., min_length=1, max_length=50)
    scene: str = Field("", max_length=200)
    image_filename: str = Field("", max_length=120)
    lang: Literal["fr", "en"] = "fr"


class GenerateResponse(BaseModel):
    brief: str
    model: str
    generated_at: str
    static_mode: bool = False


# ─────────────────────────────────────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "detectvision-backend",
        "llm_configured": is_configured(),
    }


@app.post("/process", response_model=GenerateResponse)
async def process(req: GenerateRequest) -> GenerateResponse:
    sku = req.sku.strip()
    scene = (req.scene or "").strip()
    file_name = (req.image_filename or "").strip()
    if not sku:
        raise HTTPException(status_code=400, detail="sku_required")

    now_iso = datetime.now(timezone.utc).isoformat()
    default_scene_fr = "ligne d'assemblage, eclairage standard, camera HD fixe"
    default_file = "image_capture.jpg"
    if req.lang == "fr":
        scene_ctx = scene or default_scene_fr
        file_ctx = file_name or default_file
        user_msg = f"SKU : {sku}\nFichier image upload : {file_ctx}\nContexte scene : {scene_ctx}\nGenere le rapport d'inspection."
    else:
        scene_ctx = scene or "assembly line, standard lighting, fixed HD camera"
        file_ctx = file_name or default_file
        user_msg = f"SKU: {sku}\nUploaded image file: {file_ctx}\nScene context: {scene_ctx}\nGenerate the inspection report."

    if not is_configured():
        return GenerateResponse(
            brief=_build_mock_brief(sku, scene, file_name, req.lang),
            model="static-mock",
            generated_at=now_iso,
            static_mode=True,
        )

    try:
        text, model = await chat(
            [
                {"role": "system", "content": SYSTEM_PROMPT_FR if req.lang == "fr" else SYSTEM_PROMPT_EN},
                {"role": "user", "content": user_msg},
            ],
            max_tokens=900,
        )
    except Exception:
        return GenerateResponse(
            brief=_build_mock_brief(sku, scene, file_name, req.lang),
            model="static-mock",
            generated_at=now_iso,
            static_mode=True,
        )

    return GenerateResponse(brief=text, model=model, generated_at=now_iso)


# ─────────────────────────────────────────────────────────────────────────────
# Mock brief (used when no LLM key configured)
# ─────────────────────────────────────────────────────────────────────────────
def _build_mock_brief(sku: str, scene: str, file_name: str, lang: str) -> str:
    fn = file_name or "frame_03217.jpg"
    rule_tag = sku[:3].upper() if sku else "QC"
    if lang == "en":
        return (
            f"**🎯 Inspection result**\n"
            f"- Overall verdict: REINSPECT — overall confidence 88.4%. Two defects above the major-severity threshold detected.\n"
            f"- Analyzed SKU: {sku} (file: {fn}), 4 detection zones evaluated.\n\n"
            f"**🔍 Detected defects**\n"
            f"- Scratch on upper-left coating — bbox [142, 87, 64, 12], confidence 94.2%, severity major.\n"
            f"- Missing fastener at position 3 — bbox [410, 250, 28, 28], confidence 91.8%, severity critical.\n"
            f"- Slight discoloration on lower edge — bbox [88, 510, 220, 18], confidence 76.5%, severity minor.\n"
            f"- Tape residue near label area — bbox [620, 410, 80, 40], confidence 81.0%, severity minor.\n\n"
            f"**📋 Compliance and business rules**\n"
            f"- ISO 9001 §8.6 conformity: visual finish does not meet acceptance criteria (critical defect present).\n"
            f"- Internal rule QC-{rule_tag}-07: zero critical defect tolerated on outbound shipping.\n"
            f"- Compliance status: NON-COMPLIANT — block until manual review.\n\n"
            f"**⚡ Recommended actions**\n"
            f"- Reject part automatically and route to QC rework station #2.\n"
            f"- Push event to MES `part_reject` with payload `{{sku: \"{sku}\", defects: 4, severity: \"critical\"}}` and notify Slack `#qc-realtime`."
        )
    return (
        f"**🎯 Resultat d'inspection**\n"
        f"- Verdict global : A REINSPECTER — confiance globale 88.4%. Deux defauts au-dessus du seuil de severite majeure detectes.\n"
        f"- SKU analyse : {sku} (fichier : {fn}), 4 zones de detection evaluees.\n\n"
        f"**🔍 Defauts detectes**\n"
        f"- Rayure en haut a gauche du revetement — bbox [142, 87, 64, 12], confiance 94.2%, severite majeure.\n"
        f"- Vis manquante position 3 — bbox [410, 250, 28, 28], confiance 91.8%, severite critique.\n"
        f"- Legere decoloration bord inferieur — bbox [88, 510, 220, 18], confiance 76.5%, severite mineure.\n"
        f"- Residu d'adhesif pres de la zone d'etiquette — bbox [620, 410, 80, 40], confiance 81.0%, severite mineure.\n\n"
        f"**📋 Conformite et regles metier**\n"
        f"- ISO 9001 §8.6 conformite : la finition visuelle ne respecte pas les criteres d'acceptation (defaut critique present).\n"
        f"- Regle interne QC-{rule_tag}-07 : zero defaut critique tolere a l'expedition.\n"
        f"- Statut conformite : NON CONFORME — bloquer jusqu'a revue manuelle.\n\n"
        f"**⚡ Actions recommandees**\n"
        f"- Ecarter la piece automatiquement et router vers le poste retouche QC #2.\n"
        f"- Pousser un evenement MES `part_reject` avec payload `{{sku: \"{sku}\", defauts: 4, severite: \"critique\"}}` et notifier Slack `#qc-realtime`."
    )

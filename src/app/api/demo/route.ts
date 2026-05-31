import { NextResponse } from "next/server";
import { chat, isConfigured } from "@/lib/llm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT_FR = `Tu es DetectVision, un moteur de vision par ordinateur YOLO custom pour controle qualite industriel et inspection visuelle. A partir d'une description de scene (image upload simulee, ligne de production, SKU produit), tu generes un rapport d'inspection comme si tu avais analyse une image reelle.

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

Tu DOIS inventer un rapport realiste pour la demo (jamais "je n'ai pas access a l'image"). Tu joues le modele YOLO custom qui a deja analyse le frame. Style ingenieur qualite industriel, technique. Maximum 320 mots.`;

const SYSTEM_PROMPT_EN = `You are DetectVision, a custom YOLO computer vision engine for industrial quality control and visual inspection. From a scene description (simulated image upload, production line, product SKU), you generate an inspection report as if you had analyzed a real image.

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

You MUST invent a realistic report for the demo (never "I have no image access"). You play the custom YOLO model that has already analyzed the frame. Industrial quality engineer tone, technical. Maximum 320 words.`;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const sku: string = typeof body.sku === "string" ? body.sku.trim().slice(0, 50) : "";
    const scene: string = typeof body.scene === "string" ? body.scene.trim().slice(0, 200) : "";
    const fileName: string = typeof body.fileName === "string" ? body.fileName.trim().slice(0, 120) : "";
    const lang: "fr" | "en" = body.lang === "en" ? "en" : "fr";

    if (!sku) {
      return NextResponse.json(
        { error: lang === "fr" ? "Indiquez le SKU produit a inspecter." : "Provide the product SKU to inspect." },
        { status: 400 }
      );
    }

    if (!isConfigured()) {
      return NextResponse.json(
        {
          error: "llm_not_configured",
          message: lang === "fr"
            ? "Demo en mode statique — la cle LLM sera configuree au prochain deploiement."
            : "Static demo mode — LLM key will be configured at next deploy.",
          mockBrief: buildMockBrief(sku, scene, fileName, lang),
        },
        { status: 200 }
      );
    }

    const userMsg = lang === "fr"
      ? `SKU : ${sku}\nFichier image upload : ${fileName || "image_capture.jpg"}\nContexte scene : ${scene || "ligne d'assemblage, eclairage standard, camera HD fixe"}\nGenere le rapport d'inspection.`
      : `SKU: ${sku}\nUploaded image file: ${fileName || "image_capture.jpg"}\nScene context: ${scene || "assembly line, standard lighting, fixed HD camera"}\nGenerate the inspection report.`;

    const { text, model } = await chat(
      [
        { role: "system", content: lang === "fr" ? SYSTEM_PROMPT_FR : SYSTEM_PROMPT_EN },
        { role: "user", content: userMsg },
      ],
      900
    );

    return NextResponse.json({ brief: text, model, generatedAt: new Date().toISOString() });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function buildMockBrief(sku: string, scene: string, fileName: string, lang: "fr" | "en"): string {
  if (lang === "en") {
    return `**🎯 Inspection result**\n- Overall verdict: REINSPECT — overall confidence 88.4%. Two defects above the major-severity threshold detected.\n- Analyzed SKU: ${sku} (file: ${fileName || "frame_03217.jpg"}), 4 detection zones evaluated.\n\n**🔍 Detected defects**\n- Scratch on upper-left coating — bbox [142, 87, 64, 12], confidence 94.2%, severity major.\n- Missing fastener at position 3 — bbox [410, 250, 28, 28], confidence 91.8%, severity critical.\n- Slight discoloration on lower edge — bbox [88, 510, 220, 18], confidence 76.5%, severity minor.\n- Tape residue near label area — bbox [620, 410, 80, 40], confidence 81.0%, severity minor.\n\n**📋 Compliance and business rules**\n- ISO 9001 §8.6 conformity: visual finish does not meet acceptance criteria (critical defect present).\n- Internal rule QC-${sku.slice(0, 3).toUpperCase()}-07: zero critical defect tolerated on outbound shipping.\n- Compliance status: NON-COMPLIANT — block until manual review.\n\n**⚡ Recommended actions**\n- Reject part automatically and route to QC rework station #2.\n- Push event to MES \`part_reject\` with payload \`{sku: "${sku}", defects: 4, severity: "critical"}\` and notify Slack \`#qc-realtime\`.`;
  }
  return `**🎯 Resultat d'inspection**\n- Verdict global : A REINSPECTER — confiance globale 88.4%. Deux defauts au-dessus du seuil de severite majeure detectes.\n- SKU analyse : ${sku} (fichier : ${fileName || "frame_03217.jpg"}), 4 zones de detection evaluees.\n\n**🔍 Defauts detectes**\n- Rayure en haut a gauche du revetement — bbox [142, 87, 64, 12], confiance 94.2%, severite majeure.\n- Vis manquante position 3 — bbox [410, 250, 28, 28], confiance 91.8%, severite critique.\n- Legere decoloration bord inferieur — bbox [88, 510, 220, 18], confiance 76.5%, severite mineure.\n- Residu d'adhesif pres de la zone d'etiquette — bbox [620, 410, 80, 40], confiance 81.0%, severite mineure.\n\n**📋 Conformite et regles metier**\n- ISO 9001 §8.6 conformite : la finition visuelle ne respecte pas les criteres d'acceptation (defaut critique present).\n- Regle interne QC-${sku.slice(0, 3).toUpperCase()}-07 : zero defaut critique tolere a l'expedition.\n- Statut conformite : NON CONFORME — bloquer jusqu'a revue manuelle.\n\n**⚡ Actions recommandees**\n- Ecarter la piece automatiquement et router vers le poste retouche QC #2.\n- Pousser un evenement MES \`part_reject\` avec payload \`{sku: "${sku}", defauts: 4, severite: "critique"}\` et notifier Slack \`#qc-realtime\`.`;
}

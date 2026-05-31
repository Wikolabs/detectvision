"use client";
import { useState } from "react";

const PRODUCT = "DetectVision";

const PAL = {
  bg: "#06151E",
  bg2: "#0C2230",
  surface: "rgba(255,255,255,0.04)",
  surfaceHover: "rgba(255,255,255,0.07)",
  border: "rgba(255,255,255,0.09)",
  txt1: "#E0F4FB",
  txt2: "#82A6B6",
  txt3: "#4E6878",
  accent: "#06B6D4",
  accentSoft: "rgba(6,182,212,0.12)",
  accentBorder: "rgba(6,182,212,0.30)",
  accentGlow: "rgba(6,182,212,0.18)",
  navBg: "rgba(6,21,30,0.82)",
};

export default function DemoPage() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [sku, setSku] = useState("PART-A12-87X");
  const [scene, setScene] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState("");
  const [model, setModel] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [staticMode, setStaticMode] = useState(false);

  const t = lang === "fr" ? {
    back: "Retour", title: "Demo", sub: PRODUCT + " — controle qualite visuel par YOLO custom",
    desc: "Selectionnez une image (ou laissez vide) et indiquez le SKU produit. Le moteur simule l'analyse YOLO custom et genere un rapport d'inspection complet avec defauts, conformite et actions recommandees. Aucune CV reelle, aucune integration MES — c'est un POC qui montre la logique de production.",
    fileLabel: "Image a inspecter (simulation, fichier non traite)", chooseFile: "Choisir une image", filePicked: "Image selectionnee :", noFile: "Aucune image — la simulation utilise une scene generique",
    skuLabel: "SKU produit", skuPlaceholder: "ex: PART-A12-87X",
    sceneLabel: "Contexte scene (optionnel)", scenePlaceholder: "ex: ligne d'assemblage moteur, eclairage LED 2700K, camera 4K fixe top-down",
    generate: "Lancer l'inspection", generating: "Inference en cours...",
    briefTitle: "Rapport d'inspection", emptyHint: "Le rapport YOLO et les recommandations apparaitront ici.",
    rejectMes: "Ecarter via MES", alertSlack: "Alerter qualite Slack", saveAudit: "Archiver pour audit",
    rejectMock: "Evenement \`part_reject\` envoye au MES Siemens Opcenter (mode demo, pas de connexion reelle)",
    slackMock: "Alerte poussee dans #qc-realtime avec snapshot (mode demo, pas de connexion Slack)",
    auditMock: "Rapport archive dans s3://detectvision-audit/2026/05/ (mode demo, pas d'upload reel)",
    fallback: "Mode statique : la cle LLM sera ajoutee au prochain deploiement.",
    poweredBy: "Modele :",
    note: "DEMO POC — aucune image n'est reellement analysee par CV, aucune connexion a MES (Opcenter, Wonderware), SCADA ou Slack. Le selecteur de fichier ne fait que recuperer le nom. L'IA imagine le rapport pour la demonstration.",
  } : {
    back: "Back", title: "Demo", sub: PRODUCT + " — visual QC via custom YOLO",
    desc: "Pick an image (or leave empty) and enter the product SKU. The engine simulates a custom YOLO analysis and generates a full inspection report with defects, compliance and recommended actions. No real CV, no MES integration — this is a POC showing production logic.",
    fileLabel: "Image to inspect (simulation, file not processed)", chooseFile: "Choose image", filePicked: "Image selected:", noFile: "No image — simulation uses a generic scene",
    skuLabel: "Product SKU", skuPlaceholder: "e.g. PART-A12-87X",
    sceneLabel: "Scene context (optional)", scenePlaceholder: "e.g. engine assembly line, LED 2700K lighting, top-down fixed 4K camera",
    generate: "Run inspection", generating: "Running inference...",
    briefTitle: "Inspection report", emptyHint: "The YOLO report and recommendations will appear here.",
    rejectMes: "Reject via MES", alertSlack: "Alert QC on Slack", saveAudit: "Archive for audit",
    rejectMock: "Event \`part_reject\` pushed to Siemens Opcenter MES (demo mode, no real connection)",
    slackMock: "Alert pushed to #qc-realtime with snapshot (demo mode, no real Slack connection)",
    auditMock: "Report archived to s3://detectvision-audit/2026/05/ (demo mode, no real upload)",
    fallback: "Static mode: LLM key will be added at next deploy.",
    poweredBy: "Model:",
    note: "DEMO POC — no image is actually CV-analyzed, no connection to MES (Opcenter, Wonderware), SCADA or Slack. The file picker only captures the filename. The AI imagines the report for demonstration.",
  };

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFileName(f.name);
  }

  async function generate() {
    setError(""); setBrief(""); setModel(""); setStaticMode(false);
    if (!sku.trim()) {
      setError(lang === "fr" ? "Indiquez le SKU produit." : "Provide the product SKU.");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku: sku.trim(), scene: scene.trim(), fileName: fileName.trim(), lang }),
      });
      const j = await r.json();
      if (j.error === "llm_not_configured") {
        setBrief(j.mockBrief || "");
        setStaticMode(true);
      } else if (j.error) {
        setError(j.message || j.error);
      } else {
        setBrief(j.brief || "");
        setModel(j.model || "");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "unknown_error");
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  }

  return (
    <div style={{ minHeight: "100vh", background: PAL.bg, color: PAL.txt1, display: "flex", flexDirection: "column" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        .wk-input { width: 100%; padding: 12px 14px; border-radius: 10px; background: ${PAL.surface}; border: 1px solid ${PAL.border}; color: ${PAL.txt1}; font-family: inherit; font-size: 14px; transition: border-color .2s, background .2s; }
        .wk-input:focus { outline: none; border-color: ${PAL.accent}; background: ${PAL.surfaceHover}; }
        .wk-btn-primary { background: ${PAL.accent}; color: #04141A; border: none; border-radius: 10px; padding: 13px 22px; font-weight: 700; font-size: 14px; cursor: pointer; font-family: inherit; transition: opacity .2s, transform .2s; display: inline-flex; align-items: center; gap: 8px; }
        .wk-btn-primary:hover { opacity: .9; transform: translateY(-1px); }
        .wk-btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; }
        .wk-btn-ghost { background: ${PAL.surface}; color: ${PAL.txt1}; border: 1px solid ${PAL.border}; border-radius: 10px; padding: 9px 14px; font-weight: 600; font-size: 13px; cursor: pointer; font-family: inherit; transition: background .2s, border-color .2s; display: inline-flex; align-items: center; gap: 6px; }
        .wk-btn-ghost:hover { background: ${PAL.surfaceHover}; border-color: ${PAL.accentBorder}; }
        .wk-md p, .wk-md ul { margin: 0 0 10px; }
        .wk-md ul { padding-left: 18px; }
        .wk-md li { margin-bottom: 4px; line-height: 1.65; }
        .wk-md strong { color: ${PAL.accent}; font-weight: 700; display: block; margin-top: 10px; margin-bottom: 4px; font-size: 0.78rem; letter-spacing: 1.5px; text-transform: uppercase; }
        .file-picker-label { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px; border: 1px dashed ${PAL.border}; border-radius: 10px; background: ${PAL.surface}; cursor: pointer; font-size: 13px; color: ${PAL.txt2}; transition: border-color .2s, background .2s; }
        .file-picker-label:hover { border-color: ${PAL.accentBorder}; background: ${PAL.surfaceHover}; color: ${PAL.txt1}; }
        @media (max-width: 768px) {
          .demo-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <nav style={{ padding: "16px 32px", borderBottom: `1px solid ${PAL.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: PAL.navBg, backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 10 }}>
        <a href="/" style={{ color: PAL.accent, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
          ← {t.back} {PRODUCT}<span style={{ color: PAL.accent }}>.</span>
        </a>
        <div style={{ display: "inline-flex", border: `1px solid ${PAL.border}`, borderRadius: 100, padding: 2, background: PAL.surface }}>
          <button onClick={() => setLang("fr")} style={{ background: lang === "fr" ? PAL.accent : "transparent", color: lang === "fr" ? "#04141A" : PAL.txt2, border: "none", padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRadius: 100, fontFamily: "inherit" }}>FR</button>
          <button onClick={() => setLang("en")} style={{ background: lang === "en" ? PAL.accent : "transparent", color: lang === "en" ? "#04141A" : PAL.txt2, border: "none", padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", borderRadius: 100, fontFamily: "inherit" }}>EN</button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: "32px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <h1 style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 700, margin: "0 0 6px" }}>
          {t.title} · <em style={{ fontStyle: "italic", color: PAL.accent }}>{PRODUCT}</em>
        </h1>
        <p style={{ color: PAL.txt2, fontSize: "0.95rem", lineHeight: 1.65, maxWidth: 720, margin: "0 0 6px" }}>{t.sub}</p>
        <p style={{ color: PAL.txt3, fontSize: "0.78rem", lineHeight: 1.55, maxWidth: 720, margin: "0 0 28px" }}>{t.desc}</p>

        <div className="demo-grid" style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 24 }}>
          <section style={{ background: PAL.surface, border: `1px solid ${PAL.border}`, borderRadius: 16, padding: 22 }}>
            <h2 style={{ fontSize: "0.72rem", color: PAL.txt3, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, margin: "0 0 14px" }}>{t.fileLabel}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
              <label className="file-picker-label">
                <input type="file" accept="image/*" onChange={onPickFile} style={{ display: "none" }} />
                📷 {t.chooseFile}
              </label>
              <div style={{ fontSize: 11, color: PAL.txt3, fontFamily: "monospace", padding: "0 4px" }}>
                {fileName ? `${t.filePicked} ${fileName}` : t.noFile}
              </div>
              <label style={{ fontSize: 11, color: PAL.txt3, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, marginTop: 6 }}>{t.skuLabel}</label>
              <input className="wk-input" value={sku} onChange={(e) => setSku(e.target.value)} placeholder={t.skuPlaceholder} />
              <label style={{ fontSize: 11, color: PAL.txt3, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, marginTop: 6 }}>{t.sceneLabel}</label>
              <textarea className="wk-input" value={scene} onChange={(e) => setScene(e.target.value)} placeholder={t.scenePlaceholder} rows={3} style={{ resize: "vertical", fontFamily: "inherit" }} />
            </div>
            <button className="wk-btn-primary" disabled={loading} onClick={generate} style={{ width: "100%", justifyContent: "center" }}>
              {loading ? `⏳ ${t.generating}` : `🎯 ${t.generate}`}
            </button>
            {error && <div style={{ marginTop: 12, color: "#F87171", fontSize: 13, padding: "8px 12px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8 }}>{error}</div>}
            <p style={{ color: PAL.txt3, fontSize: 11, lineHeight: 1.5, marginTop: 18, marginBottom: 0, paddingTop: 14, borderTop: `1px solid ${PAL.border}` }}>{t.note}</p>
          </section>

          <section style={{ background: PAL.bg2, border: `1px solid ${PAL.border}`, borderRadius: 16, padding: 22, minHeight: 420, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: "0.72rem", color: PAL.txt3, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: brief ? "#22D3EE" : PAL.txt3 }} />
                {t.briefTitle}
              </h2>
              {model && <span style={{ fontSize: 10, color: PAL.txt3, fontFamily: "monospace" }}>{t.poweredBy} {model}</span>}
            </div>

            {!brief ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: PAL.txt3, fontSize: 14, textAlign: "center", padding: 30 }}>
                {t.emptyHint}
              </div>
            ) : (
              <div className="wk-md" style={{ color: PAL.txt1, fontSize: 14, lineHeight: 1.7, flex: 1 }} dangerouslySetInnerHTML={{ __html: renderMarkdown(brief) }} />
            )}

            {brief && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18, paddingTop: 18, borderTop: `1px solid ${PAL.border}` }}>
                <button className="wk-btn-ghost" onClick={() => showToast(t.rejectMock)}>🚫 {t.rejectMes}</button>
                <button className="wk-btn-ghost" onClick={() => showToast(t.slackMock)}>💬 {t.alertSlack}</button>
                <button className="wk-btn-ghost" onClick={() => showToast(t.auditMock)}>🗄️ {t.saveAudit}</button>
              </div>
            )}
            {staticMode && <div style={{ marginTop: 14, color: PAL.txt3, fontSize: 12, fontStyle: "italic" }}>{t.fallback}</div>}
          </section>
        </div>
      </main>

      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: PAL.surface, border: `1px solid ${PAL.accentBorder}`, borderRadius: 12, padding: "12px 20px", color: PAL.txt1, fontSize: 13, fontWeight: 600, zIndex: 50, backdropFilter: "blur(20px)", boxShadow: "0 8px 28px rgba(0,0,0,0.4)" }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
}

function renderMarkdown(md: string): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const blocks: string[] = [];
  let listBuf: string[] = [];
  const flushList = () => {
    if (listBuf.length) {
      blocks.push("<ul>" + listBuf.map((l) => `<li>${l}</li>`).join("") + "</ul>");
      listBuf = [];
    }
  };
  for (const raw of md.split("\n")) {
    const line = raw.trim();
    if (!line) { flushList(); continue; }
    if (line.startsWith("- ")) {
      listBuf.push(esc(line.slice(2)).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"));
    } else if (line.startsWith("**") && line.endsWith("**")) {
      flushList();
      blocks.push(`<strong>${esc(line.slice(2, -2))}</strong>`);
    } else {
      flushList();
      blocks.push(`<p>${esc(line).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</p>`);
    }
  }
  flushList();
  return blocks.join("");
}

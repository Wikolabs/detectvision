"use client";
import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — Each LP customizes only this block
// ─────────────────────────────────────────────────────────────────────────────
const P = {
  name: "DetectVision",
  waPhone: "261386626100",
  palette: {
    mode: "dark" as "dark" | "light",
    bg: "#06151E",
    bg2: "#0C2230",
    surface: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.09)",
    txt1: "#E0F4FB",
    txt2: "#82A6B6",
    txt3: "#4E6878",
    accent: "#06B6D4",
    accentSoft: "rgba(6,182,212,0.12)",
    accentBorder: "rgba(6,182,212,0.30)",
    accentGlow: "rgba(6,182,212,0.18)",
    navBg: "rgba(6,21,30,0.82)",
  },
  content: {
    fr: {
      langLabel: "FR",
      tagLabel: "Vision par ordinateur · Temps reel · 24h/24",
      taglines: ["Votre camera voit.", "Notre IA comprend.", "L'alerte part avant l'incident."],
      taglineAccentIdx: 1,
      desc: "DetectVision analyse votre flux video en temps reel — detection d'objets, EPI manquants, intrusions en zone interdite — et envoie une alerte instantanee avant que l'incident ne survienne.",
      navLinks: [
        { label: "Fonctionnalites", href: "#features" },
        { label: "Comment ca marche", href: "#process" },
        { label: "Pourquoi maintenant", href: "#why" },
        { label: "Contact", href: "#cta" },
      ],
      metrics: [
        { value: "99.2%", label: "precision detection" },
        { value: "<50ms", label: "latence analyse" },
        { value: "24/7", label: "surveillance active" },
        { value: "100%", label: "compatible cameras IP" },
      ],
      features: [
        { icon: "🎯", title: "Modeles YOLO custom", desc: "Fine-tuning sur vos donnees specifiques : produits, EPI, defauts qualite, visages masques — precision superieure a 97% des 500 images d'entrainement." },
        { icon: "⚡", title: "API temps reel", desc: "Flux RTSP/HLS ou images base64. Reponse en moins de 50ms. SDKs Python et Node disponibles. Deploiement on-premise ou cloud selon vos contraintes RGPD." },
        { icon: "🔔", title: "Alertes webhook instantanees", desc: "Notification immediate sur Slack, Teams, email ou votre SCADA des qu'un evenement est detecte. Historique complet et exports pour audits de conformite." },
      ],
      steps: [
        { num: "01", title: "Connectez vos cameras", desc: "Toutes cameras IP compatibles via flux RTSP ou HLS. Detection automatique du reseau, configuration en quelques minutes sans competence reseau avancee." },
        { num: "02", title: "Definissez vos zones et regles", desc: "Dessinez les zones de surveillance sur l'interface visuelle. Configurez les objets a detecter, les seuils d'alerte et les destinataires des notifications." },
        { num: "03", title: "L'IA surveille, vous etes alertes", desc: "DetectVision analyse chaque frame en continu. Des qu'un evenement match vos regles, l'alerte part en moins d'une seconde sur vos canaux configures." },
      ],
      persuasion: {
        sectionTag: "Pourquoi maintenant",
        title: "Vos cameras filment tout. Personne ne regarde rien.",
        paragraphs: [
          { type: "pathos", text: "Dimanche 4h12 du matin, dans votre entrepot logistique de 12 000 metres carres. Un cariste percute une palette mal rangee, le rack s'effondre partiellement sur 15 metres. Personne ne le voit en direct. Vos 28 cameras IP ont tout filme — comme elles filment tout depuis trois ans — mais leur seul role est d'etre regardees apres coup, par l'expert d'assurance, dans les 72h qui suivront. Lundi matin votre directeur HSE va decouvrir l'incident, lancer une enquete interne, et vous expliquer doucement que le cariste avait deja signale ce probleme dans le registre il y a six semaines. La camera l'a filme. Personne n'a rien vu." },
          { type: "logos", text: "L'INRS estime que 18% des accidents du travail graves en France auraient pu etre evites par une detection comportementale precoce — port d'EPI, intrusion en zone interdite, postures dangereuses. McKinsey mesure que la vision par ordinateur en industrie reduit les incidents de securite de 30% a 50% selon le secteur, avec un ROI moyen de 8 mois. Gartner predit que d'ici 2027, 60% des entrepots logistiques de plus de 5000m2 seront equipes de detection IA temps reel — la maturite des modeles YOLO custom a rendu le sujet abordable pour les PME industrielles." },
          { type: "ethos", text: "Wikolabs construit des agents IA en production depuis 2023 pour des scale-ups B2B, family offices et fintechs reglementees. Nous avons brule nos doigts sur les memes problemes que vous : pipelines qui hallucinent, briefs ignores, dashboards desertes. DetectVision est ce que nous avons construit pour nos propres clients exigeants avant de le proposer au marche." },
          { type: "solution", text: "Concretement : vous connectez vos cameras IP existantes via RTSP ou HLS — aucun materiel a remplacer. Vous dessinez les zones de surveillance et configurez les regles en interface visuelle. Un modele YOLO custom fine-tune sur vos donnees specifiques analyse chaque frame en moins de 50ms et envoie l'alerte sur Slack, Teams ou votre SCADA des qu'un evenement matche. 99.2% de precision, deploiement on-premise ou cloud selon vos contraintes RGPD. L'incident est detecte avant qu'il ne devienne accident." },
        ],
      },
      ctaTitle: "Votre infrastructure sous surveillance intelligente",
      ctaDesc: "Compatible toutes cameras IP. Deploiement on-premise ou cloud. RGPD ready. Premiers resultats en moins d'une journee.",
      ctaPrimary: "Reserver un appel",
      ctaWhatsApp: "WhatsApp",
      ctaDemo: "Demander une demo",
      ctaSoonBadge: "Bientot",
      footerTagline: "Vision par ordinateur et detection d'objets IA en temps reel",
    },
    en: {
      langLabel: "EN",
      tagLabel: "Computer vision · Real-time · 24/7",
      taglines: ["Your camera sees.", "Our AI understands.", "The alert fires before the incident."],
      taglineAccentIdx: 1,
      desc: "DetectVision analyzes your video feed in real time — object detection, missing PPE, intrusions in restricted zones — and sends an instant alert before the incident happens.",
      navLinks: [
        { label: "Features", href: "#features" },
        { label: "How it works", href: "#process" },
        { label: "Why now", href: "#why" },
        { label: "Contact", href: "#cta" },
      ],
      metrics: [
        { value: "99.2%", label: "detection accuracy" },
        { value: "<50ms", label: "analysis latency" },
        { value: "24/7", label: "active monitoring" },
        { value: "100%", label: "IP-camera compatible" },
      ],
      features: [
        { icon: "🎯", title: "Custom YOLO models", desc: "Fine-tuned on your specific data: products, PPE, quality defects, masked faces — precision above 97% from 500 training images." },
        { icon: "⚡", title: "Real-time API", desc: "RTSP/HLS streams or base64 images. Response in under 50ms. Python and Node SDKs available. On-premise or cloud deployment depending on your GDPR constraints." },
        { icon: "🔔", title: "Instant webhook alerts", desc: "Immediate notification on Slack, Teams, email or your SCADA as soon as an event is detected. Full history and exports for compliance audits." },
      ],
      steps: [
        { num: "01", title: "Connect your cameras", desc: "All IP cameras supported via RTSP or HLS streams. Automatic network detection, setup in minutes without advanced network skills." },
        { num: "02", title: "Define your zones and rules", desc: "Draw monitoring zones on the visual interface. Configure detected objects, alert thresholds and notification recipients." },
        { num: "03", title: "AI watches, you get alerted", desc: "DetectVision analyzes every frame continuously. As soon as an event matches your rules, the alert fires in under a second on your configured channels." },
      ],
      persuasion: {
        sectionTag: "Why now",
        title: "Your cameras film everything. Nobody watches anything.",
        paragraphs: [
          { type: "pathos", text: "Sunday 4:12am, inside your 12,000 square meter logistics warehouse. A forklift driver hits a poorly stacked pallet, the rack partially collapses across 15 meters. Nobody sees it live. Your 28 IP cameras filmed everything — as they have for three years — but their only role is to be watched after the fact, by the insurance expert, within 72 hours. Monday morning your HSE director will discover the incident, launch an internal inquiry, and gently explain that the forklift driver had already flagged that exact issue in the log six weeks ago. The camera filmed it. Nobody saw a thing." },
          { type: "logos", text: "France's INRS estimates 18% of serious workplace accidents could have been prevented by early behavioral detection — PPE compliance, restricted-zone intrusion, dangerous postures. McKinsey measured that computer vision in industry cuts safety incidents 30% to 50% depending on the sector, with an 8-month average ROI. Gartner predicts that by 2027, 60% of logistics warehouses over 5,000m2 will run real-time AI detection — custom YOLO model maturity has made this affordable for industrial SMBs." },
          { type: "ethos", text: "Wikolabs has been building production AI agents since 2023 for B2B scale-ups, family offices and regulated fintechs. We burned our fingers on the same problems you face: hallucinating pipelines, ignored briefs, abandoned dashboards. DetectVision is what we built for our own demanding customers before bringing it to market." },
          { type: "solution", text: "Concretely: you connect your existing IP cameras via RTSP or HLS — no hardware to replace. You draw monitoring zones and configure rules through the visual interface. A custom YOLO model fine-tuned on your specific data analyzes every frame in under 50ms and fires the alert to Slack, Teams or your SCADA as soon as an event matches. 99.2% accuracy, on-premise or cloud deployment to fit your GDPR constraints. The incident is caught before it becomes an accident." },
        ],
      },
      ctaTitle: "Your infrastructure under smart surveillance",
      ctaDesc: "Works with any IP camera. On-premise or cloud deployment. GDPR ready. First results in under a day.",
      ctaPrimary: "Book a call",
      ctaWhatsApp: "WhatsApp",
      ctaDemo: "Request a demo",
      ctaSoonBadge: "Soon",
      footerTagline: "Real-time computer vision and AI object detection",
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT — identical for all LPs
// ─────────────────────────────────────────────────────────────────────────────
export default function Page() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const t = P.content[lang];
  const pal = P.palette;
  const isDark = pal.mode === "dark";
  const cardOverlayHover = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)";

  const waLink = `https://wa.me/${P.waPhone}?text=${encodeURIComponent(
    lang === "fr"
      ? `Bonjour, je souhaite discuter de ${P.name} avec Wikolabs.`
      : `Hello, I'd like to discuss ${P.name} with Wikolabs.`
  )}`;

  return (
    <div style={{ minHeight: "100vh", background: pal.bg, color: pal.txt1 }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseDot { 0%,100%{ opacity:1; transform:scale(1); } 50%{ opacity:.4; transform:scale(1.6); } }
        .wk-card { transition: background .3s, border-color .3s, transform .35s cubic-bezier(.34,1.2,.64,1); }
        .wk-card:hover { background: ${cardOverlayHover} !important; border-color: ${pal.accentBorder} !important; transform: translateY(-6px); }
        .wk-btn { transition: opacity .2s, transform .2s, box-shadow .2s; }
        .wk-btn:hover { opacity:.92; transform:translateY(-2px); box-shadow:0 12px 32px ${pal.accentGlow}; }
        .wk-btn-wa { transition: opacity .2s, transform .2s; }
        .wk-btn-wa:hover { opacity:.92; transform:translateY(-2px); }
        .wk-btn-demo { cursor: not-allowed; opacity:.55; }
        .wk-btn-demo:hover { transform:none; box-shadow:none; }
        .wk-nav-link { color:${pal.txt2}; text-decoration:none; font-size:14px; font-weight:500; transition:color .2s; }
        .wk-nav-link:hover { color:${pal.txt1}; }
        .wk-lang { display:inline-flex; border:1px solid ${pal.border}; border-radius:100px; padding:2px; background:${pal.surface}; }
        .wk-lang button { background:transparent; border:none; padding:4px 12px; font-size:11px; font-weight:700; letter-spacing:.5px; cursor:pointer; border-radius:100px; color:${pal.txt2}; transition: background .2s, color .2s; font-family:inherit; }
        .wk-lang button.active { background:${pal.accent}; color:${isDark ? "#04080F" : "#FFFFFF"}; }
        @media(max-width:768px){
          .wk-hide-sm{ display:none!important; }
          .wk-hero-title{ font-size:2.4rem!important; }
          .wk-section{ padding-left:20px!important; padding-right:20px!important; }
          .wk-cards-grid{ grid-template-columns: 1fr !important; max-width:380px; margin-left:auto; margin-right:auto; }
          .wk-metrics-row{ justify-content:center; }
          .wk-cta-row{ flex-direction:column; align-items:stretch; max-width:340px; margin-left:auto; margin-right:auto; }
          .wk-cta-row > *{ width:100%; justify-content:center; }
          .wk-persuasion{ padding:60px 20px!important; }
          .wk-foot{ flex-direction:column; gap:12px; text-align:center; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="wk-section" style={{ position:"sticky", top:0, zIndex:100, background:pal.navBg, backdropFilter:"blur(20px)", borderBottom:`1px solid ${pal.border}`, padding:"0 40px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:18, fontWeight:800, letterSpacing:"-0.5px", color:pal.txt1 }}>
          {P.name}<span style={{ color:pal.accent }}>.</span>
        </span>
        <div style={{ display:"flex", gap:24, alignItems:"center" }}>
          <div className="wk-hide-sm" style={{ display:"flex", gap:22 }}>
            {t.navLinks.map(l => <a key={l.label} href={l.href} className="wk-nav-link">{l.label}</a>)}
          </div>
          <div className="wk-lang" role="group" aria-label="language">
            <button type="button" className={lang==="fr"?"active":""} onClick={()=>setLang("fr")}>FR</button>
            <button type="button" className={lang==="en"?"active":""} onClick={()=>setLang("en")}>EN</button>
          </div>
          <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' className="wk-btn"
            style={{ background:pal.accent, color:isDark?"#04080F":"#FFFFFF", border:"none", borderRadius:8, padding:"9px 18px", fontWeight:700, fontSize:13.5, cursor:"pointer", fontFamily:"inherit" }}>
            {t.ctaPrimary} →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="wk-section" style={{ padding:"100px 40px 80px", maxWidth:1040, margin:"0 auto", textAlign:"center", position:"relative" }}>
        <div style={{ position:"absolute", top:-60, left:"50%", transform:"translateX(-50%)", width:720, height:600, background:`radial-gradient(ellipse at 50% 30%, ${pal.accentGlow} 0%, transparent 60%)`, pointerEvents:"none" }} />
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:24, background:pal.accentSoft, border:`1px solid ${pal.accentBorder}`, borderRadius:100, padding:"6px 18px", animation:"fadeUp .5s ease both" }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:pal.accent, display:"inline-block", animation:"pulseDot 2s ease-in-out infinite" }} />
          <span style={{ color:pal.accent, fontSize:11.5, fontWeight:700, letterSpacing:"2px", textTransform:"uppercase" }}>{t.tagLabel}</span>
        </div>
        <h1 className="wk-hero-title" style={{ fontSize:"clamp(2.6rem,6vw,5rem)", fontWeight:700, lineHeight:1.08, letterSpacing:"-0.03em", marginBottom:28, fontFamily:"'Instrument Serif',Georgia,serif", animation:"fadeUp .5s .08s ease both" }}>
          {t.taglines.map((line, i) => (
            <span key={i} style={{ display:"block", color:i===t.taglineAccentIdx?pal.accent:pal.txt1, fontStyle:i===t.taglineAccentIdx?"italic":"normal" }}>{line}</span>
          ))}
        </h1>
        <p style={{ fontSize:"1.1rem", color:pal.txt2, lineHeight:1.72, maxWidth:600, margin:"0 auto 44px", animation:"fadeUp .5s .16s ease both" }}>{t.desc}</p>
        <div className="wk-metrics-row" style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:14, marginBottom:44, animation:"fadeUp .5s .24s ease both" }}>
          {t.metrics.map(m => (
            <div key={m.label} style={{ background:pal.surface, border:`1px solid ${pal.border}`, borderRadius:18, padding:"14px 22px", textAlign:"center", minWidth:118 }}>
              <div style={{ fontSize:"1.7rem", fontWeight:800, color:pal.txt1, letterSpacing:"-1.5px", lineHeight:1 }}>{m.value}</div>
              <div style={{ fontSize:"0.62rem", color:pal.txt3, textTransform:"uppercase", letterSpacing:"1.5px", marginTop:5 }}>{m.label}</div>
            </div>
          ))}
        </div>
        <CtaRow t={t} pal={pal} isDark={isDark} waLink={waLink} />
      </section>

      {/* FEATURES */}
      <section id="features" className="wk-section" style={{ padding:"80px 40px", maxWidth:1100, margin:"0 auto" }}>
        <SectionHead pal={pal} tag={lang==="fr"?"Fonctionnalites":"Features"} title={lang==="fr"?"Tout automatise, <em>rien a gerer</em>":"Fully automated, <em>nothing to manage</em>"} />
        <div className="wk-cards-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
          {t.features.map((f, i) => (
            <div key={f.title} className="wk-card" style={{ background:pal.surface, border:`1px solid ${pal.border}`, borderRadius:20, padding:"28px 28px 26px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${pal.accent},transparent)`, opacity:.55 }} />
              <div style={{ fontSize:"2rem", marginBottom:16 }}>{f.icon}</div>
              <h3 style={{ fontSize:"1.05rem", fontWeight:700, color:pal.txt1, marginBottom:10 }}>{f.title}</h3>
              <p style={{ fontSize:"0.88rem", color:pal.txt2, lineHeight:1.7, margin:0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="process" className="wk-section" style={{ padding:"80px 40px", background:pal.bg2 }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <SectionHead pal={pal} tag={lang==="fr"?"Comment ca marche":"How it works"} title={lang==="fr"?"En place en <em>10 minutes</em>":"Live in <em>10 minutes</em>"} />
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {t.steps.map((s, i) => (
              <div key={s.num} style={{ display:"flex", alignItems:"flex-start", gap:22, background:pal.surface, border:`1px solid ${pal.border}`, borderRadius:18, padding:"22px 26px" }}>
                <div style={{ flexShrink:0, width:46, height:46, background:pal.accentSoft, border:`1px solid ${pal.accentBorder}`, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", color:pal.accent, fontWeight:800, fontSize:15 }}>
                  {s.num}
                </div>
                <div>
                  <h3 style={{ fontSize:"1rem", fontWeight:700, color:pal.txt1, marginBottom:6, lineHeight:1.3 }}>{s.title}</h3>
                  <p style={{ fontSize:"0.87rem", color:pal.txt2, lineHeight:1.7, margin:0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERSUASION — pathos / logos / ethos / solution */}
      <section id="why" className="wk-persuasion wk-section" style={{ padding:"100px 40px", maxWidth:860, margin:"0 auto" }}>
        <SectionHead pal={pal} tag={t.persuasion.sectionTag} title={t.persuasion.title} />
        <div style={{ display:"flex", flexDirection:"column", gap:22 }}>
          {t.persuasion.paragraphs.map((p, i) => {
            const labelMap: Record<string, { fr: string; en: string }> = {
              pathos:   { fr: "L'enjeu humain",  en: "What's at stake" },
              logos:    { fr: "Les faits",       en: "The facts" },
              ethos:    { fr: "Notre legitimite", en: "Our credibility" },
              solution: { fr: "Notre reponse",   en: "Our answer" },
            };
            const label = labelMap[p.type]?.[lang] ?? "";
            return (
              <div key={i} style={{ borderLeft:`2px solid ${pal.accentBorder}`, paddingLeft:22 }}>
                <div style={{ fontSize:"0.62rem", fontWeight:700, letterSpacing:"2.5px", textTransform:"uppercase", color:pal.accent, marginBottom:10 }}>{label}</div>
                <p style={{ fontSize:"1.02rem", color:pal.txt2, lineHeight:1.85, margin:0 }}>{p.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="wk-section" style={{ padding:"0 40px 100px", maxWidth:860, margin:"0 auto" }}>
        <div style={{ background:pal.surface, border:`1px solid ${pal.accentBorder}`, borderRadius:24, padding:"64px 48px", textAlign:"center", backgroundImage:`radial-gradient(ellipse at 50% 0%, ${pal.accentSoft} 0%, transparent 65%)` }}>
          <p style={{ fontSize:"0.68rem", color:pal.accent, letterSpacing:"3px", textTransform:"uppercase", fontWeight:700, marginBottom:16 }}>{lang==="fr"?"Demarrer":"Get started"}</p>
          <h2 style={{ fontSize:"clamp(1.8rem,3.5vw,2.8rem)", fontWeight:700, color:pal.txt1, marginBottom:14, letterSpacing:"-0.02em", fontFamily:"'Instrument Serif',Georgia,serif" }}>{t.ctaTitle}</h2>
          <p style={{ color:pal.txt2, fontSize:"1rem", marginBottom:36, lineHeight:1.7, maxWidth:540, margin:"0 auto 36px" }}>{t.ctaDesc}</p>
          <CtaRow t={t} pal={pal} isDark={isDark} waLink={waLink} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="wk-section" style={{ borderTop:`1px solid ${pal.border}`, padding:"32px 40px" }}>
        <div className="wk-foot" style={{ maxWidth:1200, margin:"0 auto", display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center", gap:16 }}>
          <div>
            <span style={{ fontWeight:800, fontSize:16, color:pal.txt1 }}>{P.name}</span><span style={{ color:pal.accent }}>.</span>
            <span style={{ display:"block", fontSize:12, color:pal.txt3, marginTop:3 }}>{t.footerTagline}</span>
          </div>
          <p style={{ fontSize:13, color:pal.txt3, margin:0 }}>© 2026 {P.name} — {lang==="fr"?"Un produit":"A product by"} <a href="https://wikolabs.com" style={{ color:pal.txt2, textDecoration:"none" }}>Wikolabs</a></p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:16, fontSize:13, alignItems:"center" }}>
            <a href="mailto:team@wikolabs.com" style={{ color:pal.txt3, textDecoration:"none" }}>team@wikolabs.com</a>
            <span style={{ color:pal.txt3 }}>·</span>
            <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' style={{ background:"none", border:"none", color:pal.txt3, fontSize:13, cursor:"pointer", fontFamily:"inherit", padding:0 }}>{t.ctaPrimary}</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function SectionHead({ pal, tag, title }: { pal: typeof P.palette; tag: string; title: string }) {
  return (
    <div style={{ textAlign:"center", marginBottom:52 }}>
      <p style={{ fontSize:"0.68rem", color:pal.accent, letterSpacing:"3px", textTransform:"uppercase", fontWeight:700, marginBottom:14 }}>{tag}</p>
      <h2
        style={{ fontSize:"clamp(1.8rem,3.5vw,2.8rem)", fontWeight:700, color:pal.txt1, letterSpacing:"-0.02em", fontFamily:"'Instrument Serif',Georgia,serif", lineHeight:1.15, margin:0 }}
        dangerouslySetInnerHTML={{ __html: title.replace(/<em>/g, `<em style="font-style:italic;color:${pal.accent}">`) }}
      />
    </div>
  );
}

function CtaRow({ t, pal, isDark, waLink }: { t: typeof P.content.fr; pal: typeof P.palette; isDark: boolean; waLink: string }) {
  return (
    <div className="wk-cta-row" style={{ display:"flex", flexWrap:"wrap", gap:12, justifyContent:"center", animation:"fadeUp .5s .32s ease both" }}>
      <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' className="wk-btn"
        style={{ background:pal.accent, color:isDark?"#04080F":"#FFFFFF", border:"none", borderRadius:10, padding:"14px 28px", fontWeight:700, fontSize:15, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8, fontFamily:"inherit" }}>
        📅 {t.ctaPrimary}
      </button>
      <a href={waLink} target="_blank" rel="noopener noreferrer" className="wk-btn-wa"
        style={{ background:"#25d366", color:"#FFFFFF", borderRadius:10, padding:"14px 28px", fontWeight:700, fontSize:15, textDecoration:"none", display:"inline-flex", alignItems:"center", gap:8 }}>
        💬 {t.ctaWhatsApp}
      </a>
      <button type="button" disabled className="wk-btn-demo" aria-disabled="true"
        style={{ background:"transparent", color:pal.txt2, border:`1px solid ${pal.border}`, borderRadius:10, padding:"14px 28px", fontWeight:700, fontSize:15, display:"inline-flex", alignItems:"center", gap:10, fontFamily:"inherit", position:"relative" }}>
        ✨ {t.ctaDemo}
        <span style={{ fontSize:9, fontWeight:800, letterSpacing:1, padding:"2px 7px", borderRadius:100, border:`1px solid ${pal.accentBorder}`, color:pal.accent, background:pal.accentSoft, textTransform:"uppercase" }}>{t.ctaSoonBadge}</span>
      </button>
    </div>
  );
}

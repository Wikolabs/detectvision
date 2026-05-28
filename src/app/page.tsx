export default function DetectVisionPage() {
  const boxes = [
    { label: "Casque", status: "ok", color: "#16a34a", top: "18%", left: "12%", width: "22%", height: "18%" },
    { label: "Gilet MANQUANT", status: "warn", color: "#dc2626", top: "40%", left: "10%", width: "26%", height: "22%" },
    { label: "Zone interdite", status: "danger", color: "#d97706", top: "55%", left: "60%", width: "30%", height: "28%" },
    { label: "Opérateur détecté", status: "ok", color: "#16a34a", top: "20%", left: "52%", width: "20%", height: "42%" },
  ];

  return (
    <main style={{ fontFamily: "var(--font-body)", color: "#0f172a" }}>
      {/* Nav */}
      <nav style={{ background: "#1e3a8a", padding: "0 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <span style={{ fontFamily: "var(--font-display)", color: "#bfdbfe", fontSize: "1.2rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            DetectVision
          </span>
          <a
            href="https://calendly.com/wikolabs" target="_blank" rel="noopener noreferrer"
            style={{ background: "#3b82f6", color: "#fff", padding: "0.45rem 1.2rem", borderRadius: 4, fontWeight: 600, fontSize: "0.875rem", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.05em" }}
          >
            Démo
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2rem 2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#dbeafe", color: "#1e3a8a", fontSize: "0.7rem", fontWeight: 700, padding: "0.3rem 0.8rem", borderRadius: 3, marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3b82f6", display: "inline-block", animation: "pulse 1.5s infinite" }} />
            Vision temps réel
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3.5vw, 2.9rem)", lineHeight: 1.15, marginBottom: "1.25rem", color: "#1e3a8a", fontWeight: 800 }}>
            Votre caméra voit.<br />Notre IA comprend.
          </h1>
          <p style={{ fontSize: "1rem", color: "#475569", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 460 }}>
            Détection d'objets, EPI manquants, intrusions en zone interdite — DetectVision analyse votre flux vidéo en temps réel et alerte avant l'incident.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a
              href="https://calendly.com/wikolabs"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-block", background: "#1e3a8a", color: "#fff", padding: "0.75rem 1.75rem", borderRadius: 4, fontWeight: 700, fontSize: "0.95rem", textDecoration: "none" }}
            >
              📅 Réserver un créneau →
            </a>
            <a
              href="https://wa.me/261386626100?text=Bonjour%2C%20je%20souhaite%20discuter%20de%20DetectVision%20avec%20Wikolabs."
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-block", background: "#25d366", color: "#fff", padding: "0.75rem 1.75rem", borderRadius: 4, fontWeight: 700, fontSize: "0.95rem", textDecoration: "none" }}
            >
              💬 WhatsApp →
            </a>
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
              {[["99.2%", "précision"], ["<50ms", "latence"], ["24/7", "actif"]].map(([v, l]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#1e3a8a", fontSize: "1.1rem" }}>{v}</div>
                  <div style={{ fontSize: "0.65rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Camera feed mockup */}
        <div style={{ position: "relative", background: "#1e293b", borderRadius: 8, aspectRatio: "16/10", overflow: "hidden", border: "2px solid #1e3a8a", boxShadow: "0 0 0 1px #3b82f6, 0 8px 40px rgba(30,58,138,0.25)" }}>
          {/* Scanlines overlay */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)", zIndex: 2, pointerEvents: "none" }} />
          {/* Background scene */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #1e293b 0%, #0f172a 100%)" }}>
            {/* Floor grid */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }} viewBox="0 0 400 250" preserveAspectRatio="none">
              {[0,50,100,150,200,250,300,350,400].map(x => <line key={x} x1={x} y1="0" x2={x} y2="250" stroke="#3b82f6" strokeWidth="0.5"/>)}
              {[0,50,100,150,200,250].map(y => <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#3b82f6" strokeWidth="0.5"/>)}
            </svg>
          </div>
          {/* Bounding boxes */}
          {boxes.map((b) => (
            <div key={b.label} style={{ position: "absolute", top: b.top, left: b.left, width: b.width, height: b.height, border: `2px solid ${b.color}`, zIndex: 3, boxShadow: `0 0 8px ${b.color}60` }}>
              <div style={{ position: "absolute", top: -22, left: -1, background: b.color, color: "#fff", fontSize: "0.6rem", fontWeight: 700, padding: "2px 6px", whiteSpace: "nowrap", letterSpacing: "0.04em" }}>
                {b.label}
              </div>
            </div>
          ))}
          {/* HUD elements */}
          <div style={{ position: "absolute", top: 8, left: 8, zIndex: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "rgba(0,0,0,0.6)", padding: "3px 8px", borderRadius: 3 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
              <span style={{ color: "#fff", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em" }}>REC LIVE</span>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: 8, right: 8, zIndex: 4, color: "#64748b", fontSize: "0.6rem", fontFamily: "monospace" }}>
            CAM-03 | 1080p | 28fps
          </div>
          <div style={{ position: "absolute", bottom: 8, left: 8, zIndex: 4 }}>
            <span style={{ background: "#dc262640", border: "1px solid #dc2626", color: "#fca5a5", fontSize: "0.6rem", fontWeight: 700, padding: "2px 7px", borderRadius: 3 }}>
              ⚠ 1 ALERTE ACTIVE
            </span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ background: "#dbeafe", padding: "4rem 2rem", marginTop: "3rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800, color: "#1e3a8a", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2.5rem" }}>
            Stack technique
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "1.25rem" }}>
            {[
              { icon: "🎯", title: "Modèles YOLO custom", desc: "Fine-tuning sur vos données : produits, EPI, défauts qualité — précision supérieure à 97% dès 500 images." },
              { icon: "⚡", title: "API temps réel", desc: "Flux RTSP/HLS ou images base64. Réponse en moins de 50ms. SDKs Python et Node disponibles." },
              { icon: "🔔", title: "Alertes webhook", desc: "Notification instantanée sur Slack, Teams, email ou votre SCADA dès qu'un événement est détecté." },
            ].map((f) => (
              <div key={f.title} style={{ background: "#fff", border: "1px solid #93c5fd", borderRadius: 6, padding: "1.5rem", borderTop: "3px solid #1e3a8a" }}>
                <div style={{ fontSize: "1.6rem", marginBottom: "0.75rem" }}>{f.icon}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "#1e3a8a", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.5rem" }}>{f.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#1e3a8a", padding: "4rem 2rem", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.9rem", fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
          Branchez DetectVision sur votre infrastructure
        </h2>
        <p style={{ color: "#93c5fd", marginBottom: "2rem" }}>Compatible toutes caméras IP. Déploiement on-premise ou cloud. RGPD ready.</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="https://calendly.com/wikolabs"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block", background: "#3b82f6", color: "#fff", padding: "0.9rem 2.5rem", borderRadius: 4, fontWeight: 700, fontSize: "1rem", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.06em" }}
          >
            📅 Réserver un créneau →
          </a>
          <a
            href="https://wa.me/261386626100?text=Bonjour%2C%20je%20souhaite%20discuter%20de%20DetectVision%20avec%20Wikolabs."
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block", background: "#25d366", color: "#fff", padding: "0.9rem 2.5rem", borderRadius: 4, fontWeight: 700, fontSize: "1rem", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.06em" }}
          >
            💬 WhatsApp →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#0f172a", padding: "1.25rem 2rem", textAlign: "center" }}>
        <p style={{ color: "#475569", fontSize: "0.8rem", margin: 0 }}>© 2025 DetectVision — Un produit Wikolabs</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem", marginTop: "0.5rem", fontSize: "0.8rem" }}>
          <a href="mailto:team@wikolabs.com" style={{ textDecoration: "none", color: "inherit" }}>team@wikolabs.com</a>
          <span>·</span>
          <a href="tel:+261386626100" style={{ textDecoration: "none", color: "inherit" }}>+261 38 66 261 00</a>
          <span>·</span>
          <a href="https://calendly.com/wikolabs" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>Prendre RDV</a>
        </div>
      </footer>
    </main>
  );
}

import { useState, useEffect } from "react";
import {
  Anchor, Package, Globe, Shield, Zap, Handshake,
  MapPin, Mail, Phone, ChevronDown, Menu, X,
  ArrowRight, Container, Truck
} from "lucide-react";

const NAV_LINKS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicios", href: "#servicios" },
  { label: "Capacidad", href: "#capacidad" },
  { label: "Contacto", href: "#contacto" },
];

const SERVICES = [
  {
    icon: Container,
    title: "Carga Contenerizada",
    subtitle: "FCL / LCL",
    desc: "Gestión integral de contenedores de carga completa y consolidada. Coordinamos el proceso completo desde el origen hasta el destino final.",
    tags: ["FCL", "LCL", "Importación", "Exportación"],
  },
  {
    icon: Package,
    title: "Carga en General",
    subtitle: "Equipos, materiales y más",
    desc: "Soluciones para mercancía suelta, equipos industriales, materiales de construcción y carga de proyecto con atención personalizada.",
    tags: ["Equipos", "Materiales", "Suelta", "Proyecto"],
  },
];

const FLEET = [
  { label: "Cajas Secas", detail: "48 y 53 pies", icon: Container },
  { label: "Plataformas", detail: "Para carga especial", icon: Truck },
  { label: "Camiones Torton", detail: "Distribución nacional", icon: Truck },
  { label: "Unidades 3.5 Ton", detail: "Última milla", icon: Package },
];

const VALUES = [
  { icon: Globe, title: "Cobertura", desc: "Local y foránea" },
  { icon: Shield, title: "Confianza", desc: "Seguridad en cada envío" },
  { icon: Zap, title: "Eficiencia", desc: "Soluciones ágiles y efectivas" },
  { icon: Handshake, title: "Compromiso", desc: "Servicio confiable y personalizado" },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "",
    cargoType: "", route: "", message: ""
  });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  const response = await fetch("https://formspree.io/f/mwvjnvzy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  if (response.ok) setSent(true);
};

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff", color: "#0F172A" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(15,23,42,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "background 0.3s, backdrop-filter 0.3s",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
        padding: "0 5%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 68,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Anchor size={24} color="#D97706" strokeWidth={2.5} />
          <span style={{ fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: "-0.3px" }}>
            SHIRES <span style={{ color: "#D97706" }}>LOGISTIC</span>
          </span>
        </div>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 32, ["@media(max-width:768px)"]: { display: "none" } }} className="desktop-nav">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} style={{
              color: "rgba(255,255,255,0.75)", fontSize: 14, fontWeight: 500,
              textDecoration: "none", transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = "#fff"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.75)"}
            >{l.label}</a>
          ))}
          <a href="#contacto" style={{
            background: "#D97706", color: "#fff", padding: "9px 20px",
            borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none",
            transition: "background 0.2s",
          }}
            onMouseEnter={e => e.target.style.background = "#B45309"}
            onMouseLeave={e => e.target.style.background = "#D97706"}
          >Cotizar ahora</a>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          display: "none", background: "none", border: "none", cursor: "pointer",
          color: "#fff", padding: 4,
        }} className="mobile-menu-btn">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: 68, left: 0, right: 0, zIndex: 99,
          background: "#0F172A", padding: "1.5rem 5%",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}>
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block", color: "rgba(255,255,255,0.8)", fontSize: 16,
                padding: "12px 0", textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}
            >{l.label}</a>
          ))}
          <a href="#contacto" onClick={() => setMenuOpen(false)} style={{
            display: "block", marginTop: 16, background: "#D97706",
            color: "#fff", padding: "12px 0", borderRadius: 8,
            textAlign: "center", fontWeight: 600, textDecoration: "none",
          }}>Cotizar ahora</a>
        </div>
      )}

      {/* HERO */}
      <section id="inicio" style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 60%, #0F172A 100%)",
        display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden",
        padding: "100px 5% 60px",
      }}>
        {/* Decorative port silhouette */}
        <div style={{
          position: "absolute", bottom: 0, right: 0, left: 0,
          height: 200, opacity: 0.06,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 200'%3E%3Crect x='0' y='100' width='1200' height='100' fill='white'/%3E%3Crect x='100' y='60' width='20' height='40' fill='white'/%3E%3Crect x='200' y='40' width='30' height='60' fill='white'/%3E%3Crect x='400' y='50' width='25' height='50' fill='white'/%3E%3Crect x='600' y='30' width='40' height='70' fill='white'/%3E%3Crect x='800' y='45' width='20' height='55' fill='white'/%3E%3Crect x='1000' y='55' width='30' height='45' fill='white'/%3E%3C/svg%3E")`,
          backgroundSize: "cover",
        }} />

        {/* Grid lines */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div style={{ maxWidth: 680, position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(217,119,6,0.15)", border: "1px solid rgba(217,119,6,0.3)",
            borderRadius: 100, padding: "6px 16px", marginBottom: 28,
          }}>
            <MapPin size={14} color="#D97706" />
            <span style={{ color: "#D97706", fontSize: 13, fontWeight: 600, letterSpacing: "0.5px" }}>
              MANZANILLO, COLIMA — PUERTO DE MÉXICO
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800,
            color: "#fff", lineHeight: 1.15, marginBottom: 20,
            letterSpacing: "-0.5px",
          }}>
            Soluciones logísticas{" "}
            <span style={{ color: "#D97706" }}>integrales</span>,<br />
            conectando tu carga<br />con el mundo.
          </h1>

          <p style={{
            fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "rgba(255,255,255,0.65)",
            marginBottom: 40, lineHeight: 1.7, maxWidth: 520,
          }}>
            Nuestra base en Manzanillo es tu conexión estratégica al mercado global.
            Freight forwarder con cobertura local y foránea.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a href="#contacto" style={{
              background: "#D97706", color: "#fff",
              padding: "14px 28px", borderRadius: 8,
              fontWeight: 700, fontSize: 15, textDecoration: "none",
              display: "flex", alignItems: "center", gap: 8,
              transition: "transform 0.2s, background 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#B45309"}
              onMouseLeave={e => e.currentTarget.style.background = "#D97706"}
            >
              Solicitar cotización <ArrowRight size={16} />
            </a>
            <a href="#servicios" style={{
              background: "rgba(255,255,255,0.08)", color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "14px 28px", borderRadius: 8,
              fontWeight: 600, fontSize: 15, textDecoration: "none",
              transition: "background 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.14)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            >
              Nuestros servicios
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <a href="#servicios" style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.4)", display: "flex", flexDirection: "column",
          alignItems: "center", gap: 6, textDecoration: "none", fontSize: 11,
          letterSpacing: "1px", fontWeight: 500,
        }}>
          SCROLL
          <ChevronDown size={18} style={{ animation: "bounce 2s infinite" }} />
        </a>

        <style>{`
          @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(5px); } }
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
          @media (max-width: 768px) {
            .desktop-nav { display: none !important; }
            .mobile-menu-btn { display: block !important; }
          }
        `}</style>
      </section>

      {/* SERVICES */}
      <section id="servicios" style={{ padding: "80px 5%", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ color: "#D97706", fontWeight: 700, fontSize: 13, letterSpacing: "2px", marginBottom: 8 }}>
              FREIGHT FORWARDER
            </p>
            <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", fontWeight: 800, color: "#0F172A", marginBottom: 14 }}>
              Nuestros Servicios Logísticos
            </h2>
            <p style={{ color: "#64748B", fontSize: 16, maxWidth: 520, margin: "0 auto" }}>
              Ofrecemos servicios <strong>locales y foráneos</strong> diseñados para mover tu mercancía de forma segura y eficiente.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {SERVICES.map((s, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 16,
                border: "1px solid #E2E8F0",
                padding: "36px 32px",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "default",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(15,23,42,0.1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  width: 56, height: 56, background: "rgba(217,119,6,0.1)",
                  borderRadius: 14, display: "flex", alignItems: "center",
                  justifyContent: "center", marginBottom: 20,
                }}>
                  <s.icon size={26} color="#D97706" strokeWidth={1.8} />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: "#0F172A" }}>{s.title}</h3>
                <p style={{ color: "#D97706", fontWeight: 600, fontSize: 13, marginBottom: 14 }}>{s.subtitle}</p>
                <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>{s.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {s.tags.map(t => (
                    <span key={t} style={{
                      background: "#F1F5F9", color: "#475569",
                      fontSize: 12, fontWeight: 600, padding: "4px 10px",
                      borderRadius: 6, letterSpacing: "0.3px",
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAPACITY */}
      <section id="capacidad" style={{ padding: "80px 5%", background: "#0F172A" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ color: "#D97706", fontWeight: 700, fontSize: 13, letterSpacing: "2px", marginBottom: 8 }}>
              GESTIÓN DE UNIDADES
            </p>
            <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 800, color: "#fff", marginBottom: 14 }}>
              Capacidad y Equipos
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, maxWidth: 580, margin: "0 auto", lineHeight: 1.7 }}>
              Operamos bajo un modelo ágil <strong style={{ color: "rgba(255,255,255,0.75)" }}>Asset-Light</strong>. Contamos con una red de proveedores certificados para garantizar la unidad exacta para tu mercancía.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {FLEET.map((f, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12, padding: "24px 20px",
                display: "flex", alignItems: "flex-start", gap: 14,
                transition: "background 0.2s, border-color 0.2s",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(217,119,6,0.1)";
                  e.currentTarget.style.borderColor = "rgba(217,119,6,0.4)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                }}
              >
                <div style={{
                  width: 42, height: 42, background: "rgba(217,119,6,0.15)",
                  borderRadius: 10, display: "flex", alignItems: "center",
                  justifyContent: "center", flexShrink: 0,
                }}>
                  <f.icon size={20} color="#D97706" strokeWidth={1.8} />
                </div>
                <div>
                  <p style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{f.label}</p>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>{f.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section style={{ padding: "80px 5%", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ color: "#D97706", fontWeight: 700, fontSize: 13, letterSpacing: "2px", marginBottom: 8 }}>
              POR QUÉ ELEGIRNOS
            </p>
            <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 800, color: "#0F172A" }}>
              Lo que nos distingue
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {VALUES.map((v, i) => (
              <div key={i} style={{
                textAlign: "center", padding: "32px 20px",
                border: "1px solid #E2E8F0", borderRadius: 14,
                transition: "border-color 0.2s, transform 0.2s",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "#D97706";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "#E2E8F0";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div style={{
                  width: 60, height: 60, background: "#FEF3C7",
                  borderRadius: "50%", display: "flex", alignItems: "center",
                  justifyContent: "center", margin: "0 auto 16px",
                }}>
                  <v.icon size={26} color="#D97706" strokeWidth={1.8} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>{v.title}</h3>
                <p style={{ color: "#64748B", fontSize: 14 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contacto" style={{ padding: "80px 5%", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ color: "#D97706", fontWeight: 700, fontSize: 13, letterSpacing: "2px", marginBottom: 8 }}>
              CONTACTO
            </p>
            <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 800, color: "#0F172A", marginBottom: 10 }}>
              Cotiza tu Envío
            </h2>
            <p style={{ color: "#64748B", fontSize: 15, maxWidth: 480, margin: "0 auto" }}>
              Déjanos tus datos y un asesor logístico se pondrá en contacto contigo a la brevedad.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
            {/* Form */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "36px 28px", border: "1px solid #E2E8F0" }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{
                    width: 64, height: 64, background: "#DCFCE7",
                    borderRadius: "50%", display: "flex", alignItems: "center",
                    justifyContent: "center", margin: "0 auto 16px",
                  }}>
                    <Zap size={28} color="#16A34A" />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>¡Solicitud enviada!</h3>
                  <p style={{ color: "#64748B", fontSize: 14 }}>Un asesor te contactará pronto.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { id: "name", label: "Nombre completo", type: "text", placeholder: "Tu nombre" },
                    { id: "company", label: "Empresa", type: "text", placeholder: "Nombre de tu empresa" },
                    { id: "email", label: "Correo electrónico", type: "email", placeholder: "correo@empresa.com" },
                    { id: "phone", label: "Teléfono", type: "tel", placeholder: "+52 314 000 0000" },
                  ].map(f => (
                    <div key={f.id}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
                        {f.label}
                      </label>
                      <input
                        type={f.type} placeholder={f.placeholder} required
                        value={form[f.id]} onChange={e => setForm({ ...form, [f.id]: e.target.value })}
                        style={{
                          width: "100%", padding: "10px 12px", borderRadius: 8,
                          border: "1px solid #E2E8F0", fontSize: 14, outline: "none",
                          fontFamily: "inherit", boxSizing: "border-box",
                        }}
                      />
                    </div>
                  ))}

                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
                      Tipo de carga
                    </label>
                    <select
                      required value={form.cargoType}
                      onChange={e => setForm({ ...form, cargoType: e.target.value })}
                      style={{
                        width: "100%", padding: "10px 12px", borderRadius: 8,
                        border: "1px solid #E2E8F0", fontSize: 14, outline: "none",
                        fontFamily: "inherit", background: "#fff", boxSizing: "border-box",
                      }}
                    >
                      <option value="">Seleccionar...</option>
                      <option>Carga Contenerizada (FCL/LCL)</option>
                      <option>Carga en General</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
                      Origen / Destino
                    </label>
                    <input
                      type="text" placeholder="Ej: Manzanillo → CDMX"
                      value={form.route} onChange={e => setForm({ ...form, route: e.target.value })}
                      style={{
                        width: "100%", padding: "10px 12px", borderRadius: 8,
                        border: "1px solid #E2E8F0", fontSize: 14, outline: "none",
                        fontFamily: "inherit", boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
                      Mensaje
                    </label>
                    <textarea
                      rows={3} placeholder="Detalles adicionales de tu envío"
                      value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      style={{
                        width: "100%", padding: "10px 12px", borderRadius: 8,
                        border: "1px solid #E2E8F0", fontSize: 14, outline: "none",
                        fontFamily: "inherit", resize: "vertical", boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <button type="submit" style={{
                    background: "#D97706", color: "#fff", border: "none",
                    padding: "13px", borderRadius: 8, fontWeight: 700,
                    fontSize: 15, cursor: "pointer", fontFamily: "inherit",
                    transition: "background 0.2s", marginTop: 4,
                  }}
                    onMouseEnter={e => e.target.style.background = "#B45309"}
                    onMouseLeave={e => e.target.style.background = "#D97706"}
                  >
                    Enviar Solicitud
                  </button>
                </form>
              )}
            </div>

            {/* Contact info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{
                background: "#0F172A", borderRadius: 16, padding: "32px 28px", color: "#fff",
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: "#fff" }}>
                  Información de contacto
                </h3>
                {[
                  { icon: MapPin, label: "Ubicación", value: "Manzanillo, Colima, México" },
                  { icon: Mail, label: "Correos", value: "a.santillan@shireslogistic.com\ne.magana@shireslogistic.com" },
                  { icon: Phone, label: "Teléfonos", value: "444 133 8949\n812 355 5926" },
                ].map((c, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 14, marginBottom: 20,
                    paddingBottom: 20, borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
                  }}>
                    <div style={{
                      width: 40, height: 40, background: "rgba(217,119,6,0.15)",
                      borderRadius: 10, display: "flex", alignItems: "center",
                      justifyContent: "center", flexShrink: 0,
                    }}>
                      <c.icon size={18} color="#D97706" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 600, marginBottom: 4, letterSpacing: "0.5px" }}>
                        {c.label.toUpperCase()}
                      </p>
                      {c.value.split("\n").map((v, j) => (
                        <p key={j} style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.6 }}>{v}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                background: "#FEF3C7", borderRadius: 14, padding: "22px 24px",
                border: "1px solid #FDE68A",
              }}>
                <p style={{ color: "#92400E", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                  Tiempo de respuesta
                </p>
                <p style={{ color: "#78350F", fontSize: 22, fontWeight: 800 }}>Menos de 2 horas</p>
                <p style={{ color: "#92400E", fontSize: 13, marginTop: 4 }}>
                  En horario hábil, lunes a viernes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: "#0F172A", padding: "28px 5%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12,
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Anchor size={18} color="#D97706" />
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
            © 2026 Shires Logistic. Todos los derechos reservados.
          </span>
        </div>
        <a href="#" style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textDecoration: "none" }}>
          Aviso de privacidad
        </a>
      </footer>
    </div>
  );
}

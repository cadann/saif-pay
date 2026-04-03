import { useState, useCallback, useEffect } from "react";

const API = "/api-proxy";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy:#0b1535; --navy2:#0f1d47; --card:#141e3c; --card2:#1a2550;
    --blue:#2d8cff; --blue2:#4da3ff; --cyan:#00c2ff;
    --white:#ffffff; --gray:#8892b0; --gray2:#4a5680;
    --border:rgba(45,140,255,0.18); --border2:rgba(255,255,255,0.07);
    --success:#00d68f; --danger:#ff5c7a;
    --radius:10px; --radius-lg:16px;
    --shadow:0 4px 32px rgba(0,0,0,0.5);
    --glow:0 0 24px rgba(45,140,255,0.3);
  }
  body {
    font-family:'Inter',sans-serif;
    background:linear-gradient(145deg,#080e28 0%,#0d1535 40%,#0f1d47 100%);
    min-height:100vh; color:var(--white); -webkit-font-smoothing:antialiased;
  }

  /* LOGIN */
  .login-wrap {
    min-height:100vh; display:flex; align-items:center; justify-content:center;
    background:linear-gradient(145deg,#080e28 0%,#0d1535 50%,#122060 100%);
    position:relative; overflow:hidden;
  }
  .login-wrap::before {
    content:''; position:absolute; width:700px; height:700px;
    background:radial-gradient(circle,rgba(45,140,255,0.08) 0%,transparent 65%);
    top:50%; left:50%; transform:translate(-50%,-50%); pointer-events:none;
  }
  .login-card {
    background:var(--card); border:1px solid var(--border);
    border-radius:var(--radius-lg); padding:48px 52px; width:420px;
    box-shadow:var(--shadow),var(--glow); position:relative; z-index:1;
    animation:slideUp .45s ease;
  }
  @keyframes slideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
  .login-logo { display:flex; flex-direction:column; align-items:center; margin-bottom:40px; }
  .login-logo-icon {
    width:68px; height:68px;
    background:linear-gradient(135deg,#1a6fff,#00c2ff);
    border-radius:16px; display:flex; align-items:center; justify-content:center;
    font-size:22px; font-weight:900; color:#fff; letter-spacing:-1px;
    font-family:'Inter',sans-serif; margin-bottom:14px;
    box-shadow:0 8px 24px rgba(45,140,255,0.4);
  }
  .login-logo-name { font-size:26px; font-weight:800; letter-spacing:3px; color:var(--white); }
  .login-logo-name span { color:var(--blue2); }
  .login-logo-sub { font-size:12px; color:var(--gray); margin-top:4px; letter-spacing:1px; }
  .login-field { margin-bottom:16px; }
  .login-field label { display:block; font-size:12px; font-weight:600; color:var(--gray); margin-bottom:8px; }
  .login-field input {
    width:100%; padding:12px 16px;
    background:rgba(255,255,255,0.05); border:1px solid var(--border2);
    border-radius:var(--radius); color:var(--white); font-size:14px;
    font-family:'Inter',sans-serif; outline:none; transition:all .2s;
  }
  .login-field input:focus { border-color:var(--blue); background:rgba(45,140,255,0.07); box-shadow:0 0 0 3px rgba(45,140,255,0.15); }
  .login-field input::placeholder { color:var(--gray2); }
  .login-btn {
    width:100%; padding:14px;
    background:linear-gradient(90deg,#1a6fff,#00c2ff);
    border:none; border-radius:var(--radius); color:#fff;
    font-family:'Inter',sans-serif; font-size:15px; font-weight:700;
    cursor:pointer; margin-top:8px; box-shadow:0 4px 20px rgba(45,140,255,0.4);
    transition:all .2s;
  }
  .login-btn:hover { filter:brightness(1.1); box-shadow:0 6px 28px rgba(45,140,255,0.55); transform:translateY(-1px); }
  .login-err { color:var(--danger); font-size:12px; text-align:center; margin-top:12px; font-weight:500; }
  .login-hint { text-align:center; font-size:11px; color:var(--gray2); margin-top:16px; }

  /* TOPBAR */
  .topbar {
    height:60px; background:rgba(8,14,40,0.95); border-bottom:1px solid var(--border2);
    display:flex; align-items:center; justify-content:space-between; padding:0 28px;
    position:sticky; top:0; z-index:100; backdrop-filter:blur(12px);
  }
  .tb-brand { display:flex; align-items:center; gap:12px; }
  .tb-icon {
    width:36px; height:36px; background:linear-gradient(135deg,#1a6fff,#00c2ff);
    border-radius:9px; display:flex; align-items:center; justify-content:center;
    font-size:14px; font-weight:900; color:#fff; font-family:'Inter',sans-serif;
    box-shadow:0 4px 12px rgba(45,140,255,0.4);
  }
  .tb-name { font-size:18px; font-weight:800; letter-spacing:2px; color:var(--white); }
  .tb-name span { color:var(--blue2); }
  .tb-divider { width:1px; height:20px; background:var(--border2); margin:0 4px; }
  .tb-page { font-size:13px; color:var(--gray); font-weight:400; }
  .tb-right { display:flex; align-items:center; gap:14px; }
  .tb-user { display:flex; align-items:center; gap:8px; font-size:13px; color:var(--gray); }
  .tb-online { width:7px; height:7px; border-radius:50%; background:var(--success); box-shadow:0 0 6px var(--success); }
  .tb-logout {
    padding:7px 16px; background:transparent; border:1px solid var(--border2);
    border-radius:8px; color:var(--gray); font-size:12px; font-weight:500;
    cursor:pointer; transition:all .2s; font-family:'Inter',sans-serif;
  }
  .tb-logout:hover { border-color:var(--blue); color:var(--white); }

  /* LAYOUT */
  .shell { display:flex; flex-direction:column; min-height:100vh; }
  .main { display:flex; flex:1; }

  /* SIDEBAR */
  .sidebar {
    width:240px; flex-shrink:0;
    background:rgba(8,14,40,0.8); border-right:1px solid var(--border2);
    padding:24px 0;
  }
  .nav-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:var(--gray2); padding:0 20px 10px; }
  .nav-item {
    display:flex; align-items:center; gap:12px;
    padding:11px 20px; margin:2px 12px; border-radius:9px;
    cursor:pointer; font-size:13px; font-weight:500; color:var(--gray);
    transition:all .15s;
  }
  .nav-item:hover { background:rgba(255,255,255,0.05); color:var(--white); }
  .nav-item.active { background:rgba(45,140,255,0.15); color:var(--white); }
  .nav-item.active .nav-dot { background:var(--blue); box-shadow:0 0 8px var(--blue); }
  .nav-icon { font-size:18px; }
  .nav-dot { width:6px; height:6px; border-radius:50%; background:transparent; margin-left:auto; transition:all .15s; }

  /* CONTENT */
  .content { flex:1; padding:32px; overflow-y:auto; }

  /* MODULE CARD */
  .mcard {
    background:var(--card); border:1px solid var(--border2);
    border-radius:var(--radius-lg); overflow:hidden;
    box-shadow:var(--shadow); max-width:860px; animation:slideUp .3s ease;
  }
  .mcard-header {
    padding:20px 28px; border-bottom:1px solid var(--border2);
    display:flex; align-items:center; gap:14px;
    background:rgba(255,255,255,0.02);
  }
  .mcard-icon {
    width:42px; height:42px; background:rgba(45,140,255,0.15);
    border:1px solid rgba(45,140,255,0.25); border-radius:10px;
    display:flex; align-items:center; justify-content:center; font-size:20px;
  }
  .mcard-title { font-size:18px; font-weight:700; color:var(--white); }
  .mcard-sub { font-size:12px; color:var(--gray); margin-top:2px; }
  .mcard-body { padding:28px; }

  /* FORM */
  .frow { display:flex; gap:16px; margin-bottom:18px; flex-wrap:wrap; }
  .fg { display:flex; flex-direction:column; gap:6px; flex:1; min-width:80px; }
  .fg label { font-size:11px; font-weight:600; color:var(--gray); text-transform:uppercase; letter-spacing:.8px; }
  .fg input, .fg select, .fg textarea {
    background:rgba(255,255,255,0.05); border:1px solid var(--border2);
    border-radius:9px; padding:10px 14px;
    font-size:13px; font-family:'Inter',sans-serif; color:var(--white);
    outline:none; transition:all .2s;
  }
  .fg input:focus, .fg select:focus, .fg textarea:focus {
    border-color:var(--blue); background:rgba(45,140,255,0.07);
    box-shadow:0 0 0 3px rgba(45,140,255,0.12);
  }
  .fg input::placeholder, .fg textarea::placeholder { color:var(--gray2); }
  .fg textarea { resize:vertical; min-height:80px; }
  .fg select option { background:#0d1535; color:#fff; }
  .fg.sm { flex:0 0 90px; min-width:70px; }
  .fg.md { flex:0 0 160px; }
  .fg.lg { flex:1; min-width:200px; }
  .fg.xl { flex:2; }
  .fhint { font-size:11px; color:var(--gray2); margin-top:3px; }
  .req { color:var(--danger); margin-left:2px; }
  .ckrow { display:flex; align-items:center; gap:10px; margin-top:14px; }
  .ckrow input[type=checkbox] { width:17px; height:17px; cursor:pointer; accent-color:var(--blue); }
  .ckrow label { font-size:13px; color:var(--gray); cursor:pointer; }
  .divider { height:1px; background:var(--border2); margin:24px 0; }

  /* BUTTONS */
  .btn-row { display:flex; gap:12px; align-items:center; }
  .btn {
    padding:10px 24px; border:none; border-radius:9px;
    font-family:'Inter',sans-serif; font-size:13px; font-weight:600;
    cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:8px;
  }
  .btn:disabled { opacity:.45; cursor:not-allowed; }
  .btn-primary {
    background:linear-gradient(90deg,#1a6fff,#00c2ff); color:#fff;
    box-shadow:0 4px 16px rgba(45,140,255,0.35);
  }
  .btn-primary:hover:not(:disabled) { filter:brightness(1.1); box-shadow:0 6px 24px rgba(45,140,255,0.5); transform:translateY(-1px); }
  .btn-ghost { background:transparent; border:1px solid var(--border2); color:var(--gray); }
  .btn-ghost:hover:not(:disabled) { border-color:var(--blue); color:var(--white); }
  .pending-note { font-size:12px; color:var(--gray2); display:flex; align-items:center; gap:6px; }

  /* STATUS */
  .status-msg {
    padding:14px 18px; border-radius:10px; font-size:13px; font-weight:500;
    margin-top:18px; display:flex; align-items:center; gap:10px; border:1px solid;
  }
  .status-ok { background:rgba(0,214,143,0.08); border-color:rgba(0,214,143,0.3); color:var(--success); }
  .status-err { background:rgba(255,92,122,0.08); border-color:rgba(255,92,122,0.3); color:var(--danger); }
  .status-load { background:rgba(45,140,255,0.08); border-color:rgba(45,140,255,0.25); color:var(--blue2); }
  .spin { display:inline-block; width:14px; height:14px; border:2px solid rgba(45,140,255,0.25); border-top-color:var(--blue); border-radius:50%; animation:spin .7s linear infinite; flex-shrink:0; }
  @keyframes spin { to { transform:rotate(360deg); } }

  /* DASHBOARD */
  .dash-welcome { margin-bottom:32px; }
  .dash-welcome h1 { font-size:30px; font-weight:800; color:var(--white); }
  .dash-welcome h1 span { color:var(--blue2); }
  .dash-welcome p { font-size:14px; color:var(--gray); margin-top:6px; }
  .dash-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; max-width:860px; }
  .dash-card {
    background:var(--card); border:1px solid var(--border2);
    border-radius:var(--radius-lg); padding:28px 24px; cursor:pointer;
    transition:all .2s; box-shadow:var(--shadow); position:relative; overflow:hidden;
  }
  .dash-card:hover { transform:translateY(-4px); border-color:rgba(45,140,255,0.35); box-shadow:var(--shadow),var(--glow); }
  .dash-card-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; }
  .dash-card-icon {
    width:48px; height:48px; background:rgba(45,140,255,0.12);
    border:1px solid rgba(45,140,255,0.2); border-radius:12px;
    display:flex; align-items:center; justify-content:center; font-size:22px;
  }
  .dash-card-arrow { color:var(--gray2); font-size:18px; }
  .dash-card-label { font-size:16px; font-weight:700; color:var(--white); }
  .dash-card-desc { font-size:13px; color:var(--gray); margin-top:6px; }
  .dash-card-line {
    position:absolute; bottom:0; left:0; right:0; height:3px;
    background:linear-gradient(90deg,#1a6fff,#00c2ff); opacity:0; transition:opacity .2s;
  }
  .dash-card:hover .dash-card-line { opacity:1; }

  /* TOAST */
  .toast-wrap { position:fixed; top:72px; right:24px; z-index:9999; display:flex; flex-direction:column; gap:8px; }
  .toast {
    padding:12px 20px; border-radius:10px; font-size:13px; font-weight:600;
    animation:toastIn .25s ease; box-shadow:var(--shadow); border:1px solid;
    display:flex; align-items:center; gap:10px; min-width:260px;
  }
  .toast-ok { background:rgba(8,28,22,0.97); border-color:rgba(0,214,143,0.35); color:var(--success); }
  .toast-err { background:rgba(28,8,16,0.97); border-color:rgba(255,92,122,0.35); color:var(--danger); }
  @keyframes toastIn { from{transform:translateX(80px);opacity:0} to{transform:none;opacity:1} }
`;

const UF = ["AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"];
const fmtCep = v => v.replace(/\D/g,"").replace(/(\d{5})(\d)/,"$1-$2").substring(0,9);
const fmtFone = v => { const d=v.replace(/\D/g,"").substring(0,10); if(!d.length) return ""; if(d.length<=2) return "("+d; if(d.length<=6) return "("+d.slice(0,2)+") "+d.slice(2); return "("+d.slice(0,2)+") "+d.slice(2,6)+"-"+d.slice(6); };
const fmtCel = v => { const d=v.replace(/\D/g,"").substring(0,11); if(!d.length) return ""; if(d.length<=2) return "("+d; if(d.length<=7) return "("+d.slice(0,2)+") "+d.slice(2); return "("+d.slice(0,2)+") "+d.slice(2,7)+"-"+d.slice(7); };
const fmtM = v => { const n=v.replace(/\D/g,""); if(!n) return "0,00"; return (parseInt(n,10)/100).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}); };

function Toast({ t }) {
  return (
    <div className="toast-wrap">
      {t.map(x => (
        <div key={x.id} className={"toast toast-"+x.type}>
          {x.type==="ok" ? "✓" : "✕"} {x.msg}
        </div>
      ))}
    </div>
  );
}

function Login({ onLogin }) {
  const [cel, setCel] = useState("");
  const [e, setE] = useState("");
  const [loading, setLoading] = useState(false);

  const fmtCelular = v => {
    const d = v.replace(/\D/g,"").substring(0,11);
    if (!d.length) return "";
    if (d.length <= 2) return "("+d;
    if (d.length <= 7) return "("+d.slice(0,2)+") "+d.slice(2);
    return "("+d.slice(0,2)+") "+d.slice(2,7)+"-"+d.slice(7);
  };

  const go = async () => {
    const num = cel.replace(/\D/g,"");
    if (num.length < 10) { setE("Informe um celular válido."); return; }
    setLoading(true);
    setE("");
    try {
      const res = await fetch(API + "/PegaAut?cel=" + encodeURIComponent(num));
      if (res.status === 404) { setE("Usuário não encontrado."); setLoading(false); return; }
      if (!res.ok) { setE("Erro ao autenticar. Tente novamente."); setLoading(false); return; }
      const data = await res.json();
      if (!data.funcao || data.funcao[3] !== "X") { setE("Acesso não autorizado para este painel."); setLoading(false); return; }
      onLogin({ cel: num, ...data });
    } catch(err) {
      setE("Erro de conexão: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-wrap" translate="no">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">S$</div>
          <div className="login-logo-name">SAIF <span>PAY</span></div>
          <div className="login-logo-sub">Gestão de Eventos e Produtos</div>
        </div>
        <div className="login-field">
          <label>Celular</label>
          <input value={cel} onChange={ev=>{setCel(fmtCelular(ev.target.value));setE("");}}
            placeholder="(00) 00000-0000" onKeyDown={ev=>ev.key==="Enter"&&go()} />
        </div>
        <button className="login-btn" onClick={go} disabled={loading}>
          {loading ? "Verificando..." : "Entrar no Sistema"}
        </button>
        {e && <div className="login-err">{e}</div>}
      </div>
    </div>
  );
}

function Topbar({ user, mod, onLogout }) {
  const labels = { dashboard:"Painel Principal", eventos:"Cadastro de Eventos", pontos:"Pontos de Venda", produtos:"Tabela de Produtos" };
  return (
    <div className="topbar" translate="no">
      <div className="tb-brand">
        <div className="tb-icon">S$</div>
        <div className="tb-name">SAIF <span>PAY</span></div>
        <div className="tb-divider" />
        <div className="tb-page">{labels[mod] || ""}</div>
      </div>
      <div className="tb-right">
        <div className="tb-user"><div className="tb-online" />{user?.cel || user}</div>
        <button className="tb-logout" onClick={onLogout}>Sair</button>
      </div>
    </div>
  );
}

function Sidebar({ active, onNav }) {
  const items = [
    { key:"dashboard", icon:"⬡", label:"Painel" },
    { key:"eventos",   icon:"🎪", label:"Eventos" },
    { key:"pontos",    icon:"🏪", label:"Pontos de Venda" },
    { key:"produtos",  icon:"📦", label:"Produtos" },
  ];
  return (
    <div className="sidebar" translate="no">
      <div className="nav-label">Menu</div>
      {items.map(i => (
        <div key={i.key} className={"nav-item"+(active===i.key?" active":"")} onClick={()=>onNav(i.key)}>
          <span className="nav-icon">{i.icon}</span>{i.label}
          <div className="nav-dot" />
        </div>
      ))}
    </div>
  );
}

function Dashboard({ onNav }) {
  const cards = [
    { key:"eventos",  icon:"🎪", label:"Eventos",         desc:"Cadastrar novos eventos" },
    { key:"pontos",   icon:"🏪", label:"Pontos de Venda", desc:"Gerenciar barracas e pontos" },
    { key:"produtos", icon:"📦", label:"Produtos",        desc:"Tabela de produtos e preços" },
  ];
  return (
    <div>
      <div className="dash-welcome">
        <h1>Bem-vindo ao <span>SAIF PAY</span></h1>
        <p>Selecione um módulo abaixo para começar o cadastro.</p>
      </div>
      <div className="dash-grid">
        {cards.map(c => (
          <div key={c.key} className="dash-card" onClick={()=>onNav(c.key)}>
            <div className="dash-card-line" />
            <div className="dash-card-top">
              <div className="dash-card-icon">{c.icon}</div>
              <span className="dash-card-arrow">→</span>
            </div>
            <div className="dash-card-label">{c.label}</div>
            <div className="dash-card-desc">{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const EV0 = { descricao:"", endereco:"", bairro:"", cidade:"", uf:"", cep:"", fone:"", celular:"", eMail:"", observacao:"", dataInicio:"", dataFim:"", responsavel:"", cupom:false };

function Eventos() {
  const [f, setF] = useState(EV0);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setF(x => ({...x, [k]:v}));
  const limpar = () => { setF(EV0); setStatus(null); };

  const salvar = async () => {
    if (!f.descricao.trim()) { setStatus({type:"err", msg:"Descrição é obrigatória."}); return; }
    setLoading(true);
    setStatus(null);
    try {
      const body = {
        descricao:   f.descricao,
        endereco:    f.endereco || "",
        bairro:      f.bairro || "",
        cidade:      f.cidade || "",
        uf:          f.uf || "",
        cep:         f.cep.replace(/\D/g,"") || "",
        fone:        f.fone.replace(/\D/g,"") || "",
        celular:     f.celular.replace(/\D/g,"") || "",
        eMail:       f.eMail || "",
        observacao:  f.observacao || "",
        dataInicio:  f.dataInicio ? f.dataInicio+"T00:00:00" : "",
        dataFim:     f.dataFim   ? f.dataFim+"T23:59:00"   : "",
        responsavel: f.responsavel || "",
        cupom:       f.cupom ? "1" : "0"
      };
      const res  = await fetch(API + "/GrvEve", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch(pe) { setStatus({type:"err", msg:"Resposta inesperada: " + text.substring(0,120)}); setLoading(false); return; }
      if (data.status === "ok") { setStatus({type:"ok", msg:"Evento cadastrado! Código: " + data.id}); setF(EV0); }
      else setStatus({type:"err", msg:"API retornou: " + JSON.stringify(data)});
    } catch(err) {
      setStatus({type:"err", msg:"Erro de conexão: " + err.message});
    }
    setLoading(false);
  };

  return (
    <div className="mcard" translate="no">
      <div className="mcard-header">
        <div className="mcard-icon">🎪</div>
        <div><div className="mcard-title">Novo Evento</div><div className="mcard-sub">Preencha os dados do evento</div></div>
      </div>
      <div className="mcard-body">
        <div className="frow">
          <div className="fg xl"><label>Descrição *</label><input value={f.descricao} onChange={e=>set("descricao",e.target.value)} placeholder="Nome do evento" autoFocus /></div>
        </div>
        <div className="frow">
          <div className="fg lg"><label>Endereço</label><input value={f.endereco} onChange={e=>set("endereco",e.target.value)} placeholder="Rua, número" /></div>
          <div className="fg md"><label>Bairro</label><input value={f.bairro} onChange={e=>set("bairro",e.target.value)} placeholder="Bairro" /></div>
        </div>
        <div className="frow">
          <div className="fg lg"><label>Cidade</label><input value={f.cidade} onChange={e=>set("cidade",e.target.value)} placeholder="Cidade" /></div>
          <div className="fg sm"><label>UF</label><select value={f.uf} onChange={e=>set("uf",e.target.value)}><option value="" />{UF.map(u=><option key={u}>{u}</option>)}</select></div>
          <div className="fg md"><label>CEP</label><input value={f.cep} onChange={e=>set("cep",fmtCep(e.target.value))} placeholder="00000-000" /></div>
          <div className="fg md"><label>Fone Fixo</label><input value={f.fone} onChange={e=>set("fone",fmtFone(e.target.value))} placeholder="(00) 0000-0000" /></div>
          <div className="fg md"><label>Celular</label><input value={f.celular} onChange={e=>set("celular",fmtCel(e.target.value))} placeholder="(00) 00000-0000" /></div>
        </div>
        <div className="frow">
          <div className="fg md"><label>Data Início</label><input type="date" value={f.dataInicio} onChange={e=>set("dataInicio",e.target.value)} /></div>
          <div className="fg md"><label>Data Fim</label><input type="date" value={f.dataFim} onChange={e=>set("dataFim",e.target.value)} /></div>
          <div className="fg xl"><label>E-mail</label><input type="email" value={f.eMail} onChange={e=>set("eMail",e.target.value)} placeholder="email@exemplo.com" /></div>
        </div>
        <div className="frow">
          <div className="fg lg"><label>Responsável</label><input value={f.responsavel} onChange={e=>set("responsavel",e.target.value)} placeholder="Nome do responsável" /></div>
        </div>
        <div className="frow">
          <div className="fg xl"><label>Observações</label><textarea value={f.observacao} onChange={e=>set("observacao",e.target.value)} placeholder="Informações adicionais..." /></div>
        </div>
        <div className="ckrow">
          <input type="checkbox" id="cup" checked={f.cupom} onChange={e=>set("cupom",e.target.checked)} />
          <label htmlFor="cup">Impressora de Cupom nas Caixas de Consumo</label>
        </div>
        <div className="divider" />
        <div className="btn-row">
          <button className="btn btn-primary" onClick={salvar} disabled={loading}>
            {loading ? <><span className="spin" />Salvando...</> : "Cadastrar Evento"}
          </button>
          <button className="btn btn-ghost" onClick={limpar} disabled={loading}>Limpar</button>
        </div>
        {status && <div className={"status-msg status-"+status.type}>{status.type==="ok"?"✓":"✕"} {status.msg}</div>}
      </div>
    </div>
  );
}

function Pontos() {
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const limpar = () => { setDesc(""); setStatus(null); };

  const salvar = async () => {
    if (!desc.trim()) { setStatus({type:"err", msg:"Descrição é obrigatória."}); return; }
    setLoading(true);
    setStatus(null);
    try {
      const res  = await fetch(API + "/GrpBarraca", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({descricao: desc}) });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch(pe) { setStatus({type:"err", msg:"Resposta inesperada: " + text.substring(0,120)}); setLoading(false); return; }
      if (data.status === "ok") { setStatus({type:"ok", msg:"Ponto de Venda cadastrado! Código: " + data.GRPCod}); setDesc(""); }
      else setStatus({type:"err", msg:"API retornou: " + JSON.stringify(data)});
    } catch(err) {
      setStatus({type:"err", msg:"Erro de conexão: " + err.message});
    }
    setLoading(false);
  };

  return (
    <div className="mcard" translate="no">
      <div className="mcard-header">
        <div className="mcard-icon">🏪</div>
        <div><div className="mcard-title">Novo Ponto de Venda</div><div className="mcard-sub">O código será gerado automaticamente</div></div>
      </div>
      <div className="mcard-body">
        <div className="frow">
          <div className="fg xl">
            <label>Descrição *</label>
            <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Ex: Bebidas, Alimentos, Entrada..." autoFocus onKeyDown={e=>e.key==="Enter"&&salvar()} />
          </div>
        </div>
        <div className="divider" />
        <div className="btn-row">
          <button className="btn btn-primary" onClick={salvar} disabled={loading}>
            {loading ? <><span className="spin" />Salvando...</> : "Cadastrar Ponto"}
          </button>
          <button className="btn btn-ghost" onClick={limpar} disabled={loading}>Limpar</button>
        </div>
        {status && <div className={"status-msg status-"+status.type}>{status.type==="ok"?"✓":"✕"} {status.msg}</div>}
      </div>
    </div>
  );
}

function Produtos() {
  const [pontos, setPontos] = useState([]);
  const [loadingP, setLoadingP] = useState(true);
  const [erroP, setErroP] = useState(false);
  const [f, setF] = useState({ grupo:"", descricao:"", valor_unitario:"0,00" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setF(x => ({...x, [k]:v}));

  useEffect(() => {
    fetch(API + "/LerBarraca")
      .then(r => r.json())
      .then(d => { setPontos(d); setLoadingP(false); })
      .catch(() => { setErroP(true); setLoadingP(false); });
  }, []);

  const limpar = () => { setF({ grupo:"", descricao:"", valor_unitario:"0,00" }); setStatus(null); };

  const salvar = async () => {
    if (!f.grupo) { setStatus({type:"err", msg:"Grupo é obrigatório."}); return; }
    if (!f.descricao.trim()) { setStatus({type:"err", msg:"Descrição é obrigatória."}); return; }
    setLoading(true);
    setStatus(null);
    try {
      const valorNumerico = parseFloat(f.valor_unitario.replace(/\./g,"").replace(",",".")) || 0;
      const body = {
        grpCod:    parseInt(f.grupo),
        descricao: f.descricao,
        valor:     valorNumerico
      };
      const res  = await fetch(API + "/GrvPrd", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch(pe) { setStatus({type:"err", msg:"Resposta inesperada: " + text.substring(0,120)}); setLoading(false); return; }
      if (data.status === "ok") { setStatus({type:"ok", msg:"Produto cadastrado! Código: " + data.codigo}); setF({ grupo:"", descricao:"", valor_unitario:"0,00" }); }
      else setStatus({type:"err", msg:"API retornou: " + JSON.stringify(data)});
    } catch(err) {
      setStatus({type:"err", msg:"Erro de conexão: " + err.message});
    }
    setLoading(false);
  };

  return (
    <div className="mcard" translate="no">
      <div className="mcard-header">
        <div className="mcard-icon">📦</div>
        <div><div className="mcard-title">Novo Produto</div><div className="mcard-sub">Selecione o grupo e informe os dados</div></div>
      </div>
      <div className="mcard-body">
        {loadingP && <div className="status-msg status-load"><span className="spin" />Carregando Pontos de Venda...</div>}
        {erroP && <div className="status-msg status-err">✕ Erro ao carregar Pontos de Venda da API.</div>}
        {!loadingP && !erroP && (
          <>
            <div className="frow">
              <div className="fg lg">
                <label>Grupo / Ponto de Venda *</label>
                <select value={f.grupo} onChange={e=>set("grupo",e.target.value)}>
                  <option value="">— Selecione —</option>
                  {pontos.map(p => <option key={p.GRPCod} value={p.GRPCod}>{p.GRPCod} — {p.Descricao}</option>)}
                </select>
              </div>
            </div>
            <div className="frow">
              <div className="fg xl"><label>Descrição *</label><input value={f.descricao} onChange={e=>set("descricao",e.target.value)} placeholder="Nome do produto" /></div>
              <div className="fg md" style={{maxWidth:160}}><label>Valor Unitário (R$)</label><input style={{textAlign:"right"}} value={f.valor_unitario} onChange={e=>set("valor_unitario",fmtM(e.target.value))} /></div>
            </div>
            <div className="divider" />
            <div className="btn-row">
              <button className="btn btn-primary" onClick={salvar} disabled={loading}>
                {loading ? <><span className="spin" />Salvando...</> : "Cadastrar Produto"}
              </button>
              <button className="btn btn-ghost" onClick={limpar} disabled={loading}>Limpar</button>
            </div>
          </>
        )}
        {status && <div className={"status-msg status-"+status.type}>{status.type==="ok"?"✓":"✕"} {status.msg}</div>}
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [mod, setMod] = useState("dashboard");
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((msg, type="ok") => {
    const id = Date.now();
    setToasts(t => [...t, {id, msg, type}]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  if (!user) return <><style>{S}</style><Login onLogin={u=>setUser(u)} /></>;

  return (
    <div translate="no">
      <style>{S}</style>
      <Toast t={toasts} />
      <div className="shell">
        <Topbar user={user} mod={mod} onLogout={()=>setUser(null)} />
        <div className="main">
          <Sidebar active={mod} onNav={setMod} />
          <div className="content">
            {mod==="dashboard" && <Dashboard onNav={setMod} />}
            {mod==="eventos"   && <Eventos />}
            {mod==="pontos"    && <Pontos />}
            {mod==="produtos"  && <Produtos />}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useCallback, useEffect } from "react";

const API = "http://simaosql.ddns.net:3000/api";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700;800&family=Rajdhani:wght@500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg0:#0a1520; --bg1:#0d1e2e; --panel:#0e2033; --border:rgba(0,180,255,0.22);
    --border2:rgba(0,180,255,0.12); --neon:#00b4ff; --neon2:#00e5ff;
    --neon-dim:rgba(0,180,255,0.35); --white:#e8f4ff; --muted:#4a7a9b; --muted2:#2a5070;
    --success:#00d084; --danger:#ff4d6d; --input-bg:rgba(255,255,255,0.06);
    --input-bd:rgba(0,180,255,0.3); --shadow:0 4px 24px rgba(0,0,0,0.6);
    --glow-sm:0 0 8px rgba(0,180,255,0.4); --glow-md:0 0 18px rgba(0,180,255,0.5);
    --radius:6px; --radius-lg:12px;
  }
  body { font-family:'Exo 2',sans-serif; background:var(--bg0); min-height:100vh; color:var(--white); -webkit-font-smoothing:antialiased; }

  /* LOGIN */
  .lw { min-height:100vh; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; background:radial-gradient(ellipse 80% 60% at 50% 40%,#0d2d45 0%,#080f18 100%); }
  .lg-glow { position:absolute; width:600px; height:600px; background:radial-gradient(circle,rgba(0,180,255,0.12) 0%,transparent 70%); border-radius:50%; top:50%; left:50%; transform:translate(-50%,-50%); animation:pulse 4s ease-in-out infinite; }
  @keyframes pulse{0%,100%{opacity:.6;transform:translate(-50%,-50%) scale(1)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.15)}}
  .lc { position:relative;z-index:1; background:rgba(13,30,46,0.92); border:1px solid var(--border); border-radius:var(--radius-lg); padding:44px 52px; width:400px; box-shadow:0 8px 48px rgba(0,0,0,0.7),var(--glow-md); backdrop-filter:blur(12px); animation:fu .5s ease; }
  @keyframes fu{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
  .logo-w { display:flex; flex-direction:column; align-items:center; margin-bottom:36px; }
  .logo-i { width:72px;height:72px; background:linear-gradient(135deg,#0077cc,#00b4ff); border-radius:18px; display:flex;align-items:center;justify-content:center; font-size:36px; margin-bottom:12px; box-shadow:0 0 28px rgba(0,180,255,0.5),0 0 6px rgba(0,180,255,0.8); position:relative;overflow:hidden; }
  .logo-i::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.18) 0%,transparent 60%);border-radius:18px;}
  .logo-n { font-family:'Rajdhani',sans-serif; font-size:30px;font-weight:700; letter-spacing:4px; background:linear-gradient(90deg,#00b4ff,#00e5ff,#00b4ff); -webkit-background-clip:text;-webkit-text-fill-color:transparent; background-size:200%; animation:sh 3s linear infinite; }
  @keyframes sh{0%{background-position:0%}100%{background-position:200%}}
  .logo-t { font-size:10px;letter-spacing:4px;color:var(--muted);text-transform:uppercase;margin-top:4px; }
  .lf { margin-bottom:18px; }
  .lf label { display:block;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:var(--neon);margin-bottom:6px;opacity:.8; }
  .lf input { width:100%;padding:11px 14px;background:var(--input-bg);border:1px solid var(--input-bd);border-radius:var(--radius);color:var(--white);font-size:14px;font-family:'Exo 2',sans-serif;outline:none;transition:all .2s; }
  .lf input:focus{border-color:var(--neon);box-shadow:var(--glow-sm);}
  .lf input::placeholder{color:var(--muted);}
  .lb { width:100%;padding:13px;background:linear-gradient(90deg,#0077cc,#00b4ff);border:none;border-radius:var(--radius);color:#fff;font-family:'Rajdhani',sans-serif;font-size:17px;font-weight:700;letter-spacing:3px;cursor:pointer;margin-top:8px;box-shadow:var(--glow-sm);transition:all .2s;position:relative;overflow:hidden; }
  .lb::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);transition:left .4s;}
  .lb:hover::before{left:100%;} .lb:hover{box-shadow:var(--glow-md);filter:brightness(1.1);}
  .le{color:var(--danger);font-size:12px;text-align:center;margin-top:10px;}
  .lh{text-align:center;font-size:11px;color:var(--muted);margin-top:14px;}

  /* SHELL */
  .shell{display:flex;flex-direction:column;min-height:100vh;}
  .topbar{height:56px;background:rgba(10,21,32,0.97);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 24px;box-shadow:0 2px 20px rgba(0,0,0,0.5);position:sticky;top:0;z-index:100;backdrop-filter:blur(8px);}
  .tb-l{display:flex;align-items:center;gap:14px;}
  .tb-badge{width:34px;height:34px;background:linear-gradient(135deg,#0077cc,#00b4ff);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 0 12px rgba(0,180,255,0.5);}
  .tb-name{font-family:'Rajdhani',sans-serif;font-size:20px;font-weight:700;letter-spacing:3px;background:linear-gradient(90deg,#00b4ff,#00e5ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .tb-sep{width:1px;height:24px;background:var(--border);}
  .tb-mod{font-size:13px;color:var(--muted);letter-spacing:.5px;}
  .tb-r{display:flex;align-items:center;gap:14px;}
  .tb-user{font-size:13px;color:var(--muted);display:flex;align-items:center;gap:6px;}
  .tb-dot{width:6px;height:6px;border-radius:50%;background:var(--success);box-shadow:0 0 6px var(--success);}
  .out-btn{padding:6px 14px;background:transparent;border:1px solid var(--border);border-radius:var(--radius);color:var(--muted);font-size:12px;font-family:'Exo 2',sans-serif;cursor:pointer;transition:all .2s;letter-spacing:.5px;}
  .out-btn:hover{border-color:var(--neon);color:var(--neon);box-shadow:var(--glow-sm);}
  .main{display:flex;flex:1;}

  /* SIDEBAR */
  .sidebar{width:230px;flex-shrink:0;background:rgba(11,24,38,0.98);border-right:1px solid var(--border2);padding-top:20px;}
  .nav-sec{font-size:9px;text-transform:uppercase;letter-spacing:3px;color:var(--muted2);padding:16px 20px 8px;}
  .nav-item{display:flex;align-items:center;gap:12px;padding:11px 20px;cursor:pointer;font-size:13px;color:var(--muted);border-left:2px solid transparent;transition:all .15s;}
  .nav-item:hover{background:rgba(0,180,255,0.06);color:var(--white);}
  .nav-item.active{background:rgba(0,180,255,0.1);color:var(--neon);border-left-color:var(--neon);text-shadow:0 0 8px rgba(0,180,255,0.5);}
  .nav-icon{font-size:17px;}
  .content{flex:1;padding:28px;overflow-y:auto;}

  /* MODULE */
  .mf{background:var(--panel);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow);max-width:860px;animation:fu .3s ease;}
  .mh{padding:16px 24px;background:linear-gradient(90deg,rgba(0,100,180,0.25),rgba(0,180,255,0.08));border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px;}
  .mh-icon{font-size:22px;}
  .mh h2{font-family:'Rajdhani',sans-serif;font-size:20px;font-weight:700;letter-spacing:2px;color:var(--neon2);text-shadow:var(--glow-sm);text-transform:uppercase;}
  .mh-line{flex:1;height:1px;background:linear-gradient(90deg,var(--neon-dim),transparent);margin-left:8px;}
  .mb{padding:28px;}

  /* FORM */
  .fr{display:flex;gap:14px;margin-bottom:16px;flex-wrap:wrap;}
  .fg{display:flex;flex-direction:column;gap:5px;flex:1;min-width:80px;}
  .fg label{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:var(--neon);opacity:.75;}
  .fg input,.fg select,.fg textarea{background:var(--input-bg);border:1px solid var(--input-bd);border-radius:var(--radius);padding:8px 12px;font-size:13px;font-family:'Exo 2',sans-serif;color:var(--white);outline:none;transition:all .2s;}
  .fg input:focus,.fg select:focus,.fg textarea:focus{border-color:var(--neon);box-shadow:var(--glow-sm);background:rgba(0,180,255,0.06);}
  .fg textarea{resize:vertical;min-height:80px;}
  .fg select option{background:#0d1e2e;color:#e8f4ff;}
  .fg.sm{flex:0 0 80px;min-width:60px;} .fg.md{flex:0 0 150px;} .fg.lg{flex:1;min-width:200px;} .fg.xl{flex:2;}
  .fhint{font-size:10px;color:var(--muted);margin-top:2px;}
  .req{color:var(--danger);margin-left:2px;}
  .ck{display:flex;align-items:center;gap:10px;margin-top:12px;}
  .ck input[type=checkbox]{width:16px;height:16px;cursor:pointer;accent-color:var(--neon);}
  .ck label{font-size:12px;color:var(--muted);cursor:pointer;}
  .div{height:1px;background:var(--border2);margin:20px 0;}

  /* BUTTONS */
  .bar{display:flex;gap:10px;align-items:center;}
  .btn{padding:9px 22px;border:none;border-radius:var(--radius);font-family:'Rajdhani',sans-serif;font-size:14px;font-weight:700;letter-spacing:2px;cursor:pointer;transition:all .2s;text-transform:uppercase;position:relative;overflow:hidden;}
  .btn:disabled{opacity:.5;cursor:not-allowed;}
  .btn::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);transition:left .35s;}
  .btn:hover:not(:disabled)::before{left:100%;}
  .bs{background:linear-gradient(90deg,#0077cc,#00b4ff);color:#fff;box-shadow:0 0 12px rgba(0,180,255,0.35);}
  .bs:hover:not(:disabled){box-shadow:var(--glow-md);filter:brightness(1.1);}
  .bc{background:linear-gradient(90deg,#006644,#00d084);color:#fff;box-shadow:0 0 10px rgba(0,208,132,0.3);}
  .br{background:rgba(255,255,255,0.07);border:1px solid var(--border);color:var(--muted);}
  .br:hover:not(:disabled){border-color:var(--neon);color:var(--neon);}

  /* STATUS MESSAGES */
  .msg{padding:12px 16px;border-radius:var(--radius);font-size:13px;font-weight:600;margin-top:16px;display:flex;align-items:center;gap:10px;border:1px solid;}
  .msg-ok{background:rgba(0,30,20,0.95);border-color:rgba(0,208,132,0.4);color:var(--success);}
  .msg-err{background:rgba(30,0,10,0.95);border-color:rgba(255,77,109,0.4);color:var(--danger);}
  .msg-load{background:rgba(0,20,40,0.95);border-color:rgba(0,180,255,0.3);color:var(--neon);}
  .spin{display:inline-block;width:14px;height:14px;border:2px solid rgba(0,180,255,0.3);border-top-color:var(--neon);border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0;}
  @keyframes spin{to{transform:rotate(360deg)}}

  /* DASH */
  .dw{max-width:900px;}
  .dwl{margin-bottom:32px;}
  .dwl h1{font-family:'Rajdhani',sans-serif;font-size:28px;font-weight:700;background:linear-gradient(90deg,#00b4ff,#00e5ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:2px;}
  .dwl p{font-size:13px;color:var(--muted);margin-top:4px;}
  .dg{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
  .dc{background:var(--panel);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px 20px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden;box-shadow:var(--shadow);}
  .dc::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--neon),transparent);opacity:0;transition:opacity .2s;}
  .dc:hover{transform:translateY(-4px);box-shadow:0 8px 32px rgba(0,0,0,0.6),var(--glow-sm);}
  .dc:hover::before{opacity:1;}
  .dcg{position:absolute;bottom:-20px;right:-20px;width:80px;height:80px;background:radial-gradient(circle,rgba(0,180,255,0.12),transparent 70%);}
  .dct{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;}
  .dci{width:44px;height:44px;background:rgba(0,180,255,0.1);border:1px solid var(--border);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;}
  .dcl{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:1.5px;margin-top:8px;}
  .dcd{font-size:13px;color:var(--muted);margin-top:4px;}

  /* TOAST */
  .toast-w{position:fixed;top:68px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;}
  .toast{padding:12px 20px;border-radius:var(--radius);font-size:13px;font-weight:600;animation:ti .25s ease;box-shadow:0 4px 20px rgba(0,0,0,0.5);border:1px solid;display:flex;align-items:center;gap:8px;min-width:260px;}
  .tok{background:rgba(0,30,20,0.95);border-color:rgba(0,208,132,0.4);color:var(--success);}
  .terr{background:rgba(30,0,10,0.95);border-color:rgba(255,77,109,0.4);color:var(--danger);}
  @keyframes ti{from{transform:translateX(80px);opacity:0}to{transform:none;opacity:1}}
`;

const UF = ["AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"];
const fmtCep = v => v.replace(/\D/g,"").replace(/(\d{5})(\d)/,"$1-$2").substring(0,9);
const fmtFone = v => { const d=v.replace(/\D/g,"").substring(0,10); if(!d.length) return ""; if(d.length<=2) return `(${d}`; if(d.length<=6) return `(${d.slice(0,2)}) ${d.slice(2)}`; return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`; };
const fmtCel = v => { const d=v.replace(/\D/g,"").substring(0,11); if(!d.length) return ""; if(d.length<=2) return `(${d}`; if(d.length<=7) return `(${d.slice(0,2)}) ${d.slice(2)}`; return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`; };
const fmtM = v => { const n=v.replace(/\D/g,""); if(!n) return "0,00"; return (parseInt(n,10)/100).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}); };

function Toast({ t }) {
  return <div className="toast-w">{t.map(x=><div key={x.id} className={`toast ${x.type==="ok"?"tok":"terr"}`}>{x.type==="ok"?"✓":"✕"} {x.msg}</div>)}</div>;
}

function Login({ onLogin }) {
  const [l,setL]=useState(""); const [s,setS]=useState(""); const [e,setE]=useState("");
  const go = () => { if(l==="admin"&&s==="admin123") onLogin(l); else setE("Usuário ou senha inválidos."); };
  return (
    <div className="lw">
      <div className="lg-glow"/>
      <div className="lc">
        <div className="logo-w">
          <div className="logo-i">💸</div>
          <div className="logo-n">SAIF PAY</div>
          <div className="logo-t">Gestão de Eventos &amp; Produtos</div>
        </div>
        <div className="lf"><label>Usuário</label><input value={l} onChange={e=>{setL(e.target.value);setE("");}} placeholder="Digite seu usuário" onKeyDown={e=>e.key==="Enter"&&go()}/></div>
        <div className="lf"><label>Senha</label><input type="password" value={s} onChange={e=>{setS(e.target.value);setE("");}} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&go()}/></div>
        <button className="lb" onClick={go}>ACESSAR SISTEMA</button>
        {e&&<div className="le">{e}</div>}
        <div className="lh">Demo: admin / admin123</div>
      </div>
    </div>
  );
}

function Topbar({ user, mod, onLogout }) {
  const labels={dashboard:"Painel",eventos:"Eventos",pontos:"Pontos de Venda",produtos:"Produtos"};
  return (
    <div className="topbar">
      <div className="tb-l">
        <div className="tb-badge">💸</div>
        <div className="tb-name">SAIF PAY</div>
        <div className="tb-sep"/>
        <div className="tb-mod">{labels[mod]||""}</div>
      </div>
      <div className="tb-r">
        <div className="tb-user"><div className="tb-dot"/>{user}</div>
        <button className="out-btn" onClick={onLogout}>⏻ Sair</button>
      </div>
    </div>
  );
}

function Sidebar({ active, onNav }) {
  const items=[
    {key:"dashboard",icon:"⬡",label:"Painel"},
    {key:"eventos",icon:"🎪",label:"Eventos"},
    {key:"pontos",icon:"🏪",label:"Pontos de Venda"},
    {key:"produtos",icon:"📦",label:"Produtos"},
  ];
  return (
    <div className="sidebar">
      <div className="nav-sec">Navegação</div>
      {items.map(i=>(
        <div key={i.key} className={`nav-item${active===i.key?" active":""}`} onClick={()=>onNav(i.key)}>
          <span className="nav-icon">{i.icon}</span>{i.label}
        </div>
      ))}
    </div>
  );
}

function Dashboard({ onNav }) {
  const cards = [
    { key:"eventos",  icon:"🎪", label:"Eventos",         desc:"Cadastrar novo evento" },
    { key:"pontos",   icon:"🏪", label:"Pontos de Venda", desc:"Cadastrar ponto de venda" },
    { key:"produtos", icon:"📦", label:"Produtos",        desc:"Cadastrar produto" },
  ];
  return (
    <div className="dw">
      <div className="dwl">
        <h1>BEM-VINDO AO SAIF PAY</h1>
        <p>Selecione um módulo para cadastrar informações.</p>
      </div>
      <div className="dg">
        {cards.map(c=>(
          <div key={c.key} className="dc" onClick={()=>onNav(c.key)}>
            <div className="dcg"/>
            <div className="dct"><div className="dci">{c.icon}</div></div>
            <div className="dcl">{c.label}</div>
            <div className="dcd">{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── EVENTOS
const EV0 = { descricao:"", endereco:"", bairro:"", cidade:"", uf:"", cep:"", fone:"", celular:"", eMail:"", observacao:"", dataInicio:"", dataFim:"", responsavel:"", cupom:false };

function Eventos() {
  const [f, setF] = useState(EV0);
  const [status, setStatus] = useState(null); // null | {type, msg}
  const [loading, setLoading] = useState(false);
  const set = (k,v) => setF(x=>({...x,[k]:v}));

  const limpar = () => { setF(EV0); setStatus(null); };

  const salvar = async () => {
    if(!f.descricao.trim()) { setStatus({type:"err", msg:"Descrição é obrigatória."}); return; }
    setLoading(true); setStatus(null);
    try {
      const body = {
        descricao: f.descricao,
        endereco: f.endereco,
        bairro: f.bairro,
        cidade: f.cidade,
        uf: f.uf,
        cep: f.cep.replace(/\D/g,""),
        fone: f.fone.replace(/\D/g,""),
        celular: f.celular.replace(/\D/g,""),
        eMail: f.eMail,
        observacao: f.observacao,
        dataInicio: f.dataInicio ? f.dataInicio + "T00:00:00" : "",
        dataFim: f.dataFim ? f.dataFim + "T23:59:00" : "",
        responsavel: f.responsavel,
        cupom: f.cupom ? "1" : "0"
      };
      const res = await fetch(`${API}/GrvEve`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if(data.status === "ok") {
        setStatus({type:"ok", msg:`Evento cadastrado com sucesso! ID: ${data.id}`});
        setF(EV0);
      } else {
        setStatus({type:"err", msg:"Erro ao cadastrar evento. Tente novamente."});
      }
    } catch(e) {
      setStatus({type:"err", msg:"Erro de conexão com a API. Verifique a rede."});
    }
    setLoading(false);
  };

  return (
    <div className="mf">
      <div className="mh"><span className="mh-icon">🎪</span><h2>Novo Evento</h2><div className="mh-line"/></div>
      <div className="mb">
        <div className="fr">
          <div className="fg xl"><label>Descrição<span className="req">*</span></label><input value={f.descricao} onChange={e=>set("descricao",e.target.value)} maxLength={100} autoFocus/></div>
        </div>
        <div className="fr">
          <div className="fg lg"><label>Endereço</label><input value={f.endereco} onChange={e=>set("endereco",e.target.value)}/></div>
          <div className="fg md"><label>Bairro</label><input value={f.bairro} onChange={e=>set("bairro",e.target.value)}/></div>
        </div>
        <div className="fr">
          <div className="fg lg"><label>Cidade</label><input value={f.cidade} onChange={e=>set("cidade",e.target.value)}/></div>
          <div className="fg sm"><label>UF</label><select value={f.uf} onChange={e=>set("uf",e.target.value)}><option value=""/>{UF.map(u=><option key={u}>{u}</option>)}</select></div>
          <div className="fg md"><label>CEP</label><input value={f.cep} onChange={e=>set("cep",fmtCep(e.target.value))} placeholder="00000-000"/></div>
          <div className="fg md"><label>Fone Fixo</label><input value={f.fone} onChange={e=>set("fone",fmtFone(e.target.value))} placeholder="(00) 0000-0000"/></div>
          <div className="fg md"><label>Celular</label><input value={f.celular} onChange={e=>set("celular",fmtCel(e.target.value))} placeholder="(00) 00000-0000"/></div>
        </div>
        <div className="fr">
          <div className="fg md"><label>Data Início</label><input type="date" value={f.dataInicio} onChange={e=>set("dataInicio",e.target.value)}/></div>
          <div className="fg md"><label>Data Fim</label><input type="date" value={f.dataFim} onChange={e=>set("dataFim",e.target.value)}/></div>
          <div className="fg xl"><label>E-mail</label><input type="email" value={f.eMail} onChange={e=>set("eMail",e.target.value)}/></div>
        </div>
        <div className="fr">
          <div className="fg lg"><label>Responsável</label><input value={f.responsavel} onChange={e=>set("responsavel",e.target.value)}/></div>
        </div>
        <div className="fr">
          <div className="fg xl"><label>Observações</label><textarea value={f.observacao} onChange={e=>set("observacao",e.target.value)}/></div>
        </div>
        <div className="ck">
          <input type="checkbox" id="cup" checked={f.cupom} onChange={e=>set("cupom",e.target.checked)}/>
          <label htmlFor="cup">Impressora de Cupom nos Caixas de Consumo</label>
        </div>
        <div className="div"/>
        <div className="bar">
          <button className="btn bs" onClick={salvar} disabled={loading}>
            {loading ? <><span className="spin"/> Salvando...</> : "💾 Cadastrar"}
          </button>
          <button className="btn br" onClick={limpar} disabled={loading}>✕ Limpar</button>
        </div>
        {status && (
          <div className={`msg msg-${status.type}`}>
            {status.type==="ok" ? "✓" : "✕"} {status.msg}
          </div>
        )}
      </div>
    </div>
  );
}

// ── PONTOS DE VENDA
function Pontos() {
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const limpar = () => { setDescricao(""); setStatus(null); };

  const salvar = async () => {
    if(!descricao.trim()) { setStatus({type:"err", msg:"Descrição é obrigatória."}); return; }
    setLoading(true); setStatus(null);
    try {
      const res = await fetch(`${API}/GrpBarraca`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ descricao })
      });
      const data = await res.json();
      if(data.status === "ok") {
        setStatus({type:"ok", msg:`Ponto de Venda cadastrado com sucesso! Código: ${data.GRPCod}`});
        setDescricao("");
      } else {
        setStatus({type:"err", msg:"Erro ao cadastrar. Tente novamente."});
      }
    } catch(e) {
      setStatus({type:"err", msg:"Erro de conexão com a API. Verifique a rede."});
    }
    setLoading(false);
  };

  return (
    <div className="mf">
      <div className="mh"><span className="mh-icon">🏪</span><h2>Novo Ponto de Venda</h2><div className="mh-line"/></div>
      <div className="mb">
        <div className="fr">
          <div className="fg xl">
            <label>Descrição<span className="req">*</span></label>
            <input value={descricao} onChange={e=>setDescricao(e.target.value)} maxLength={100} autoFocus
              onKeyDown={e=>e.key==="Enter"&&salvar()}/>
            <span className="fhint">O código será gerado automaticamente pelo sistema.</span>
          </div>
        </div>
        <div className="div"/>
        <div className="bar">
          <button className="btn bs" onClick={salvar} disabled={loading}>
            {loading ? <><span className="spin"/> Salvando...</> : "💾 Cadastrar"}
          </button>
          <button className="btn br" onClick={limpar} disabled={loading}>✕ Limpar</button>
        </div>
        {status && (
          <div className={`msg msg-${status.type}`}>
            {status.type==="ok" ? "✓" : "✕"} {status.msg}
          </div>
        )}
      </div>
    </div>
  );
}

// ── PRODUTOS
function Produtos() {
  const [pontos, setPontos] = useState([]);
  const [loadingPontos, setLoadingPontos] = useState(true);
  const [erroPontos, setErroPontos] = useState(false);
  const [f, setF] = useState({ grupo:"", descricao:"", valor_unitario:"0,00" });
  const [status, setStatus] = useState(null);
  const set = (k,v) => setF(x=>({...x,[k]:v}));

  useEffect(() => {
    fetch(`${API}/LerBarraca`)
      .then(r=>r.json())
      .then(data=>{ setPontos(data); setLoadingPontos(false); })
      .catch(()=>{ setErroPontos(true); setLoadingPontos(false); });
  }, []);

  return (
    <div className="mf">
      <div className="mh"><span className="mh-icon">📦</span><h2>Novo Produto</h2><div className="mh-line"/></div>
      <div className="mb">
        {loadingPontos && <div className="msg msg-load"><span className="spin"/> Carregando Pontos de Venda...</div>}
        {erroPontos && <div className="msg msg-err">✕ Erro ao carregar Pontos de Venda da API.</div>}
        {!loadingPontos && !erroPontos && (
          <>
            <div className="fr">
              <div className="fg lg">
                <label>Grupo / Ponto de Venda<span className="req">*</span></label>
                <select value={f.grupo} onChange={e=>set("grupo",e.target.value)}>
                  <option value="">— Selecione —</option>
                  {pontos.map(p=><option key={p.GRPCod} value={p.GRPCod}>{p.GRPCod} — {p.Descricao}</option>)}
                </select>
              </div>
            </div>
            <div className="fr">
              <div className="fg xl"><label>Descrição<span className="req">*</span></label><input value={f.descricao} onChange={e=>set("descricao",e.target.value)} maxLength={100}/></div>
              <div className="fg md" style={{maxWidth:160}}><label>Valor Unitário (R$)</label><input style={{textAlign:"right"}} value={f.valor_unitario} onChange={e=>set("valor_unitario",fmtM(e.target.value))}/></div>
            </div>
            <div className="div"/>
            <div className="bar">
              <button className="btn bs" disabled style={{opacity:.4}}>💾 Cadastrar</button>
              <span style={{fontSize:12,color:"var(--muted)",marginLeft:8}}>⏳ Aguardando API de Produtos</span>
            </div>
          </>
        )}
        {status && <div className={`msg msg-${status.type}`}>{status.type==="ok"?"✓":"✕"} {status.msg}</div>}
      </div>
    </div>
  );
}

// ── ROOT
export default function App() {
  const [user,setUser]=useState(null);
  const [mod,setMod]=useState("dashboard");
  const [toasts,setToasts]=useState([]);
  const addToast=useCallback((msg,type="ok")=>{const id=Date.now();setToasts(t=>[...t,{id,msg,type}]);setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3500);},[]);

  if(!user) return <><style>{S}</style><Login onLogin={u=>setUser(u)}/></>;
  return (
    <>
      <style>{S}</style>
      <Toast t={toasts}/>
      <div className="shell">
        <Topbar user={user} mod={mod} onLogout={()=>setUser(null)}/>
        <div className="main">
          <Sidebar active={mod} onNav={setMod}/>
          <div className="content">
            {mod==="dashboard" && <Dashboard onNav={setMod}/>}
            {mod==="eventos"   && <Eventos addToast={addToast}/>}
            {mod==="pontos"    && <Pontos addToast={addToast}/>}
            {mod==="produtos"  && <Produtos addToast={addToast}/>}
          </div>
        </div>
      </div>
    </>
  );
}

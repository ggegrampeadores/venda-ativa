/* Venda Ativa GGE - base compartilhada (login, menu, conexao, helpers) */
(function(){
  var SB_URL = window.GGE_SUPABASE_URL || "https://opceujqpqyvxsatzdarg.supabase.co";
  var SB_KEY = window.GGE_SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wY2V1anFwcXl2eHNhdHpkYXJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NzIwMDEsImV4cCI6MjA4OTA0ODAwMX0.XKhgaNBJF8xiHiGEWEs8HL1dq5KFJpo2_RQckjsY9kc";
  var OWNER_KEY = "gge2026";
  var ROLES = { "Francisco":"func", "Matheus":"func", "Lorena":"func", "Admin":"admin" };

  var sb = supabase.createClient(SB_URL, SB_KEY);

  function brl(n){ if(n==null||n==="") return "—"; return "R$ "+Math.round(n).toLocaleString("pt-BR"); }
  function digits(x){ return (x||"").replace(/\D/g,""); }
  function waNum(x){ var d=digits(x); if(d && d.length<=11) d="55"+d; return d; }
  function esc(s){ return (s==null?"":String(s)).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }
  function user(){ try{ return JSON.parse(sessionStorage.getItem("va_user")); }catch(e){ return null; } }
  function sair(){ sessionStorage.removeItem("va_user"); location.href="index.html"; }

  var CSS = ""
  + ":root{--bg:#0d1117;--panel:#161b22;--panel2:#1c2330;--border:#30363d;--text:#e6edf3;--muted:#8b949e;--muted2:#6e7681;--blue:#58a6ff;--green:#3fb950;--red:#f85149;--yellow:#d29922;}"
  + "*{margin:0;padding:0;box-sizing:border-box;}"
  + "body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--bg);color:var(--text);line-height:1.5;}"
  + "a{color:inherit;text-decoration:none;}"
  + "button{font-family:inherit;cursor:pointer;}"
  + "select,input{font-family:inherit;}"
  + ".va-side{position:fixed;top:0;left:0;bottom:0;width:194px;background:#0b0f15;border-right:1px solid var(--border);padding:16px 12px;display:flex;flex-direction:column;z-index:40;}"
  + ".va-brand{font-size:16px;font-weight:700;margin-bottom:2px;}.va-brand span{color:var(--blue);}"
  + ".va-role{font-size:11px;color:var(--muted2);margin-bottom:16px;}"
  + ".va-side a{display:block;padding:9px 11px;border-radius:8px;font-size:14px;color:var(--muted);margin-bottom:3px;}"
  + ".va-side a:hover{background:var(--panel2);color:var(--text);}"
  + ".va-side a.on{background:var(--panel2);color:var(--blue);}"
  + ".va-foot{margin-top:auto;font-size:12px;color:var(--muted);border-top:1px solid var(--border);padding-top:12px;}"
  + ".va-foot button{background:none;border:none;color:var(--muted2);font-size:12px;text-decoration:underline;padding:0;margin-top:4px;}"
  + ".va-content{margin-left:194px;padding:22px 26px 60px;max-width:1180px;}"
  + "@media(max-width:760px){.va-side{position:static;width:auto;flex-direction:row;flex-wrap:wrap;gap:4px;}.va-content{margin-left:0;}.va-foot{margin:0;border:none;padding:0;}}"
  + ".va-h1{font-size:20px;font-weight:600;margin-bottom:2px;}.va-sub{font-size:12px;color:var(--muted);margin-bottom:18px;}"
  + ".card{background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:14px 16px;}"
  + ".metric{background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:12px 14px;}"
  + ".metric .lbl{font-size:12px;color:var(--muted);}.metric .val{font-size:23px;font-weight:600;margin-top:3px;}"
  + ".mrow{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:11px;margin-bottom:18px;}"
  + ".btn{font-size:13px;padding:8px 13px;border-radius:8px;border:1px solid var(--border);background:var(--panel2);color:var(--text);}"
  + ".btn:hover{border-color:#3d4757;}.btn.blue{border-color:var(--blue);color:var(--blue);}.btn.green{border-color:var(--green);color:var(--green);}"
  + "select,input[type=text],input[type=date],input[type=number],input[type=password]{background:var(--panel);border:1px solid var(--border);border-radius:8px;color:var(--text);padding:8px 10px;font-size:13px;}"
  + "table.tbl{width:100%;border-collapse:collapse;font-size:13px;}"
  + "table.tbl th{text-align:left;color:var(--muted);font-weight:500;font-size:12px;padding:8px 9px;border-bottom:1px solid var(--border);position:sticky;top:0;background:var(--panel);cursor:pointer;white-space:nowrap;}"
  + "table.tbl td{padding:7px 9px;border-bottom:1px solid var(--border);white-space:nowrap;}"
  + "table.tbl tr:hover td{background:var(--panel2);}"
  + ".pill{font-size:11px;padding:2px 8px;border-radius:999px;}"
  + ".empty{color:var(--muted);text-align:center;padding:30px 10px;font-size:14px;}"
  + "#va-login{position:fixed;inset:0;background:#0d1117;display:flex;align-items:center;justify-content:center;z-index:100;}"
  + "#va-login .box{background:#161b22;border:1px solid #30363d;border-radius:14px;padding:28px 30px;width:300px;max-width:90vw;text-align:center;}"
  + "#va-login select,#va-login input{width:100%;margin-bottom:10px;padding:10px;}"
  + "#va-login button{width:100%;background:#1c2330;border:1px solid #58a6ff;color:#58a6ff;border-radius:8px;padding:10px;font-size:14px;}";

  document.head.insertAdjacentHTML("beforeend","<style>"+CSS+"</style>");

  function showLogin(){
    var nomes = Object.keys(ROLES).map(function(n){return "<option>"+n+"</option>";}).join("");
    var html = '<div id="va-login"><div class="box">'
      + '<div style="font-size:18px;font-weight:700;margin-bottom:2px;">Venda Ativa <span style="color:#58a6ff">GGE</span></div>'
      + '<div style="font-size:12px;color:#8b949e;margin-bottom:16px;">Entre para começar</div>'
      + '<select id="va-nome">'+nomes+'</select>'
      + '<input id="va-pw" type="password" placeholder="Senha">'
      + '<button id="va-enter">Entrar</button>'
      + '<div id="va-err" style="font-size:12px;color:#f85149;margin-top:8px;height:14px;"></div>'
      + '</div></div>';
    document.body.insertAdjacentHTML("afterbegin", html);
    function tryEnter(){
      var nome=document.getElementById("va-nome").value;
      var pw=document.getElementById("va-pw").value;
      if(pw===OWNER_KEY){ sessionStorage.setItem("va_user", JSON.stringify({nome:nome, role:ROLES[nome]||"func"})); location.reload(); }
      else { document.getElementById("va-err").textContent="Senha incorreta"; }
    }
    document.getElementById("va-enter").addEventListener("click", tryEnter);
    document.getElementById("va-pw").addEventListener("keydown", function(e){ if(e.key==="Enter") tryEnter(); });
  }

  var MENU = {
    func: [["dashboard.html","Meu painel"],["contatos.html","Contatos"],["listagem.html","Listagem"],["relatorios.html","Relatórios"]],
    admin: [["admin.html","Visão geral"],["parametros.html","Parâmetros"],["contatos.html","Contatos"],["listagem.html","Listagem"],["relatorios.html","Relatórios"]]
  };

  // Monta o menu lateral e retorna o usuario, ou mostra login e retorna null.
  function montar(active){
    var u=user();
    if(!u){ showLogin(); return null; }
    var itens=(MENU[u.role]||MENU.func).map(function(m){
      return '<a href="'+m[0]+'" class="'+(active===m[0]?"on":"")+'">'+m[1]+'</a>';
    }).join("");
    var side='<div class="va-side"><div class="va-brand">Venda Ativa <span>GGE</span></div>'
      + '<div class="va-role">'+(u.role==="admin"?"Administrador":"Vendedor")+'</div>'
      + itens
      + '<div class="va-foot">'+esc(u.nome)+'<br><button onclick="VA.sair()">sair</button></div></div>';
    document.body.insertAdjacentHTML("afterbegin", side);
    return u;
  }

  window.VA = { sb:sb, brl:brl, digits:digits, waNum:waNum, esc:esc, user:user, sair:sair, montar:montar };
})();

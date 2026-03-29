import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, setDoc } from "firebase/firestore";

// ─── FIREBASE SETUP ──────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBz5Jsw8CzZJiwGtOXD58URZi15c7cv6VA",
  authDomain: "noyalsurya-s-workspace.firebaseapp.com",
  projectId: "noyalsurya-s-workspace",
  storageBucket: "noyalsurya-s-workspace.firebasestorage.app",
  messagingSenderId: "406460631567",
  appId: "1:406460631567:web:372ba49acf0593fa83317a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ─── CLOUD STORAGE HOOK ──────────────────────────────────────────────────────
function useCloudStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);

  // 1. Listen for real-time changes from the cloud
  useEffect(() => {
    const docRef = doc(db, "publish_os_data", key);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setValue(docSnap.data().value);
      } else {
        // If it's the first time running, save the initial hardcoded data to the cloud
        setDoc(docRef, { value: initialValue });
      }
    });
    return () => unsubscribe();
  }, [key]);

  // 2. Write changes back to the cloud
  const setCloudValue = (newValue) => {
    const valueToStore = typeof newValue === "function" ? newValue(value) : newValue;
    setValue(valueToStore); // Update local screen instantly
    setDoc(doc(db, "publish_os_data", key), { value: valueToStore }); // Sync to cloud
  };

  return [value, setCloudValue];
}

// ─── RESET CLOUD DATA ──────────────────────────────────────────────────────
const resetCloudData = async () => {
  await setDoc(doc(db, "publish_os_data", "workspaces"), { value: INIT_WS });
  await setDoc(doc(db, "publish_os_data", "allContent"), { value: INIT_CONTENT });
  await setDoc(doc(db, "publish_os_data", "activeWsId"), { value: "ws-ucp" });
  alert("Cloud data reset to initial values!");
};

// ─── DATA & CONSTANTS ────────────────────────────────────────────────────────
const today = new Date();
const fmt = (d) => d.toISOString().split("T")[0];
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const genId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const STATUSES = [
  { key:"ideation_room",              label:"Ideation",         color:"#a78bfa" },
  { key:"approved_script",            label:"Script Approved",  color:"#34d399" },
  { key:"shooting_done_post_planned", label:"Shoot Done",       color:"#fb923c" },
  { key:"editing_phase",              label:"Editing Phase",    color:"#f59e0b" },
  { key:"to_be_published",            label:"To Be Published",  color:"#38bdf8" },
  { key:"published",                  label:"Published",        color:"#4ade80" },
];

const PLATFORMS = ["IG","YT","TikTok","LinkedIn"];
const PC = {
  IG:      { bg:"#e1306c18", text:"#e1306c", border:"#e1306c40" },
  YT:      { bg:"#ff000018", text:"#ff5555", border:"#ff000040" },
  TikTok:  { bg:"#69c9d018", text:"#69c9d0", border:"#69c9d040" },
  LinkedIn:{ bg:"#0a66c218", text:"#4a9ade", border:"#0a66c240" },
};

const WS_COLORS = ["#7c6af7","#f59e0b","#34d399","#38bdf8","#f87171","#e1306c","#fb923c","#a78bfa"];

const INIT_WS = [
  { id:"ws-surya", name:"Noyal Surya J J",         type:"personal", color:"#7c6af7", igAccounts:["@noyalsurya","@surya.creates"] },
  { id:"ws-ucp",   name:"Urban Class Properties",   type:"brand",    color:"#f59e0b", igAccounts:["@urbanclassproperties","@urbanclass.insider"] },
];

const INIT_CONTENT = [
  { id:"c1",  wsId:"ws-ucp",   title:"Dubai South — Why Smart Investors Are Moving South",  platforms:["IG","YT"],       igAccount:"@urbanclassproperties", status:"approved_script",            date:fmt(today),             is_scheduled:true,  client:"Urban Class Properties", caption:"the skyline is shifting south →", script:"Hook: Everyone's talking Downtown. Real money moves south...", hashtags:"#dubaisouth #realestate", notes:"Aerial B-roll." },
  { id:"c2",  wsId:"ws-ucp",   title:"3 Reasons Dubai is Safer Than You Think",             platforms:["IG","TikTok"],   igAccount:"@urbanclassproperties", status:"shooting_done_post_planned", date:fmt(today),             is_scheduled:false, client:"Urban Class Properties", caption:"stop listening to the noise ↓", script:"", hashtags:"#dubai #investment", notes:"" },
  { id:"c3",  wsId:"ws-ucp",   title:"Off-Plan vs Ready — Which Wins in 2025?",            platforms:["IG"],            igAccount:"@urbanclassproperties", status:"ideation_room",              date:fmt(addDays(today,2)),  is_scheduled:false, client:"", caption:"", script:"", hashtags:"", notes:"Compare ROI data." },
  { id:"c4",  wsId:"ws-ucp",   title:"How NRIs Are Beating Indian Real Estate Returns",    platforms:["IG","LinkedIn"], igAccount:"@urbanclassproperties", status:"ideation_room",              date:null,                   is_scheduled:false, client:"", caption:"", script:"", hashtags:"", notes:"" },
  { id:"c5",  wsId:"ws-ucp",   title:"Creek Harbour Deep Dive",                            platforms:["YT"],            igAccount:null,                    status:"approved_script",            date:fmt(addDays(today,3)),  is_scheduled:false, client:"Urban Class Properties", caption:"", script:"Full 8-min explainer.", hashtags:"", notes:"" },
  { id:"c6",  wsId:"ws-ucp",   title:"What AED 10k/month Can Buy You in Dubai",           platforms:["IG","TikTok"],   igAccount:"@urbanclassproperties", status:"published",                  date:fmt(addDays(today,-3)), is_scheduled:true,  client:"Urban Class Properties", caption:"your salary can afford dubai →", script:"", hashtags:"#dubailiving", notes:"42k views." },
  { id:"c7",  wsId:"ws-ucp",   title:"Office Life — Team Monday Vibe",                    platforms:["IG"],            igAccount:"@urbanclass.insider",       status:"shooting_done_post_planned", date:fmt(addDays(today,1)),  is_scheduled:true,  client:"", caption:"mondays hit different", script:"", hashtags:"#officelife", notes:"" },
  { id:"c8",  wsId:"ws-ucp",   title:"Mortgage Rejection? Here's What Actually Happened", platforms:["IG","LinkedIn"], igAccount:"@urbanclassproperties", status:"editing_phase",              date:fmt(addDays(today,4)),  is_scheduled:false, client:"", caption:"", script:"", hashtags:"", notes:"FOIR angle." },
  { id:"c9",  wsId:"ws-ucp",   title:"Meydan — The Underrated Address",                   platforms:["IG"],            igAccount:"@urbanclassproperties", status:"to_be_published",            date:fmt(addDays(today,1)),  is_scheduled:true,  client:"Urban Class Properties", caption:"", script:"", hashtags:"#meydan", notes:"" },
  { id:"c10", wsId:"ws-surya", title:"Behind the Scenes — My Dubai Content Day",          platforms:["IG"],            igAccount:"@noyalsurya",           status:"ideation_room",              date:fmt(addDays(today,6)),  is_scheduled:false, client:"", caption:"", script:"", hashtags:"#contentcreator", notes:"Personal vlog." },
  { id:"c11", wsId:"ws-surya", title:"Why I Moved Into Real Estate Content",              platforms:["IG","YT"],       igAccount:"@surya.creates",        status:"approved_script",            date:fmt(addDays(today,7)),  is_scheduled:false, client:"", caption:"", script:"Talking head, honest story.", hashtags:"", notes:"" },
];

// ─── TINY ATOMS ───────────────────────────────────────────────────────────────
const PBadge = ({ p }) => {
  const c = PC[p] || { bg:"#22222222", text:"#aaa", border:"#44444444" };
  return <span style={{padding:"2px 7px",borderRadius:4,fontSize:10,fontWeight:500,letterSpacing:"0.05em",border:"1px solid",background:c.bg,color:c.text,borderColor:c.border}}>{p}</span>;
};
const SDot = ({ status }) => {
  const s = STATUSES.find(x=>x.key===status);
  return <span style={{width:7,height:7,borderRadius:"50%",display:"inline-block",flexShrink:0,background:s?.color||"#555"}}/>;
};
const SchedPill = ({ v }) => v
  ? <span style={{marginLeft:"auto",fontSize:10,padding:"2px 8px",borderRadius:20,background:"#4ade8018",color:"#4ade80",border:"1px solid #4ade8040"}}>● Sched</span>
  : <span style={{marginLeft:"auto",fontSize:10,padding:"2px 8px",borderRadius:20,background:"#3a3a5833",color:"#7070a0",border:"1px solid #1f1f30"}}>○ Unsched</span>;

// ─── CARD ─────────────────────────────────────────────────────────────────────
const Card = ({ item, onClick, draggable, onDragStart, onDragEnd, faded }) => (
  <div onClick={onClick} draggable={draggable} onDragStart={onDragStart} onDragEnd={onDragEnd}
    style={{background:"#13131e",border:"1px solid #1f1f30",borderRadius:9,padding:"12px 14px",cursor:"pointer",transition:"all .15s",opacity: faded ? 0.35 : 1, position:"relative",overflow:"hidden"}}>
    <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:13,fontWeight:500,color:"#ededf5",lineHeight:1.4,marginBottom:8}}>{item.title}</div>
    <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
      <SDot status={item.status}/>
      {item.platforms.map(p=><PBadge key={p} p={p}/>)}
      <SchedPill v={item.is_scheduled}/>
    </div>
    {item.igAccount && <div style={{fontSize:10,color:"#7c6af7",marginTop:5,fontWeight:500}}>{item.igAccount}</div>}
    {item.date && <div style={{fontSize:10,color:"#7070a0",marginTop:4}}>{item.date}</div>}
    {item.client && <div style={{fontSize:10,color:"#7070a0",marginTop:2}}>↳ {item.client}</div>}
  </div>
);

// ─── CREATE WS MODAL ─────────────────────────────────────────────────────────
function CreateWsModal({ onClose, onCreate }) {
  const [name,setName] = useState("");
  const [type,setType] = useState("brand");
  const [color,setColor] = useState(WS_COLORS[0]);
  const [igInput,setIgInput] = useState("");
  const [igAccounts,setIgAccounts] = useState([]);
  const addIg = () => { if(!igInput.trim()) return; const h=igInput.startsWith("@")?igInput:"@"+igInput; setIgAccounts(a=>[...a,h]); setIgInput(""); };
  const I = {background:"#08080d",border:"1px solid #1f1f30",borderRadius:7,color:"#ededf5",fontFamily:"'Fira Code',monospace",fontSize:12,padding:"7px 11px",outline:"none",width:"100%"};
  const L = {fontSize:9,letterSpacing:"0.16em",textTransform:"uppercase",color:"#7070a0",display:"block",marginBottom:5};
  return (
    <div style={{background:"#13131e",border:"1px solid #2a2a3e",borderRadius:14,width:380,maxWidth:"96vw",padding:26,boxShadow:"0 24px 64px rgba(0,0,0,.6)"}}>
      <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:17,fontWeight:600,marginBottom:20,color:"#ededf5"}}>New Workspace</div>
      <div style={{marginBottom:14}}><label style={L}>Workspace Name</label><input style={I} value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. My Brand"/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
        <div><label style={L}>Type</label>
          <select style={{...I,appearance:"none",cursor:"pointer"}} value={type} onChange={e=>setType(e.target.value)}>
            <option value="personal">Personal</option>
            <option value="brand">Brand / Client</option>
          </select>
        </div>
        <div><label style={L}>Color</label>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginTop:4}}>
            {WS_COLORS.map(c=><div key={c} onClick={()=>setColor(c)} style={{width:22,height:22,borderRadius:"50%",background:c,cursor:"pointer",border:`2px solid ${color===c?"#ededf5":"transparent"}`,transition:"border .12s"}}/>)}
          </div>
        </div>
      </div>
      <div style={{marginBottom:20}}>
        <label style={L}>IG Accounts</label>
        {igAccounts.map((a,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
            <span style={{background:"#e1306c18",color:"#e1306c",border:"1px solid #e1306c40",borderRadius:5,padding:"4px 10px",fontSize:11,flex:1}}>{a}</span>
            <button onClick={()=>setIgAccounts(acc=>acc.filter((_,j)=>j!==i))} style={{background:"transparent",border:"none",color:"#3a3a58",cursor:"pointer",fontSize:15,padding:"2px 5px"}}>×</button>
          </div>
        ))}
        <div style={{display:"flex",gap:6,marginTop:4}}>
          <input style={{...I,flex:1}} value={igInput} onChange={e=>setIgInput(e.target.value)} placeholder="@handle" onKeyDown={e=>e.key==="Enter"&&addIg()}/>
          <button onClick={addIg} style={{background:"#7c6af7",color:"#fff",border:"none",borderRadius:7,padding:"6px 12px",cursor:"pointer",fontFamily:"'Fira Code',monospace",fontSize:11}}>Add</button>
        </div>
      </div>
      <div style={{display:"flex",gap:9,paddingTop:14,borderTop:"1px solid #1f1f30"}}>
        <button onClick={()=>{if(!name.trim())return;onCreate({id:genId(),name,type,color,igAccounts});}} style={{background:"#7c6af7",color:"#fff",border:"none",borderRadius:7,padding:"8px 18px",cursor:"pointer",fontFamily:"'Fira Code',monospace",fontSize:12,fontWeight:500}}>Create</button>
        <button onClick={onClose} style={{background:"transparent",color:"#7070a0",border:"1px solid #1f1f30",borderRadius:7,padding:"8px 18px",cursor:"pointer",fontFamily:"'Fira Code',monospace",fontSize:12}}>Cancel</button>
      </div>
    </div>
  );
}

// ─── CONTENT MODAL ───────────────────────────────────────────────────────────
function ContentModal({ item, workspace, onClose, onSave, onDelete }) {
  const [form, setForm] = useState({...item});
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const toggleP = p => set("platforms", form.platforms.includes(p) ? form.platforms.filter(x=>x!==p) : [...form.platforms,p]);
  const I = {background:"#08080d",border:"1px solid #1f1f30",borderRadius:7,color:"#ededf5",fontFamily:"'Fira Code',monospace",fontSize:12,padding:"7px 11px",outline:"none",width:"100%",transition:"border-color .14s"};
  const L = {fontSize:9,letterSpacing:"0.16em",textTransform:"uppercase",color:"#7070a0",display:"block",marginBottom:5};
  const igOptions = workspace?.igAccounts || [];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.72)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(5px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"#13131e",border:"1px solid #2a2a3e",borderRadius:14,width:660,maxWidth:"96vw",maxHeight:"90vh",overflowY:"auto",padding:26,boxShadow:"0 24px 64px rgba(0,0,0,.6)"}}>
        {/* header */}
        <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:20}}>
          <textarea value={form.title} onChange={e=>set("title",e.target.value)} rows={2}
            style={{flex:1,background:"transparent",border:"none",fontFamily:"'Playfair Display',serif",fontSize:20,color:"#ededf5",outline:"none",resize:"none",lineHeight:1.3}} placeholder="Post title..."/>
          <button onClick={onClose} style={{background:"transparent",border:"1px solid #1f1f30",color:"#7070a0",width:30,height:30,borderRadius:7,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>
        </div>
        {/* row 1 */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:13}}>
          <div><label style={L}>Status</label>
            <select style={{...I,appearance:"none",cursor:"pointer"}} value={form.status} onChange={e=>set("status",e.target.value)}>
              {STATUSES.map(s=><option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
          <div><label style={L}>Date</label><input type="date" style={I} value={form.date||""} onChange={e=>set("date",e.target.value||null)}/></div>
          <div><label style={L}>Client</label><input style={I} value={form.client||""} onChange={e=>set("client",e.target.value)} placeholder="Client name..."/></div>
        </div>
        {/* row 2 */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:13}}>
          <div><label style={L}>Platforms</label>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {PLATFORMS.map(p=>{const c=PC[p];const on=form.platforms.includes(p);return(
                <button key={p} onClick={()=>toggleP(p)} style={{padding:"4px 11px",borderRadius:5,border:"1px solid",background:on?c.bg:"transparent",color:on?c.text:"#7070a0",borderColor:on?c.border:"#1f1f30",cursor:"pointer",fontFamily:"'Fira Code',monospace",fontSize:10.5,transition:"all .14s"}}>{p}</button>
              );})}
            </div>
          </div>
          <div><label style={L}>IG Account</label>
            {igOptions.length>0
              ? <select style={{...I,appearance:"none",cursor:"pointer"}} value={form.igAccount||""} onChange={e=>set("igAccount",e.target.value)}>
                  <option value="">— none —</option>
                  {igOptions.map(a=><option key={a} value={a}>{a}</option>)}
                </select>
              : <input style={I} value={form.igAccount||""} onChange={e=>set("igAccount",e.target.value)} placeholder="@handle"/>
            }
          </div>
        </div>
        {/* scheduled */}
        <div style={{display:"flex",alignItems:"center",gap:9,padding:"8px 0",marginBottom:12}}>
          <input type="checkbox" id="sched" checked={form.is_scheduled} onChange={e=>set("is_scheduled",e.target.checked)} style={{width:15,height:15,accentColor:"#7c6af7",cursor:"pointer"}}/>
          <label htmlFor="sched" style={{fontSize:12,cursor:"pointer",color:form.is_scheduled?"#4ade80":"#7070a0"}}>Scheduled on platform</label>
        </div>
        {/* text fields */}
        {[["Caption","caption","Instagram caption...",56],["Script","script","Script / talking points...",88]].map(([lbl,key,ph,mh])=>(
          <div key={key} style={{marginBottom:12}}>
            <label style={L}>{lbl}</label>
            <textarea style={{...I,resize:"vertical",minHeight:mh}} value={form[key]||""} onChange={e=>set(key,e.target.value)} placeholder={ph}/>
          </div>
        ))}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:4}}>
          {[["Hashtags","hashtags","#dubai #realestate"],["Notes","notes","Internal notes..."]].map(([lbl,key,ph])=>(
            <div key={key}><label style={L}>{lbl}</label><textarea style={{...I,resize:"vertical",minHeight:60}} value={form[key]||""} onChange={e=>set(key,e.target.value)} placeholder={ph}/></div>
          ))}
        </div>
        {/* actions */}
        <div style={{display:"flex",gap:9,paddingTop:14,marginTop:8,borderTop:"1px solid #1f1f30"}}>
          <button onClick={()=>onSave(form)} style={{background:"#7c6af7",color:"#fff",border:"none",borderRadius:7,padding:"8px 18px",cursor:"pointer",fontFamily:"'Fira Code',monospace",fontSize:12,fontWeight:500}}>Save</button>
          <button onClick={onClose} style={{background:"transparent",color:"#7070a0",border:"1px solid #1f1f30",borderRadius:7,padding:"8px 18px",cursor:"pointer",fontFamily:"'Fira Code',monospace",fontSize:12}}>Cancel</button>
          <button onClick={()=>onDelete(item.id)} style={{background:"transparent",color:"#f87171",border:"1px solid #f8717140",borderRadius:7,padding:"8px 18px",cursor:"pointer",fontFamily:"'Fira Code',monospace",fontSize:12,marginLeft:"auto"}}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ content, onCard }) {
  const td = fmt(today);
  const todayItems = content.filter(c=>c.date===td&&["approved_script","editing_phase","shooting_done_post_planned","to_be_published"].includes(c.status));
  const upcoming = content.filter(c=>c.date&&c.date>td&&c.status!=="published").sort((a,b)=>a.date.localeCompare(b.date));
  const pub = content.filter(c=>c.status==="published").length;
  const sched = content.filter(c=>c.is_scheduled&&c.status!=="published").length;
  const needs = content.filter(c=>["approved_script","editing_phase","shooting_done_post_planned","to_be_published"].includes(c.status)).length;
  const SL = {fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:"#3a3a58",marginBottom:12,display:"flex",alignItems:"center",gap:8};
  const Line = () => <span style={{flex:1,height:1,background:"#1f1f30"}}/>;
  return (
    <div style={{flex:1,overflowY:"auto",padding:24}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:24}}>
        {[["Due Today",todayItems.length,true],["In Pipeline",needs,false],["Scheduled",sched,false],["Published",pub,false]].map(([l,n,hi])=>(
          <div key={l} style={{background:hi?"#7c6af722":"#13131e",border:`1px solid ${hi?"#7c6af7":"#1f1f30"}`,borderRadius:10,padding:"14px 16px"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:30,color:hi?"#7c6af7":"#ededf5",lineHeight:1}}>{n}</div>
            <div style={{fontSize:9.5,letterSpacing:"0.14em",textTransform:"uppercase",color:"#7070a0",marginTop:3}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={SL}>Today <span style={{background:"#7c6af7",color:"#fff",width:17,height:17,borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700}}>{todayItems.length}</span><Line/></div>
      {todayItems.length===0 ? <div style={{color:"#3a3a58",fontSize:11.5,paddingBottom:24}}>Nothing due today — you're clear ✓</div>
        : <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:10,marginBottom:28}}>{todayItems.map(item=><Card key={item.id} item={item} onClick={()=>onCard(item)}/>)}</div>}
      <div style={SL}>Upcoming <span style={{background:"#7c6af7",color:"#fff",width:17,height:17,borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700}}>{upcoming.length}</span><Line/></div>
      {upcoming.length===0 ? <div style={{color:"#3a3a58",fontSize:11.5}}>No upcoming posts.</div>
        : <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:10}}>{upcoming.map(item=><Card key={item.id} item={item} onClick={()=>onCard(item)}/>)}</div>}
    </div>
  );
}

// ─── BOARD ────────────────────────────────────────────────────────────────────
function Board({ content, onCard, onStatusChange }) {
  const [dragId,setDragId] = useState(null);
  const [overCol,setOverCol] = useState(null);
  return (
    <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex",gap:12,padding:"18px 20px 14px",overflowX:"auto",height:"100%",alignItems:"flex-start"}}>
        {STATUSES.map(col=>{
          const items=content.filter(c=>c.status===col.key);
          return (
            <div key={col.key} style={{minWidth:222,width:222,flexShrink:0,display:"flex",flexDirection:"column",maxHeight:"100%"}}>
              <div style={{padding:"9px 12px",borderRadius:"9px 9px 0 0",display:"flex",alignItems:"center",gap:7,border:"1px solid #1f1f30",borderBottom:"none",background:"#13131e",flexShrink:0}}>
                <span style={{width:7,height:7,borderRadius:"50%",background:col.color,flexShrink:0}}/>
                <span style={{fontSize:10.5,fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase",flex:1,color:col.color}}>{col.label}</span>
                <span style={{fontSize:10,color:"#7070a0",background:"#1a1a28",padding:"1px 7px",borderRadius:10}}>{items.length}</span>
              </div>
              <div onDragOver={e=>{e.preventDefault();setOverCol(col.key);}} onDragLeave={()=>setOverCol(null)}
                onDrop={e=>{e.preventDefault();if(dragId)onStatusChange(dragId,col.key);setDragId(null);setOverCol(null);}}
                style={{flex:1,border:"1px solid #1f1f30",borderTop:"none",borderRadius:"0 0 9px 9px",background:overCol===col.key?"#7c6af722":"#0e0e16",padding:8,display:"flex",flexDirection:"column",gap:7,overflowY:"auto",minHeight:300,transition:"background .12s"}}>
                {items.length===0
                  ? <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 12px",color:"#3a3a58",fontSize:10.5,gap:6,flex:1}}><span style={{fontSize:20,opacity:.3}}>○</span>Empty</div>
                  : items.map(item=><Card key={item.id} item={item} onClick={()=>onCard(item)} draggable onDragStart={e=>{setDragId(item.id);e.dataTransfer.effectAllowed="move";}} onDragEnd={()=>{setDragId(null);setOverCol(null);}} faded={dragId===item.id}/>)
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── CALENDAR ────────────────────────────────────────────────────────────────
function CalendarView({ content, onCard }) {
  const [vd,setVd] = useState(new Date(today.getFullYear(),today.getMonth(),1));
  const yr=vd.getFullYear(), mo=vd.getMonth();
  const first=new Date(yr,mo,1).getDay(), dim=new Date(yr,mo+1,0).getDate(), dimPrev=new Date(yr,mo,0).getDate();
  const cells=[];
  for(let i=0;i<first;i++) cells.push({day:dimPrev-first+1+i,curr:false});
  for(let i=1;i<=dim;i++) cells.push({day:i,curr:true});
  const rem=42-cells.length; for(let i=1;i<=rem;i++) cells.push({day:i,curr:false});
  const getItems=(day,curr)=>{ if(!curr) return []; const ds=`${yr}-${String(mo+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`; return content.filter(c=>c.date===ds); };
  const isToday=(day,curr)=>curr&&day===today.getDate()&&mo===today.getMonth()&&yr===today.getFullYear();
  return (
    <div style={{flex:1,overflowY:"auto",padding:24}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
        <span style={{fontFamily:"'Playfair Display',serif",fontSize:22,flex:1}}>{MONTHS[mo]} {yr}</span>
        {["‹","›"].map((ch,i)=>(
          <button key={ch} onClick={()=>setVd(new Date(yr,mo+(i===0?-1:1),1))} style={{background:"#13131e",border:"1px solid #1f1f30",color:"#ededf5",width:30,height:30,borderRadius:7,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{ch}</button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1,background:"#1f1f30",border:"1px solid #1f1f30",borderRadius:11,overflow:"hidden"}}>
        {DAYS_SHORT.map(d=><div key={d} style={{background:"#13131e",padding:"8px 10px",fontSize:9.5,letterSpacing:"0.14em",textTransform:"uppercase",color:"#7070a0",textAlign:"center"}}>{d}</div>)}
        {cells.map((cell,i)=>{
          const items=getItems(cell.day,cell.curr);
          return (
            <div key={i} style={{background:isToday(cell.day,cell.curr)?"#7c6af722":cell.curr?"#13131e":"#08080d",minHeight:100,padding:7}}>
              <div style={{fontSize:10.5,color:isToday(cell.day,cell.curr)?"#7c6af7":"#7070a0",marginBottom:4,fontWeight:isToday(cell.day,cell.curr)?700:400}}>{cell.day}</div>
              {items.slice(0,3).map(item=>(
                <div key={item.id} onClick={()=>onCard(item)} style={{background:"#1a1a28",border:"1px solid #1f1f30",borderRadius:4,padding:"3px 6px",marginBottom:3,fontSize:9.5,cursor:"pointer",color:"#ededf5",display:"flex",alignItems:"center",gap:4,lineHeight:1.3}}>
                  <SDot status={item.status}/>
                  <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.title}</span>
                </div>
              ))}
              {items.length>3&&<div style={{fontSize:9.5,color:"#3a3a58",paddingLeft:3}}>+{items.length-3} more</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [workspaces, setWorkspaces] = useCloudStorage("workspaces", INIT_WS);
  const [activeWsId, setActiveWsId] = useCloudStorage("active_ws", "ws-ucp");
  const [allContent, setAllContent] = useCloudStorage("content", INIT_CONTENT);
  
  const [route,setRoute] = useState("dashboard");
  const [modal,setModal] = useState(null);
  const [wsDropOpen,setWsDropOpen] = useState(false);
  const [createWsOpen,setCreateWsOpen] = useState(false);

  const ws = workspaces.find(w=>w.id===activeWsId);
  const content = allContent.filter(c=>c.wsId===activeWsId);

  const handleSave = upd => { setAllContent(prev=>prev.map(c=>c.id===upd.id?upd:c)); setModal(null); };
  const handleDelete = id => { setAllContent(prev=>prev.filter(c=>c.id!==id)); setModal(null); };
  const handleStatusChange = (id,status) => setAllContent(prev=>prev.map(c=>c.id===id?{...c,status}:c));
  const handleNew = () => {
    const blank={id:genId(),wsId:activeWsId,title:"New Post",platforms:["IG"],igAccount:ws?.igAccounts?.[0]||null,status:"ideation_room",date:fmt(today),is_scheduled:false,client:"",caption:"",script:"",hashtags:"",notes:""};
    setAllContent(prev=>[blank,...prev]); setModal(blank);
  };
  const handleCreateWs = w => { setWorkspaces(prev=>[...prev,w]); setActiveWsId(w.id); setCreateWsOpen(false); };

  const NAV = [{key:"dashboard",label:"Dashboard",icon:"◈"},{key:"board",label:"Board",icon:"⊞"},{key:"calendar",label:"Calendar",icon:"▦"}];
  const PAGE_TITLE = {dashboard:"Today",board:"Content Pipeline",calendar:"Calendar"};

  const SB = {fontFamily:"'Fira Code',monospace",fontSize:12,WebkitFontSmoothing:"antialiased"};

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700&family=Fira+Code:wght@300;400;500&family=Playfair+Display:ital,wght@0,600;1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:#08080d;color:#ededf5;font-family:'Fira Code',monospace;font-size:12.5px;-webkit-font-smoothing:antialiased;overflow:hidden;}
        ::-webkit-scrollbar{width:3px;height:3px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#2a2a3e;border-radius:2px;}
        select option{background:#13131e;color:#ededf5;}
      `}</style>

      <div style={{display:"flex",height:"100vh",overflow:"hidden",...SB}}>

        {/* ── SIDEBAR ── */}
        <nav style={{width:228,minWidth:228,background:"#0e0e16",borderRight:"1px solid #1f1f30",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {/* top */}
          <div style={{padding:"20px 18px 16px",borderBottom:"1px solid #1f1f30"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:21,color:"#ededf5",letterSpacing:"-0.01em",lineHeight:1.1}}>
              Noyal Surya's <span style={{color:"#7c6af7"}}>workspace</span>
            </div>
            {/* workspace selector */}
            <div style={{marginTop:12,background:"#1a1a28",border:"1px solid #2a2a3e",borderRadius:8,padding:"8px 10px",cursor:"pointer",position:"relative"}} onClick={()=>setWsDropOpen(o=>!o)}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{width:8,height:8,borderRadius:"50%",background:ws?.color,flexShrink:0}}/>
                <span style={{fontSize:11.5,fontWeight:500,flex:1,color:"#ededf5",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ws?.name}</span>
                <span style={{fontSize:9,color:"#7070a0"}}>{wsDropOpen?"▲":"▼"}</span>
              </div>
              <div style={{fontSize:9,color:"#7070a0",letterSpacing:"0.12em",textTransform:"uppercase",marginTop:2,paddingLeft:16}}>{ws?.type==="personal"?"Personal":"Brand / Client"}</div>
              {/* dropdown */}
              {wsDropOpen && (
                <div style={{position:"absolute",top:"calc(100% + 6px)",left:0,right:0,background:"#1a1a28",border:"1px solid #2a2a3e",borderRadius:10,zIndex:200,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,.5)"}}>
                  {workspaces.map(w=>(
                    <div key={w.id} onClick={e=>{e.stopPropagation();setActiveWsId(w.id);setWsDropOpen(false);}}
                      style={{padding:"9px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,background:w.id===activeWsId?"#7c6af722":"transparent",fontSize:12,transition:"background .12s"}}>
                      <span style={{width:7,height:7,borderRadius:"50%",background:w.color,flexShrink:0}}/>
                      <span style={{flex:1,fontWeight:500}}>{w.name}</span>
                      {w.id===activeWsId&&<span style={{fontSize:10,color:"#7c6af7"}}>✓</span>}
                    </div>
                  ))}
                  <div onClick={e=>{e.stopPropagation();setWsDropOpen(false);setCreateWsOpen(true);}}
                    style={{padding:"9px 12px",cursor:"pointer",fontSize:11,color:"#7070a0",borderTop:"1px solid #1f1f30",display:"flex",alignItems:"center",gap:6,transition:"color .12s"}}>
                    ＋ New workspace
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* nav */}
          <div style={{padding:"14px 0 4px",flexShrink:0}}>
            <div style={{fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:"#3a3a58",padding:"0 18px 6px"}}>Views</div>
            {NAV.map(n=>(
              <div key={n.key} onClick={()=>setRoute(n.key)}
                style={{display:"flex",alignItems:"center",gap:9,padding:"8px 18px",cursor:"pointer",color:route===n.key?"#7c6af7":"#7070a0",background:route===n.key?"#7c6af722":"transparent",borderLeft:`2px solid ${route===n.key?"#7c6af7":"transparent"}`,fontSize:12,transition:"all .12s"}}>
                <span style={{fontSize:13,width:15,textAlign:"center"}}>{n.icon}</span>{n.label}
              </div>
            ))}
          </div>

          {/* IG accounts quick-view */}
          {ws?.igAccounts?.length > 0 && (
            <div style={{padding:"10px 18px",borderTop:"1px solid #1f1f30",marginTop:8}}>
              <div style={{fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:"#3a3a58",marginBottom:7}}>IG Accounts</div>
              {ws.igAccounts.map(a=>(
                <div key={a} style={{fontSize:11,color:"#e1306c",padding:"3px 0",display:"flex",alignItems:"center",gap:6}}>
                  <span style={{width:5,height:5,borderRadius:"50%",background:"#e1306c",flexShrink:0}}/>
                  {a}
                </div>
              ))}
            </div>
          )}

          {/* footer */}
          <div style={{marginTop:"auto",padding:"16px 18px",borderTop:"1px solid #1f1f30", display: "flex", flexDirection: "column", gap: 8}}>
            <button onClick={handleNew} style={{width:"100%",background:"#7c6af7",color:"#fff",border:"none",borderRadius:8,padding:"9px 12px",cursor:"pointer",fontFamily:"'Fira Code',monospace",fontSize:12,fontWeight:500,display:"flex",alignItems:"center",justifyContent:"center",gap:7,transition:"background .15s"}}>
              ＋ New Post
            </button>
            <button onClick={resetCloudData} style={{width:"100%",background:"transparent",color:"#f87171",border:"1px solid #f8717140",borderRadius:8,padding:"9px 12px",cursor:"pointer",fontFamily:"'Fira Code',monospace",fontSize:12,transition:"background .15s"}}>
              Reset Data
            </button>
          </div>
        </nav>

        {/* ── MAIN ── */}
        <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
          {/* topbar */}
          <div style={{height:52,background:"#0e0e16",borderBottom:"1px solid #1f1f30",display:"flex",alignItems:"center",padding:"0 24px",gap:14,flexShrink:0}}>
            <span style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:15,fontWeight:600,flex:1}}>{PAGE_TITLE[route]}</span>
            <span style={{padding:"3px 10px",borderRadius:20,fontSize:10,fontWeight:500,letterSpacing:"0.05em",border:"1px solid",color:ws?.color,borderColor:ws?.color+"55",background:ws?.color+"12"}}>{ws?.name}</span>
            <span style={{fontSize:11,color:"#7070a0"}}>{today.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",year:"numeric"})}</span>
          </div>

          {/* page */}
          <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
            {route==="dashboard" && <Dashboard content={content} onCard={setModal}/>}
            {route==="board"     && <Board content={content} onCard={setModal} onStatusChange={handleStatusChange}/>}
            {route==="calendar"  && <CalendarView content={content} onCard={setModal}/>}
          </div>
        </div>
      </div>

      {/* content modal */}
      {modal && <ContentModal item={modal} workspace={ws} onClose={()=>setModal(null)} onSave={handleSave} onDelete={handleDelete}/>}

      {/* create workspace modal */}
      {createWsOpen && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.72)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(5px)"}} onClick={e=>e.target===e.currentTarget&&setCreateWsOpen(false)}>
          <CreateWsModal onClose={()=>setCreateWsOpen(false)} onCreate={handleCreateWs}/>
        </div>
      )}
    </>
  );
}
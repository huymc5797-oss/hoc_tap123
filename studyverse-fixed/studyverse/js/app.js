(function(){
  const navItems=[
    ["trangchu.html","⌂","Trang chủ","home"],
    ["kho-tai-lieu.html","▤","Kho tài liệu","documents"],
    ["pomodoro.html","◷","Pomodoro","pomodoro"],
    ["flashcard.html","▣","Flashcard","flashcard"],
    ["quiz.html","◎","Quiz","quiz"],
    ["de-thi.html","▤","Đề thi","exam"],
    ["lo-trinh.html","⌁","Lộ trình cá nhân","roadmap"],
    ["thong-ke.html","▥","Thống kê","statistics"]
  ];
  const page=document.body.dataset.page||"home";
  const getUser=()=>{try{return JSON.parse(localStorage.getItem("sv_user")||"null")}catch(e){return null}};
  window.SV={
    getUser,
    getData(key,fallback){try{const v=localStorage.getItem("sv_"+key);return v?JSON.parse(v):fallback}catch(e){return fallback}},
    setData(key,value){localStorage.setItem("sv_"+key,JSON.stringify(value))},
    toast(message,type=""){const root=document.getElementById("toast-root");if(!root)return;const el=document.createElement("div");el.className="toast "+type;el.textContent=message;root.appendChild(el);setTimeout(()=>el.remove(),3400)},
    escape(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))},
    formatMinutes(n){n=Math.max(0,Math.round(n||0));const h=Math.floor(n/60),m=n%60;return h?`${h} giờ ${m} phút`:`${m} phút`},
    todayKey(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`},
    recordActivity(type,label,extra={}){const a=this.getData("activity",[]);a.unshift({type,label,at:new Date().toISOString(),...extra});this.setData("activity",a.slice(0,100))},
    navItems
  };
  const sidebar=document.getElementById("sidebar");
  if(sidebar){
    sidebar.innerHTML=`<div class="brand"><div class="brand-mark">S</div><div><div class="brand-name">studyverse<span style="color:#62b5ff">.</span></div><div class="brand-sub">LEARN WITH INTENTION</div></div></div><div class="nav-label">WORKSPACE</div><nav class="nav-list">${navItems.map(([href,icon,label,key])=>`<a class="nav-link ${page===key?"active":""}" href="${href}"><span class="nav-icon">${icon}</span><span>${label}</span></a>`).join("")}</nav><div class="sidebar-bottom"><div class="sidebar-tip"><span style="color:#75bdff">✦ DAILY REMINDER</span><strong>Tiến bộ từng chút một.</strong><p>Những phiên học nhỏ sẽ tạo nên thói quen lớn.</p></div><nav class="nav-list"><a class="nav-link ${page==="settings"?"active":""}" href="cai-dat.html"><span class="nav-icon">⚙</span><span>Cài đặt</span></a></nav><div class="user-mini"><div class="avatar" id="sidebar-avatar">G</div><div><strong id="sidebar-username">Khách học tập</strong><small id="sidebar-user-status">Chế độ khách</small></div></div></div>`;
  }
  const topbar=document.getElementById("topbar");
  if(topbar){
    topbar.innerHTML=`<div class="topbar-left"><button class="icon-button mobile-menu" id="mobile-menu" aria-label="Mở menu">☰</button><span class="breadcrumb">Không gian học tập <span style="color:#33495d">/</span> ${({home:"Tổng quan",documents:"Kho tài liệu",pomodoro:"Pomodoro",flashcard:"Flashcard",quiz:"Quiz",exam:"Đề thi",roadmap:"Lộ trình cá nhân",statistics:"Thống kê",settings:"Cài đặt"}[page]||"Studyverse")}</span></div><div class="topbar-right"><input class="global-search" id="global-search" placeholder="⌕  Tìm nhanh..." aria-label="Tìm nhanh">${getUser()?"":"<a class=\"button button-secondary auth-top-link\" href=\"dang-nhap.html\">Đăng nhập</a><a class=\"button button-primary auth-top-link\" href=\"dang-ky.html\">Đăng ký</a>"}<button class="icon-button" id="top-notification" aria-label="Thông báo">♧</button><a class="top-avatar" id="top-avatar" href="dang-nhap.html">G</a></div>`;
    document.getElementById("mobile-menu")?.addEventListener("click",()=>sidebar?.classList.toggle("open"));
    document.getElementById("top-notification")?.addEventListener("click",()=>SV.toast("Bạn đã cập nhật phiên bản Studyverse mới nhất."));
    document.getElementById("global-search")?.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.value.trim()){location.href="kho-tai-lieu.html?q="+encodeURIComponent(e.target.value.trim())}});
  }
  const user=getUser();
  if(user){
    const name=user.username||"Học viên";
    const el=document.getElementById("sidebar-username");if(el)el.textContent=name;
    const av=document.getElementById("sidebar-avatar");if(av)av.textContent=name[0].toUpperCase();
    const status=document.getElementById("sidebar-user-status");if(status)status.textContent="Đã đăng nhập (demo)";
    const top=document.getElementById("top-avatar");if(top){top.textContent=name[0].toUpperCase();top.href="cai-dat.html";top.title=name}
  }
  const date=document.getElementById("today-date");if(date)date.textContent=new Intl.DateTimeFormat("vi-VN",{weekday:"short",day:"numeric",month:"short",year:"numeric"}).format(new Date());
  const reduce=localStorage.getItem("sv_reduce_motion")==="true";if(reduce)document.body.classList.add("reduce-motion");
  document.addEventListener("click",e=>{if(sidebar&&!sidebar.contains(e.target)&&!e.target.closest("#mobile-menu"))sidebar.classList.remove("open")});
})();

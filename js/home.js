(function(){
 const {getData,setData,toast,recordActivity,formatMinutes,todayKey,escape}=SV;
 const user=SV.getUser();const title=document.getElementById("welcome-title");if(title&&user)title.textContent=`Chào ${user.username} quay trở lại 👋`;
 let tasks=getData("tasks",null);if(!tasks){tasks=[{id:1,text:"Học tập trung một phiên Pomodoro",done:false},{id:2,text:"Ôn lại 10 Flashcard",done:false},{id:3,text:"Làm một Quiz ngắn",done:false}];setData("tasks",tasks)}
 const renderTasks=()=>{const root=document.getElementById("task-list");root.innerHTML=tasks.length?tasks.map(t=>`<div class="task-item ${t.done?"done":""}"><input class="task-check" type="checkbox" data-id="${t.id}" ${t.done?"checked":""} aria-label="Hoàn thành nhiệm vụ"><span class="task-text">${escape(t.text)}</span><button class="task-delete" data-delete="${t.id}" aria-label="Xóa nhiệm vụ">×</button></div>`).join(""):`<div class="empty-state">Chưa có nhiệm vụ. Thêm một việc nhỏ để bắt đầu nhé.</div>`;document.getElementById("stat-tasks").textContent=tasks.filter(t=>t.done).length};
 renderTasks();
 document.getElementById("add-task").addEventListener("click",()=>{document.getElementById("task-form").classList.toggle("hidden");document.getElementById("task-input").focus()});
 document.getElementById("task-form").addEventListener("submit",e=>{e.preventDefault();const input=document.getElementById("task-input"),text=input.value.trim();if(!text)return;tasks.push({id:Date.now(),text,done:false});setData("tasks",tasks);input.value="";renderTasks();toast("Đã thêm nhiệm vụ.")});
 document.getElementById("task-list").addEventListener("change",e=>{if(e.target.matches(".task-check")){const t=tasks.find(x=>x.id===Number(e.target.dataset.id));if(t){t.done=e.target.checked;setData("tasks",tasks);if(t.done)recordActivity("task","Hoàn thành nhiệm vụ: "+t.text);renderTasks();updateStats()}}});
 document.getElementById("task-list").addEventListener("click",e=>{const b=e.target.closest("[data-delete]");if(b){tasks=tasks.filter(t=>t.id!==Number(b.dataset.delete));setData("tasks",tasks);renderTasks()}});
 function weekData(){const sessions=getData("sessions",[]),out=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const key=todayKey(d);out.push({key,label:new Intl.DateTimeFormat("vi-VN",{weekday:"short"}).format(d),value:sessions.filter(s=>s.day===key).reduce((n,s)=>n+(s.minutes||0),0)})}return out}
 function drawChart(){const data=weekData(),max=Math.max(1,...data.map(x=>x.value));document.getElementById("weekly-chart").innerHTML=data.map(x=>`<div class="bar-column"><span class="bar-value">${x.value||""}</span><div class="bar" style="height:${Math.max(3,x.value/max*78)}%"></div><span class="bar-day">${x.label}</span></div>`).join("")}
 function updateStats(){const sessions=getData("sessions",[]),today=todayKey(),todaySessions=sessions.filter(s=>s.day===today);document.getElementById("stat-focus").textContent=formatMinutes(sessions.reduce((n,s)=>n+(s.minutes||0),0));document.getElementById("stat-pomodoros").textContent=sessions.length;document.getElementById("stat-streak").textContent=sessions.some(s=>s.day===today)?"1 ngày":"0 ngày";document.getElementById("stat-tasks").textContent=tasks.filter(t=>t.done).length;drawChart()}
 updateStats();

// Cập nhật tiến độ lộ trình trên trang chủ
(function updateHomeRoadmapProgress() {
  const items = getData("roadmap", []);
  const total = items.length;
  const completed = items.filter(item => item.done).length;

  const percent = total > 0
    ? Math.round(completed / total * 100)
    : 0;

  const bar = document.getElementById("home-roadmap-progress");
  const label = document.getElementById("home-roadmap-percent");

  if (bar) {
    bar.style.width = percent + "%";
  }

  if (label) {
    label.textContent = percent + "%";
  }
})();

const data=window.CAPSULE_DATA||[],grid=document.getElementById("memoryGrid"),tf=document.getElementById("themeFilter"),yf=document.getElementById("yearFilter"),q=document.getElementById("searchInput"),modal=document.getElementById("memoryModal"),mc=document.getElementById("modalContent");const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));document.getElementById("openCapsule").onclick=()=>{document.getElementById("intro").classList.add("hidden");sessionStorage.setItem("opened","1")};if(sessionStorage.getItem("opened"))document.getElementById("intro").classList.add("hidden");[...new Set(data.flatMap(d=>d.themes))].sort().forEach(t=>tf.add(new Option(t,t)));[...new Set(data.map(d=>d.year).filter(Boolean))].sort().forEach(y=>yf.add(new Option(y,y)));function filtered(){const s=q.value.toLowerCase();return data.filter(d=>(!s||JSON.stringify(d).toLowerCase().includes(s))&&(!tf.value||d.themes.includes(tf.value))&&(!yf.value||d.year===yf.value))}function render(){const items=filtered();grid.innerHTML=items.map((d,i)=>{const cover=d.media.find(m=>m.type==="image");return `<article class="memory-card ${cover?"has-card-image":""}" data-id="${d.id}">${cover?`<div class="card-image"><img src="${esc(cover.url)}" alt="Submitted Time Capsule photograph" loading="lazy"><div class="card-image-shade"></div></div>`:""}<div class="card-content"><div class="card-number">${String(i+1).padStart(2,"0")}</div><div class="card-meta">${esc([d.year,d.location].filter(Boolean).join(" - "))}</div><blockquote>“${esc(d.quote)}”</blockquote><div class="theme-tags">${d.themes.map(t=>`<span class="theme-tag">${esc(t)}</span>`).join("")}</div>${d.media.length?`<div class="card-artifact-count">${d.media.length} artifact${d.media.length===1?"":"s"}</div>`:""}</div></article>`}).join("");document.querySelectorAll(".memory-card").forEach(c=>c.onclick=()=>openMemory(c.dataset.id))}function openMemory(id){const d=data.find(x=>x.id===id);if(!d)return;const media=d.media.map(m=>m.type==="image"?`<img src="${m.url}">`:`<a class="file-link" href="${m.url}" target="_blank">Open artifact: ${esc(m.name)}</a>`).join("");mc.innerHTML=`<article class="modal-body"><div>${esc([d.label,d.year,d.location].filter(Boolean).join(" - "))}</div><h2>Memory for 2100</h2><blockquote class="modal-quote">“${esc(d.quote)}”</blockquote>${d.reflection?`<section class="modal-section"><h3>Reflection / Prediction</h3><p>${esc(d.reflection)}</p></section>`:""}${d.meaning?`<section class="modal-section"><h3>What Fulbright means to me</h3><p>${esc(d.meaning)}</p></section>`:""}${media?`<div class="modal-media">${media}</div>`:""}</article>`;modal.showModal()}document.getElementById("modalClose").onclick=()=>modal.close();function random(){if(data.length)openMemory(data[Math.floor(Math.random()*data.length)].id)}document.getElementById("randomMemory").onclick=random;document.getElementById("randomHero").onclick=random;tf.onchange=yf.onchange=render;q.oninput=render;const decades=new Set(data.map(d=>d.yearStart).filter(Boolean).map(y=>Math.floor(y/10)*10));document.getElementById("stats").innerHTML=[[data.length,"Voices preserved"],[decades.size,"Decades represented"],[new Set(data.map(d=>d.location).filter(Boolean)).size,"Locations"],[2100,"Year of opening"]].map(x=>`<div class="stat"><strong>${x[0]}</strong><span>${x[1]}</span></div>`).join("");const timelineEntries=data.filter(d=>d.yearStart).sort((a,b)=>a.yearStart-b.yearStart);
let timelineIndex=0;
const timelineTrack=document.getElementById("timelineTrack");
const featureMedia=document.getElementById("timelineFeatureMedia");
const featureYear=document.getElementById("timelineFeatureYear");
const featureLocation=document.getElementById("timelineFeatureLocation");
const featureQuote=document.getElementById("timelineFeatureQuote");
const featureThemes=document.getElementById("timelineFeatureThemes");
const timelinePosition=document.getElementById("timelinePosition");
const timelineOpenMemory=document.getElementById("timelineOpenMemory");

timelineTrack.innerHTML=timelineEntries.map((d,i)=>`
  <button class="timeline-item" data-index="${i}" aria-label="Open timeline entry for ${esc(d.year)}">
    <strong>${esc(d.year)}</strong>
    <span>${esc(d.themes[0]||"Fulbright memory")}</span>
  </button>`).join("")+
  `<div class="timeline-item future" aria-label="The Time Capsule opens in 2100">
    <strong>2100</strong><span>The capsule opens</span>
  </div>`;

function renderTimeline(index){
  if(!timelineEntries.length){
    document.getElementById("timelineFeature").innerHTML="<p>No dated memories are available yet.</p>";
    return;
  }
  timelineIndex=(index+timelineEntries.length)%timelineEntries.length;
  const d=timelineEntries[timelineIndex];
  const firstImage=d.media.find(m=>m.type==="image");

  featureMedia.innerHTML=firstImage
    ? `<img src="${esc(firstImage.url)}" alt="Submitted Time Capsule artifact">`
    : `<div class="timeline-feature-placeholder">${esc(d.year||"2100")}</div>`;

  featureYear.textContent=d.year||"Fulbright memory";
  featureLocation.textContent=d.location||"A Fulbrighter";
  featureQuote.textContent=`“${d.quote||"A story preserved for 2100."}”`;
  featureThemes.innerHTML=d.themes.map(t=>`<span class="theme-tag">${esc(t)}</span>`).join("");
  timelinePosition.textContent=`Memory ${timelineIndex+1} of ${timelineEntries.length}`;
  timelineOpenMemory.onclick=()=>openMemory(d.id);

  document.querySelectorAll(".timeline-item[data-index]").forEach((button,i)=>{
    button.classList.toggle("active",i===timelineIndex);
  });

  const active=document.querySelector(`.timeline-item[data-index="${timelineIndex}"]`);
  if(active) active.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"});
}

document.querySelectorAll(".timeline-item[data-index]").forEach(button=>{
  button.onclick=()=>renderTimeline(Number(button.dataset.index));
});
document.getElementById("timelinePrev").onclick=()=>renderTimeline(timelineIndex-1);
document.getElementById("timelineNext").onclick=()=>renderTimeline(timelineIndex+1);
document.addEventListener("keydown",event=>{
  if(!document.getElementById("timeline").matches(":hover")) return;
  if(event.key==="ArrowLeft") renderTimeline(timelineIndex-1);
  if(event.key==="ArrowRight") renderTimeline(timelineIndex+1);
});
renderTimeline(0);let g=[];data.forEach(d=>d.media.forEach(m=>g.push({...m,entry:d})));document.getElementById("galleryGrid").innerHTML=g.length?g.map(x=>`<div class="gallery-item" data-id="${x.entry.id}">${x.type==="image"?`<img src="${x.url}">`:`<div class="doc-tile">Document<br>${esc(x.name)}</div>`}<div class="gallery-label">${esc([x.entry.year,x.entry.location].filter(Boolean).join(" - "))}</div></div>`).join(""):"<p>No matched artifacts in this build.</p>";document.querySelectorAll(".gallery-item").forEach(x=>x.onclick=()=>openMemory(x.dataset.id));document.getElementById("closingQuote").textContent=data.length?`“${data[Math.floor(Math.random()*data.length)].quote}”`:"Messages for 2100.";render();

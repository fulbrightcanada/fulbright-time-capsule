const entries=window.CAPSULE_ENTRIES||[],flickr=window.FULBRIGHT_FLICKR||[];
const grid=document.getElementById("memoryGrid");
const esc=s=>String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function card(e,i){
 const media=e.media||[],docs=e.docs||[],first=media[0];
 const additionalMedia=media.filter((m,j)=>j>0 || (docs.length===0 && media.length>1));
 const materials=(additionalMedia.length||docs.length)?`<div class="memory-materials"><h4>From this memory</h4><div class="material-grid">${additionalMedia.map(m=>`<a class="material-tile" href="${esc(m.url)}" target="_blank" rel="noopener"><img loading="lazy" src="${esc(m.url)}" alt="Photograph contributed by ${esc(e.name)}"><span>View photograph ↗</span></a>`).join("")}${docs.map(d=>`<a class="material-tile document-tile" href="${esc(d.url)}" target="_blank" rel="noopener">${d.preview?`<img loading="lazy" src="${esc(d.preview)}" alt="Document preview contributed by ${esc(e.name)}">`:`<span class="document-placeholder" aria-hidden="true">PDF</span>`}<span>${esc(d.label||"Open document")} ↗</span></a>`).join("")}</div></div>`:"";
 return `<article class="memory-card ${i===0?'featured':''}">${first?`<div class="cover"><img loading="lazy" src="${esc(first.url)}" alt="A photograph contributed by ${esc(e.name)}"></div>`:`<div class="cover empty-cover" aria-hidden="true"><span>Fulbright memories</span></div>`}<div class="card-body"><div class="meta">${esc(e.year||"Fulbright alum")} ${e.location?'· '+esc(e.location):''}</div><h3>${esc(e.name)}</h3>${e.testimonial?`<blockquote>“${esc(e.testimonial)}”</blockquote>`:''}<details><summary>What Fulbright means to me</summary><p>${esc(e.meaning||"A reflection preserved for future generations.")}</p></details>${materials}</div></article>`;
}
function render(){
 const q=document.getElementById("search").value.toLowerCase(),yr=document.getElementById("yearFilter").value;
 const filtered=entries.filter(e=>(!yr||e.year===yr)&&(!q||[e.name,e.year,e.location,e.testimonial,e.meaning].join(" ").toLowerCase().includes(q)));
 grid.innerHTML=filtered.map((e,i)=>card(e,i)).join("")||"<p>No memories match that search.</p>";
}
const years=[...new Set(entries.map(e=>e.year).filter(Boolean))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
years.forEach(y=>{const o=document.createElement("option");o.value=y;o.textContent=y;document.getElementById("yearFilter").appendChild(o)});
document.getElementById("search").addEventListener("input",render);
document.getElementById("yearFilter").addEventListener("change",render);
render();
document.getElementById("flickrGrid").innerHTML=flickr.map(f=>`<div class="flickr-photo"><img loading="lazy" src="${esc(f.url)}" alt="${esc(f.caption)}" onerror="this.parentElement.classList.add('fallback');this.style.display='none'"><a href="${esc(f.album)}" target="_blank" rel="noopener"><span>${esc(f.caption)} ↗</span></a></div>`).join("");

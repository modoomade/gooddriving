document.addEventListener("DOMContentLoaded",function(){
const menuBtn=document.querySelector(".gd-mobile-btn");const panel=document.querySelector(".gd-mobile-panel");if(menuBtn&&panel){menuBtn.addEventListener("click",function(){panel.classList.toggle("open");document.body.classList.toggle("menu-open",panel.classList.contains("open"));});panel.querySelectorAll("a").forEach(function(a){a.addEventListener("click",function(){panel.classList.remove("open");document.body.classList.remove("menu-open");});});}
const slides=[...document.querySelectorAll(".gd-home-slide")];const dots=[...document.querySelectorAll(".gd-hero-dot")];const prev=document.querySelector(".gd-hero-prev");const next=document.querySelector(".gd-hero-next");let idx=0,timer=null;function show(i){if(!slides.length)return;if(i<0)i=slides.length-1;if(i>=slides.length)i=0;slides.forEach(s=>s.classList.remove("active"));dots.forEach(d=>d.classList.remove("active"));idx=i;slides[idx].classList.add("active");if(dots[idx])dots[idx].classList.add("active");}function auto(){clearInterval(timer);if(slides.length>1)timer=setInterval(()=>show(idx+1),5000);}if(prev)prev.addEventListener("click",()=>{show(idx-1);auto();});if(next)next.addEventListener("click",()=>{show(idx+1);auto();});dots.forEach((d,i)=>d.addEventListener("click",()=>{show(i);auto();}));show(0);auto();
document.querySelectorAll(".gd-faq-item").forEach(function(item){const q=item.querySelector(".gd-faq-q");if(!q)return;q.addEventListener("click",function(){const on=item.classList.contains("active");document.querySelectorAll(".gd-faq-item").forEach(x=>x.classList.remove("active"));if(!on)item.classList.add("active");});});
});

// main review seamless one-card infinite slider
document.addEventListener("DOMContentLoaded",function(){
  const track=document.getElementById("gdMainReviewTrack");
  const prev=document.getElementById("gdMainReviewPrev");
  const next=document.getElementById("gdMainReviewNext");

  if(!track)return;

  const originals=Array.from(track.children);
  const count=originals.length;
  if(!count)return;

  const before=document.createDocumentFragment();
  const after=document.createDocumentFragment();

  originals.forEach(function(item){
    const cloneBefore=item.cloneNode(true);
    const cloneAfter=item.cloneNode(true);
    cloneBefore.setAttribute("aria-hidden","true");
    cloneAfter.setAttribute("aria-hidden","true");
    before.appendChild(cloneBefore);
    after.appendChild(cloneAfter);
  });

  track.prepend(before);
  track.append(after);

  let index=count;
  let autoTimer=null;
  let normalizeTimer=null;
  let paused=false;
  let programmatic=false;

  function getStep(){
    const cards=track.querySelectorAll(".gd-review-media-card");
    if(cards.length<2)return 0;
    return cards[1].offsetLeft-cards[0].offsetLeft;
  }

  function setPosition(i,smooth){
    const step=getStep();
    if(!step)return;
    programmatic=true;
    track.scrollTo({left:i*step,behavior:smooth?"smooth":"auto"});
    if(!smooth){
      requestAnimationFrame(function(){programmatic=false;});
    }
  }

  function normalize(){
    if(index>=count*2){
      index-=count;
      setPosition(index,false);
    }else if(index<count){
      index+=count;
      setPosition(index,false);
    }
  }

  function stopAuto(){
    clearInterval(autoTimer);
    autoTimer=null;
  }

  function startAuto(){
    stopAuto();
    if(paused)return;
    autoTimer=setInterval(function(){
      move(1,true);
    },3500);
  }

  function move(direction,fromAuto){
    clearTimeout(normalizeTimer);
    index+=direction;
    setPosition(index,true);
    normalizeTimer=setTimeout(function(){
      normalize();
      programmatic=false;
    },620);

    if(!fromAuto){
      stopAuto();
      setTimeout(startAuto,1000);
    }
  }

  function syncIndexFromScroll(){
    const step=getStep();
    if(!step)return;
    index=Math.round(track.scrollLeft/step);
    normalize();
  }

  function pause(){
    paused=true;
    stopAuto();
  }

  function resume(){
    paused=false;
    startAuto();
  }

  if(prev){
    prev.addEventListener("click",function(){
      move(-1,false);
    });
  }

  if(next){
    next.addEventListener("click",function(){
      move(1,false);
    });
  }

  track.addEventListener("mouseenter",pause);
  track.addEventListener("mouseleave",resume);

  track.addEventListener("touchstart",function(){
    pause();
    programmatic=false;
  },{passive:true});

  track.addEventListener("touchend",function(){
    clearTimeout(normalizeTimer);
    normalizeTimer=setTimeout(function(){
      syncIndexFromScroll();
      const step=getStep();
      if(step)setPosition(index,true);
      setTimeout(function(){
        normalize();
        programmatic=false;
        resume();
      },620);
    },80);
  },{passive:true});

  let scrollIdle=null;
  track.addEventListener("scroll",function(){
    if(programmatic)return;
    clearTimeout(scrollIdle);
    scrollIdle=setTimeout(function(){
      syncIndexFromScroll();
    },120);
  },{passive:true});

  window.addEventListener("resize",function(){
    clearTimeout(normalizeTimer);
    setPosition(index,false);
    normalize();
  });

  requestAnimationFrame(function(){
    setPosition(index,false);
    startAuto();
  });
});

/* Fitness Farm Charlevoix - header, menu and demo form behaviour */
function ffMenu(open){
  var m = document.getElementById('ffMenu');
  if(!m) return;
  var show = (open === undefined) ? m.style.opacity !== '1' : !!open;
  m.style.opacity = show ? '1' : '0';
  m.style.transform = show ? 'translateY(0)' : 'translateY(-14px)';
  m.style.pointerEvents = show ? 'auto' : 'none';
}
function ffForm(f){
  var wrap = f.closest('.ff-form');
  if(wrap){ var done = wrap.parentElement.querySelector('.ff-sent');
    if(done){ wrap.style.display='none'; done.style.display='block'; } }
  return false;
}
function ffSub(f){
  var b = f.querySelector('button');
  if(b) b.textContent = 'You are on the list';
  return false;
}
(function(){
  function apply(){
    var mobile = window.innerWidth < 940;
    var nav = document.querySelector('[data-ff-nav]');
    var burger = document.querySelector('[data-ff-burger]');
    var bar = document.querySelector('[data-ff-mobilebar]');
    if(nav) nav.style.display = mobile ? 'none' : 'flex';
    if(burger) burger.style.display = mobile ? 'flex' : 'none';
    if(bar) bar.style.display = mobile ? 'grid' : 'none';
  }
  function shade(){
    var h = document.querySelector('[data-ff-bar]');
    if(!h) return;
    var on = window.scrollY > 12;
    h.style.boxShadow = on ? '0 10px 30px -18px rgba(29,29,30,0.45)' : 'none';
    h.style.background = on ? 'rgba(251,250,248,0.97)' : 'rgba(251,250,248,0.93)';
  }
  function boot(){ apply(); shade();
    window.addEventListener('resize', apply);
    window.addEventListener('scroll', shade, { passive:true });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();

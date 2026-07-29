/* Fitness Farm Charlevoix - header, menu and demo form behaviour */
function ffMenu(open){
  var m = document.getElementById('ffMenu');
  if(!m) return;
  var show = (open === undefined) ? m.getAttribute('data-open') !== 'open' : !!open;
  m.setAttribute('data-open', show ? 'open' : 'closed');
  document.body.style.overflow = show ? 'hidden' : '';
}
document.addEventListener('keydown', function(e){ if(e.key === 'Escape') ffMenu(false); });
window.addEventListener('resize', function(){ if(window.innerWidth >= 940) ffMenu(false); });
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

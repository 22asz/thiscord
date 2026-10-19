(function(){
  // js/app.js - client behavior for thiscord
  // Safe, minimal implementations for handlers referenced from index.html

  // Triple-click logo handler (window.handleLogoClick)
  let _logoClicks = 0, _logoTimer = null;
  window.handleLogoClick = function(){
    _logoClicks++;
    clearTimeout(_logoTimer);
    _logoTimer = setTimeout(()=> { _logoClicks = 0; }, 600);
    if(_logoClicks >= 3){
      _logoClicks = 0;
      const modal = document.getElementById('discordModal');
      if(modal) modal.classList.remove('hidden');
    }
  };

  // Praise button: increment counter, show confetti and thank-you message
  window.praiseAlec = function(){
    const el = document.getElementById('praiseCounter');
    if(el){
      const current = parseInt((el.textContent || '').replace(/[^0-9]/g,'')) || 0;
      el.textContent = (current + 1).toLocaleString();
    }
    if(typeof confetti === 'function'){
      try{ confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } }); }catch(e){}
    }
    const t = document.getElementById('thankYouMsg');
    if(t){
      t.style.opacity = '1';
      setTimeout(()=> t.style.opacity = '0', 1800);
    }
  };

  // Check secret trigger typed into name input (example behavior)
  window.checkSecretTrigger = function(e){
    const v = (e?.target?.value || '').toLowerCase();
    const btn = document.getElementById('adminPurgeBtn');
    if(btn){
      if(v.includes('admin') || v.includes('alec') || v.includes('godlike')) btn.classList.remove('hidden');
      else btn.classList.add('hidden');
    }
  };

  // Submit praise form: append to comments feed and increment counter
  window.submitPraise = function(ev){
    try{ ev?.preventDefault(); }catch(e){}
    const name = (document.getElementById('userName')?.value || 'Anonymous').trim();
    const text = (document.getElementById('userComment')?.value || '').trim();
    if(!text) return;
    const feed = document.getElementById('commentsFeed');
    if(feed){
      const card = document.createElement('div');
      card.className = 'purple-gold-card rounded-2xl p-4';
      const esc = s => String(s).replace(/[&<>"]+/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]||c));
      card.innerHTML = `\n        <div class="flex items-center justify-between">\n          <div class="text-sm font-semibold text-white">${esc(name)}</div>\n          <div class="text-xs text-gray-400">Just now</div>\n        </div>\n        <p class="mt-2 text-sm text-gray-200">${esc(text)}</p>\n      `;
      feed.prepend(card);
    }
    // reset form
    const form = document.getElementById('praiseForm');
    if(form) form.reset();
    // increment praise counter + confetti
    window.praiseAlec();
  };

  // Prompt secret code to open modal
  window.promptSecretCode = function(){
    try{
      const code = prompt('Enter secret code:');
      if(code === null) return;
      if(code.trim() === 'open-sesame' || code.trim() === 'alec'){
        const modal = document.getElementById('discordModal');
        if(modal) modal.classList.remove('hidden');
      } else {
        // silently ignore or show console hint
        console.log('promptSecretCode: incorrect code');
      }
    }catch(e){ console.error(e); }
  };

  // Toggle modal / logs
  window.toggleLogModal = function(){
    const modal = document.getElementById('discordModal');
    if(modal) modal.classList.toggle('hidden');
    else console.log('toggleLogModal: modal not found');
  };

  // Admin action: clear comments
  window.adminClearChannel = function(){
    if(!confirm('Clear all comments in the feed?')) return;
    const feed = document.getElementById('commentsFeed');
    if(feed) feed.innerHTML = '';
  };

  // Graceful hookup in case inline handlers are not used: attach listeners
  document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('praiseBtn')?.addEventListener('click', function(e){ e.preventDefault(); window.praiseAlec(); });
    document.getElementById('praiseForm')?.addEventListener('submit', window.submitPraise);
    document.getElementById('userName')?.addEventListener('input', window.checkSecretTrigger);
    // hide admin purge by default
    const btn = document.getElementById('adminPurgeBtn'); if(btn) btn.classList.add('hidden');
  });
})();

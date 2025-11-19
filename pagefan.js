    const el = id => document.getElementById(id);
    const outName = el('outName');
    const outSub = el('outSub');
    const outText = el('outText');
    const largePhoto = el('largePhoto');
    const smallPhoto = el('smallPhoto');
    const placeholderLarge = el('placeholderLarge');
    const placeholderSmall = el('placeholderSmall');

    function readFileToDataUrl(file, cb){
      const r = new FileReader();
      r.onload = e => cb(e.target.result);
      r.readAsDataURL(file);
    }

    el('apply').addEventListener('click', ()=>{
      outName.textContent = el('name').value || 'Nom du mangaka';
      outSub.textContent = el('sub').value || 'Nationalité — dates';
      outText.textContent = el('bigtext').value.trim() || 'Texte de présentation. Cliquez sur "Appliquer au gabarit" pour insérer votre texte.';
    });

    el('largeFile').addEventListener('change', (ev)=>{
      const f = ev.target.files[0];
      if(!f) return;
      readFileToDataUrl(f, src=>{
        placeholderLarge.style.display='none';
        largePhoto.innerHTML = '';
        const img = document.createElement('img'); img.src = src; img.alt = 'Photo grande';
        largePhoto.appendChild(img);
      });
    });

    el('smallFile').addEventListener('change', (ev)=>{
      const f = ev.target.files[0];
      if(!f) return;
      readFileToDataUrl(f, src=>{
        placeholderSmall.style.display='none';
        smallPhoto.innerHTML = '';
        const img = document.createElement('img'); img.src = src; img.alt = 'Photo petite';
        smallPhoto.appendChild(img);
      });
    });

    el('clearLarge').addEventListener('click', ()=>{
      el('largeFile').value=''; placeholderLarge.style.display='block'; largePhoto.innerHTML = '<span id="placeholderLarge">Image grande (zone)</span>';
    });
    el('clearSmall').addEventListener('click', ()=>{
      el('smallFile').value=''; placeholderSmall.style.display='block'; smallPhoto.innerHTML = '<span id="placeholderSmall">Image petite (zone)</span>';
    });

    el('reset').addEventListener('click', ()=>{
      el('editor').reset();
      outName.textContent='Nom du mangaka'; outSub.textContent='Nationalité — dates'; outText.textContent='Texte de présentation. Cliquez sur "Appliquer au gabarit" pour insérer votre texte.';
      el('clearLarge').click(); el('clearSmall').click();
    });

    // Download standalone HTML
    el('download').addEventListener('click', ()=>{
      const name = encodeURIComponent(el('name').value || 'mangaka');
      // Build a minimal standalone HTML string using current preview contents and embedded images
      const largeImg = largePhoto.querySelector('img')?.src || '';
      const smallImg = smallPhoto.querySelector('img')?.src || '';
      const html = `<!doctype html>\n<html lang=\"fr\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n<title>${escapeHtml(el('name').value || 'Page Mangaka')}</title>\n<style>body{font-family:Inter,Arial,sans-serif;background:#f7f9fb;padding:28px;color:#111} .card{max-width:980px;margin:0 auto;background:#fff;padding:20px;border-radius:12px;box-shadow:0 8px 24px rgba(16,24,40,0.06)} .layout{display:flex;gap:16px;align-items:flex-start} .cover{width:58%;border-radius:8px;overflow:hidden;min-height:260px;background:#eef2f7} .cover img{width:100%;height:100%;object-fit:cover} .side{width:42%} .portrait{height:120px;border-radius:8px;overflow:hidden;margin-bottom:12px;background:#f1f5f9} .portrait img{width:100%;height:100%;object-fit:cover} h1{margin:0 0 6px;font-size:26px} p.meta{margin:0;color:#6b7280} p.bio{margin-top:10px;line-height:1.6;font-size:16px}</style>\n</head>\n<body>\n<div class=\"card\">\n  <div class=\"layout\">\n    <div class=\"cover\">${ largeImg ? `<img src=\"${largeImg}\" alt=\"Photo large\">` : '' }</div>\n    <div class=\"side\">\n      <div class=\"portrait\">${ smallImg ? `<img src=\"${smallImg}\" alt=\"Photo petite\">` : '' }</div>\n      <h1>${escapeHtml(el('name').value || 'Nom du mangaka')}</h1>\n      <p class=\"meta\">${escapeHtml(el('sub').value || '')}</p>\n      <p class=\"bio\">${escapeHtml(el('bigtext').value || '')}</p>\n    </div>\n  </div>\n</div>\n</body>\n</html>`;

      const blob = new Blob([html], {type:'text/html'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `${name}-mangaka.html`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    });

    // small escape helper
    function escapeHtml(s){
      if(!s) return '';
      return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;').replace(/\n/g,'<br>');
    }
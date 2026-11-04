(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };

  /* ---- mobile nav ---- */
  var burger = $('#burger'), menu = $('#menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
  }

  /* ---- home tabs ---- */
  var tabs = $$('[role="tab"]');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute('aria-selected', on);
        document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
      });
    });
  });

  /* ---- careers: job list ---- */
  var jobsEl = $('#jobs');
  if (jobsEl) {
    // Edit this list to add or remove openings.
    var jobs = [
      { t: 'Talent Acquisition Specialist', d: 'TA', loc: 'Jaipur, Rajasthan', mode: 'Hybrid', type: 'Full-Time', p: 'Join our talent acquisition team and help build great teams across industries.' },
      { t: 'Business Development Executive', d: 'BDE', loc: 'Jaipur, Rajasthan', mode: 'On-site', type: 'Full-Time', p: 'Drive growth by building client relationships and finding new opportunities.' },
      { t: 'HR Intern', d: 'HR', loc: 'Jaipur, Rajasthan', mode: 'Remote', type: 'Internship', p: 'Support our HR team with recruitment, screening and candidate coordination.' }
    ];
    var apply = jobsEl.getAttribute('data-apply') || '#';
    var q = $('#j-q'), fd = $('#j-dept'), fl = $('#j-loc'), ft = $('#j-type');
    var render = function () {
      var s = q.value.trim().toLowerCase();
      var list = jobs.filter(function (j) {
        return (!fd.value || j.d === fd.value) && (!fl.value || j.loc === fl.value) &&
          (!ft.value || j.type === ft.value) && (!s || (j.t + ' ' + j.p).toLowerCase().indexOf(s) > -1);
      });
      $('#j-count').textContent = list.length + ' of ' + jobs.length + ' openings';
      jobsEl.innerHTML = list.length ? list.map(function (j) {
        return '<article class="job"><div><h3>' + esc(j.t) + '</h3><p>' + esc(j.p) + '</p><div class="tags">' +
          '<span class="tag dept">' + esc(j.d) + '</span><span class="tag">' + esc(j.loc) + '</span><span class="tag">' + esc(j.mode) + '</span><span class="tag">' + esc(j.type) + '</span>' +
          '</div></div><a class="btn btn-line" href="' + apply + '">Apply</a></article>';
      }).join('') : '<div class="empty">No openings match your search right now. Try clearing a filter, or submit your profile for future roles.</div>';
    };
    [q, fd, fl, ft].forEach(function (el) { el.addEventListener('input', render); });
    render();
  }

  /* ---- partner: service cards <-> dropdown ---- */
  var topic = $('#f-topic');
  if (topic) {
    $$('input[name="svc"]').forEach(function (r) { r.addEventListener('change', function () { topic.value = r.value; }); });
    topic.addEventListener('change', function () {
      var r = $('input[name="svc"][value="' + topic.value + '"]');
      if (r) r.checked = true;
    });
  }

  /* ---- forms ----
     Set data-endpoint on a <form> (e.g. a Formspree URL) to make it send. */
  $$('.js-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var notice = $('.notice', form);
      var bad = $$('[required]', form).filter(function (f) {
        return !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      })[0];
      notice.hidden = false;
      if (bad) {
        notice.textContent = 'Please fill in "' + bad.labels[0].childNodes[0].textContent.trim() + '" so we can reach you.';
        bad.focus();
        return;
      }
      var endpoint = form.getAttribute('data-endpoint');
      if (!endpoint) {
        notice.textContent = 'Thanks for your interest. This form is not connected yet, so please email hr@talvexglobal.com or call +91 0120567890.';
        return;
      }
      var btn = $('button[type="submit"]', form);
      btn.disabled = true;
      notice.textContent = 'Sending…';
      fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          form.reset();
          notice.textContent = 'Thank you. Our team will get back to you within one business day.';
        })
        .catch(function () {
          notice.textContent = 'Your message could not be sent. Please try again, or email hr@talvexglobal.com.';
        })
        .then(function () { btn.disabled = false; });
    });
  });

  /* ---- contact: copy buttons ---- */
  $$('.copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy'; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(b.getAttribute('data-copy')).then(done).catch(function () {});
    });
  });
})();

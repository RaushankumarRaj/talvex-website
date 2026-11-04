(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };

  /* ---- header turns solid on scroll ---- */
  var hdr = $('#hdr');
  if (hdr) {
    var onScroll = function () { hdr.classList.toggle('scrolled', window.scrollY > 20); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- scroll reveal + number count-up ---- */
  var countUp = function (el) {
    var to = +el.getAttribute('data-to'), suf = el.getAttribute('data-suffix') || '', t0 = null;
    var step = function (t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / 1400, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    document.documentElement.classList.add('rv');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        $$('[data-to]', e.target).forEach(countUp);
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('[data-reveal]').forEach(function (el) { io.observe(el); });
    // never leave content hidden if the observer misses something
    setTimeout(function () { $$('[data-reveal]').forEach(function (el) { el.classList.add('in'); }); }, 4000);
  }

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
        return '<article class="job"><span class="ico"><svg class="i"><use href="#i-briefcase"/></svg></span><div><h3>' + esc(j.t) + '</h3><p>' + esc(j.p) + '</p><div class="tags">' +
          '<span class="tag dept">' + esc(j.d) + '</span><span class="tag">' + esc(j.loc) + '</span><span class="tag">' + esc(j.mode) + '</span><span class="tag">' + esc(j.type) + '</span>' +
          '</div></div><a class="btn btn-dark" href="' + apply + '">Apply now <svg class="i"><use href="#i-arrow"/></svg></a></article>';
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

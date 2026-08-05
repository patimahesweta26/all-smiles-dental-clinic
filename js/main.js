// ===== Theme toggle =====
(function () {
  var root = document.documentElement;
  var toggle = document.getElementById('themeToggle');
  var icon = toggle.querySelector('i');

  function applyIcon() {
    var dark = root.getAttribute('data-theme') === 'dark';
    icon.className = dark ? 'ph ph-moon' : 'ph ph-sun';
  }

  function setTheme(theme) {
    if (theme === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    try { localStorage.setItem('as-theme', theme); } catch (e) {}
    applyIcon();
  }

  applyIcon();

  toggle.addEventListener('click', function () {
    var dark = root.getAttribute('data-theme') === 'dark';
    setTheme(dark ? 'light' : 'dark');
  });
})();

// ===== Mobile nav =====
(function () {
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');

  toggle.addEventListener('click', function () {
    nav.classList.toggle('open');
    toggle.classList.toggle('open');
    toggle.setAttribute('aria-label', nav.classList.contains('open') ? 'Close menu' : 'Open menu');
  });

  document.querySelectorAll('.has-dropdown > a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 860) {
        e.preventDefault();
        link.parentElement.classList.toggle('open');
      }
    });
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 860 && !link.parentElement.classList.contains('has-dropdown')) {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-label', 'Open menu');
      }
    });
  });
})();

// ===== Header shadow (no scroll listeners) =====
(function () {
  var header = document.getElementById('header');
  var sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
  document.body.appendChild(sentinel);

  var obs = new IntersectionObserver(function (entries) {
    header.classList.toggle('scrolled', !entries[0].isIntersecting);
  }, { threshold: 0 });

  obs.observe(sentinel);
})();

// ===== Scroll-spy (IntersectionObserver) =====
(function () {
  var links = document.querySelectorAll('.nav-list > li > a[href^="#"]');

  function setActive(id) {
    links.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

  document.querySelectorAll('section[id]').forEach(function (sec) { observer.observe(sec); });
})();

// ===== Reveal on scroll =====
(function () {
  var items = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || reduce) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(function (el) { observer.observe(el); });
})();

// ===== Counters =====
(function () {
  var counters = document.querySelectorAll('.counter');

  function animate(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var duration = 1600;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('en-IN');
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(function (el) { el.textContent = parseInt(el.getAttribute('data-target'), 10).toLocaleString('en-IN'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(function (el) { observer.observe(el); });
})();

// ===== Testimonial slider =====
(function () {
  var slides = document.querySelectorAll('.t-slide');
  var dots = document.querySelectorAll('.t-dot');
  var prev = document.querySelector('.t-prev');
  var next = document.querySelector('.t-next');
  var index = 0;
  var timer = null;

  function show(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach(function (s, n) { s.classList.toggle('active', n === index); });
    dots.forEach(function (d, n) { d.classList.toggle('active', n === index); });
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      show(parseInt(dot.getAttribute('data-index'), 10));
      restart();
    });
  });

  prev.addEventListener('click', function () { show(index - 1); restart(); });
  next.addEventListener('click', function () { show(index + 1); restart(); });

  function restart() {
    clearInterval(timer);
    timer = setInterval(function () { show(index + 1); }, 5500);
  }

  restart();
})();

// ===== FAQ accordion =====
(function () {
  var items = document.querySelectorAll('.faq-item');

  function setHeight(item) {
    var answer = item.querySelector('.faq-a');
    var btn = item.querySelector('.faq-q');
    var open = item.classList.contains('open');
    answer.style.maxHeight = open ? answer.scrollHeight + 'px' : '0px';
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  items.forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    setHeight(item);

    btn.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      items.forEach(function (other) {
        other.classList.remove('open');
        setHeight(other);
      });
      if (!wasOpen) {
        item.classList.add('open');
        setHeight(item);
      }
    });
  });
})();

// ===== Appointment form (WhatsApp) =====
(function () {
  var form = document.getElementById('appointmentForm');
  var note = document.getElementById('formNote');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = form.elements['name'].value.trim();
    var phone = form.elements['phone'].value.trim();
    var service = form.elements['service'].value;
    var date = form.elements['date'].value;
    var time = form.elements['time'].value;

    if (!name || !phone || !service || !date || !time) {
      note.className = 'form-note error';
      note.textContent = 'Please fill in all the required fields.';
      return;
    }

    var msg =
      'New appointment request:%0A' +
      'Name: ' + name + '%0A' +
      'Phone: ' + phone + '%0A' +
      'Service: ' + service + '%0A' +
      'Date: ' + date + '%0A' +
      'Time: ' + time +
      (form.elements['message'].value.trim() ? '%0AMessage: ' + form.elements['message'].value.trim() : '');

    window.open('https://wa.me/917978977072?text=' + msg, '_blank');

    note.className = 'form-note success';
    note.textContent = 'Thank you. We have opened WhatsApp to send your booking. Our team will confirm shortly.';
    form.reset();
  });
})();

// ===== Gallery lightbox =====
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll('.g-item'));
  var lightbox = document.getElementById('lightbox');
  var lbImg = lightbox.querySelector('.lb-img');
  var lbCount = lightbox.querySelector('.lb-count');
  var close = lightbox.querySelector('.lb-close');
  var prevBtn = lightbox.querySelector('.lb-prev');
  var nextBtn = lightbox.querySelector('.lb-next');
  var index = 0;

  function open(i) {
    index = i;
    lbImg.src = items[index].getAttribute('data-full');
    lbImg.alt = items[index].querySelector('img').alt;
    lbCount.textContent = (index + 1) + ' / ' + items.length;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    close.focus();
  }

  function closeLb() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  function step(dir) {
    index = (index + dir + items.length) % items.length;
    lbImg.src = items[index].getAttribute('data-full');
    lbImg.alt = items[index].querySelector('img').alt;
    lbCount.textContent = (index + 1) + ' / ' + items.length;
  }

  items.forEach(function (item, i) {
    item.addEventListener('click', function () { open(i); });
  });

  close.addEventListener('click', closeLb);
  prevBtn.addEventListener('click', function () { step(-1); });
  nextBtn.addEventListener('click', function () { step(1); });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLb();
  });

  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
})();

// ===== Service details modal =====
(function () {
  var modal = document.getElementById('smModal');
  var title = document.getElementById('smTitle');
  var desc = document.getElementById('smDesc');
  var points = document.getElementById('smPoints');
  var icon = document.getElementById('smIcon');
  var close = modal.querySelector('.sm-close');
  var cta = document.getElementById('smCta');

  var data = {
    'smile-makeover': {
      icon: 'ph ph-sparkle',
      title: 'Smile Makeover',
      desc: 'A complete redesign of your smile using a combination of cosmetic treatments planned around your facial features and goals.',
      points: ['Digital smile design and preview', 'Veneers, bonding and whitening', 'Gum reshaping for balance', 'Personalised aesthetic plan']
    },
    'dental-implants': {
      icon: 'ph ph-wrench',
      title: 'Dental Implants',
      desc: 'Permanent, natural-looking replacements for missing teeth, fixed securely into the jaw with titanium posts.',
      points: ['Single and multiple tooth implants', 'Implant-supported bridges', 'Bone grafting when needed', 'Same-day treatment options']
    },
    'aligners-braces': {
      icon: 'ph ph-smiley',
      title: 'Aligners & Braces',
      desc: 'Discreet, comfortable ways to straighten your teeth without the look of traditional metal wires.',
      points: ['Clear, removable aligner trays', 'Shorter adjustment visits', 'Suitable for teens and adults', 'Digital progress tracking']
    },
    'full-mouth-rehab': {
      icon: 'ph ph-stamp',
      title: 'Full Mouth Rehabilitation',
      desc: 'Rebuild and restore the function, health and beauty of your entire mouth with a complete, phased treatment plan.',
      points: ['Complete oral health evaluation', 'Crowns, bridges and implants', 'Bite correction and alignment', 'Coordinated specialist care']
    },
    'child-dentistry': {
      icon: 'ph ph-baby',
      title: 'Child Dentistry',
      desc: 'Friendly, gentle dental care designed to keep young smiles healthy and make every visit a positive experience.',
      points: ['Preventive check-ups and cleanings', 'Fluoride and fissure sealants', 'Care for baby teeth', 'Fear-free, playful environment']
    },
    'root-canal': {
      icon: 'ph ph-first-aid',
      title: 'Root Canal Treatment',
      desc: 'Painless, single-visit treatment that removes infection from inside the tooth and saves it from extraction.',
      points: ['Single-visit root canals', 'Rotary endodontics for precision', 'Relief from tooth pain', 'Restores strength with a crown']
    },
    'laser-dentistry': {
      icon: 'ph ph-magic-wand',
      title: 'Laser Dentistry',
      desc: 'Advanced laser technology for accurate, minimally invasive treatment with less discomfort and faster healing.',
      points: ['Gum treatment with lasers', 'Painless cavity preparation', 'Reduced bleeding and swelling', 'Quicker recovery time']
    },
    'crowns-bridges': {
      icon: 'ph ph-tooth',
      title: 'Crowns, Bridges & Dentures',
      desc: 'Replace and restore damaged or missing teeth with strong, natural-looking restorations made to fit you perfectly.',
      points: ['Metal-free ceramic crowns', 'Fixed bridges for gaps', 'Comfortable partial dentures', 'Shade-matched to natural teeth']
    },
    'orthodontics': {
      icon: 'ph ph-sliders-horizontal',
      title: 'Orthodontic Treatment',
      desc: 'Customised tooth movement using modern braces and aligners to correct alignment and bite issues.',
      points: ['Metal and ceramic braces', 'Clear aligner therapy', 'Crossbite and crowding correction', 'Retainers for lasting results']
    }
  };

  function openService(key) {
    var d = data[key];
    if (!d) return;
    title.textContent = d.title;
    desc.textContent = d.desc;
    icon.innerHTML = '<i class="' + d.icon + '" aria-hidden="true"></i>';
    points.innerHTML = '';
    d.points.forEach(function (p) {
      var li = document.createElement('li');
      li.innerHTML = '<i class="ph ph-check-circle" aria-hidden="true"></i><span>' + p + '</span>';
      points.appendChild(li);
    });
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    close.focus();
  }

  function closeService() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.tile[data-service]').forEach(function (tile) {
    tile.addEventListener('click', function () { openService(tile.getAttribute('data-service')); });
  });

  close.addEventListener('click', closeService);

  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeService();
  });

  document.addEventListener('keydown', function (e) {
    if (!modal.hidden && e.key === 'Escape') closeService();
  });

  cta.addEventListener('click', closeService);
})();

// ===== Doctors carousel =====
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.doctors-carousel').forEach(function (carousel) {
    var track = carousel.querySelector('.dc-track');
    var slides = track.querySelectorAll('.dc-slide');
    var dots = carousel.querySelectorAll('.dc-dot');
    var prev = carousel.querySelector('.dc-prev');
    var next = carousel.querySelector('.dc-next');
    var index = 0;
    var timer = null;

    function show(i, animate) {
      index = (i + slides.length) % slides.length;
      var offset = index * -100;
      if (animate) {
        track.style.transition = 'transform .6s var(--ease, cubic-bezier(.16,1,.3,1))';
      } else {
        track.style.transition = 'none';
      }
      track.style.transform = 'translateX(' + offset + '%)';
      dots.forEach(function (d, n) { d.classList.toggle('active', n === index); });
    }

    function restart() {
      clearInterval(timer);
      if (reduce) return;
      timer = setInterval(function () { show(index + 1, true); }, 5000);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(parseInt(dot.getAttribute('data-index'), 10), true);
        restart();
      });
    });

    prev.addEventListener('click', function () { show(index - 1, true); restart(); });
    next.addEventListener('click', function () { show(index + 1, true); restart(); });

    show(0, false);
    restart();
  });
})();

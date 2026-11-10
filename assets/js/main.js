/**
 * Shubh Solar Energy & Third Eye Security Device - Main Interactive Script
 * Jabalpur, Madhya Pradesh
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Initialize AOS (Animate on Scroll) - disabled on mobile viewports to prevent horizontal translation overflow
  if (window.AOS) {
    window.AOS.init({
      duration: 650,
      easing: 'ease-out-cubic',
      once: true,
      offset: 30,
      disable: () => window.innerWidth < 768
    });
  }

  /* ----------------------------------------------------
     1. Header Sticky Effect & Mobile Menu
  ---------------------------------------------------- */
  const header = document.getElementById('main-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const closeDrawerBtn = document.getElementById('close-drawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('bg-obsidian/95', 'border-white/10', 'shadow-2xl');
      header.classList.remove('bg-transparent', 'border-transparent');
    } else {
      header.classList.remove('shadow-2xl');
    }
  });

  function openDrawer() {
    mobileDrawer.classList.remove('translate-x-full', 'invisible', 'pointer-events-none');
    mobileDrawer.classList.add('translate-x-0', 'visible', 'pointer-events-auto');
    mobileOverlay.classList.remove('opacity-0', 'pointer-events-none');
    mobileOverlay.classList.add('opacity-100', 'pointer-events-auto');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.add('translate-x-full', 'invisible', 'pointer-events-none');
    mobileDrawer.classList.remove('translate-x-0', 'visible', 'pointer-events-auto');
    mobileOverlay.classList.add('opacity-0', 'pointer-events-none');
    mobileOverlay.classList.remove('opacity-100', 'pointer-events-auto');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  /* ----------------------------------------------------
     2. Interactive Solar Savings Calculator Engine
  ---------------------------------------------------- */
  const billSlider = document.getElementById('calc-bill-slider');
  const billDisplay = document.getElementById('calc-bill-display');
  const plantCapacity = document.getElementById('calc-capacity');
  const roofSpace = document.getElementById('calc-roof');
  const monthlyUnits = document.getElementById('calc-units');
  const monthlySavings = document.getElementById('calc-monthly-savings');
  const annualSavings = document.getElementById('calc-annual-savings');
  const govSubsidy = document.getElementById('calc-subsidy');
  const grossCost = document.getElementById('calc-gross');
  const netInvestment = document.getElementById('calc-net');
  const lifetimeWealth = document.getElementById('calc-lifetime');
  const treesCount = document.getElementById('calc-trees');
  const calcWaBtn = document.getElementById('calc-whatsapp-btn');
  const presetButtons = document.querySelectorAll('.preset-btn');

  function calculateSolar(billValue) {
    const bill = parseInt(billValue, 10);
    if (billDisplay) billDisplay.textContent = '₹' + bill.toLocaleString('en-IN');

    // Sizing Formula based on MPPKVVCL tariff (~₹7.2 to ₹8.0/unit slab average in MP)
    // 1 kW generates approx 120-130 kWh/month in Jabalpur's sunny climate
    let kw = 2;
    if (bill < 2500) {
      kw = 2;
    } else if (bill <= 4500) {
      kw = 3;
    } else if (bill <= 7500) {
      kw = 5;
    } else if (bill <= 12000) {
      kw = 7;
    } else if (bill <= 18000) {
      kw = 10;
    } else {
      kw = Math.min(25, Math.ceil(bill / 1800));
    }

    const area = kw * 85; // ~85 sq.ft per kW with high-efficiency TopCon modules
    const units = kw * 125; // 125 units per kW per month average in MP
    const estMonthlySave = Math.min(bill, Math.round(units * 7.5));
    const estAnnualSave = estMonthlySave * 12;

    // PM Surya Ghar Subsidy calculation
    // 1 kW: ₹30,000 | 2 kW: ₹60,000 | 3 kW and above: ₹78,000 maximum central DBT
    let subsidy = 78000;
    if (kw === 1) subsidy = 30000;
    else if (kw === 2) subsidy = 60000;
    else subsidy = 78000;

    // Industry benchmark pricing in MP for Tier-1 TopCon Bifacial + HDG structure
    const estGross = kw * 62000;
    const estNet = Math.max(0, estGross - subsidy);
    const wealth25yr = (estAnnualSave * 25) - estNet;
    const trees = kw * 18;

    // Update UI elements
    if (plantCapacity) plantCapacity.textContent = kw + ' kW';
    if (roofSpace) roofSpace.textContent = area + ' sq. ft.';
    if (monthlyUnits) monthlyUnits.textContent = units.toLocaleString('en-IN') + ' kWh';
    if (monthlySavings) monthlySavings.textContent = '₹' + estMonthlySave.toLocaleString('en-IN');
    if (annualSavings) annualSavings.textContent = '₹' + estAnnualSave.toLocaleString('en-IN');
    if (govSubsidy) govSubsidy.textContent = '₹' + subsidy.toLocaleString('en-IN');
    if (grossCost) grossCost.textContent = '₹' + estGross.toLocaleString('en-IN');
    if (netInvestment) netInvestment.textContent = '₹' + estNet.toLocaleString('en-IN');
    if (lifetimeWealth) lifetimeWealth.textContent = '₹' + Math.round(wealth25yr / 100000).toFixed(1) + ' Lakhs';
    if (treesCount) treesCount.textContent = trees + ' Trees';

    // Update WhatsApp link
    if (calcWaBtn) {
      const msg = `*Shubh Solar Jabalpur - Solar Sizing Inquiry*%0A%0A` +
        `• Current Monthly Bill: ₹${bill.toLocaleString('en-IN')}%0A` +
        `• Recommended Plant: ${kw} kW%0A` +
        `• Expected Monthly Generation: ${units} Units (kWh)%0A` +
        `• PM Surya Ghar DBT Subsidy: ₹${subsidy.toLocaleString('en-IN')}%0A` +
        `• Net Estimated Investment: ₹${estNet.toLocaleString('en-IN')}%0A` +
        `• 25-Year Estimated Savings: ₹${Math.round(wealth25yr / 100000).toFixed(1)} Lakhs%0A%0A` +
        `Please schedule a Free 3D Roof LiDAR Survey for my home in Jabalpur.`;
      calcWaBtn.href = `https://wa.me/917498341255?text=${msg}`;
    }
  }

  if (billSlider) {
    billSlider.addEventListener('input', (e) => {
      calculateSolar(e.target.value);
      // Remove active from preset buttons if slider is dragged manually
      presetButtons.forEach(btn => btn.classList.remove('border-amber-400', 'bg-amber-400/20', 'text-amber-400'));
    });
    // Initial run
    calculateSolar(billSlider.value);
  }

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const bill = btn.getAttribute('data-bill');
      if (bill && billSlider) {
        billSlider.value = bill;
        calculateSolar(bill);
        presetButtons.forEach(b => b.classList.remove('border-amber-400', 'bg-amber-400/20', 'text-amber-400'));
        btn.classList.add('border-amber-400', 'bg-amber-400/20', 'text-amber-400');
      }
    });
  });

  /* ----------------------------------------------------
     3. Project Portfolio Filtering
  ---------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => {
        b.classList.remove('bg-amber-400', 'text-slate-950', 'font-bold');
        b.classList.add('bg-surface-2', 'text-slate-300', 'border-white/10');
      });
      btn.classList.add('bg-amber-400', 'text-slate-950', 'font-bold');
      btn.classList.remove('bg-surface-2', 'text-slate-300', 'border-white/10');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.classList.add('hidden');
          }, 200);
        }
      });
    });
  });

  /* ----------------------------------------------------
     4. FAQ Accordion
  ---------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isOpen = !content.classList.contains('hidden');

        // Close other items
        faqItems.forEach(otherItem => {
          const otherContent = otherItem.querySelector('.faq-content');
          const otherIcon = otherItem.querySelector('.faq-icon');
          if (otherContent) otherContent.classList.add('hidden');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        });

        // Toggle current
        if (!isOpen) {
          content.classList.remove('hidden');
          if (icon) icon.style.transform = 'rotate(180deg)';
        } else {
          content.classList.add('hidden');
          if (icon) icon.style.transform = 'rotate(0deg)';
        }
      });
    }
  });

  /* ----------------------------------------------------
     5. Contact Form Lead Preview & Submission
  ---------------------------------------------------- */
  const contactForm = document.getElementById('quote-form');
  const formBillSelect = document.getElementById('form-bill');
  const formCapacityPreview = document.getElementById('preview-capacity');
  const formSubsidyPreview = document.getElementById('preview-subsidy');
  const formSavingsPreview = document.getElementById('preview-savings');
  const toastNotification = document.getElementById('toast-notification');

  function showToast(message) {
    if (!toastNotification) return;
    toastNotification.textContent = message;
    toastNotification.classList.remove('translate-y-24', 'opacity-0');
    setTimeout(() => {
      toastNotification.classList.add('translate-y-24', 'opacity-0');
    }, 4000);
  }

  if (formBillSelect) {
    formBillSelect.addEventListener('change', (e) => {
      const val = parseInt(e.target.value, 10);
      let kw = 3;
      let subsidy = 78000;
      let savings = 3500;

      if (val < 2500) {
        kw = 2;
        subsidy = 60000;
        savings = 2200;
      } else if (val <= 5000) {
        kw = 3;
        subsidy = 78000;
        savings = 3800;
      } else if (val <= 10000) {
        kw = 5;
        subsidy = 78000;
        savings = 6500;
      } else {
        kw = 10;
        subsidy = 78000;
        savings = 12500;
      }

      if (formCapacityPreview) formCapacityPreview.textContent = `${kw} kW Recommended`;
      if (formSubsidyPreview) formSubsidyPreview.textContent = `₹${subsidy.toLocaleString('en-IN')} Govt DBT Subsidy`;
      if (formSavingsPreview) formSavingsPreview.textContent = `~₹${savings.toLocaleString('en-IN')}/mo bill cut`;
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name')?.value || '';
      const phone = document.getElementById('form-phone')?.value || '';
      const area = document.getElementById('form-area')?.value || '';
      const bill = document.getElementById('form-bill')?.value || '';
      const roof = document.getElementById('form-roof')?.value || '';

      if (!name || !phone) {
        showToast('Please fill out your name and phone number.');
        return;
      }

      const msg = `*Shubh Solar Free Site Survey Request*%0A%0A` +
        `• Name: ${encodeURIComponent(name)}%0A` +
        `• Phone: ${encodeURIComponent(phone)}%0A` +
        `• Jabalpur Colony/Area: ${encodeURIComponent(area || 'Garha / Jabalpur')}%0A` +
        `• Monthly Electricity Bill: ₹${encodeURIComponent(bill || '4000')}%0A` +
        `• Rooftop Type: ${encodeURIComponent(roof || 'RCC Terrace')}%0A%0A` +
        `Please confirm my site survey appointment and PM Surya Ghar subsidy estimate.`;

      showToast('Opening WhatsApp with your solar request details...');

      setTimeout(() => {
        window.open(`https://wa.me/917498341255?text=${msg}`, '_blank');
        contactForm.reset();
      }, 700);
    });
  }

  /* ----------------------------------------------------
     6. Copy Plus Code / Address Tooltip
  ---------------------------------------------------- */
  const copyPlusCodeBtn = document.getElementById('copy-plus-code-btn');
  if (copyPlusCodeBtn) {
    copyPlusCodeBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('5V5R+G8 Jabalpur, Madhya Pradesh').then(() => {
        showToast('Google Plus Code copied: 5V5R+G8 Jabalpur');
      }).catch(() => {
        showToast('Office Location: 27, Ganga Nagar Colony, Garha, Jabalpur');
      });
    });
  }

  /* ----------------------------------------------------
     7. Dynamic Counter Animation for Trust Highlights
  ---------------------------------------------------- */
  const counterElements = document.querySelectorAll('.count-up');
  let countersAnimated = false;

  function runCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    counterElements.forEach(el => {
      const target = parseFloat(el.getAttribute('data-target'));
      const suffix = el.getAttribute('data-suffix') || '';
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const duration = 1800; // ms
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = (easeProgress * target).toFixed(decimals);

        el.textContent = currentVal + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          el.textContent = target.toFixed(decimals) + suffix;
        }
      }
      requestAnimationFrame(updateNumber);
    });
  }

  // Observe trust highlights section for scroll trigger
  const statsSection = document.getElementById('trust-highlights');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounters();
          observer.unobserve(statsSection);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(statsSection);
  }
});

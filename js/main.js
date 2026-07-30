/* Crystal Management Services — site interactions */

(function () {
  const header = document.querySelector(".site-header");
  const navWrap = document.querySelector(".nav-wrap");
  const toggle = document.querySelector(".menu-toggle");
  const yearEls = document.querySelectorAll("[data-year]");

  yearEls.forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (toggle && navWrap && header) {
    toggle.addEventListener("click", () => {
      const open = navWrap.classList.toggle("is-open");
      header.classList.toggle("is-menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    navWrap.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navWrap.classList.remove("is-open");
        header.classList.remove("is-menu-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Reveal on scroll
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  // Cinematic hero — subtle parallax on background
  const hero = document.querySelector("[data-hero]");
  const heroBg = document.querySelector(".hero-bg");
  const motionOk = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

  if (hero && heroBg && motionOk) {
    let raf = 0;
    let targetX = 0;
    let targetY = 0;

    const render = () => {
      heroBg.style.setProperty("--hx", `${targetX}px`);
      heroBg.style.setProperty("--hy", `${targetY}px`);
      raf = 0;
    };

    hero.addEventListener(
      "pointermove",
      (event) => {
        const rect = hero.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        targetX = px * -14;
        targetY = py * -10;
        if (!raf) raf = requestAnimationFrame(render);
      },
      { passive: true }
    );

    hero.addEventListener("pointerleave", () => {
      targetX = 0;
      targetY = 0;
      if (!raf) raf = requestAnimationFrame(render);
    });
  }

  // Sticky mobile CTA only after hero leaves view (avoids duplicate button)
  const mobileCta = document.querySelector(".mobile-cta");
  const heroEl = document.querySelector("[data-hero]") || document.querySelector(".hero, .page-hero");
  if (mobileCta) {
    if (heroEl && "IntersectionObserver" in window) {
      const ctaObserver = new IntersectionObserver(
        ([entry]) => {
          mobileCta.classList.toggle("is-visible", !entry.isIntersecting);
        },
        { threshold: 0.12 }
      );
      ctaObserver.observe(heroEl);
    } else {
      mobileCta.classList.add("is-visible");
    }
  }

  // Soft cursor glow over links / buttons (desktop only)
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const allowMotion = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

  if (finePointer && allowMotion) {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);

    let glowRaf = 0;
    let gx = -100;
    let gy = -100;
    let hot = false;

    const interactiveSelector =
      'a[href], button:not([disabled]), .btn, summary, [role="button"], input[type="submit"], input[type="button"], label[for]';

    const paintGlow = () => {
      glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
      glowRaf = 0;
    };

    const setHot = (next) => {
      if (hot === next) return;
      hot = next;
      glow.classList.toggle("is-hot", hot);
    };

    window.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType && event.pointerType !== "mouse") return;
        gx = event.clientX;
        gy = event.clientY;
        glow.classList.add("is-on");
        if (!glowRaf) glowRaf = requestAnimationFrame(paintGlow);

        const target = event.target;
        const hit =
          target instanceof Element &&
          Boolean(target.closest(interactiveSelector));
        setHot(hit);
      },
      { passive: true }
    );

    document.documentElement.addEventListener("mouseleave", () => {
      glow.classList.remove("is-on", "is-hot");
      hot = false;
    });

    window.addEventListener("blur", () => {
      glow.classList.remove("is-on", "is-hot");
      hot = false;
    });
  }

  // Lead capture forms → mailto fallback (swap to HubSpot/Formspree later)
  document.querySelectorAll("[data-lead-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const interest = String(data.get("interest") || "").trim();
      const message = String(data.get("message") || "").trim();

      if (!name || !email) return;

      const subject = encodeURIComponent(`Website enquiry — ${interest || "General"}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nInterest: ${interest}\n\nMessage:\n${message}`
      );

      const success = form.querySelector(".form-success");
      if (success) success.classList.add("is-visible");

      // Opens her email client until CRM/form endpoint is connected
      window.location.href = `mailto:schola@cteprojects.org.uk?subject=${subject}&body=${body}`;
      form.reset();
    });
  });
})();

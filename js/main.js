/* Crystal Management Services — site interactions */

(function () {
  const header = document.querySelector(".site-header");
  const navWrap = document.querySelector(".nav-wrap");
  const toggle = document.querySelector(".menu-toggle");
  const yearEls = document.querySelectorAll("[data-year]");
  const enquiryEndpoint = "forms/send-enquiry.php";

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

  const hero = document.querySelector("[data-hero]");
  const heroBg = document.querySelector(".hero-bg");
  const motionOk = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

  if (hero && heroBg && motionOk) {
    let raf = 0;
    let targetX = 0;

    const render = () => {
      heroBg.style.setProperty("--hx", `${targetX}px`);
      heroBg.style.setProperty("--hy", "0px");
      raf = 0;
    };

    hero.addEventListener(
      "pointermove",
      (event) => {
        const rect = hero.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        targetX = px * -10;
        if (!raf) raf = requestAnimationFrame(render);
      },
      { passive: true }
    );

    hero.addEventListener("pointerleave", () => {
      targetX = 0;
      if (!raf) raf = requestAnimationFrame(render);
    });
  }

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

  const interestSelect = document.querySelector("#interest");
  if (interestSelect) {
    const params = new URLSearchParams(window.location.search);
    const interest = params.get("interest");
    if (interest) {
      const match = Array.from(interestSelect.options).find((opt) => opt.value === interest);
      if (match) interestSelect.value = interest;
    }
  }

  const openMailtoFallback = (payload) => {
    const subject = encodeURIComponent(`Website enquiry — ${payload.interest || "General"}`);
    const body = encodeURIComponent(
      `Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nInterest: ${payload.interest}\n\nMessage:\n${payload.message}`
    );
    window.location.href = `mailto:admin@crystalmanagementservices.com?subject=${subject}&body=${body}`;
  };

  document.querySelectorAll("[data-lead-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const payload = {
        name: String(data.get("name") || "").trim(),
        email: String(data.get("email") || "").trim(),
        phone: String(data.get("phone") || "").trim(),
        interest: String(data.get("interest") || "").trim(),
        message: String(data.get("message") || "").trim(),
      };

      if (!payload.name || !payload.email) return;

      const success = form.querySelector(".form-success");
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      try {
        const response = await fetch(enquiryEndpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
        });

        if (!response.ok) throw new Error("Enquiry endpoint unavailable");

        const result = await response.json().catch(() => ({}));
        if (!result.ok) throw new Error("Enquiry rejected");

        if (success) {
          success.textContent = "Thank you. Your enquiry has been sent. We will respond shortly.";
          success.classList.add("is-visible");
        }
        form.reset();
      } catch (error) {
        openMailtoFallback(payload);
        if (success) {
          success.textContent = "Your email app should open with the enquiry ready to send.";
          success.classList.add("is-visible");
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  });
})();

const menuToggle = document.querySelector(".menu-toggle");
const menuPanel = document.querySelector(".menu-panel");
const hero = document.querySelector(".hero");
const heroMachine = document.querySelector(".hero__machine");

if (menuToggle && menuPanel) {
  const menuLinks = menuPanel.querySelectorAll("a");

  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
    menuPanel.classList.remove("is-open");
  };

  const openMenu = () => {
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Cerrar menú");
    menuPanel.classList.add("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    if (isExpanded) {
      closeMenu();
      return;
    }

    openMenu();
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    const clickedInsideMenu = menuPanel.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

const demoForm = document.querySelector("[data-demo-form]");

if (demoForm) {
  demoForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

if (hero && heroMachine) {
  const waitForImage = (src) =>
    new Promise((resolve) => {
      const image = new Image();
      image.src = src;

      if (image.complete) {
        resolve();
        return;
      }

      image.addEventListener("load", () => resolve(), { once: true });
      image.addEventListener("error", () => resolve(), { once: true });
    });

  const startHeroAnimation = () => {
    window.setTimeout(() => {
      hero.classList.add("is-ready");
      document.body.classList.add("page-is-ready");
    }, 160);
  };

  Promise.all([
    waitForImage("img/hero.webp"),
    waitForImage("img/hero__tatuadora.webp"),
  ]).then(startHeroAnimation);
} else {
  document.body.classList.add("page-is-ready");
}

const lazyImages = document.querySelectorAll('img[loading="lazy"]');

lazyImages.forEach((image) => {
  const shell = image.parentElement;

  if (shell) {
    shell.classList.add("is-loading-image");
  }

  const markLoaded = () => {
    image.classList.add("is-loaded");
    shell?.classList.remove("is-loading-image");
  };

  if (image.complete) {
    markLoaded();
  } else {
    image.addEventListener("load", markLoaded, { once: true });
    image.addEventListener("error", markLoaded, { once: true });
  }
});

const workCards = document.querySelectorAll(".work-card");
const worksToggles = document.querySelectorAll("[data-works-toggle]");
const testimonyCards = document.querySelectorAll(".testimony-card");

if (workCards.length) {
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-inview");
        cardObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  workCards.forEach((card) => cardObserver.observe(card));
}

worksToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const group = toggle.closest(".works-group");

    if (!group) {
      return;
    }

    const isExpanded = group.classList.toggle("is-expanded");
    toggle.setAttribute("aria-expanded", String(isExpanded));
    toggle.querySelector("span").textContent = isExpanded ? "Ver menos" : "Ver más";
  });
});

if (testimonyCards.length) {
  // Activates each testimonial as it enters view so the ink reveal
  // feels tied to scroll instead of running immediately on page load.
  const testimonyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        testimonyObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.28,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  testimonyCards.forEach((card) => testimonyObserver.observe(card));
}

const processMarkers = document.querySelectorAll(".process-marker");
const processTips = document.querySelectorAll(".process-tip");
const processLayers = document.querySelectorAll(".process-arm-layer");

if (processMarkers.length) {
  const isMobileProcess = window.matchMedia("(max-width: 767px)").matches;
  const stageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const stageId = entry.target.dataset.stage;
        const stageNumber = Number(stageId);

        processMarkers.forEach((marker) => marker.classList.remove("is-active"));
        processTips.forEach((tip) => {
          const tipNumber = Number(tip.dataset.stage);
          tip.classList.toggle("is-active", tip.dataset.stage === stageId);
          tip.classList.toggle("is-complete", tipNumber < stageNumber);
        });
        processLayers.forEach((layer) => {
          const isMatch = layer.classList.contains(`process-arm-layer--${stageId}`);
          layer.classList.toggle("is-active", isMatch);
        });
        entry.target.classList.add("is-active");
      });
    },
    {
      threshold: isMobileProcess ? 0.4 : 0.45,
      rootMargin: isMobileProcess ? "-14% 0px -20% 0px" : "-12% 0px -12% 0px",
    }
  );

  processMarkers.forEach((marker) => stageObserver.observe(marker));
}

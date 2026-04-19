const menuToggle = document.querySelector(".menu-toggle");
const menuPanel = document.querySelector(".menu-panel");
const hero = document.querySelector(".hero");
const heroMachine = document.querySelector(".hero__machine");

if (menuToggle && menuPanel) {
  const menuLinks = menuPanel.querySelectorAll("a");

  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    menuPanel.classList.remove("is-open");
  };

  const openMenu = () => {
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Cerrar menu");
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
  const startHeroAnimation = () => {
    window.setTimeout(() => {
      hero.classList.add("is-ready");
    }, 160);
  };

  if (heroMachine.complete) {
    startHeroAnimation();
  } else {
    heroMachine.addEventListener("load", startHeroAnimation, { once: true });
    heroMachine.addEventListener("error", startHeroAnimation, { once: true });
  }
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

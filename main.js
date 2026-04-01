(function () {
  'use strict';

  // ===== 狀態：是否已登入（可改為從 API / localStorage 讀取）
  let isLoggedIn = false;

  // ===== DOM 節點
  const navBeforeLogin = document.querySelector('.nav-before-login');
  const navAfterLogin = document.querySelector('.nav-after-login');
  const memberNameBtn = document.querySelector('.member-name-btn');
  const memberDropdown = document.querySelector('.member-dropdown');
  const featuredTrack = document.querySelector('.featured-track');
  const carouselPrev = document.querySelector('.carousel-prev');
  const carouselNext = document.querySelector('.carousel-next');
  const legalModal = document.getElementById('modal-legal');
  const legalOpenBtn = document.querySelector('[data-modal="legal"]');
  const legalCloseBtn = legalModal?.querySelector('.modal-close');
  const legalBackdrop = legalModal?.querySelector('.modal-backdrop');

  // ===== 登入狀態切換
  function renderNavByLogin() {
    if (isLoggedIn) {
      navBeforeLogin?.classList.add('is-hidden');
      navAfterLogin?.classList.remove('is-hidden');
    } else {
      navBeforeLogin?.classList.remove('is-hidden');
      navAfterLogin?.classList.add('is-hidden');
    }
  }

  function openMemberDropdown() {
    if (!memberDropdown) return;
    memberDropdown.classList.add('is-open');
    memberNameBtn?.setAttribute('aria-expanded', 'true');
  }

  function closeMemberDropdown() {
    if (!memberDropdown) return;
    memberDropdown.classList.remove('is-open');
    memberNameBtn?.setAttribute('aria-expanded', 'false');
  }

  if (memberNameBtn && memberDropdown) {
    memberNameBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const open = memberDropdown.classList.toggle('is-open');
      memberNameBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function () {
      closeMemberDropdown();
    });
    memberDropdown.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  }

  renderNavByLogin();

  // ===== 登入表單：避免 POST 造成 405，暫時帳號 AAA/123 導向 React 後台
  const authForm = document.querySelector('.auth-form');
  if (authForm && document.getElementById('login-email')) {
    authForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailInput = document.getElementById('login-email');
      var passwordInput = document.getElementById('login-password');
      var account = (emailInput && emailInput.value) ? emailInput.value.trim() : '';
      var password = (passwordInput && passwordInput.value) ? passwordInput.value : '';
      if (account === 'AAA' && password === '123') {
        // 靜態站／GitHub Pages：導向後台示範頁，避免 POST 造成 405
        window.location.href = 'admin.html';
        return;
      }
      alert('此為靜態示範頁面，尚無登入功能。\n\n暫時後台入口：帳號 AAA / 密碼 123');
    });
  }

  // ===== 精選課程輪播（前後按鈕）
  if (featuredTrack && (carouselPrev || carouselNext)) {
    const TRANSITION = 'transform 0.4s ease';
    let index = 0;
    let slideStep = 0;
    let slideCount = 0;
    let isAnimating = false;
    let resizeTimer = null;

    function removeClones() {
      // 移除舊的 clones，避免 resize/re-init 疊加
      featuredTrack.querySelectorAll('.featured-slide.is-clone').forEach((el) => el.remove());
    }

    function measureStep(realSlides) {
      if (realSlides.length < 2) return 0;
      const r0 = realSlides[0].getBoundingClientRect();
      const r1 = realSlides[1].getBoundingClientRect();
      return r1.left - r0.left; // 含 gap 的「一步位移」
    }

    function applyTransform(instant) {
      const offset = -(index * slideStep);

      if (instant) {
        featuredTrack.style.transition = 'none';
      } else {
        featuredTrack.style.transition = TRANSITION;
      }

      featuredTrack.style.transform = 'translateX(' + offset + 'px)';

      if (instant) {
        // 強制 reflow，確保下一次 transition 不會被舊狀態影響
        featuredTrack.getBoundingClientRect();
        requestAnimationFrame(function () {
          featuredTrack.style.transition = TRANSITION;
        });
      }
    }

    function initCarousel() {
      removeClones();

      const realSlides = Array.from(featuredTrack.querySelectorAll('.featured-slide'));
      slideCount = realSlides.length;
      if (slideCount <= 1) return;

      // 以「整組複製 3 份」做 infinite：
      // [ clonesBefore(1..n) | real(1..n) | clonesAfter(1..n) ]
      // 好處：不需要算 visibleCount，避免桌機/平板/手機出現結尾空白
      const beforeFrag = document.createDocumentFragment();
      const afterFrag = document.createDocumentFragment();

      realSlides.forEach((sl) => {
        const c = sl.cloneNode(true);
        c.classList.add('is-clone');
        beforeFrag.appendChild(c);
      });
      realSlides.forEach((sl) => {
        const c = sl.cloneNode(true);
        c.classList.add('is-clone');
        afterFrag.appendChild(c);
      });

      const firstReal = realSlides[0];
      featuredTrack.insertBefore(beforeFrag, firstReal);
      featuredTrack.appendChild(afterFrag);

      // 重新取得實際 real slides（原本節點沒有 is-clone class）
      const updatedRealSlides = Array.from(featuredTrack.querySelectorAll('.featured-slide:not(.is-clone)'));
      slideStep = measureStep(updatedRealSlides);

      // 起始：指向中間 real 區（確保視窗永遠不會走到空白）
      index = slideCount;
      isAnimating = false;
      applyTransform(true);
    }

    function goNext() {
      if (isAnimating) return;
      isAnimating = true;
      index += 1;
      applyTransform(false);
    }

    function goPrev() {
      if (isAnimating) return;
      isAnimating = true;
      index -= 1;
      applyTransform(false);
    }

    if (carouselNext) carouselNext.addEventListener('click', goNext);
    if (carouselPrev) carouselPrev.addEventListener('click', goPrev);

    featuredTrack.addEventListener('transitionend', function (e) {
      if (e.propertyName !== 'transform') return;
      isAnimating = false;

      // index 走到後半 clones 區：瞬間切回中間 real 區的對應位置
      if (index >= slideCount * 2) {
        index = slideCount;
        applyTransform(true);
        return;
      }

      // index 走到前半 clones 區：瞬間切回中間 real 區的對應位置
      if (index < slideCount) {
        index = slideCount * 2 - 1;
        applyTransform(true);
        return;
      }
    });

    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        initCarousel();
      }, 150);
    });

    initCarousel();
  }

  // ===== 條款／隱私權彈窗
  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  if (legalOpenBtn && legalModal) {
    legalOpenBtn.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(legalModal);
    });
  }
  if (legalCloseBtn && legalModal) {
    legalCloseBtn.addEventListener('click', function () {
      closeModal(legalModal);
    });
  }
  if (legalBackdrop && legalModal) {
    legalBackdrop.addEventListener('click', function () {
      closeModal(legalModal);
    });
  }

  // ESC 關閉彈窗
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && legalModal && !legalModal.hasAttribute('hidden')) {
      closeModal(legalModal);
    }
  });

  // ===== 行動版選單（可選：需在 HTML 加上對應結構可展開的選單）
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', function () {
      navMenu.classList.toggle('is-open-mobile');
    });
  }
})();

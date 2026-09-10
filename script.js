/* =========================================================
   경북 AX랩 · AX 인사이트 톡 세미나 (Multi-Page) - 공통 스크립트
   - Tailwind CDN 설정
   - GNB 액티브 상태 처리
   - 모바일 메뉴 / 스크롤 그림자 / 등장 애니메이션
   - 사전 신청 폼 유효성 검사 + 완료 알림 + 메인 이동
   ========================================================= */

/* ---------------------------------------------------------
   1) Tailwind CDN 설정
   - 이 파일은 <head>에서 Tailwind CDN 스크립트 "다음"에,
     일반 <script src>로 로드되어야 합니다. (defer 사용 금지)
   --------------------------------------------------------- */
if (typeof window !== 'undefined' && window.tailwind) {
  window.tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          sans: ['Pretendard', 'Noto Sans KR', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        },
        colors: {
          brand: {
            50: '#ebf3ff',
            100: '#d7e6ff',
            500: '#1e66f5',
            600: '#1e66f5',
            700: '#1a56d6',
          },
          ink: '#1e293b',
          muted: '#64748b',
        },
      },
    },
  };
}

/* ---------------------------------------------------------
   2) 페이지 동작 (DOM 준비 후 실행)
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var HEADER_OFFSET = 88;

  /* ----- GNB 액티브 상태 처리 -----
     현재 파일명과 일치하는 nav 링크에 text-blue-600 / font-bold 부여 */
  var currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (currentPage === '') currentPage = 'index.html';

  document.querySelectorAll('[data-nav]').forEach(function (link) {
    var target = (link.getAttribute('href') || '').toLowerCase();
    if (target === currentPage) {
      link.classList.remove('text-slate-600', 'text-slate-700');
      link.classList.add('text-blue-600', 'font-bold');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ----- 모바일 메뉴 토글 ----- */
  var menuToggle = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var iconOpen = document.getElementById('icon-open');
  var iconClose = document.getElementById('icon-close');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      var isHidden = mobileMenu.classList.toggle('hidden');
      if (iconOpen) iconOpen.classList.toggle('hidden', !isHidden);
      if (iconClose) iconClose.classList.toggle('hidden', isHidden);
      menuToggle.setAttribute('aria-expanded', String(!isHidden));
    });
  }

  /* ----- GNB 스크롤 시 그림자 ----- */
  var header = document.getElementById('site-header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('shadow-soft', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ----- 같은 페이지 내 앵커 스무스 스크롤 (GNB 높이 보정) ----- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (!id || id === '#') return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var top = el.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
      window.scrollTo({ top: top, behavior: 'smooth' });
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
      }
    });
  });

  /* ----- 스크롤 등장 애니메이션 ----- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ----- 원격 지원 (데모) ----- */
  var remoteBtn = document.getElementById('remote-support');
  if (remoteBtn) {
    remoteBtn.addEventListener('click', function (e) {
      e.preventDefault();
      alert('원격 지원 안내\n\n운영 사무국(054-000-0000)으로 연락 주시면\n화면 공유 기반 원격 지원을 도와드립니다.');
    });
  }

  /* ----- 사전 신청 폼 (apply.html) ----- */
  var form = document.getElementById('apply-form');
  var errorBox = document.getElementById('form-error');

  function showError(msg) {
    if (!errorBox) { alert(msg); return; }
    errorBox.textContent = msg;
    errorBox.classList.remove('hidden');
    errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  if (form) {
    form.addEventListener('input', function () {
      if (errorBox) errorBox.classList.add('hidden');
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (errorBox) errorBox.classList.add('hidden');

      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var email = form.email.value.trim();
      var affiliation = form.affiliation.value.trim();
      var privacy = form.privacy.checked;

      if (!name) { return showError('성명을 입력해 주세요.'); }
      if (!phone) { return showError('연락처를 입력해 주세요.'); }
      if (!/^[0-9\-\+\s()]{9,}$/.test(phone)) { return showError('연락처 형식을 확인해 주세요. (숫자, - 만 입력)'); }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { return showError('올바른 이메일 주소를 입력해 주세요.'); }
      if (!affiliation) { return showError('소속을 입력해 주세요.'); }
      if (!privacy) { return showError('개인정보 수집 및 이용에 동의해 주세요.'); }

      // 실제 전송 로직 자리 (예: fetch)
      alert('신청이 완료되었습니다.\n입력하신 이메일로 세부 안내를 보내드리겠습니다. 감사합니다!');
      window.location.href = 'index.html';
    });
  }
});

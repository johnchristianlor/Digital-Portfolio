/* ─── CLOUDINARY ASSET LOADER ─────────────────────────────────── */
const CLOUDINARY_ASSETS = window.CLOUDINARY_ASSETS || {};

function getAssetValue(path) {
    return String(path || '').split('.').reduce((value, key) => {
        if (value == null) return undefined;
        if (Array.isArray(value) && /^\d+$/.test(key)) return value[Number(key)];
        return value[key];
    }, CLOUDINARY_ASSETS);
}

function cleanAssetUrl(value) {
    return typeof value === 'string' ? value.trim() : '';
}

function makeCloudinaryPlaceholder(label = 'Add Cloudinary image') {
    const safeLabel = String(label || 'Add Cloudinary image')
        .replace(/[&<>"']/g, '')
        .slice(0, 44);
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675">
            <defs>
                <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0" stop-color="#08111f"/>
                    <stop offset="1" stop-color="#101827"/>
                </linearGradient>
            </defs>
            <rect width="1200" height="675" rx="32" fill="url(#g)"/>
            <rect x="34" y="34" width="1132" height="607" rx="24" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="12 12"/>
            <circle cx="600" cy="274" r="42" fill="#173044"/>
            <path d="M520 404 600 324l52 52 38-38 82 82H428l92-16Z" fill="#24455d"/>
            <text x="600" y="500" text-anchor="middle" fill="#94a3b8" font-family="Arial, sans-serif" font-size="27">${safeLabel}</text>
            <text x="600" y="540" text-anchor="middle" fill="#64748b" font-family="Arial, sans-serif" font-size="19">Paste the Cloudinary URL in cloudinary-config.js</text>
        </svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function applyCloudinaryAssets() {
    const favicon = document.getElementById('site-favicon');
    const faviconUrl = cleanAssetUrl(CLOUDINARY_ASSETS.favicon);
    if (favicon && faviconUrl) favicon.href = faviconUrl;

    document.querySelectorAll('[data-cloudinary-src]').forEach((element) => {
        const path = element.dataset.cloudinarySrc;
        const url = cleanAssetUrl(getAssetValue(path));
        if (url) {
            element.src = url;
            element.classList.remove('cloudinary-missing');
        } else {
            element.src = makeCloudinaryPlaceholder(element.alt || 'Add image');
            element.classList.add('cloudinary-missing');
        }
    });

    document.querySelectorAll('[data-cloudinary-href]').forEach((link) => {
        const primary = cleanAssetUrl(getAssetValue(link.dataset.cloudinaryHref));
        const fallback = cleanAssetUrl(getAssetValue(link.dataset.cloudinaryFallbackHref));
        const url = primary || fallback;
        link.href = url || '#';
        link.classList.toggle('cloudinary-link-missing', !url);
        link.addEventListener('click', (event) => {
            if (!url) {
                event.preventDefault();
                window.alert('Paste the matching Cloudinary URL in cloudinary-config.js first.');
            }
        });
    });
}

applyCloudinaryAssets();

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('mobile-menu');
    const navList    = document.querySelector('.nav-list');
    const navLinks   = document.querySelectorAll('.nav-link');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            menuToggle.classList.toggle('active');
            document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
        });

        menuToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                menuToggle.click();
            }
        });

        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navList.contains(e.target) && navList.classList.contains('active')) {
                navList.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    const textElement = document.getElementById('typing-text');
    const nameText    = "John Christian Lor";

    if (textElement) {
        textElement.textContent = "";
        let i = 0;
        function typeWriter() {
            if (i < nameText.length) {
                textElement.textContent += nameText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        setTimeout(typeWriter, 500);
    }

    const roleElement = document.getElementById('dynamic-role');
    const roleArticle = document.getElementById('role-article');
    const roles = [
        { article: 'an', label: 'Educator' },
        { article: 'a', label: 'Creative Developer' },
        { article: 'a', label: 'Tech Enthusiast' },
        { article: 'a', label: 'Web Developer' },
        { article: 'a', label: 'Software Developer' },
        { article: 'a', label: 'Digital Creator' }
    ];

    if (roleElement && roleArticle) {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduceMotion) {
            roleArticle.textContent = roles[0].article;
            roleElement.textContent = roles[0].label;
        } else {
            let roleIndex = 0;
            let charIndex = roles[0].label.length;
            let deleting = true;

            const animateRole = () => {
                const currentRole = roles[roleIndex];

                if (deleting) {
                    charIndex--;
                    roleElement.textContent = currentRole.label.slice(0, Math.max(charIndex, 0));

                    if (charIndex <= 0) {
                        deleting = false;
                        roleIndex = (roleIndex + 1) % roles.length;
                        roleArticle.textContent = roles[roleIndex].article;
                        setTimeout(animateRole, 320);
                        return;
                    }

                    setTimeout(animateRole, 48);
                } else {
                    const nextRole = roles[roleIndex];
                    charIndex++;
                    roleElement.textContent = nextRole.label.slice(0, charIndex);

                    if (charIndex >= nextRole.label.length) {
                        deleting = true;
                        setTimeout(animateRole, 1800);
                        return;
                    }

                    setTimeout(animateRole, 78);
                }
            };

            setTimeout(animateRole, 2200);
        }
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-animate');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll('.hidden-animate').forEach(el => observer.observe(el));
    applyDynamicVerificationBadges();
    applyCredentialImageOrientation();
});

const badgeModal   = document.getElementById('badge-list-modal');
const certModal    = document.getElementById('cert-list-modal');
const seminarModal = document.getElementById('seminar-list-modal');
const imageModal   = document.getElementById('image-modal');
const modalImg     = document.getElementById('modal-img-target');
const modalPreviewTitle = document.getElementById('modal-preview-title');
const modalPreviewSubtitle = document.getElementById('modal-preview-subtitle');
const modalPreviewBadge = document.getElementById('modal-preview-badge');



function applyCredentialImageOrientation() {
    const mediaBlocks = document.querySelectorAll('.media-certificate, .credential-thumb');

    mediaBlocks.forEach(media => {
        const img = media.querySelector('img');
        if (!img) return;

        const classify = () => {
            media.classList.remove('is-portrait', 'is-landscape');
            const portrait = img.naturalHeight > img.naturalWidth * 1.08;
            media.classList.add(portrait ? 'is-portrait' : 'is-landscape');
            media.style.setProperty('--certificate-bg', `url("${img.src.replace(/"/g, '%22')}")`);
        };

        if (img.complete && img.naturalWidth) classify();
        else img.addEventListener('load', classify, { once: true });
    });
}


function applyResponsiveMediaBackdrops() {
    document.querySelectorAll('#credentials .highlight-media').forEach(media => {
        const img = media.querySelector('img');
        if (!img) return;

        const apply = () => {
            const src = img.currentSrc || img.src;
            if (src) media.style.setProperty('--preview-bg', `url("${src.replace(/"/g, '\\"')}")`);
        };

        if (img.complete) apply();
        else img.addEventListener('load', apply, { once: true });
    });
}

function hasRealVerificationLink(card) {
    if (!card) return false;
    const link = card.querySelector('.mini-verify-link, .credential-link');
    if (!link) return false;
    const href = (link.getAttribute('href') || '').trim();
    const hasPlaceholderHandler = (link.getAttribute('onclick') || '').includes('showCredentialPlaceholder');
    return href !== '' && href !== '#' && !hasPlaceholderHandler;
}

function applyDynamicVerificationBadges() {
    const certificateHighlightCards = document.querySelectorAll('.credential-section:not(.seminar-section) .highlight-card');
    certificateHighlightCards.forEach(card => {
        const top = card.querySelector('.highlight-top');
        if (!top) return;

        const existingAuto = top.querySelector('.auto-verified-pill');
        if (existingAuto) existingAuto.remove();

        if (hasRealVerificationLink(card)) {
            card.classList.add('has-real-link');
            const draft = top.querySelector('.draft-pill');
            if (draft) draft.remove();
            if (!top.querySelector('.verified-pill')) {
                const badge = document.createElement('span');
                badge.className = 'verified-pill auto-verified-pill';
                badge.innerHTML = '<i class="fas fa-circle-check"></i> Verified';
                top.appendChild(badge);
            }
        } else {
            card.classList.remove('has-real-link');
            top.querySelectorAll('.verified-pill').forEach(badge => badge.remove());
        }
    });

}

function setPreviewMeta(card, imgEl) {
    if (!modalPreviewTitle || !modalPreviewSubtitle || !modalPreviewBadge) return;

    const title = card?.querySelector('h4')?.textContent?.trim() || imgEl?.alt || 'Credential Preview';
    const subtitle = card?.querySelector('p')?.textContent?.trim() || 'Larger elegant preview for certificate and seminar images.';
    const verified = hasRealVerificationLink(card);
    const isListCard = !!card?.classList.contains('credential-list-card');
    const isSeminar = !!card?.closest('.seminar-section') || card?.classList.contains('seminar-item');
    const isBadge = !!card?.classList.contains('badge-card') || !!card?.classList.contains('badge-list-card');

    modalPreviewTitle.textContent = isBadge ? 'Badge Preview' : title;
    modalPreviewSubtitle.textContent = isBadge ? 'A larger view of this badge image.' : subtitle;
    modalPreviewBadge.classList.toggle('is-verified', verified && !isListCard && !isBadge);
    modalPreviewBadge.innerHTML = isBadge
        ? '<i class="fas fa-award"></i> Badge Preview'
        : isListCard
            ? (isSeminar
                ? '<i class="fas fa-images"></i> Seminar Preview'
                : '<i class="fas fa-image"></i> Certificate Preview')
            : verified
                ? '<i class="fas fa-circle-check"></i> Verified Preview'
                : isSeminar
                    ? '<i class="fas fa-images"></i> Seminar Preview'
                    : '<i class="fas fa-image"></i> Preview';
}

function openBadgeList() {
    if (badgeModal) {
        badgeModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function openCertList() {
    if (certModal) {
        certModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function openSeminarList() {
    if (seminarModal) {
        seminarModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeListModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function openImageModal(btn) {
    const imgEl = btn.querySelector('img') || btn.parentElement.querySelector('img');
    const card = btn.closest('.highlight-card, .credential-list-card, .badge-card, .badge-list-card');
    if (imageModal && modalImg && imgEl) {
        modalImg.src = imgEl.src;
        modalImg.alt = imgEl.alt || 'Preview image';
        setPreviewMeta(card, imgEl);
        imageModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeImageModal() {
    if (imageModal) {
        imageModal.style.display = 'none';
        if (badgeModal.style.display !== 'flex' && certModal.style.display !== 'flex' && seminarModal.style.display !== 'flex') {
            document.body.style.overflow = '';
        }
    }
}

window.onclick = function (event) {
    if (event.target === badgeModal)   closeListModal('badge-list-modal');
    else if (event.target === certModal)    closeListModal('cert-list-modal');
    else if (event.target === seminarModal) closeListModal('seminar-list-modal');
    else if (event.target === imageModal)   closeImageModal();
};

document.addEventListener('keydown', function (event) {
    if (event.key === "Escape") {
        if (imageModal && imageModal.style.display === 'flex') {
            closeImageModal();
        } else {
            closeListModal('badge-list-modal');
            closeListModal('cert-list-modal');
            closeListModal('seminar-list-modal');
        }
    }
});
function showCredentialPlaceholder(event) {
    if (event) event.preventDefault();
    window.alert('Replace the placeholder image src and the verification link in index.html. Portrait or vertical certificates are supported already—the frame will auto-fit them professionally.');
    return false;
}

/* ─── PROJECT SHOWCASE / CASE-STUDY MODAL ─────────────────────── */
const PROJECT_ASSETS = CLOUDINARY_ASSETS.projects || {};
const simpleIcon = (slug, color) => `https://cdn.simpleicons.org/${slug}/${color}`;
const projectShots = (projectKey, labels = []) => {
    const urls = Array.isArray(PROJECT_ASSETS?.[projectKey]?.screenshots)
        ? PROJECT_ASSETS[projectKey].screenshots.map(cleanAssetUrl).filter(Boolean)
        : [];

    if (!urls.length) {
        return [{ src: makeCloudinaryPlaceholder('Project screenshot'), alt: labels[0] || 'Project screenshot' }];
    }

    return urls.map((src, index) => ({
        src,
        alt: labels[index] || `Project screenshot ${index + 1}`
    }));
};

const projectShowcaseData = {
    ecommerce: {
        type: 'Full-stack Web Application',
        title: 'E-Commerce Dashboard',
        description: 'A comprehensive platform for buying and selling electronics with real-time inventory management, secure payment flow, order monitoring, product organization, and a responsive dashboard experience.',
        tech: [
            { name: 'React', logo: simpleIcon('react', '61DAFB') },
            { name: 'Node.js', logo: simpleIcon('nodedotjs', '5FA04E') },
            { name: 'Stripe', logo: simpleIcon('stripe', '635BFF') }
        ],
        live: '#',
        github: '#',
        screenshots: projectShots('ecommerce', [
            'E-Commerce dashboard overview screenshot',
            'E-Commerce product management screenshot',
            'E-Commerce checkout screenshot'
        ])
    },
    chat: {
        type: 'Real-time Communication Platform',
        title: 'Real-time Chat App',
        description: 'A responsive messaging platform built around fast room-based conversations, user presence, media sharing, and an organized interface for communication across desktop and mobile devices.',
        tech: [
            { name: 'Vue.js', logo: simpleIcon('vuedotjs', '4FC08D') },
            { name: 'Tailwind CSS', logo: simpleIcon('tailwindcss', '06B6D4') },
            { name: 'Firebase', logo: simpleIcon('firebase', 'DD2C00') }
        ],
        live: '#',
        github: '#',
        screenshots: projectShots('chat', [
            'Real-time chat conversation screenshot',
            'Real-time chat media sharing screenshot',
            'Real-time chat settings screenshot'
        ])
    }
};

const projectCarousel = document.getElementById('projects-carousel');
const projectCarouselTrack = document.getElementById('projects-carousel-track');
const projectCarouselSlides = projectCarouselTrack ? Array.from(projectCarouselTrack.querySelectorAll('.project-carousel-slide')) : [];
const projectCarouselPrev = document.getElementById('project-carousel-prev');
const projectCarouselNext = document.getElementById('project-carousel-next');
const projectCarouselIndicators = document.getElementById('project-carousel-indicators');
let currentProjectSlide = 0;
let projectCarouselTimer = null;

function updateProjectCarousel() {
    if (!projectCarouselTrack || !projectCarouselSlides.length) return;
    projectCarouselTrack.style.transform = `translateX(-${currentProjectSlide * 100}%)`;
    projectCarouselSlides.forEach((slide, index) => {
        const isActive = index === currentProjectSlide;
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        slide.tabIndex = isActive ? 0 : -1;
        slide.querySelectorAll('a, button').forEach((item) => {
            item.tabIndex = isActive ? 0 : -1;
        });
    });

    if (projectCarouselIndicators) {
        projectCarouselIndicators.querySelectorAll('.project-carousel-dot').forEach((dot, index) => {
            const isActive = index === currentProjectSlide;
            dot.classList.toggle('active', isActive);
            dot.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
    }

    const multipleSlides = projectCarouselSlides.length > 1;
    if (projectCarouselPrev) projectCarouselPrev.disabled = !multipleSlides;
    if (projectCarouselNext) projectCarouselNext.disabled = !multipleSlides;
}

function goToProjectSlide(index) {
    if (!projectCarouselSlides.length) return;
    currentProjectSlide = (index + projectCarouselSlides.length) % projectCarouselSlides.length;
    updateProjectCarousel();
}

function nextProjectSlide() { goToProjectSlide(currentProjectSlide + 1); }
function prevProjectSlide() { goToProjectSlide(currentProjectSlide - 1); }

function stopProjectCarouselAuto() {
    if (projectCarouselTimer) {
        clearInterval(projectCarouselTimer);
        projectCarouselTimer = null;
    }
}

function startProjectCarouselAuto() {
    stopProjectCarouselAuto();
    if (projectCarouselSlides.length < 2) return;
    projectCarouselTimer = setInterval(nextProjectSlide, 5500);
}

function resetProjectCarouselAuto() {
    startProjectCarouselAuto();
}

function initProjectCarousel() {
    if (!projectCarousel || !projectCarouselTrack || !projectCarouselSlides.length) return;

    if (projectCarouselIndicators) {
        projectCarouselIndicators.innerHTML = '';
        projectCarouselSlides.forEach((slide, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = `project-carousel-dot${index === 0 ? ' active' : ''}`;
            dot.setAttribute('aria-label', `Show project ${index + 1}`);
            dot.setAttribute('aria-current', index === 0 ? 'true' : 'false');
            dot.addEventListener('click', () => {
                goToProjectSlide(index);
                resetProjectCarouselAuto();
            });
            projectCarouselIndicators.appendChild(dot);
        });
    }

    if (projectCarouselPrev) {
        projectCarouselPrev.addEventListener('click', () => {
            prevProjectSlide();
            resetProjectCarouselAuto();
        });
    }

    if (projectCarouselNext) {
        projectCarouselNext.addEventListener('click', () => {
            nextProjectSlide();
            resetProjectCarouselAuto();
        });
    }

    projectCarousel.addEventListener('mouseenter', stopProjectCarouselAuto);
    projectCarousel.addEventListener('mouseleave', startProjectCarouselAuto);
    projectCarousel.addEventListener('focusin', stopProjectCarouselAuto);
    projectCarousel.addEventListener('focusout', (event) => {
        if (!projectCarousel.contains(event.relatedTarget)) startProjectCarouselAuto();
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopProjectCarouselAuto();
        else startProjectCarouselAuto();
    });

    updateProjectCarousel();
    startProjectCarouselAuto();
}

const projectDetailModal = document.getElementById('project-detail-modal');
const projectModalTitle = document.getElementById('project-modal-title');
const projectModalType = document.getElementById('project-modal-type');
const projectModalStack = document.getElementById('project-modal-stack');
const projectModalDescription = document.getElementById('project-modal-description');
const projectGalleryMain = document.getElementById('project-gallery-main');
const projectGalleryThumbnails = document.getElementById('project-gallery-thumbnails');
const projectGalleryPrev = document.getElementById('project-gallery-prev');
const projectGalleryNext = document.getElementById('project-gallery-next');
const projectGalleryCounter = document.getElementById('project-gallery-counter');
const projectModalLive = document.getElementById('project-modal-live');
const projectModalGithub = document.getElementById('project-modal-github');
let currentProjectScreenshots = [];
let currentProjectScreenshotIndex = 0;

function renderProjectTechStack(tech = []) {
    if (!projectModalStack) return;
    projectModalStack.innerHTML = tech.map(item =>
        `<span class="project-stack-chip"><img alt="${item.name} logo" class="tech-logo" src="${item.logo}"/> ${item.name}</span>`
    ).join('');
}

function updateProjectScreenshotView(index = 0, focusThumb = false) {
    if (!projectGalleryMain || !currentProjectScreenshots.length) return;

    currentProjectScreenshotIndex = (index + currentProjectScreenshots.length) % currentProjectScreenshots.length;
    const currentShot = currentProjectScreenshots[currentProjectScreenshotIndex];
    projectGalleryMain.src = currentShot.src;
    projectGalleryMain.alt = currentShot.alt || 'Project system screenshot';

    if (projectGalleryCounter) {
        projectGalleryCounter.textContent = `${currentProjectScreenshotIndex + 1} / ${currentProjectScreenshots.length}`;
    }

    if (projectGalleryPrev) projectGalleryPrev.disabled = currentProjectScreenshots.length <= 1;
    if (projectGalleryNext) projectGalleryNext.disabled = currentProjectScreenshots.length <= 1;

    if (projectGalleryThumbnails) {
        const thumbs = Array.from(projectGalleryThumbnails.querySelectorAll('.project-gallery-thumb'));
        thumbs.forEach((thumb, thumbIndex) => thumb.classList.toggle('active', thumbIndex === currentProjectScreenshotIndex));
        const activeThumb = thumbs[currentProjectScreenshotIndex];

        if (activeThumb) {
            const containerWidth = projectGalleryThumbnails.clientWidth;
            const targetLeft = activeThumb.offsetLeft - ((containerWidth - activeThumb.offsetWidth) / 2);
            projectGalleryThumbnails.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
            if (focusThumb) activeThumb.focus({ preventScroll: true });
        }
    }
}

function changeProjectScreenshot(direction = 1) {
    if (!currentProjectScreenshots.length) return;
    updateProjectScreenshotView(currentProjectScreenshotIndex + direction);
}

function renderProjectScreenshots(screenshots = []) {
    if (!projectGalleryThumbnails || !projectGalleryMain || !screenshots.length) return;

    currentProjectScreenshots = screenshots;
    currentProjectScreenshotIndex = 0;
    projectGalleryThumbnails.innerHTML = '';

    screenshots.forEach((shot, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `project-gallery-thumb${index === 0 ? ' active' : ''}`;
        button.setAttribute('aria-label', `Show screenshot ${index + 1}`);
        button.innerHTML = `<img src="${shot.src}" alt="${shot.alt || `Project screenshot ${index + 1}`}"/>`;
        button.addEventListener('click', () => updateProjectScreenshotView(index, true));
        projectGalleryThumbnails.appendChild(button);
    });

    updateProjectScreenshotView(0);
}

function openProjectModal(projectKey) {
    const project = projectShowcaseData[projectKey];
    if (!project || !projectDetailModal) return;

    if (projectModalTitle) projectModalTitle.textContent = project.title;
    if (projectModalType) projectModalType.textContent = project.type;
    if (projectModalDescription) projectModalDescription.textContent = project.description;
    renderProjectTechStack(project.tech);
    renderProjectScreenshots(project.screenshots);

    if (projectModalLive) projectModalLive.href = project.live || '#';
    if (projectModalGithub) projectModalGithub.href = project.github || '#';

    projectDetailModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    const closeButton = projectDetailModal.querySelector('.project-modal-close');
    if (closeButton) setTimeout(() => closeButton.focus(), 30);
}

function closeProjectModal() {
    if (!projectDetailModal) return;
    projectDetailModal.style.display = 'none';
    document.body.style.overflow = '';
}

if (projectGalleryPrev) {
    projectGalleryPrev.addEventListener('click', () => changeProjectScreenshot(-1));
}
if (projectGalleryNext) {
    projectGalleryNext.addEventListener('click', () => changeProjectScreenshot(1));
}

document.addEventListener('keydown', function (event) {
    if (projectDetailModal && projectDetailModal.style.display === 'flex') {
        if (event.key === 'ArrowLeft') changeProjectScreenshot(-1);
        if (event.key === 'ArrowRight') changeProjectScreenshot(1);
    }
});

function handleProjectCardKey(event, projectKey) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openProjectModal(projectKey);
    }
}

function handleProjectLink(event, label) {
    const link = event.currentTarget;
    const href = (link.getAttribute('href') || '').trim();
    event.stopPropagation();

    if (!href || href === '#') {
        event.preventDefault();
        window.alert(`Add your ${label} URL in index.html or projectShowcaseData in script.js.`);
        return false;
    }
    return true;
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && projectDetailModal && projectDetailModal.style.display === 'flex') {
        closeProjectModal();
    }
});

initProjectCarousel();


// ─── CONTACT / FAQ / NEWSLETTER ───────────────────────
function toggleFaq(button) {
    const item = button.closest('.faq-item');
    if (!item) return;

    const list = item.parentElement;
    const shouldOpen = !item.classList.contains('active');

    if (list) {
        list.querySelectorAll('.faq-item').forEach((faqItem) => {
            faqItem.classList.remove('active');
            const faqButton = faqItem.querySelector('.faq-question');
            if (faqButton) faqButton.setAttribute('aria-expanded', 'false');
        });
    }

    if (shouldOpen) {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
    }
}

function handleContactSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form || !form.checkValidity()) {
        if (form) form.reportValidity();
        return;
    }

    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const subject = String(data.get('subject') || 'Portfolio inquiry').trim();
    const priority = String(data.get('priority') || 'General').trim();
    const message = String(data.get('message') || '').trim();

    const body = [
        `Hi John Christian,`,
        '',
        message,
        '',
        `Priority: ${priority}`,
        `From: ${name}`,
        `Reply to: ${email}`
    ].join('\n');

    window.location.href = `mailto:johnchristian.lor@email.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function handleNewsletterSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form || !form.checkValidity()) {
        if (form) form.reportValidity();
        return;
    }

    const input = form.querySelector('input[type="email"]');
    const note = document.getElementById('newsletter-note');
    const email = input ? input.value.trim() : '';
    if (!email) return;

    if (note) {
        note.textContent = 'Opening your email app to confirm the subscription request…';
        note.classList.add('success');
    }

    window.location.href = `mailto:johnchristian.lor@email.com?subject=${encodeURIComponent('Newsletter subscription')}&body=${encodeURIComponent(`Please add ${email} to the portfolio newsletter.`)}`;
}

function handlePlaceholderSocial(event, platform) {
    event.preventDefault();
    window.alert(`Add your ${platform} profile URL in the Contact section of index.html.`);
    return false;
}

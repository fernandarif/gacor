const nameInput = document.getElementById("nameInput");
const enterBtn = document.getElementById("enterBtn");
const backBtn = document.getElementById("backBtn");
const welcomePage = document.getElementById("welcomePage");
const contentPage = document.getElementById("contentPage");
const userName = document.getElementById("userName");
const menuButtons = document.querySelectorAll(".menu-card");
const sections = document.querySelectorAll(".section");
// Social credentials (converted/normalized)
const WHATSAPP_NUMBER = "628217748537"; // converted from 08217748537
const INSTAGRAM_USERNAME = "fernandarif_";
const whatsappBtn = document.getElementById("whatsappBtn");
const instagramBtn = document.getElementById("instagramBtn");

function showPage(target) {
  welcomePage.classList.toggle("active", target === "welcome");
  contentPage.classList.toggle("active", target === "content");
  contentPage.setAttribute("aria-hidden", target !== "content");
}

function activateSection(id) {
  sections.forEach((section) => {
    section.classList.toggle("active", section.id === id);
  });
}

enterBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.focus();
    nameInput.setCustomValidity("Tolong masukkan namamu dulu.");
    nameInput.reportValidity();
    return;
  }
  userName.textContent = name;
  showPage("content");
});

backBtn.addEventListener("click", () => {
  showPage("welcome");
});

nameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    enterBtn.click();
  }
});

// Social buttons behavior
if (whatsappBtn) {
  whatsappBtn.addEventListener("click", () => {
    const name = userName.textContent || "sayang";
    const message = encodeURIComponent(
      `Halo aku${name}, aku kirim pesan ini dari halaman spesial kita ❤️,`,
    );
    const url = WHATSAPP_NUMBER
      ? `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
      : `https://wa.me/?text=${message}`;
    window.open(url, "_blank");
  });
}

if (instagramBtn) {
  instagramBtn.addEventListener("click", () => {
    const url = INSTAGRAM_USERNAME
      ? `https://instagram.com/${INSTAGRAM_USERNAME}`
      : "https://instagram.com/";
    window.open(url, "_blank");
  });
}

const galleryItems = document.querySelectorAll(".gallery__item");
const photoModal = document.getElementById("photoModal");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalDownload = document.getElementById("modalDownload");

function openPhotoModal(item) {
  const bgImage = item.style.backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
  const imageUrl = bgImage ? bgImage[1] : "";
  const title = item.dataset.title || "Foto Romantis";
  const description = item.dataset.description || "Momen spesial bersama kamu";

  modalImage.style.backgroundImage = `url('${imageUrl}')`;
  modalTitle.textContent = title;
  modalDescription.textContent = description;
  if (modalDownload) {
    // set href and a reasonable filename
    modalDownload.href = imageUrl;
    try {
      let filename = title.replace(/[^a-z0-9]+/gi, "_").toLowerCase();
      if (imageUrl.startsWith("data:")) {
        filename += ".png";
      } else {
        const parts = imageUrl.split("?")[0].split(".");
        const ext = parts.length > 1 ? parts.pop() : "jpg";
        filename += "." + ext;
      }
      modalDownload.download = filename;
    } catch (e) {
      modalDownload.removeAttribute("download");
    }
  }
  photoModal.classList.add("active");
}

function closePhotoModal() {
  photoModal.classList.remove("active");
}

function updateGalleryItems() {
  const items = document.querySelectorAll(".gallery__item");
  items.forEach((item) => {
    if (item.dataset.listener) return;
    item.addEventListener("click", () => openPhotoModal(item));
    item.dataset.listener = "1";
  });
}

// initial bind
updateGalleryItems();

modalClose.addEventListener("click", closePhotoModal);
modalOverlay.addEventListener("click", closePhotoModal);

function hideInlineSection(section) {
  // remove inline class and restore to original position
  section.classList.remove("inline");
  if (section._placeholder && section._originalParent) {
    section._originalParent.insertBefore(section, section._placeholder);
    section._placeholder.remove();
    section._placeholder = null;
    section._originalParent = null;
    section._originalNext = null;
  }
  // remove inline-hide button if exists
  const hideBtn = section.querySelector(".inline-hide");
  if (hideBtn) hideBtn.remove();
}

modalClose.addEventListener("click", closePhotoModal);
modalOverlay.addEventListener("click", closePhotoModal);

menuButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const sectionId = button.dataset.target;
    // toggle inline display under the clicked button
    const section = document.getElementById(sectionId);
    if (!section) return;

    if (section.classList.contains("inline")) {
      hideInlineSection(section);
      button.classList.remove("active");
      return;
    }

    // hide other inline sections
    document
      .querySelectorAll(".section.inline")
      .forEach((s) => hideInlineSection(s));

    // insert placeholder at original position to restore later
    section._originalParent = section.parentNode;
    section._originalNext = section.nextSibling;
    const placeholder = document.createComment("placeholder-" + sectionId);
    section._placeholder = placeholder;
    section._originalParent.insertBefore(placeholder, section);

    // insert section after the clicked button
    button.parentNode.insertBefore(section, button.nextSibling);
    section.classList.add("inline");
    button.classList.add("active");

    // add hide control if not present
    let hideBtn = section.querySelector(".inline-hide");
    if (!hideBtn) {
      hideBtn = document.createElement("button");
      hideBtn.type = "button";
      hideBtn.className = "inline-hide btn btn--ghost";
      hideBtn.setAttribute("aria-label", "Sembunyikan");
      hideBtn.title = "Sembunyikan";
      hideBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
      hideBtn.addEventListener("click", () => {
        hideInlineSection(section);
        button.classList.remove("active");
      });
      section.insertBefore(hideBtn, section.firstChild);
    }

    // rebind gallery listeners for moved photo section
    if (sectionId === "photoSection") {
      updateGalleryItems();
    }
  });
});

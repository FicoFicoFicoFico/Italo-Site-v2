
const slides = [...document.querySelectorAll(".viewer-slide")];
const previousButton = document.getElementById("previous-image");
const nextButton = document.getElementById("next-image");
const counter = document.getElementById("viewer-counter");
const imageArea = document.querySelector(".viewer-image-area");
const description = document.querySelector(".project-description");

let currentIndex = 0;

function removeDuplicateImages() {
    if (!description) return;

    description.querySelectorAll("img").forEach(image => {
        let parent = image.parentElement;
        image.remove();

        while (
            parent &&
            parent !== description &&
            parent.textContent.trim() === "" &&
            !parent.querySelector("img, video, iframe, svg")
            ) {
            const nextParent = parent.parentElement;
            parent.remove();
            parent = nextParent;
        }
    });
}

function showImage(index) {
    if (!slides.length) {
        previousButton.disabled = true;
        nextButton.disabled = true;
        counter.textContent = "0 / 0";
        return;
    }

    currentIndex = Math.max(
        0,
        Math.min(index, slides.length - 1)
    );

    slides.forEach((slide, i) => {
        slide.hidden = i !== currentIndex;
    });

    counter.textContent = `${currentIndex + 1} / ${slides.length}`;

    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === slides.length - 1;
}

previousButton.addEventListener("click", () => {
    showImage(currentIndex - 1);
});

nextButton.addEventListener("click", () => {
    showImage(currentIndex + 1);
});

document.addEventListener("keydown", event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    if (event.key === "ArrowLeft") {
        showImage(currentIndex - 1);
    }

    if (event.key === "ArrowRight") {
        showImage(currentIndex + 1);
    }
});

let touchStartX = 0;
let touchStartY = 0;

imageArea.addEventListener("touchstart", event => {
    if (event.touches.length !== 1) return;

    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}, { passive: true });

imageArea.addEventListener("touchend", event => {
    if (event.changedTouches.length !== 1) return;

    const deltaX =
        event.changedTouches[0].clientX - touchStartX;

    const deltaY =
        event.changedTouches[0].clientY - touchStartY;

    if (
        Math.abs(deltaX) < 45 ||
        Math.abs(deltaX) < Math.abs(deltaY)
    ) {
        return;
    }

    if (deltaX < 0) {
        showImage(currentIndex + 1);
    } else {
        showImage(currentIndex - 1);
    }
}, { passive: true });

removeDuplicateImages();
showImage(0);

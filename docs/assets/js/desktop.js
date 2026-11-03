
const desktop = document.querySelector(".desktop");
const desktopIcons = document.querySelector(".desktop-icons");
const taskbarApps = document.getElementById("taskbar-apps");
const clock = document.getElementById("clock");
const startButton = document.getElementById("start-button");

const windows = [...document.querySelectorAll(".app-window")];
const savedPositions = new Map();
const mobileWindowHistory = [];

let highestZ = 10;
let artworkWindowNumber = 0;

const viewerStyles = document.createElement("link");
viewerStyles.rel = "stylesheet";
viewerStyles.href = "/assets/css/artwork-window.css";
document.head.appendChild(viewerStyles);

const extraStyles = document.createElement("style");
extraStyles.textContent = `
    @media (min-width: 701px) {
        .desktop .desktop-icons {
            position: absolute;
            inset: 0 0 32px 0;
            width: auto;
            height: auto;
            display: block;
            pointer-events: none;
        }

        .desktop .desktop-icon {
            position: absolute;
            top: 0;
            left: 0;
            margin: 0;
            pointer-events: auto;
            touch-action: none;
        }

        .desktop .desktop-icon.is-dragging {
            z-index: 5;
            cursor: grabbing;
            background: rgba(0, 0, 128, 0.3);
            outline: 1px dotted white;
        }
    }

    @media (max-width: 700px) {
        .desktop > .app-window .title-bar-controls
        button[data-action="maximize"] {
            display: none !important;
        }

        .desktop > .app-window {
            overflow: hidden;
        }

        .desktop > .app-window .artwork-frame {
            min-height: 0;
            flex: 1;
        }
    }

    .easter-window .easter-body {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-height: 0;
        padding: 7px;
        margin: 0 4px 4px;
        background: #c0c0c0;
    }

    .easter-video-panel {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        min-height: 0;
        overflow: hidden;
        background: #000;
        border: 2px solid;
        border-color: #808080 #fff #fff #808080;
        box-shadow: inset 1px 1px #404040;
    }

    .easter-video {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
        background: #000;
    }

    .media-controls {
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        gap: 8px;
        padding: 9px;
        background: #c0c0c0;
        border: 2px solid;
        border-color: #fff #808080 #808080 #fff;
    }

    .media-progress-row {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
    }

    .media-progress,
    .media-volume {
        -webkit-appearance: none;
        appearance: none;
        height: 19px;
        min-width: 0;
        padding: 0;
        margin: 0;
        background: transparent;
        border: none;
        box-shadow: none;
        cursor: pointer;
        outline-offset: 3px;
    }

    .media-progress {
        flex: 1;
        width: 100%;
    }

    .media-progress::-webkit-slider-runnable-track,
    .media-volume::-webkit-slider-runnable-track {
        height: 6px;
        background: #fff;
        border: 2px solid;
        border-color: #808080 #fff #fff #808080;
        box-sizing: border-box;
    }

    .media-progress::-moz-range-track,
    .media-volume::-moz-range-track {
        height: 6px;
        background: #fff;
        border: 2px solid;
        border-color: #808080 #fff #fff #808080;
        box-sizing: border-box;
    }

    .media-progress::-webkit-slider-thumb,
    .media-volume::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 12px;
        height: 18px;
        margin-top: -8px;
        background: #c0c0c0;
        border: 2px solid;
        border-color: #fff #404040 #404040 #fff;
        border-radius: 0;
        box-shadow: inset 1px 1px #dfdfdf;
    }

    .media-progress::-moz-range-thumb,
    .media-volume::-moz-range-thumb {
        width: 12px;
        height: 18px;
        background: #c0c0c0;
        border: 2px solid;
        border-color: #fff #404040 #404040 #fff;
        border-radius: 0;
    }

    .media-time {
        display: block;
        flex-shrink: 0;
        min-width: 97px;
        padding: 5px;
        background: #fff;
        border: 2px solid;
        border-color: #808080 #fff #fff #808080;
        color: #000;
        font-family: "Courier New", monospace;
        font-size: 11px;
        text-align: center;
        font-variant-numeric: tabular-nums;
    }

    .media-button-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }

    .media-playback-buttons,
    .media-volume-controls {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
    }

    .media-control-button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 36px;
        height: 29px;
        min-width: 36px;
        min-height: 29px;
        margin: 0;
        padding: 0;
        background: #c0c0c0;
        border: 2px solid;
        border-color: #fff #404040 #404040 #fff;
        border-radius: 0;
        box-shadow: inset 1px 1px #dfdfdf;
        color: #000;
        font-family: Arial, sans-serif;
        font-size: 13px;
        cursor: pointer;
    }

    .media-control-button:active {
        border-color: #404040 #fff #fff #404040;
        box-shadow: inset 1px 1px #808080;
    }

    .media-control-button:focus-visible,
    .media-progress:focus-visible,
    .media-volume:focus-visible {
        outline: 1px dotted #000;
        outline-offset: 2px;
    }

    .media-volume {
        width: 85px;
    }

    .easter-status {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        min-height: 24px;
        padding: 4px 7px;
        background: #c0c0c0;
        border: 2px solid;
        border-color: #808080 #fff #fff #808080;
        font-family: inherit;
        font-size: 11px;
    }

    .easter-status span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    @media (max-width: 700px) {
        .easter-window .easter-body {
            padding: 5px;
        }

        .media-controls {
            padding: 10px 7px;
            gap: 12px;
        }

        .media-control-button {
            width: 42px;
            height: 36px;
            min-width: 42px;
            min-height: 36px;
        }

        .media-volume {
            width: 75px;
        }

        .media-time {
            min-width: 90px;
            padding: 5px 3px;
        }
    }

    @media (max-width: 360px) {
        .media-control-button {
            width: 36px;
            min-width: 36px;
        }

        .media-volume {
            width: 52px;
        }
    }
`;
document.head.appendChild(extraStyles);

function isMobile() {
    return window.matchMedia("(max-width: 700px)").matches;
}

function bringToFront(win) {
    win.style.zIndex = ++highestZ;
}

function getVisibleWindow() {
    return windows
        .filter(win => !win.hidden)
        .sort((a, b) =>
            Number(b.style.zIndex) - Number(a.style.zIndex)
        )[0] || null;
}

function removeFromMobileHistory(win) {
    for (let i = mobileWindowHistory.length - 1; i >= 0; i--) {
        if (mobileWindowHistory[i] === win) {
            mobileWindowHistory.splice(i, 1);
        }
    }
}

function rememberMobileWindow(win) {
    if (!win || win.hidden) return;

    removeFromMobileHistory(win);
    mobileWindowHistory.push(win);
}

function pauseWindowMedia(win) {
    win.querySelectorAll("video, audio").forEach(media => {
        media.pause();
    });
}

function restorePreviousMobileWindow() {
    if (!isMobile()) return;

    while (mobileWindowHistory.length > 0) {
        const previous = mobileWindowHistory.pop();

        if (
            !windows.includes(previous) ||
            previous.dataset.open !== "true"
        ) {
            continue;
        }

        windows.forEach(win => {
            win.hidden = win !== previous;

            if (win !== previous) {
                pauseWindowMedia(win);
            }
        });

        previous.hidden = false;
        bringToFront(previous);
        return;
    }
}

function updateTaskbar() {
    taskbarApps.replaceChildren();

    for (const win of windows) {
        if (win.dataset.open !== "true") continue;

        const button = document.createElement("button");
        button.className = "taskbar-app";
        button.type = "button";

        button.textContent = win
            .querySelector(".title-bar-text")
            .textContent.trim();

        button.addEventListener("click", () => {
            closeStartMenu();

            if (win.hidden) {
                showWindow(win);
            } else if (Number(win.style.zIndex) === highestZ) {
                minimizeWindow(win);
            } else {
                showWindow(win);
            }
        });

        taskbarApps.appendChild(button);
    }
}

function showWindow(win) {
    if (isMobile()) {
        const current = getVisibleWindow();

        if (current && current !== win) {
            rememberMobileWindow(current);
        }

        removeFromMobileHistory(win);

        for (const other of windows) {
            if (other !== win) {
                other.hidden = true;
                pauseWindowMedia(other);
            }
        }
    }

    win.hidden = false;
    win.dataset.open = "true";

    bringToFront(win);
    updateTaskbar();
}

function openWindow(id) {
    const win = document.getElementById(id);

    if (!win || !win.classList.contains("app-window")) return;

    closeStartMenu();
    showWindow(win);
}

function closeWindow(win) {
    const wasVisible = !win.hidden;

    pauseWindowMedia(win);

    if (win.id === "easter-egg-player") {
        const video = win.querySelector("video");

        if (video) {
            video.currentTime = 0;
        }
    }

    win.hidden = true;
    delete win.dataset.open;

    removeFromMobileHistory(win);

    if (win.classList.contains("artwork-window")) {
        const iframe = win.querySelector("iframe");

        if (iframe) {
            iframe.src = "about:blank";
        }

        win.remove();

        const index = windows.indexOf(win);

        if (index !== -1) {
            windows.splice(index, 1);
        }

        savedPositions.delete(win);
    }

    if (isMobile() && wasVisible) {
        restorePreviousMobileWindow();
    }

    updateTaskbar();
}

function minimizeWindow(win) {
    const wasVisible = !win.hidden;

    pauseWindowMedia(win);

    win.hidden = true;
    removeFromMobileHistory(win);

    if (isMobile() && wasVisible) {
        restorePreviousMobileWindow();
    }

    updateTaskbar();
}

function maximizeWindow(win) {
    if (isMobile()) return;

    if (win.classList.contains("maximized")) {
        win.classList.remove("maximized");

        const saved = savedPositions.get(win);

        if (saved) {
            win.style.left = saved.left;
            win.style.top = saved.top;
            win.style.width = saved.width;
            win.style.height = saved.height;
        }
    } else {
        savedPositions.set(win, {
            left: win.style.left,
            top: win.style.top,
            width: win.style.width,
            height: win.style.height
        });

        win.classList.add("maximized");
    }

    bringToFront(win);
}

function prepareWindow(win) {
    const titleBar = win.querySelector(".title-bar");

    win.addEventListener("pointerdown", () => {
        bringToFront(win);
    });

    win.querySelectorAll("[data-action]").forEach(button => {
        button.addEventListener("click", () => {
            const action = button.dataset.action;

            if (action === "close") closeWindow(win);
            if (action === "minimize") minimizeWindow(win);
            if (action === "maximize") maximizeWindow(win);
        });
    });

    titleBar.addEventListener("pointerdown", event => {
        if (isMobile()) return;
        if (win.classList.contains("maximized")) return;
        if (event.target.closest("button")) return;
        if (event.button !== 0) return;

        bringToFront(win);

        const desktopRect = desktop.getBoundingClientRect();
        const winRect = win.getBoundingClientRect();

        const startX = event.clientX;
        const startY = event.clientY;

        const initialLeft = winRect.left - desktopRect.left;
        const initialTop = winRect.top - desktopRect.top;

        titleBar.setPointerCapture(event.pointerId);

        function move(e) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            const maxLeft = Math.max(
                0,
                desktop.clientWidth - win.offsetWidth
            );

            const maxTop = Math.max(
                0,
                desktop.clientHeight - 80
            );

            win.style.left =
                Math.max(
                    0,
                    Math.min(maxLeft, initialLeft + dx)
                ) + "px";

            win.style.top =
                Math.max(
                    0,
                    Math.min(maxTop, initialTop + dy)
                ) + "px";
        }

        function stop() {
            titleBar.removeEventListener("pointermove", move);
            titleBar.removeEventListener("pointerup", stop);
            titleBar.removeEventListener("pointercancel", stop);
        }

        titleBar.addEventListener("pointermove", move);
        titleBar.addEventListener("pointerup", stop);
        titleBar.addEventListener("pointercancel", stop);
    });
}

windows.forEach(prepareWindow);

document.querySelectorAll("[data-open]").forEach(icon => {
    icon.addEventListener("click", () => {
        openWindow(icon.dataset.open);
    });
});

function formatVideoTime(seconds) {
    if (!Number.isFinite(seconds)) return "00:00";

    const total = Math.floor(Math.max(0, seconds));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const secondsLeft = total % 60;

    if (hours > 0) {
        return [
            hours,
            String(minutes).padStart(2, "0"),
            String(secondsLeft).padStart(2, "0")
        ].join(":");
    }

    return [
        String(minutes).padStart(2, "0"),
        String(secondsLeft).padStart(2, "0")
    ].join(":");
}

function createVideoEasterEgg() {
    const icon = document.createElement("button");

    icon.className = "desktop-icon";
    icon.type = "button";
    icon.setAttribute("aria-label", "Open secret video");

    icon.innerHTML = `
        <span class="desktop-icon-symbol" aria-hidden="true">
            <img
                src="/assets/images/video_icon.png"
                alt=""
                width="100"
                height="100"
                draggable="false"
            >
        </span>
        <span class="desktop-icon-label">video.mp4</span>
    `;

    desktopIcons.appendChild(icon);

    const win = document.createElement("section");

    win.className = "window app-window easter-window";
    win.id = "easter-egg-player";
    win.setAttribute("role", "dialog");
    win.setAttribute("aria-label", "Secret video player");
    win.setAttribute("tabindex", "-1");
    win.hidden = true;

    const titleBar = document.createElement("div");
    titleBar.className = "title-bar";

    const titleText = document.createElement("div");
    titleText.className = "title-bar-text";
    titleText.textContent = "secret.mp4 - Media Player";

    const titleControls = document.createElement("div");
    titleControls.className = "title-bar-controls";

    for (const action of ["minimize", "maximize", "close"]) {
        const button = document.createElement("button");

        button.type = "button";
        button.dataset.action = action;
        button.setAttribute(
            "aria-label",
            action.charAt(0).toUpperCase() + action.slice(1)
        );

        titleControls.appendChild(button);
    }

    titleBar.append(titleText, titleControls);

    const body = document.createElement("div");
    body.className = "window-body easter-body";

    const videoPanel = document.createElement("div");
    videoPanel.className = "easter-video-panel";

    const video = document.createElement("video");

    video.className = "easter-video";
    video.src = "/assets/videos/easter-egg.mp4";
    video.playsInline = true;
    video.preload = "metadata";
    video.controls = false;

    videoPanel.appendChild(video);

    const mediaControls = document.createElement("div");
    mediaControls.className = "media-controls";

    mediaControls.innerHTML = `
        <div class="media-progress-row">
            <input
                class="media-progress"
                type="range"
                min="0"
                max="1000"
                value="0"
                step="1"
                aria-label="Video position"
            >
            <output class="media-time">00:00 / 00:00</output>
        </div>

        <div class="media-button-row">
            <div class="media-playback-buttons">
                <button
                    class="media-control-button media-play"
                    type="button"
                    aria-label="Play"
                    title="Play / Pause"
                >▶</button>

                <button
                    class="media-control-button media-stop"
                    type="button"
                    aria-label="Stop"
                    title="Stop"
                >■</button>
            </div>

            <div class="media-volume-controls">
                <button
                    class="media-control-button media-mute"
                    type="button"
                    aria-label="Mute"
                    aria-pressed="false"
                    title="Mute / Unmute"
                >♪</button>

                <input
                    class="media-volume"
                    type="range"
                    min="0"
                    max="100"
                    value="100"
                    aria-label="Volume"
                >
            </div>
        </div>
    `;

    const progress = mediaControls.querySelector(".media-progress");
    const timeDisplay = mediaControls.querySelector(".media-time");
    const playButton = mediaControls.querySelector(".media-play");
    const stopButton = mediaControls.querySelector(".media-stop");
    const muteButton = mediaControls.querySelector(".media-mute");
    const volumeSlider = mediaControls.querySelector(".media-volume");

    const status = document.createElement("div");
    status.className = "easter-status";

    const fileLabel = document.createElement("span");
    fileLabel.textContent = "secret.mp4";

    const statusLabel = document.createElement("span");
    statusLabel.textContent = "Ready";

    status.append(fileLabel, statusLabel);
    body.append(videoPanel, mediaControls, status);

    win.append(titleBar, body);
    desktop.appendChild(win);

    windows.push(win);
    prepareWindow(win);

    win.style.width = "560px";
    win.style.height = "390px";
    win.style.left = "340px";
    win.style.top = "120px";

    function updateProgress() {
        const duration = video.duration;

        if (Number.isFinite(duration) && duration > 0) {
            progress.value = String(
                Math.round((video.currentTime / duration) * 1000)
            );

            timeDisplay.textContent =
                `${formatVideoTime(video.currentTime)} / ` +
                `${formatVideoTime(duration)}`;
        } else {
            progress.value = "0";
            timeDisplay.textContent =
                `${formatVideoTime(video.currentTime)} / 00:00`;
        }
    }

    function updatePlayButton() {
        const paused = video.paused || video.ended;

        playButton.textContent = paused ? "▶" : "❚❚";
        playButton.setAttribute(
            "aria-label",
            paused ? "Play" : "Pause"
        );
    }

    function updateMuteButton() {
        const muted = video.muted || video.volume === 0;

        muteButton.textContent = muted ? "×" : "♪";
        muteButton.setAttribute(
            "aria-label",
            muted ? "Unmute" : "Mute"
        );
        muteButton.setAttribute("aria-pressed", String(muted));
    }

    async function togglePlayback() {
        if (video.paused || video.ended) {
            try {
                await video.play();
            } catch {
                statusLabel.textContent = "Press Play";
            }
        } else {
            video.pause();
        }
    }

    playButton.addEventListener("click", togglePlayback);

    stopButton.addEventListener("click", () => {
        video.pause();
        video.currentTime = 0;
        statusLabel.textContent = "Stopped";
        updateProgress();
    });

    progress.addEventListener("input", () => {
        if (!Number.isFinite(video.duration) || video.duration <= 0) {
            return;
        }

        video.currentTime =
            (Number(progress.value) / 1000) * video.duration;

        updateProgress();
    });

    volumeSlider.addEventListener("input", () => {
        video.volume = Number(volumeSlider.value) / 100;

        if (video.volume > 0) {
            video.muted = false;
        }

        updateMuteButton();
    });

    muteButton.addEventListener("click", () => {
        if (video.volume === 0) {
            video.volume = 0.5;
            volumeSlider.value = "50";
            video.muted = false;
        } else {
            video.muted = !video.muted;
        }

        updateMuteButton();
    });

    video.addEventListener("loadedmetadata", updateProgress);
    video.addEventListener("durationchange", updateProgress);
    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("volumechange", updateMuteButton);

    video.addEventListener("play", () => {
        statusLabel.textContent = "Playing";
        updatePlayButton();
    });

    video.addEventListener("pause", () => {
        if (!video.ended && statusLabel.textContent !== "Stopped") {
            statusLabel.textContent = "Paused";
        }

        updatePlayButton();
    });

    video.addEventListener("ended", () => {
        statusLabel.textContent = "Finished";
        updatePlayButton();
        updateProgress();
    });

    video.addEventListener("waiting", () => {
        statusLabel.textContent = "Buffering...";
    });

    video.addEventListener("error", () => {
        statusLabel.textContent = "Unable to open file";
    });

    win.addEventListener("keydown", event => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;

        if (
            event.target instanceof HTMLInputElement ||
            event.target instanceof HTMLButtonElement
        ) {
            return;
        }

        if (event.code === "Space") {
            event.preventDefault();
            togglePlayback();
        }

        if (event.key === "ArrowLeft") {
            event.preventDefault();
            video.currentTime = Math.max(0, video.currentTime - 5);
        }

        if (event.key === "ArrowRight") {
            event.preventDefault();

            if (Number.isFinite(video.duration)) {
                video.currentTime = Math.min(
                    video.duration,
                    video.currentTime + 5
                );
            }
        }
    });

    videoPanel.addEventListener("click", togglePlayback);

    icon.addEventListener("click", () => {
        const wasClosed = win.dataset.open !== "true";

        if (wasClosed) {
            video.currentTime = 0;
            statusLabel.textContent = "Ready";
        }

        openWindow(win.id);
        win.focus({ preventScroll: true });

        if (wasClosed) {
            video.play().catch(() => {
                statusLabel.textContent = "Press Play";
            });
        }
    });
}

createVideoEasterEgg();

const ICON_GRID = {
    left: 16,
    top: 22,
    columnWidth: 150,
    rowHeight: 150,
    iconWidth: 130,
    iconHeight: 130
};


const draggableIcons = [
    ...desktopIcons.querySelectorAll(".desktop-icon")
];

const iconPositions = new Map();

function getIconId(icon) {
    if (icon.dataset.open) {
        return icon.dataset.open;
    }

    return "secret-video";
}

function getGridDimensions() {
    const width = desktop.clientWidth;
    const height = desktop.clientHeight - 32;

    const columns = Math.max(
        1,
        Math.floor(
            (width - ICON_GRID.left - ICON_GRID.iconWidth) /
            ICON_GRID.columnWidth
        ) + 1
    );

    const rows = Math.max(
        1,
        Math.floor(
            (height - ICON_GRID.top - ICON_GRID.iconHeight) /
            ICON_GRID.rowHeight
        ) + 1
    );

    return { columns, rows };
}

function getGridPixelPosition(column, row) {
    return {
        x: ICON_GRID.left + column * ICON_GRID.columnWidth,
        y: ICON_GRID.top + row * ICON_GRID.rowHeight
    };
}

function findNearestFreeCell(column, row, occupied) {
    const { columns, rows } = getGridDimensions();

    const preferredColumn = Math.max(
        0,
        Math.min(columns - 1, column)
    );

    const preferredRow = Math.max(
        0,
        Math.min(rows - 1, row)
    );

    let nearest = null;
    let bestDistance = Infinity;

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows; r++) {
            const key = `${c},${r}`;

            if (occupied.has(key)) continue;

            const dx = c - preferredColumn;
            const dy = r - preferredRow;
            const distance = dx * dx + dy * dy;

            if (distance < bestDistance) {
                nearest = { column: c, row: r };
                bestDistance = distance;
            }
        }
    }

    return nearest || {
        column: preferredColumn,
        row: preferredRow
    };
}

function positionIcon(icon, column, row) {
    const pixelPosition = getGridPixelPosition(column, row);

    icon.style.left = `${pixelPosition.x}px`;
    icon.style.top = `${pixelPosition.y}px`;

    iconPositions.set(icon, { column, row });
}

function arrangeDesktopIcons() {
    if (isMobile()) {
        draggableIcons.forEach(icon => {
            icon.style.left = "";
            icon.style.top = "";
            icon.classList.remove("is-dragging");
        });

        return;
    }

    const occupied = new Set();

    draggableIcons.forEach((icon, index) => {
        const saved = iconPositions.get(icon);

        const preferredColumn = saved?.column ?? 0;
        const preferredRow = saved?.row ?? index;

        const cell = findNearestFreeCell(
            preferredColumn,
            preferredRow,
            occupied
        );

        occupied.add(`${cell.column},${cell.row}`);

        positionIcon(icon, cell.column, cell.row);
    });
}

draggableIcons.forEach((icon, index) => {
    iconPositions.set(icon, {
        column: 0,
        row: index
    });

    let drag = null;
    let suppressClick = false;

    icon.addEventListener("click", event => {
        if (!suppressClick) return;

        event.preventDefault();
        event.stopImmediatePropagation();

        suppressClick = false;
    }, true);

    icon.addEventListener("pointerdown", event => {
        if (isMobile()) return;
        if (event.button !== 0) return;

        const current = iconPositions.get(icon);
        const pixel = getGridPixelPosition(
            current.column,
            current.row
        );

        drag = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            iconX: pixel.x,
            iconY: pixel.y,
            moved: false
        };

        suppressClick = false;

        icon.setPointerCapture(event.pointerId);
    });

    icon.addEventListener("pointermove", event => {
        if (!drag || event.pointerId !== drag.pointerId) return;

        const dx = event.clientX - drag.startX;
        const dy = event.clientY - drag.startY;

        if (!drag.moved && Math.hypot(dx, dy) <= 6) {
            return;
        }

        drag.moved = true;
        icon.classList.add("is-dragging");

        const maxX = Math.max(
            0,
            desktop.clientWidth - ICON_GRID.iconWidth
        );

        const maxY = Math.max(
            0,
            desktop.clientHeight - 32 - ICON_GRID.iconHeight
        );

        const x = Math.max(
            0,
            Math.min(maxX, drag.iconX + dx)
        );

        const y = Math.max(
            0,
            Math.min(maxY, drag.iconY + dy)
        );

        icon.style.left = `${x}px`;
        icon.style.top = `${y}px`;
    });

    function finishIconDrag(event) {
        if (!drag || event.pointerId !== drag.pointerId) {
            return;
        }

        const didMove = drag.moved;
        const cancelled = event.type === "pointercancel";

        drag = null;
        icon.classList.remove("is-dragging");

        if (icon.hasPointerCapture(event.pointerId)) {
            icon.releasePointerCapture(event.pointerId);
        }

        if (!didMove || cancelled) {
            const current = iconPositions.get(icon);
            positionIcon(icon, current.column, current.row);
            return;
        }

        suppressClick = true;

        const x = parseFloat(icon.style.left);
        const y = parseFloat(icon.style.top);

        const desiredColumn = Math.round(
            (x - ICON_GRID.left) / ICON_GRID.columnWidth
        );

        const desiredRow = Math.round(
            (y - ICON_GRID.top) / ICON_GRID.rowHeight
        );

        const occupied = new Set();

        draggableIcons.forEach(other => {
            if (other === icon) return;

            const position = iconPositions.get(other);

            if (position) {
                occupied.add(
                    `${position.column},${position.row}`
                );
            }
        });

        const freeCell = findNearestFreeCell(
            desiredColumn,
            desiredRow,
            occupied
        );

        positionIcon(
            icon,
            freeCell.column,
            freeCell.row
        );

    }

    icon.addEventListener("pointerup", finishIconDrag);
    icon.addEventListener("pointercancel", finishIconDrag);
});

arrangeDesktopIcons();

function openArtworkViewer(url, title) {
    const existing = windows.find(
        win =>
            win.classList.contains("artwork-window") &&
            win.dataset.projectUrl === url
    );

    if (existing) {
        closeStartMenu();
        showWindow(existing);
        return;
    }

    artworkWindowNumber++;

    const win = document.createElement("section");

    win.className = "window app-window artwork-window";
    win.id = `artwork-viewer-${artworkWindowNumber}`;
    win.setAttribute("role", "dialog");
    win.setAttribute("aria-label", `${title} — Image Viewer`);
    win.dataset.projectUrl = url;

    const titleBar = document.createElement("div");
    titleBar.className = "title-bar";

    const titleText = document.createElement("div");
    titleText.className = "title-bar-text";
    titleText.textContent = `${title} — Image Viewer`;

    const controls = document.createElement("div");
    controls.className = "title-bar-controls";

    for (const action of ["minimize", "maximize", "close"]) {
        const button = document.createElement("button");

        button.type = "button";
        button.dataset.action = action;
        button.setAttribute(
            "aria-label",
            action.charAt(0).toUpperCase() + action.slice(1)
        );

        controls.appendChild(button);
    }

    titleBar.append(titleText, controls);

    const frame = document.createElement("iframe");

    frame.className = "artwork-frame";
    frame.title = `${title} artwork and description`;
    frame.src = url;
    frame.setAttribute("loading", "eager");

    win.append(titleBar, frame);
    desktop.appendChild(win);

    windows.push(win);
    prepareWindow(win);

    if (!isMobile()) {
        const offset = (artworkWindowNumber - 1) % 4;
        const desktopWidth = desktop.clientWidth;
        const desktopHeight = desktop.clientHeight;

        const viewerWidth = Math.min(
            760,
            desktopWidth - 24
        );

        const viewerHeight = Math.min(
            660,
            desktopHeight - 56
        );

        const preferredLeft =
            Math.max(
                260,
                Math.round(desktopWidth * 0.27)
            ) + offset * 22;

        const preferredTop = 90 + offset * 22;

        const left = Math.max(
            0,
            Math.min(
                preferredLeft,
                desktopWidth - viewerWidth - 8
            )
        );

        const top = Math.max(
            0,
            Math.min(
                preferredTop,
                desktopHeight - viewerHeight - 40
            )
        );

        win.style.width = `${viewerWidth}px`;
        win.style.height = `${viewerHeight}px`;
        win.style.left = `${left}px`;
        win.style.top = `${top}px`;
    }

    closeStartMenu();
    showWindow(win);
}

document.querySelectorAll("#artworks .file-grid .file").forEach(link => {
    link.addEventListener("click", event => {
        if (
            event.button !== 0 ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.altKey
        ) {
            return;
        }

        event.preventDefault();

        const url = link.getAttribute("href");
        const title = link.textContent.trim();

        openArtworkViewer(url, title);
    });
});

const startMenu = document.createElement("nav");

startMenu.className = "start-menu";
startMenu.id = "start-menu";
startMenu.setAttribute("aria-label", "Start menu");
startMenu.hidden = true;

startMenu.innerHTML = `
    <div class="start-menu-sidebar" aria-hidden="true">
        <span>Ítalo Carajá <strong>98</strong></span>
    </div>

    <div class="start-menu-items">
        <button
            class="start-menu-item"
            type="button"
            data-start-open="artworks"
        >
            <img src="/assets/images/folder_icon.png" alt="">
            <span>Artworks</span>
        </button>

        <button
            class="start-menu-item"
            type="button"
            data-start-open="about"
        >
            <img src="/assets/images/about_icon.png" alt="">
            <span>About Me.txt</span>
        </button>

        <div class="start-menu-divider"></div>

        <a
            class="start-menu-item"
            href="https://www.instagram.com/italocaraja/"
            target="_blank"
            rel="noopener noreferrer"
        >
            <span class="start-menu-symbol">@</span>
            <span>Instagram</span>
        </a>

        <a
            class="start-menu-item"
            href="mailto:italocaraja@gmail.com"
        >
            <span class="start-menu-symbol">✉</span>
            <span>Email</span>
        </a>
    </div>
`;

desktop.appendChild(startMenu);

startButton.setAttribute("aria-controls", "start-menu");
startButton.setAttribute("aria-expanded", "false");
startButton.setAttribute("aria-haspopup", "true");

function openStartMenu() {
    startMenu.hidden = false;
    startButton.setAttribute("aria-expanded", "true");
}

function closeStartMenu() {
    startMenu.hidden = true;
    startButton.setAttribute("aria-expanded", "false");
}

startButton.addEventListener("click", () => {
    if (startMenu.hidden) {
        openStartMenu();
    } else {
        closeStartMenu();
    }
});

startMenu.querySelectorAll("[data-start-open]").forEach(item => {
    item.addEventListener("click", () => {
        openWindow(item.dataset.startOpen);
    });
});

startMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeStartMenu);
});

document.addEventListener("pointerdown", event => {
    if (startMenu.hidden) return;
    if (startMenu.contains(event.target)) return;
    if (startButton.contains(event.target)) return;

    closeStartMenu();
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !startMenu.hidden) {
        closeStartMenu();
        startButton.focus();
    }
});

const projectCount = document.querySelectorAll(
    "#artworks .file-grid .file"
).length;

const artworkCountLabel = document.getElementById("artwork-count");

if (artworkCountLabel) {
    artworkCountLabel.textContent = `${projectCount} object(s)`;
}

function updateClock() {
    clock.textContent = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

updateClock();
setInterval(updateClock, 30000);

window.addEventListener("resize", () => {
    arrangeDesktopIcons();

    if (isMobile()) {
        const visible = windows
            .filter(win => !win.hidden)
            .sort(
                (a, b) =>
                    Number(b.style.zIndex) -
                    Number(a.style.zIndex)
            );

        visible.slice(1).forEach(win => {
            win.hidden = true;
            pauseWindowMedia(win);
        });
    } else {
        mobileWindowHistory.length = 0;
    }

    closeStartMenu();
});

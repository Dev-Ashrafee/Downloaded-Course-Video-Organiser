// Get references to HTML elements
const folderInput = document.getElementById("folderInput");
const videoList = document.getElementById("videoList");
const videoPlayer = document.getElementById("videoPlayer");
const videoSource = document.getElementById("videoSource");
const videoPlayerContainer = document.querySelector(".video-player");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const videoDescription = document.getElementById("videoDescription");

const volumeControl = document.getElementById("volumeControl");
const speedControl = document.getElementById("speedControl");
const fullScreenBtn = document.getElementById("fullScreenBtn");

// Array to store selected video files
let videoFiles = [];

// Set to store names of completed videos
let completedVideos = new Set(
  JSON.parse(localStorage.getItem("completedVideos")) || []
);

// Function to render video list
function renderVideoList(files) {
  videoList.innerHTML = ""; // Clear the video list

  files.forEach((file) => {
    // Create a list item for each video
    const listItem = document.createElement("div");
    listItem.classList.add("video-item");
    listItem.dataset.filePath = URL.createObjectURL(file);

    // Create a span for video title
    const titleSpan = document.createElement("span");
    titleSpan.textContent = file.name;
    listItem.appendChild(titleSpan);

    // Check if the video is completed
    if (completedVideos.has(file.name)) {
      titleSpan.classList.add("completed"); // Add completed class
    }

    // Create a button for marking the video as completed
    const completedButton = document.createElement("button");
    completedButton.textContent = "Completed ?";
    completedButton.disabled = completedVideos.has(file.name);
    completedButton.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent click event on video item
      titleSpan.classList.add("completed");
      completedButton.disabled = true;
      completedVideos.add(file.name);
      localStorage.setItem(
        "completedVideos",
        JSON.stringify(Array.from(completedVideos))
      ); // Save to localStorage
    });
    listItem.appendChild(completedButton);

    // Add click event to play the video
    listItem.addEventListener("click", () => {
      videoSource.src = listItem.dataset.filePath;
      videoPlayer.load();
      videoPlayerContainer.style.display = "block";
      videoPlayer.scrollIntoView({ behavior: "smooth" });

      // Display video description
      videoDescription.textContent = `Playing: ${file.name}`;
    });

    // Append the list item to the video list
    videoList.appendChild(listItem);
  });
}

// Function to handle folder selection
folderInput.addEventListener("change", function (event) {
  // Filter selected files to include only videos
  videoFiles = Array.from(event.target.files).filter((file) =>
    file.type.startsWith("video/")
  );
  renderVideoList(videoFiles);
});

// Function to handle search input
searchInput.addEventListener("input", function (event) {
  const query = event.target.value.toLowerCase();
  // Filter video files based on search query
  const filteredFiles = videoFiles.filter((file) =>
    file.name.toLowerCase().includes(query)
  );
  renderVideoList(filteredFiles);
});

// Function to handle sort selection
sortSelect.addEventListener("change", function (event) {
  const sortBy = event.target.value;
  const sortedFiles = [...videoFiles];

  // Sort files by name or date
  if (sortBy === "name") {
    sortedFiles.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "date") {
    sortedFiles.sort((a, b) => a.lastModified - b.lastModified);
  }

  renderVideoList(sortedFiles);
});

// Function to handle volume control
volumeControl.addEventListener("input", (event) => {
  videoPlayer.volume = event.target.value;
});

// Function to handle playback speed control
speedControl.addEventListener("change", (event) => {
  videoPlayer.playbackRate = event.target.value;
});

// Function to handle full screen
fullScreenBtn.addEventListener("click", () => {
  if (videoPlayer.requestFullscreen) {
    videoPlayer.requestFullscreen();
  } else if (videoPlayer.mozRequestFullScreen) {
    // Firefox
    videoPlayer.mozRequestFullScreen();
  } else if (videoPlayer.webkitRequestFullscreen) {
    // Chrome, Safari, and Opera
    videoPlayer.webkitRequestFullscreen();
  } else if (videoPlayer.msRequestFullscreen) {
    // IE/Edge
    videoPlayer.msRequestFullscreen();
  }
});

// Keyboard shortcuts for video controls
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case " ": // Space to play/pause
      if (videoPlayer.paused) {
        videoPlayer.play();
      } else {
        videoPlayer.pause();
      }
      break;
    case "ArrowUp": // Arrow up to increase volume
      videoPlayer.volume = Math.min(videoPlayer.volume + 0.1, 1);
      volumeControl.value = videoPlayer.volume;
      break;
    case "ArrowDown": // Arrow down to decrease volume
      videoPlayer.volume = Math.max(videoPlayer.volume - 0.1, 0);
      volumeControl.value = videoPlayer.volume;
      break;
    case "ArrowRight": // Arrow right to fast forward
      videoPlayer.currentTime += 5;
      break;
    case "ArrowLeft": // Arrow left to rewind
      videoPlayer.currentTime -= 5;
      break;
  }
});

// Initial render of video list
renderVideoList(videoFiles);

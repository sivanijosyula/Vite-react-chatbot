import React, { useEffect } from 'react';

const Display = ({ value }) => {
  useEffect(() => {
    // Regular expression to find video links (YouTube, Vimeo, etc.)
    const videoRegex = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_\-]+)/g;
    let match;
    const videoLinks = [];

    // Find all video links in the response
    while ((match = videoRegex.exec(value)) !== null) {
      videoLinks.push(match[0]);
    }

    // Get the container element where videos will be displayed
    const videoContainer = document.getElementById('videoContainer');
    videoContainer.innerHTML = ''; // Clear previous content

    // Create and append video elements
    videoLinks.forEach(link => {
      const videoElement = document.createElement('iframe');
      videoElement.width = '600';
      videoElement.height = '300';
      videoElement.allowFullscreen = true;

      // Determine the video platform and set the src accordingly
      if (link.includes('youtube.com') || link.includes('youtu.be')) {
        const videoId = link.split('v=')[1] || link.split('/').pop();
        videoElement.src = `https://www.youtube.com/embed/${videoId}`;
      }
      // Append the video element to the container
      videoContainer.appendChild(videoElement);
    });
  }, [value]);

  return (
    <div id='displaybox'>
      {value}
      <div id="videoContainer"></div>
    </div>
  );
};
export default Display;
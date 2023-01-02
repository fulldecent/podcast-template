// Convert chapter markers from YouTube format (MM:SS Title, or HH:MM:SS Title) to FFmpeg ffmetadata format
// Specification: https://ffmpeg.org/ffmpeg-formats.html#Metadata-1

const fs = require('fs');

// Load YouTube chapter markers from stdin like:
// 00:00 Chapter 1
// 01:00:00 Chapter 2
const input = fs.readFileSync(0, 'utf8');
const lines = input.trim().split('\n');
const chapters = lines.map(line => {
    // Use regex to parse time code and title
    const match = line.match(/^(\d{1,2}:\d{2}(:\d{2})?) (.+)$/);
    if (!match) {
        throw new Error(`Invalid chapter marker: ${line}`);
    }
    const time = match[1];
    const title = match[3];
    var timeCodes = time.split(':').map(Number);        
    // Reduce to seconds
    while (timeCodes.length > 1) {
        const carry = timeCodes[0] * 60;
        timeCodes.shift();
        timeCodes[0] += carry;
    }
    const startSeconds = timeCodes[0];
    return { title, startSeconds };
});

// Print header
console.log(';FFMETADATA1');

// Write chapter markers
chapters.forEach((chapter, index) => {
  console.log(`\n[CHAPTER]`);
  console.log(`TIMEBASE=1/1000`);
  console.log(`START=${chapter.startSeconds * 1000}`);
  // End time adds is start time of next chapter, or for last chapter just one second
  const endSeconds = chapters[index + 1]?.startSeconds || chapter.startSeconds + 1;
  console.log(`END=${endSeconds * 1000}`);
  console.log(`title=${chapter.title}`);
});
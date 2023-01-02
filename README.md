# podcast.phor.net

This is a reusable project template for publishing your YouTube channel or other audio files as a podcast. It uses Jekyll to generate the RSS feed and HTML pages, and GitHub Pages to host the site.

---

TODO: add subscribe links


This repo builds the RSS feed for the Community Service Hour podcast.

Subscribe at:

          <p>Subscribe on <a href="https://podcasts.apple.com/us/podcast/community-service-hour/id1581000008">Apple Podcasts</a>, <a href="https://podcasts.google.com/feed/aHR0cHM6Ly9hbmNob3IuZm0vcy8xZjY4ZjY0MC9wb2RjYXN0L3Jzcw==">Google Podcasts</a>, <a href="https://open.spotify.com/show/6Z0ZQZ5Z1Z1Z1Z1Z1Z1Z1Z">Spotify</a>, <a href="https://www.stitcher.com/podcast/community-service-hour">Stitcher</a>, <a href="https://www.breaker.audio/community-service-hour">Breaker</a>, <a href="https://pca.st/itunes/1581000008">Pocket Casts</a>, <a href="https://radiopublic.com/community-service-hour-GKXVJd">RadioPublic</a>, <a href="https://www.listennotes.com/podcasts/community-service-hour-8Z8Y8Z8Y8Z8Y8Z8Y8Z8Y8Z8Y/">Listen Notes</a>, <a href="https://overcast.fm/itunes1581000008/community-service-hour">Overcast</a>, <a href="https://www.podchaser.com/podcasts/community-service-hour-1581000008">Podchaser</a>, <a href="https://www.podbean.com/podcast-detail/2q7xv-9b6e8/Community-Service-Hour-Podcast">Podbean</a>, <a href="https://www.listennotes.com/podcasts/community-service-hour-8Z8Y8Z8Y8Z8Y8Z8Y8Z8Z8Y/">Listen Notes</a>, <a href="https://www.listennotes.com/podcasts/community-service-hour-8Z8Y8Z8Y8Z8Y8[...]"></a>


...

## NOTES

See RSS feed at https://vanillajspodcast.com/

## Audio encoding

We follow all Apple requirements (and when appropriate, recommendations) for audio encoding.

Specification: https://podcasters.apple.com/support/893-audio-requirements

* Requirements for RSS feed audio
  * > For RSS feeds, Apple Podcasts accepts MP3 or AAC formats.
  * > ... recommended bit rates
    > | **Number of channels** | **22.05/24 kHz** | **44.1/48 kHz** |
    | :--------------------- | :--------------- | :-------------- |
    | 1 (mono)               | 40–80 kbps       | 64–128 kbps     |
    | 2 (stereo)             | 80–160 kbps      | 128–256 kbps    |
  
* Best practices for audio on Apple Podcasts
  * Formats
    * > For RSS feeds, we strongly recommend using AAC instead of MP3.
    * > When choosing AAC, we recommend using the MP4 format over the ADTS format because MP4 allows for the most-efficient streaming usage and accurate seeking.
  * Audio levels
    * > ... we recommend that the audio signals are preconditioned so the overall loudness remains around -16 dB LKFS, with a +/- 1 dB tolerance, and that the true-peak value doesn’t exceed -1 dB FS

Our selections:

* AAC/MP4
* Stereo, 44.1kHz, 160kbps
* Overall loudness of -16 dB LKFS with +/- 1 dB tolerance, true peak of -1 dBTP
* Encode loudness information in the header of the MP4 file

## Chapter markers

Specification: https://podcasters.apple.com/support/2482-using-chapters-on-apple-podcasts

## Production notes

Save chapter markers in this format to chapters.txt (use HH:MM:SS or MM:SS):

```
00:00:00 Intro
00:00:45 The agenda
00:02:27 Area contract intro
00:07:22 Push and pull Ether sending
00:17:49 Ethereum should be illegal
00:33:49 Free tool: batch transfer NFTs
00:44:19 Adidas drop gamed by robot?
01:13:15 Composing the Tweet
```

Then convert to ffmetadata format using:

```sh
node text-to-ffmetadata.js < chapters.txt > chapters.ffmetadata
```

Use ffmpeg to extract audio from the video episode, use required format and add chapter markers from the file chapters.ffmetadata.

```sh
ffmpeg -i ../Episode\ 3\ FULL.m4v -i chapters.ffmetadata -map_metadata 1 -vn -acodec aac -ac 2 -ar 44100 -b:a 160k -af loudnorm=I=-16:TP=-1:LRA=11:print_format=json -f mp4 -movflags +faststart episode.m4a
```


check:

```sh
ffprobe -i episode.m4a -print_format json -show_chapters -loglevel error
```

## How to add an episode

1. Translate chapter markers to FFMpeg format (above)
2. Upload media to media.phor.net
3. Create a _episodes/ file
  1. Fill in all metadata
  2. Add show notes in markdown, can use GPT to translate any random format you have into paragraph format:
     ```
     # Below is a paragraph-based description of the episode and the above topics:
     ```
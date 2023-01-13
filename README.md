# podcast.phor.net

This is a reusable project template to self-publish your YouTube channel or other audio files as a podcast. Output fully complies with Apple Podcasts for Creators specifications.

We use Jekyll to generate the RSS feed and HTML pages, and GitHub Pages to host the site. And you would go around registering your podcast with iTunes, Google Play, and other podcast directories.

The data (_data, _episodes) in this repository are for the NFT/Web3 Community Service hour. 

Subscribe to Community Service Hour at:

- Apple Podcasts: https://podcasts.apple.com/us/podcast/community-service-hour/id1662422217
- Google Podcasts: https://podcasts.google.com/feed/aHR0cHM6Ly9wb2RjYXN0LnBob3IubmV0L2ZlZWQueG1s?sa=X&ved=0CAMQ4aUDahcKEwignIL6m7f8AhUAAAAAHQAAAAAQBA
- Spotify // NEED LINK
- Stitcher // NEED LINK
- Breaker // NEED LINK
- Pocket Casts // NEED LINK
- RadioPublic // NEED LINK
- Overcast // NEED LINK
- RSS: https://podcast.phor.net/feed.xml

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
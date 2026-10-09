# Community Service Hour

> [!TIP]
> This template is a starting point you can use for a podcast on your own domain. We offer:
>
> * A Jekyll site and an RSS feed that meets Apple Podcasts [RSS requirements](https://podcasters.apple.com/support/823-podcast-requirements)
> * Episode pages with a timeline, and [ffmetadata](https://ffmpeg.org/ffmpeg-formats.html#Metadata-1) chapter files for ffmpeg
> * Continuous integration to [check formatting](.github/workflows/lint.yml) and [build the site](.github/workflows/build-test.yml)
> * Automated releases with [Release Please](.github/workflows/release.yml) and SLSA provenance attestation
> * Modern [EditorConfig](.editorconfig), [.gitignore](.gitignore) and linting
>
> What is in scope for this template?
>
> We the people who publish audio on our own domain, in order to keep the feed and the episode pages in one repository, maintain this starting point.
>
> The feed has to satisfy Apple Podcasts, because that is the specification the other directories still follow. Media files stay on a host you choose. The enclosure URL points there. This repository does not become your object store.
>
> We do not specify that GitHub and GitHub Actions are the only way to host the site. The Jekyll build is the site. GitHub Pages is the path this repository uses.
>
> And now below is the template, shown for a specific project, enjoy!

[![Lint](https://github.com/fulldecent/podcast-template/actions/workflows/lint.yml/badge.svg)](https://github.com/fulldecent/podcast-template/actions/workflows/lint.yml) [![Build and test](https://github.com/fulldecent/podcast-template/actions/workflows/build-test.yml/badge.svg)](https://github.com/fulldecent/podcast-template/actions/workflows/build-test.yml)

A weekly conversation, published as a podcast you can subscribe to from the site.

Community Service Hour takes questions, talks through last week's scene, and ships the audio with chapter markers. The site and the feed are this repository. The media files are not.

> [!NOTE]
> Replace the project name, the description, and the badge URLs. Then replace [_data/channel.yml](_data/channel.yml), [channel.jpg](channel.jpg), [CNAME](CNAME), and the files in [_episodes/](_episodes/). Delete [CNAME](CNAME) if the site should stay on `github.io`.

## Try it out

The sample show is at <https://podcast.phor.net/>. Open an episode and use the timeline to move through the audio. The feed is <https://podcast.phor.net/feed.xml>.

Subscribers who already followed this feed are sent to <https://hour.gg/podcast.xml> by `itunes:new-feed-url`. That tag is the sample show's move. A new podcast leaves it out.

> [!NOTE]
> Link the deployed site here. Delete this section when there is no public demo.

## Installation

You need Git, Ruby 3.3.4, Bundler, and ffmpeg. Ruby 3.3.4 is the interpreter [GitHub Pages is running](https://pages.github.com/versions.json). [.ruby-version](.ruby-version) records it. The [Gemfile](Gemfile) pins `github-pages` 232, the gem version on that same page.

GitHub Pages does not read [Gemfile.lock](Gemfile.lock), so that file is gitignored. A lockfile would describe a build Pages will not run. [pages-gem issue 768](https://github.com/github/pages-gem/issues/768)

Create the repository with **Use this template** on [podcast-template](https://github.com/fulldecent/podcast-template). The steps are in [Creating a repository from a template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template).

### macOS and Linux

[rv](https://github.com/spinel-coop/rv) reads [.ruby-version](.ruby-version). Install it with Homebrew, then install this project's Ruby and gems:

```sh
brew install rv ffmpeg
rv ruby install
rv run bundle install
```

A `bundle` taken from Homebrew uses a different Ruby than [.ruby-version](.ruby-version) and fails looking for `exe/bundle`. Run Bundler through `rv run`.

On Linux, Homebrew is the [install path rv publishes](https://github.com/spinel-coop/rv#install) besides its `curl|sh` script. Use Homebrew.

ffmpeg is there for the audio steps below. The site build does not call it.

### Windows

Install [rv from its releases](https://github.com/spinel-coop/rv/releases), then install ffmpeg:

```powershell
winget install --exact --id Gyan.FFmpeg
rv ruby install
rv run bundle install
```

In PowerShell, `rv` is the alias for `Remove-Variable`. The rv project uses `rvw` there.

### Build the site

From the repository root:

```sh
rv run bundle exec jekyll build
```

The HTML and [feed.xml](feed.xml) are written to `_site/`. Serve them locally:

```sh
rv run bundle exec jekyll serve
```

Open <http://127.0.0.1:4000>. The console prints the address when the port differs.

To work in a container instead, install a Docker host and the Dev Containers extension, then run **Reopen in Container**. [.devcontainer/devcontainer.json](.devcontainer/devcontainer.json) uses the Ruby 3.3 dev container image. The published Jekyll image pegs Ruby 3.4, which is not the Ruby GitHub Pages runs. The image tag is the 3.3 minor. CI and rv install the 3.3.4 patch from [.ruby-version](.ruby-version).

> [!NOTE]
> Explain what your users need to install, including Jekyll, because publishing a podcast does not imply they already run it.

## Usage

Channel tags live in [_data/channel.yml](_data/channel.yml). Episode pages and feed items are Markdown files in [_episodes/](_episodes/). [_drafts/YYYY-MM-DD-episode-N.md](_drafts/YYYY-MM-DD-episode-N.md) is the empty episode. Jekyll does not publish files in `_drafts/` unless you pass `--drafts`.

[_ffmetadata](_ffmetadata) is a symlink to `_episodes`. The `ffmetadata` collection runs those same files through [_layouts/ffmetadata.txt](_layouts/ffmetadata.txt) and writes one chapter file per episode under `/ffmetadata/`.

### Audio

Follow Apple's [audio requirements](https://podcasters.apple.com/support/893-audio-requirements). For an RSS enclosure they accept MP3 or AAC and recommend AAC in an MP4 container, because MP4 seeks accurately. Their recommended bit rates:

| Channels | 22.05/24 kHz | 44.1/48 kHz |
| --- | --- | --- |
| 1 (mono) | 40–80 kbps | 64–128 kbps |
| 2 (stereo) | 80–160 kbps | 128–256 kbps |

They also ask for integrated loudness around -16 dB LKFS, ±1 dB, and a true peak at or under -1 dB FS.

This template uses AAC in MP4, stereo, 44.1 kHz, 160 kbps. LKFS and LUFS match for this measurement. ffmpeg's `loudnorm` filter speaks LUFS.

One `loudnorm` pass only approximates the target. The linear mode needs the numbers from a measurement pass to land inside ±1 dB. [ffmpeg documents both passes](https://ffmpeg.org/ffmpeg-filters.html#loudnorm).

Measure:

```sh
ffmpeg -i IN.m4v -vn -af loudnorm=I=-16:TP=-1:LRA=11:print_format=json -f null -
```

Encode with the measured `input_i`, `input_tp`, `input_lra`, `input_thresh`, and `target_offset` from that JSON:

```sh
ffmpeg -i IN.m4v -vn -c:a aac -ac 2 -ar 44100 -b:a 160k \
  -af loudnorm=I=-16:TP=-1:LRA=11:measured_I=INPUT_I:measured_TP=INPUT_TP:measured_LRA=INPUT_LRA:measured_thresh=INPUT_THRESH:offset=TARGET_OFFSET:linear=true \
  -movflags +faststart YYYY-mm-dd-episode-NN-WITHOUT-CHAPTERS.m4a
```

`-ac 2` is stereo. 160 kbps is inside Apple's stereo range at 44.1 kHz and outside the mono range. Do not switch to mono without lowering the bit rate into 64–128 kbps.

### Chapters

Apple's chapter behavior is documented at [Using chapters on Apple Podcasts](https://podcasters.apple.com/support/2482-using-chapters-on-apple-podcasts). The site writes an ffmetadata file per episode. Attach one to the encoded audio:

```sh
ffmpeg -i 2022-03-08-episode-14-WITHOUT-CHAPTERS.m4a \
  -i _site/ffmetadata/2022-03-08-episode-14.txt \
  -map_metadata 1 -codec copy 2022-03-08-episode-14.m4a
```

[text-to-ffmetadata.js](text-to-ffmetadata.js) converts a YouTube chapter list (`MM:SS Title` or `HH:MM:SS Title`) from standard input. It does not escape `\`, `=`, `;`, `#`, or newlines in titles. The Jekyll layout has the same gap. Titles in the sample episodes do not contain those characters.

```sh
node text-to-ffmetadata.js < chapters.txt > chapters.ffmetadata
```

### Publish an episode

On macOS, after the final `.m4a` (with chapters) is in `MEDIADIR` and the episode file is in `_episodes/`:

```sh
NUM=15
MEDIADIR=~/Desktop/OUT

UUID=$(uuidgen)
sed -i '' -e "s/guid: .*/guid: \"$UUID\"/" _episodes/*-*-*-episode-$NUM.md

DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$MEDIADIR"/*-*-*-episode-$NUM.m4a | cut -d. -f1)
sed -i '' -e "s/itunes-duration: .*/itunes-duration: $DURATION/" _episodes/*-*-*-episode-$NUM.md

SIZE=$(stat -f%z "$MEDIADIR"/*-*-*-episode-$NUM.m4a)
sed -i '' -e "s/enclosure-length: .*/enclosure-length: $SIZE/" _episodes/*-*-*-episode-$NUM.md
```

`sed -i ''` and `stat -f` are macOS. GNU `sed -i` and `stat -c%s` are the corresponding commands.

Upload the media to the host named in `enclosure-url`. Build the site, and publish it. This repository's GitHub Pages source is the `main` branch, so a push to `main` is the publication step. The custom domain is [CNAME](CNAME).

> [!NOTE]
> Replace the media host, the domain, and the macOS-only script if your editors use something else.

## Development

Thank you for taking an interest in improving Community Service Hour and the podcasts of people who start from this project.

Follow the installation steps so Ruby matches GitHub Pages. Episode HTML is [_layouts/episode.html](_layouts/episode.html). The feed template is [feed.xml](feed.xml). The home page is [index.html](index.html).

```sh
rv run bundle exec jekyll serve --drafts
```

`--drafts` renders `_drafts/` so you can read an episode before you move it into `_episodes/`.

### Testing

All project updates that we release must conform to our test suite. GitHub Actions runs the checks on pushes to `main` and pull requests. You can also run them locally before sending proposed changes.

```sh
rv run bundle exec jekyll build
test -s _site/feed.xml
printf '00:00 Intro\n01:00 Next\n' | node text-to-ffmetadata.js
```

The build is the test of the feed, the episode pages, and the chapter files. [Build and test](.github/workflows/build-test.yml) also checks that the sample feed has two items, the `hour.gg` new-feed URL, and a chapter file for episode 57.

With an actively maintained version of Node.js installed, correct formatting before sending proposed changes:

```sh
npx prettier@latest --check . --write
npx markdownlint-cli@latest "**/*.md" --fix
```

Jekyll writes `_site/`. Release files go in `dist/`. Both are gitignored.

### Releases

Use `fix:`, `feat:` or `BREAKING CHANGE:` in your commit messages. This triggers our bot to make a release draft pull request. Merging that pull request triggers a new tag and GitHub Release.

The [release workflow](.github/workflows/release.yml) uses Release Please's `simple` release type. Nothing in this repository stores a version except the changelog and the git tag, so there is no version file to edit on the release pull request.

[Build and test](.github/workflows/build-test.yml) builds the site and attests `feed.xml`. The release includes that feed and `release.sigstore.jsonl`, containing build provenance and version attestations. The feed in the release is the sample show's feed at that tag. It is the build artifact, not a file your subscribers should switch to. Subscribers use the feed on your domain.

> [!NOTE]
> In your GitHub repository settings, under Actions, General, Workflow permissions, select read and write permissions and check "Allow GitHub Actions to create and approve pull requests". Under General, Releases, enable release immutability. Attestations are available for public repositories; private repositories require GitHub Enterprise Cloud.
>
> A repository created from this template starts with no tags and no releases. Release Please reads the latest tag on the default branch to choose the next version. The publish job accepts a tag shaped like `v1.2.3`.
>
> Run these commands from a clone of the new repository. `gh` fills in `{owner}/{repo}` from that clone.
>
> List tags:
>
> ```sh
> gh api repos/{owner}/{repo}/tags --jq '.[].name'
> ```
>
> Set the starting tag on the current `main` commit. `v0.0.0` is the version Release Please counts forward from. Use another `vMAJOR.MINOR.PATCH` tag when this repository should start later.
>
> ```sh
> gh api --method POST repos/{owner}/{repo}/git/refs \
>   -f ref="refs/tags/v0.0.0" \
>   -f sha="$(gh api repos/{owner}/{repo}/commits/main --jq .sha)"
> ```
>
> `gh release list` and `gh release create` publish the releases this workflow creates after that tag.

### Maintenance

The project administrator completes these maintenance tasks each month. If they are 3+ months late, please remind them or send your own issue/pull request.

1. Identify external Actions in [.github/workflows](.github/workflows) and look for available new versions. Review and update them if it is safe. GitHub-supported Actions (under the actions/ organization) may require only cursory review.
1. Update the Ruby pin and the `github-pages` pin to the versions GitHub Pages is running.

   ```sh
   curl -s https://pages.github.com/versions.json
   ```

   Write the `ruby` value to [.ruby-version](.ruby-version) and the `github-pages` value to [Gemfile](Gemfile). [.devcontainer/devcontainer.json](.devcontainer/devcontainer.json) repeats the Ruby minor, because the image tag cannot read [.ruby-version](.ruby-version). Update that pin in the same change when the minor changes.

1. Read Apple's [RSS requirements](https://podcasters.apple.com/support/823-podcast-requirements) and [audio requirements](https://podcasters.apple.com/support/893-audio-requirements) again. Change the feed or the encode instructions when those pages change.

## Project scope

We are people who record a weekly conversation and want the episode list, the show notes, and the podcast feed in the repository we already edit.

Community Service Hour publishes that feed and one page per episode. Chapter titles in the episode Markdown become ffmetadata for the audio file. The audio file itself is uploaded somewhere else and linked with `enclosure-url`.

We specifically will not add comments, a second media host, or a feed that diverges from Apple's RSS requirements in order to satisfy one directory.

> [!NOTE]
> Introduce your community, explain what is in scope, and say what is out of scope.

## References

1. We use title case only for proper nouns, including the name of our project.
1. This project is built based on [best practices documented in project-template](https://github.com/fulldecent/project-template), release 1.3.0.
1. [EditorConfig](.editorconfig), the lint workflow, and the release workflow are taken from that release. [.gitignore](.gitignore) starts with that file and then follows [GitHubPages.gitignore](https://github.com/github/gitignore/blob/main/GitHubPages.gitignore).
1. We use the github-pages gem at the version on [pages.github.com/versions.json](https://pages.github.com/versions.json). GitHub Pages ignores `Gemfile.lock`. [pages-gem issue 768](https://github.com/github/pages-gem/issues/768)
1. [rv](https://github.com/spinel-coop/rv) is how we install that Ruby. Homebrew's `bundle` is a different interpreter than [.ruby-version](.ruby-version).
1. The feed follows Apple's [podcast RSS requirements](https://podcasters.apple.com/support/823-podcast-requirements). The encode settings follow Apple's [audio requirements](https://podcasters.apple.com/support/893-audio-requirements). Chapters follow [Using chapters on Apple Podcasts](https://podcasters.apple.com/support/2482-using-chapters-on-apple-podcasts) and ffmpeg's [metadata format](https://ffmpeg.org/ffmpeg-formats.html#Metadata-1).
1. The dev container uses `mcr.microsoft.com/devcontainers/ruby:3.3-bookworm` because the [Jekyll dev container image](https://github.com/devcontainers/images/tree/main/src/jekyll) pegs Ruby 3.4.
1. This project is released under the [MIT license](LICENSE.md).

> [!NOTE]
> Carefully consider which license to apply to your project and replace the copyright line in [LICENSE.md](LICENSE.md). Cite external sources that materially informed your decisions, including the release of this podcast template you used.

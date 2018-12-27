# Google Cloud Voice Synthesis

This is a script to allow quick voice file synthesis via the Google Cloud voice API.

To use the script you will need to:

1.  [Setup the project](#Setup) (first time only)
2.  [Run the synthesize script](#Run)

## Setup

To use the script first install the npm dependencies by running

```sh
npm install
```

Then, use the Google Cloud Platform console to first [create a new service account key](https://console.cloud.google.com/apis/credentials/serviceaccountkey), ensuring that you grant the `Owner` role. Rename the downloaded file to `gcloud_auth.json` and place it in the root of the repository folder.

Next make sure that you [enable the text-to-speech API for your project](https://console.cloud.google.com/apis/library/texttospeech.googleapis.com?q=speech).

## Run

The script accepts 4 different types of inputs, all commands roughly follow the format

```sh
node synthesize <command> [--outputFile <path>|--help|--version]
```

### Text input

**Raw text**

To synthesize a raw text string use the `text` command

```sh
node synthesize text "hello" -o hello.mp3
```

**Text file**

To synthesize a text file use the `text-file` command

```sh
node synthesize text-file resources/demo.txt -o output.mp3
```

### SSML input

The Google Cloud voice API also support [Speech Synthesis Markup Language](https://en.wikipedia.org/wiki/Speech_Synthesis_Markup_Language) as an input, a [sample SSML file](resources/demo.ssml) is provided in the `./resources` directory.

**Raw SSML**

To synthesize a raw SSML string use the `ssml` command

```sh
node synthesize ssml "<speak>Hello there.</speak>" -o hello.mp3
```

**SSML file**

To synthesize an SSML file use the `ssml-file` command

```sh
node synthesize ssml-file resources/demo.ssml -o output.mp3
```

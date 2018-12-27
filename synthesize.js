const fs = require('fs')
const util = require('util')

// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech')

// Creates a client
const client = new textToSpeech.TextToSpeechClient()

// Creates a request object, contains default request parameters
const createRequest = input => ({
  input,
  // Select the language and SSML Voice Gender (optional)
  voice: {
    languageCode: 'en-AU',
    ssmlGender: 'MALE',
    name: 'en-AU-Wavenet-B'
  },
  // Select the type of audio encoding
  audioConfig: { audioEncoding: 'MP3' }
})

async function fetchAudioToFile(input, outputFile = 'output.mp3') {
  // Create the formatted request object
  const request = createRequest(input)

  // Performs the Text-to-Speech request
  const [response] = await client.synthesizeSpeech(request)

  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile)
  await writeFile(outputFile, response.audioContent, 'binary')

  console.log(`Audio content written to file: ${outputFile}`)
}

const synthesizeText = (text, outputFile) =>
  fetchAudioToFile({ text }, outputFile)

const synthesizeSsml = (ssml, outputFile) =>
  fetchAudioToFile({ ssml }, outputFile)

const synthesizeTextFile = (textFile, outputFile) => {
  const text = fs.readFileSync(textFile)
  return fetchAudioToFile({ text }, outputFile)
}

const synthesizeSsmlFile = (ssmlFile, outputFile) => {
  const ssml = fs.readFileSync(ssmlFile)
  return fetchAudioToFile({ ssml }, outputFile)
}

async function main() {
  require(`yargs`)
    .demand(1)
    .command(`text <text>`, `Synthesizes audio file from text`, {}, opts =>
      synthesizeText(opts.text, opts.outputFile)
    )
    .command(`ssml <ssml>`, `Synthesizes audio file from SSML`, {}, opts =>
      synthesizeSsml(opts.ssml, opts.outputFile)
    )
    .command(
      `text-file <textFile>`,
      `Synthesizes audio file from text in a file`,
      {},
      opts => synthesizeTextFile(opts.textFile, opts.outputFile)
    )
    .command(
      `ssml-file <ssmlFile>`,
      `Synthesizes audio file from SSML in a file`,
      {},
      opts => synthesizeSsmlFile(opts.ssmlFile, opts.outputFile)
    )
    .options({
      outputFile: {
        alias: 'o',
        default: 'output.mp3',
        global: true,
        requiresArg: true,
        type: 'string'
      }
    })
    .example(`node $0 text "hello" -o hello.mp3`)
    .example(`node $0 ssml "<speak>Hello there.</speak>" -o hello.mp3`)
    .example(`node $0 text-file resources/demo.txt -o output.mp3`)
    .example(`node $0 ssml-file resources/demo.ssml -o output.mp3`)
    .wrap(120)
    .recommendCommands()
    .epilogue(
      `For more information, see https://cloud.google.com/text-to-speech/docs`
    )
    .help()
    .strict().argv
}

main().catch(console.error)

const fs = require('fs')
const util = require('util')

// Imports the Google Cloud client library
import textToSpeech, {
  Voice,
  SynthesizeSpeechRequest,
  SynthesisInput,
  VoiceSelectionParams,
  SsmlVoiceGender
} from '@google-cloud/text-to-speech'

/** The text to speech client */
const client = new textToSpeech.TextToSpeechClient()

export interface VoiceProfileOptions {
  /** Part of a language code, used to filter the results */
  language?: string
  /** Retrieves all available voice profiles */
  wavenet?: boolean
}

/** Retrive all voice profiles */
export async function getVoiceProfiles(
  opts: VoiceProfileOptions
): Promise<Voice[]> {
  const [result] = await client.listVoices({})
  const { voices } = result

  return voices.filter(voice => {
    if (opts.wavenet && !voice.name.toLowerCase().includes('wavenet')) {
      return false
    }

    if (
      opts.language &&
      !voice.languageCodes.some(lang =>
        lang.toLowerCase().includes(opts.language.toLowerCase())
      )
    ) {
      return false
    }

    return true
  })
}

/** Creates a request object, contains default request parameters */
export const createRequest = (
  input: SynthesisInput,
  {
    languageCode = 'en-AU',
    ssmlGender = 'MALE' as SsmlVoiceGender,
    name = 'en-AU-Wavenet-B'
  } = {}
): SynthesizeSpeechRequest => ({
  input,
  // Select the language and SSML Voice Gender (optional)
  voice: {
    name,
    languageCode,
    ssmlGender
  },
  // Select the type of audio encoding
  audioConfig: { audioEncoding: 'MP3' }
})

export async function fetchAudioToFile(
  input: SynthesisInput,
  outputFile = 'output.mp3',
  options: VoiceSelectionParams
) {
  // Create the formatted request object
  const request = createRequest(input, options)

  // Performs the Text-to-Speech request
  const [response] = await client.synthesizeSpeech(request)

  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile)
  await writeFile(outputFile, response.audioContent, 'binary')

  console.log(`Audio content written to file: ${outputFile}`)
}

export const synthesizeText = (
  text: string,
  outputFile: string,
  options: VoiceSelectionParams
) => fetchAudioToFile({ text }, outputFile, options)

export const synthesizeSsml = (
  ssml: string,
  outputFile: string,
  options: VoiceSelectionParams
) => fetchAudioToFile({ ssml }, outputFile, options)

export const synthesizeTextFile = (
  textFile: string,
  outputFile: string,
  options: VoiceSelectionParams
) => {
  const text = fs.readFileSync(textFile)
  return fetchAudioToFile({ text }, outputFile, options)
}

export const synthesizeSsmlFile = (
  ssmlFile: string,
  outputFile: string,
  options: VoiceSelectionParams
) => {
  const ssml = fs.readFileSync(ssmlFile)
  return fetchAudioToFile({ ssml }, outputFile, options)
}

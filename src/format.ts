import chalk from 'chalk'
import { SsmlVoiceGender } from '@google-cloud/text-to-speech'

type FormattedGenders = { [K in SsmlVoiceGender]: string }

const formattedGenders: FormattedGenders = {
  MALE: chalk.blue('male'),
  FEMALE: chalk.rgb(249, 135, 197)('female'),
  NEUTRAL: 'neutral',
  SSML_VOICE_GENDER_UNSPECIFIED: chalk.red('unspecified')
}

/** Format a voice profile gender */
export const voiceProfileGender = (gender: SsmlVoiceGender): string =>
  formattedGenders[gender] || chalk.red('unknown')

/** Format a voice profile name */
export const voiceProfileName = (name: string): string =>
  name.replace(/wavenet|standard/i, match => {
    if (match.toLowerCase().includes('wavenet')) {
      return chalk.cyan(match)
    } else {
      return chalk.yellow(match)
    }
  })

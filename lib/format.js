import chalk from 'chalk';
const formattedGenders = {
    MALE: chalk.blue('male'),
    FEMALE: chalk.rgb(249, 135, 197)('female'),
    NEUTRAL: 'neutral',
    SSML_VOICE_GENDER_UNSPECIFIED: chalk.red('unspecified')
};
/** Format a voice profile gender */
export const voiceProfileGender = (gender) => formattedGenders[gender] || chalk.red('unknown');
/** Format a voice profile name */
export const voiceProfileName = (name) => name.replace(/wavenet|standard/i, match => {
    if (match.toLowerCase().includes('wavenet')) {
        return chalk.cyan(match);
    }
    else {
        return chalk.yellow(match);
    }
});

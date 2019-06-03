import Table from 'cli-table3';
import * as format from './format';
import * as lib from './lib';
// Fetches all available voice profiles and prints them in a table
async function printVoiceProfiles(opts) {
    const voices = await lib.getVoiceProfiles(opts);
    const table = new Table({
        head: ['name', 'gender', 'languages', 'sample rate']
    });
    voices.forEach(voice => table.push([
        format.voiceProfileName(voice.name),
        format.voiceProfileGender(voice.ssmlGender),
        voice.languageCodes.join(', '),
        voice.naturalSampleRateHertz + 'Hz'
    ]));
    console.log(table.toString());
}
const createSynthesisYargs = (name, description) => yargs => {
    return yargs
        .positional(name, {
        description,
        type: 'string'
    })
        .options({
        outputFile: {
            alias: 'o',
            default: 'output.mp3',
            requiresArg: true,
            type: 'string'
        },
        voiceProfile: {
            alias: 'v',
            default: 'en-AU-Wavenet-B',
            requiresArg: true,
            type: 'string'
        }
    });
};
async function main() {
    require(`yargs`)
        .scriptName('synthesize')
        .usage('node $0 <cmd> [args]')
        .demand(1)
        .command(`text <inputText>`, `Synthesizes audio file from text`, createSynthesisYargs('inputText', 'The plain text to synthesize'), opts => lib.synthesizeText(opts.inputText, opts.outputFile, {
        name: opts.voiceProfile
    }))
        .command(`ssml <ssmlText>`, `Synthesizes audio file from SSML`, createSynthesisYargs('ssmlText', 'The SSML text to synthesize'), opts => lib.synthesizeSsml(opts.ssmlText, opts.outputFile, {
        name: opts.voiceProfile
    }))
        .command(`text-file <filePath>`, `Synthesizes audio file from text in a file`, createSynthesisYargs('filePath', 'The path to a plain text file to synthesize'), opts => lib.synthesizeTextFile(opts.filePath, opts.outputFile, {
        name: opts.voiceProfile
    }))
        .command(`ssml-file <filePath>`, `Synthesizes audio file from SSML in a file`, createSynthesisYargs('filePath', 'The path to a SSML text file to synthesize'), opts => lib.synthesizeSsmlFile(opts.filePath, opts.outputFile, {
        name: opts.voiceProfile
    }))
        .command(`list-voices`, 'Prints all available voice profiles', {
        wavenet: {
            alias: 'w',
            desc: 'Only print wavenet voice profiles',
            type: 'boolean'
        },
        language: {
            alias: ['l', 'lang'],
            desc: `Part of a language code that will be used to filter profiles (eg 'en-' to match english languages)`,
            type: 'string',
            requiresArg: true
        }
    }, printVoiceProfiles)
        .example(`node $0 text "hello" -o hello.mp3`)
        .example(`node $0 ssml "<speak>Hello there.</speak>" -o hello.mp3`)
        .example(`node $0 text-file resources/demo.txt -o output.mp3`)
        .example(`node $0 ssml-file resources/demo.ssml -o output.mp3`)
        .example(`node $0 list-voices`)
        .wrap(120)
        .recommendCommands()
        .epilogue(`For more information, see https://cloud.google.com/text-to-speech/docs`)
        .help()
        .strict().argv;
}
main().catch(console.error);

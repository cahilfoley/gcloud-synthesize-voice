import { Voice, SynthesizeSpeechRequest, SynthesisInput, VoiceSelectionParams, SsmlVoiceGender } from '@google-cloud/text-to-speech';
export interface VoiceProfileOptions {
    /** Part of a language code, used to filter the results */
    language?: string;
    /** Retrieves all available voice profiles */
    wavenet?: boolean;
}
/** Retrive all voice profiles */
export declare function getVoiceProfiles(opts: VoiceProfileOptions): Promise<Voice[]>;
/** Creates a request object, contains default request parameters */
export declare const createRequest: (input: SynthesisInput, { languageCode, ssmlGender, name }?: {
    languageCode?: string;
    ssmlGender?: SsmlVoiceGender;
    name?: string;
}) => SynthesizeSpeechRequest;
export declare function fetchAudioToFile(input: SynthesisInput, outputFile: string, options: VoiceSelectionParams): Promise<void>;
export declare const synthesizeText: (text: string, outputFile: string, options: VoiceSelectionParams) => Promise<void>;
export declare const synthesizeSsml: (ssml: string, outputFile: string, options: VoiceSelectionParams) => Promise<void>;
export declare const synthesizeTextFile: (textFile: string, outputFile: string, options: VoiceSelectionParams) => Promise<void>;
export declare const synthesizeSsmlFile: (ssmlFile: string, outputFile: string, options: VoiceSelectionParams) => Promise<void>;

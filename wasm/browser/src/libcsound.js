import {
  csoundCreate,
  csoundDestroy,
  csoundGetAPIVersion,
  csoundGetVersion,
  csoundInitialize,
} from "./modules/instantiation";
import {
  csoundParseOrc,
  csoundCompileTree,
  csoundCompileOrc,
  csoundEvalCode,
  csoundStart,
  csoundCompileCsd,
  csoundCompileCsdText,
  csoundPerform,
  csoundPerformKsmps,
  csoundPerformBuffer,
  csoundStop,
  csoundCleanup,
  csoundReset,
} from "./modules/performance";
import {
  csoundGetSr,
  csoundGetKr,
  csoundGetKsmps,
  csoundGetNchnls,
  csoundGetNchnlsInput,
  csoundGet0dBFS,
  csoundGetA4,
  csoundGetCurrentTimeSamples,
  csoundGetSizeOfMYFLT,
  csoundSetOption,
  csoundSetParams,
  csoundGetParams,
  csoundGetDebug,
  csoundSetDebug,
} from "./modules/attributes";
import {
  csoundGetInputBufferSize,
  csoundGetOutputBufferSize,
  csoundGetInputBuffer,
  csoundGetOutputBuffer,
  csoundGetSpin,
  csoundGetSpout,
} from "./modules/rtaudio";
import {
  csoundGetMIDIDevList,
  csoundSetMidiCallbacks,
  csoundGetRtMidiName,
  csoundGetMidiOutFileName,
  csoundPushMidiMessage,
  _isRequestingRtMidiInput,
} from "./modules/rtmidi";
import {
  csoundInputMessage,
  csoundInputMessageAsync,
  csoundGetControlChannel,
  csoundSetControlChannel,
  csoundGetStringChannel,
  csoundSetStringChannel,
} from "./modules/control-events";
import { csoundGetInputName, csoundGetOutputName } from "./modules/general-io";
import { csoundAppendEnv, csoundShouldDaemonize } from "./modules/extra";
import {
  csoundIsScorePending,
  csoundSetScorePending,
  csoundReadScore,
  csoundGetScoreTime,
  csoundGetScoreOffsetSeconds,
  csoundSetScoreOffsetSeconds,
  csoundRewindScore,
} from "./modules/score-handling";
import {
  csoundTableLength,
  csoundTableGet,
  csoundTableSet,
  csoundTableCopyIn,
  csoundTableCopyOut,
  csoundGetTable,
  csoundGetTableArgs,
  csoundIsNamedGEN,
  csoundGetNamedGEN,
} from "./modules/table";
import * as fs from "./filesystem/worker-fs";

goog.declareModuleId("libcsound");

/*
   Don't call these functions directly.
   They are closures that take wasm instance as
   first argument before they can be called as
   documented.
*/
/**
 * @type {WasmExports}
 * @suppress {checkTypes}
 */
export const api = {
  // @module/instantiation
  csoundCreate,
  csoundDestroy,
  csoundGetAPIVersion,
  csoundGetVersion,
  csoundInitialize,
  // @module/performance
  csoundParseOrc,
  csoundCompileTree,
  csoundCompileOrc,
  csoundEvalCode,
  csoundStart,
  csoundCompileCsd,
  csoundCompileCsdText,
  csoundPerform,
  csoundPerformKsmps,
  csoundPerformBuffer,
  csoundStop,
  csoundCleanup,
  csoundReset,
  // @module/attributes
  csoundGetSr,
  csoundGetKr,
  csoundGetKsmps,
  csoundGetNchnls,
  csoundGetNchnlsInput,
  csoundGet0dBFS,
  csoundGetA4,
  csoundGetCurrentTimeSamples,
  csoundGetSizeOfMYFLT,
  csoundSetOption,
  csoundSetParams,
  csoundGetParams,
  csoundGetDebug,
  csoundSetDebug,
  // @module/rtaudio
  csoundGetInputBufferSize,
  csoundGetOutputBufferSize,
  csoundGetInputBuffer,
  csoundGetOutputBuffer,
  csoundGetSpin,
  csoundGetSpout,
  // @module/rtmidi
  csoundGetMIDIDevList,
  csoundSetMidiCallbacks,
  csoundGetRtMidiName,
  csoundGetMidiOutFileName,
  csoundPushMidiMessage,
  _isRequestingRtMidiInput,
  // @module/control_events
  csoundInputMessage,
  csoundInputMessageAsync,
  csoundGetControlChannel,
  csoundSetControlChannel,
  csoundGetStringChannel,
  csoundSetStringChannel,
  // @module/general_io
  csoundGetInputName,
  csoundGetOutputName,
  // @module/extra
  csoundAppendEnv,
  csoundShouldDaemonize,
  // @module/score-handling
  csoundIsScorePending,
  csoundSetScorePending,
  csoundReadScore,
  csoundGetScoreTime,
  csoundGetScoreOffsetSeconds,
  csoundSetScoreOffsetSeconds,
  csoundRewindScore,
  // @module/table
  csoundTableLength,
  csoundTableGet,
  csoundTableSet,
  csoundTableCopyIn,
  csoundTableCopyOut,
  csoundGetTable,
  csoundGetTableArgs,
  csoundIsNamedGEN,
  csoundGetNamedGEN,
  // filesystem
  fs,
};

export default function (wasm) {
  const apiFs = { ...api["fs"] };
  delete api["fs"];

  return {
    ...Object.keys(api).reduce((accumulator, k) => {
      accumulator[k] = api[k](wasm);
      return accumulator;
    }, {}),
    ...Object.keys(fs).reduce((accumulator, k) => {
      accumulator[k] = apiFs[k](wasm);
      return accumulator;
    }, {}),
  };
}

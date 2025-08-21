import { useEffect, useState, useCallback } from "react";
// Lazy require to avoid crashing if the native module isn't installed
const Voice2Text: any = (() => {
  try {
    const m = require("react-native-voice2text");
    return m?.default ?? m;
  } catch (_e) {
    return {
      startListening: async (_lang?: string) => false,
      stopListening: async () => { },
      cancelListening: async () => { },
      destroy: async () => { },
      onResults: (_cb: any) => () => { },
      onPartialResults: (_cb: any) => () => { },
      onError: (_cb: any) => () => { },
      onSpeechStart: (_cb: any) => () => { },
    };
  }
})();

export function useVoiceRecognizer(onTextChange?: (text: string) => void) {
  const [recognizedText, setRecognizedText] = useState("");
  const [status, setStatus] = useState("Idle");
  const [finalReceived, setFinalReceived] = useState(false);
  const [manuallyStopped, setManuallyStopped] = useState(false);

  const startListening = useCallback(async () => {
    setStatus("Starting...");
    setRecognizedText("");
    setFinalReceived(false);
    setManuallyStopped(false);
    try {
      const started = await Voice2Text.startListening("en-US");
      if (started) setStatus("Listening...");
    } catch (e) {
      console.error("❌ startListening error:", e);
      setStatus("Error starting listening");
    }
  }, []);

  const stopListening = useCallback(async () => {
    console.log("⏹ stopListening pressed");
    setManuallyStopped(true);
    try {
      await Voice2Text.stopListening();
      setStatus("Stopped by user");
    } catch (e) {
      console.error("❌ stopListening error:", e);
      setStatus("Error stopping listening");
    }
  }, []);

  useEffect(() => {
    console.log("👂 Setting up speech listeners");

    const unsubResults = Voice2Text.onResults((results: any) => {
      console.log("📥 onResults fired:", results);
      const text = results?.text || results?.[0];
      if (text) {
        setRecognizedText(text);
        if (onTextChange) onTextChange(text);
        setStatus("✅ Final result received!");
        setFinalReceived(true);
      }
    });

    const unsubPartial = Voice2Text.onPartialResults((partial: any) => {
      console.log("📝 onPartialResults fired:", partial);
      if (partial?.partialText) {
        setRecognizedText(partial.partialText);
        if (onTextChange) onTextChange(partial.partialText);
        setStatus("Listening (partial)...");
      }
    });

    const unsubError = Voice2Text.onError((err: any) => {
      console.error("🚨 onError fired:", err);
      if (err.code === 5) {
        if (manuallyStopped) {
          console.log("ℹ️ Ignored error 5 (manual stop)");
          return;
        }
        if (finalReceived) {
          console.log("⚠️ Ignored error 5 (already final)");
          return;
        }
        setStatus("Stopped with last partial result.");
      } else {
        setStatus("Error: " + JSON.stringify(err));
      }
    });

    const unsubStart = Voice2Text.onSpeechStart(() => {
      console.log("🎙️ onSpeechStart fired");
      setStatus("Speech started...");
      setFinalReceived(false);
      setManuallyStopped(false);
    });

    return () => {
      console.log("🧹 Cleaning up listeners & shutting down");
      unsubResults?.();
      unsubPartial?.();
      unsubError?.();
      unsubStart?.();

      // ✅ ensure mic is released
      Voice2Text.stopListening().catch(() => { });
      Voice2Text.cancelListening().catch(() => { });
      Voice2Text.destroy().catch(() => { });
    };
  }, [onTextChange, finalReceived, manuallyStopped]);

  return {
    recognizedText,
    status,
    startListening,
    stopListening,
  };
}

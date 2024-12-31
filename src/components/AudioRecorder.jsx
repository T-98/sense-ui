import  { useState, useRef } from "react";

function AudioRecorder({skeletonUI}) {
    console.log(`Skeleton UI is ${JSON.stringify(skeletonUI)}`)
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef();
    const [audioChunks, setAudioChunks] = useState([]);


    function getBlob() {
        return new Promise((resolve) => {

            resolve(new Blob(audioChunks, { type: "audio/wav" }))

        })
    }
    function convertAudio(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(",")[1])
            reader.onerror = (error) => reject(error)
            reader.readAsDataURL(blob);
        })
    }
    const toggleRecording = async () => {
        if (!isRecording) {
            // Start recording

            try {

                const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const recorder = new MediaRecorder(mediaStream);
                recorder.start();
                setIsRecording(true);

                mediaRecorderRef.current = recorder;
                let localChunks = []
                recorder.ondataavailable = (e) => {
                    console.log(e.data)
                    localChunks.push(e.data)

                };
                setAudioChunks(localChunks);


                console.log("Started recording");
            } catch (err) {
                console.error("Error starting recording", err);
            }
        } else {
            // Stop recording
            if (mediaRecorderRef.current) {
                try {
                    const recorder = mediaRecorderRef.current;

                    recorder.stop();

                    // Wait for the recording to stop and finalize
                    recorder.onstop = async () => {
                        setIsRecording(false);
                        console.log(audioChunks)
                        // Create the audio blob
                        const audioBlob = await getBlob()
                        const base64Audio = await convertAudio(audioBlob);
                        console.log("Audio Base64: ", base64Audio);
                        const skeleton_ui = {
                            "data": {
                                "components": [
                                    { "component": "Profile Pic", "uid": "btn-001", "purpose": "generate AI profile picture" },
                                    { "component": "Generate Resume", "uid": "btn-002", "purpose": "generate resume" },
                                    { "component": "Create Folders", "uid": "input-001", "purpose": "create folders" },
                                    { "component": "Generate Resume", "uid": "input-002", "purpose": "make resume" },
                                ]
                            }
                        }

                        // Send the audio blob to the server
                        const response = await fetch("http://0.0.0.0:8000/generate", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ audio_path: base64Audio, skeleton_ui: skeletonUI }),
                        });

                        console.log("Server Response: ", response);
                    };

                    recorder.stream.getTracks().forEach((track) => track.stop());
                } catch (error) {
                    console.error("Error during recording stop:", error);
                } finally {
                    setAudioChunks([]); // Clear chunks
                }
            }
        }
    };

    return (
        <div className="flex justify-center">
            <button
                onClick={toggleRecording}
                style={{
                    backgroundColor: isRecording ? "red" : "blue",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    padding: "20px",
                    fontSize: "16px",
                }}
                title={isRecording ? "Stop Recording" : "Start Recording"}
            >
                🎤
            </button>
        </div>
    );
}

export default AudioRecorder;

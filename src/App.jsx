import { useState, useEffect } from "react";
import AIButton from "./components/AIButton";
import AIInput from "./components/AIInput";
import AudioRecorder from "./components/AudioRecorder";
import ActionHandler from "./services/ActionHandler";
import Particles from "./components/Particles";
function App() {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [skeletonUI, setSkeletonUI] = useState(null);

  useEffect(() => {
    let ws;
    let reconnectInterval = 5000; // 5 seconds

    const connectWebSocket = () => {
      const wsUrl = "ws://localhost:8080";
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.onmessage = (message) => {
        console.log("WebSocket message received:", message.data);
        try {
          const action = JSON.parse(message.data);
          ActionHandler(action);
        } catch (error) {
          console.error("Error parsing action message:", error);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected. Reconnecting in 5 seconds...");
        setTimeout(connectWebSocket, reconnectInterval);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        ws.close();
      };
    };

    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (ws) ws.close();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("../metadata/skeleton.json"); // Fetch from public directory
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        setSkeletonUI(jsonData);
      } catch (err) {
        console.error("Error fetching JSON:", err);
      }
    };

    fetchData();
  }, []);

  const handleNavClick = (e, uid) => {
    console.log("Navigation Button clicked!", uid, e.target);
  };

  const handleEmailInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleFirstNameInputChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameInputChange = (e) => {
    setLastName(e.target.value);
  };

  const handlePhoneInputChange = (e) => {
    setPhone(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with email:", email);
  };

  const handleAction = (e, uid) => {
    console.log("Action Button clicked!", uid, e.target);
  };

  const handleSupport = (e, uid) => {
    console.log("Support Button clicked!", uid, e.target);
  };

  return (
    <>
      <div className="relative flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-black">
        <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
        <div className="px-96 pb-20 pt-0 bg-black w-screen duration-1000 animate-title ">
          <nav className="flex flex-row justify-between items-center w-full h-14 p-8 rounded-lg border-b border-b-slate-700">
            <p className="text-white text-xl font-custom">SenseUI</p>
            <div className="flex flex-row gap-4">
              <AIButton
                id="nav-btn-001"
                purpose="navigateHome"
                label="Home"
                onClick={(e) => handleNavClick(e, "nav-btn-001")}
              />
              <AIButton
                id="nav-btn-002"
                purpose="navigateAbout"
                label="About"
                onClick={(e) => handleNavClick(e, "nav-btn-002")}
              />
            </div>
          </nav>
        </div>
        <Particles
          className="absolute inset-0 -z-10 animate-fade-in"
          quantity={100}
        />
        <h1 className="font-custom py-3.5 px-0.5 z-10 text-4xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text ">
          SenseUI
        </h1>

        <div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
        <div className="my-16 text-center animate-fade-in">
          <main>
            <form>
              <div className="flex flex-row gap-4 mb-2">
                <AIInput
                  id="input-001"
                  purpose="collectUserName"
                  placeholder="Firstname"
                  value={firstname}
                  onChange={handleFirstNameInputChange}
                />
                <AIInput
                  id="input-002"
                  purpose="collectUserName"
                  placeholder="Lastname"
                  value={lastname}
                  onChange={handleLastNameInputChange}
                />
              </div>
              <div className="flex flex-col gap-2 mb-2">
                <AIInput
                  id="input-003"
                  purpose="collectUserEmail"
                  placeholder="name@example.com"
                  value={email}
                  onChange={handleEmailInputChange}
                />
                <AIInput
                  id="input-004"
                  purpose="phone number"
                  placeholder="(123) 456-7890"
                  value={phone}
                  onChange={handlePhoneInputChange}
                />
                <AIInput
                  id="input-005"
                  purpose="Message"
                  placeholder="Enter message here..."
                />
              </div>
              <div className="flex flex-row justify-between mb-2">
                <AIButton
                  id="btn-001"
                  purpose="submitForm"
                  label="Submit"
                  onClick={(e) => handleFormSubmit(e)}
                />
                <AIButton
                  id="section-btn-001"
                  purpose="performAction"
                  label="Cancel"
                  onClick={(e) => handleAction(e, "section-btn-001")}
                />
              </div>
            </form>
          </main>
          <AudioRecorder skeletonUI={skeletonUI} />
        </div>
      </div>
    </>
  );
}

export default App;

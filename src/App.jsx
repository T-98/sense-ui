import { useState, useEffect } from "react";
import AIButton from "./components/AIButton";
import AIInput from "./components/AIInput";
import AudioRecorder from "./components/AudioRecorder"
import ActionHandler from "./services/ActionHandler";
function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [skeletonUI, setSkeletonUI] = useState(null);

  // ./frontend/src/App.js

useEffect(() => {
  let ws;
  let reconnectInterval = 5000; // 5 seconds

  const connectWebSocket = () => {
      const wsUrl = 'ws://localhost:8080';
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
          console.log('WebSocket connected');
      };

      ws.onmessage = (message) => {
          console.log('WebSocket message received:', message.data);
          try {
              const action = JSON.parse(message.data);
              ActionHandler(action);
          } catch (error) {
              console.error('Error parsing action message:', error);
          }
      };

      ws.onclose = () => {
          console.log('WebSocket disconnected. Reconnecting in 5 seconds...');
          setTimeout(connectWebSocket, reconnectInterval);
      };

      ws.onerror = (error) => {
          console.error('WebSocket error:', error);
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
        const response = await fetch('../metadata/skeleton.json'); // Fetch from public directory
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        setSkeletonUI(jsonData);
      } catch (err) {
        console.error('Error fetching JSON:', err);
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

  const handleNameInputChange = (e) => {
    setName(e.target.value);
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
      <nav>
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
      </nav>
      <main>
        <form>
          <AIInput
            id="input-001"
            purpose="collectUserEmail"
            placeholder="name@example.com"
            value={email}
            onChange={handleEmailInputChange}
          />
          <AIInput
            id="input-002"
            purpose="collectUserName"
            placeholder="Firstname Lastname"
            value={name}
            onChange={handleNameInputChange}
          />
          <AIButton
            id="btn-001"
            purpose="submitForm"
            label="Submit"
            onClick={(e) => handleFormSubmit(e)}
          />
        </form>
        <section>
          <AIButton
            id="section-btn-001"
            purpose="performAction"
            label="Action"
            onClick={(e) => handleAction(e, "section-btn-001")}
          />
        </section>
      </main>
      <footer>
        <AIButton
          id="footer-btn-001"
          purpose="contactSupport"
          label="Support"
          onClick={(e) => handleSupport(e, "footer-btn-001")}
        />
      </footer>
      <AudioRecorder skeletonUI={skeletonUI} />
    </>
  );
}

export default App;
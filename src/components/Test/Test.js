'use client';
import React, { useState, useEffect } from 'react';

export default function Test() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:5000/chatbotAPI');

    eventSource.onmessage = (event) => {
      const newWords = event.data.split(' ');

      // Update the display word by word
      setWords((prevWords) => [...prevWords, ...newWords]);
    };

    eventSource.onerror = (error) => {
      console.error('Error with EventSource:', error);
      eventSource.close();
    };

    return () => {
      // Close the EventSource connection when the component unmounts
      eventSource.close();
    };
  }, []); // Run this effect only once when the component mounts

  return (
    <main className="main">
      <p>Streaming response:</p>
      <br />
      <div style={{ whiteSpace: 'pre-wrap' }}>{words.join(' ')}</div>
    </main>
  );
}

'use client';  // This marks the file as a client-side component

import React, { useState } from 'react';

export default function Home() {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [removedCards, setRemovedCards] = useState<Set<number>>(new Set()); // Track removed cards
  const [isPopupVisible, setIsPopupVisible] = useState(false); // Track popup visibility

  // Image URLs for the cards
  const images = [
    '/images/c1.png', // Example image 1 (unselected)
    '/images/c2.png', // Example image 2 (unselected)
    '/images/c3.png', // Example image 3 (unselected)
    '/images/c4.png', // Example image 4 (unselected)
    '/images/c5.png', // Example image 5 (unselected)
  ];

  // Image URLs for the selected state (you can replace these with your images for selected states)
  const selectedImages = [
    '/images/c1-selected.png', // Selected image for card 1
    '/images/c2-selected.png', // Selected image for card 2
    '/images/c3-selected.png', // Selected image for card 3
    '/images/c4-selected.png', // Selected image for card 4
    '/images/c5-selected.png', // Selected image for card 5
  ];

  // Handle card click (select and unselect)
  const handleCardClick = (index: number) => {
    // Only allow selection if no card has been selected yet
    if (selectedCardIndex === null && !removedCards.has(index)) {
      setSelectedCardIndex(index); // Select the card
    }
  };

  // Close the selected card (unselect it) and remove it
  const closeCard = () => {
    setRemovedCards((prev) => new Set(prev).add(selectedCardIndex!)); // Mark the card as removed
    setSelectedCardIndex(null); // Unselect the card
  };

  // Check if all cards are removed
  const checkAllCardsRemoved = () => {
    return removedCards.size === images.length;
  };

  // Show the popup when all cards are removed
  const handleRestart = () => {
    setRemovedCards(new Set()); // Clear removed cards
    setIsPopupVisible(false); // Close the popup
  };

  // Main container styling (deck) for the entire view
  const deckStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: '100vh', // Full viewport height (to cover the entire monitor)
    overflow: 'hidden',
    position: 'relative', // Set position to relative for the overlay positioning
  };

  // Dark overlay styling
  const overlayStyle = {
    position: 'absolute', // Overlay sits on top of the background
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url(/images/bg.png)', // Set background image for the whole container
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: 0.6, // Adjust opacity to make the background darker
    zIndex: -1, // Ensure the overlay is behind the cards
  };

  // Card styling based on selection state
  const cardStyle = (isSelected: boolean, index: number, isUnselectable: boolean) => ({
    width: '250px',  // Normal card width (approx. 2.5 inches)
    height: '350px', // Normal card height (approx. 3.5 inches)
    borderRadius: '10px', // Slight rounding of corners
    cursor: isUnselectable ? 'not-allowed' : 'pointer', // Disable cursor if unselectable
    opacity: isUnselectable ? 0.5 : 1,  // Dim card if unselectable
    transition: 'transform 0.3s ease, z-index 0.2s, opacity 0.3s ease',
    transform: isSelected ? 'scale(1.5)' : 'scale(1)',  // Zoom in when selected
    zIndex: isSelected ? 10 : 1, // Bring selected card to the front
    position: isSelected ? 'absolute' : 'relative', // Center card when selected
    top: isSelected ? '50%' : 'auto', // Center vertically
    left: isSelected ? '50%' : 'auto', // Center horizontally
    transform: isSelected
      ? 'scale(1.5) translate(-50%, -50%)'  // Zoom and center when selected
      : 'scale(1)', // Normal size when unselected
    animation: isSelected ? 'none' : 'spinVertical 2s linear infinite', // Apply vertical spinning animation to unselected cards
    backgroundImage: `url(${isSelected ? selectedImages[index] : images[index]})`, // Update image if selected
    backgroundSize: 'cover', // Ensure the background image covers the card
    backgroundPosition: 'center', // Center the image
    backgroundRepeat: 'no-repeat', // Do not repeat the image
  });

  // Close button style
  const closeButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '18px',
    color: '#333',
  };

  // Popup styling
  const popupStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    zIndex: 1000,
  };

  const popupButtonStyle = {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#33FF57',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  return (
    <div style={deckStyle}>
      {/* Dark overlay */}
      <div style={overlayStyle}></div>

      {images.map((imageUrl, index) => {
        // Skip rendering the card if it is removed
        if (removedCards.has(index)) {
          return null;
        }

        const isSelected = selectedCardIndex === index;
        const isUnselectable = selectedCardIndex !== null && !isSelected; // Unselectable if a card is selected

        return (
          <div
            key={index}
            onDoubleClick={() => handleCardClick(index)}  // Only allow selecting a card if none is selected
            style={cardStyle(isSelected, index, isUnselectable)}
          >
            {isSelected && (
              <button style={closeButtonStyle} onClick={closeCard}>
                ✖
              </button>
            )}
          </div>
        );
      })}
      
      {checkAllCardsRemoved() && !isPopupVisible && (
        <div style={popupStyle}>
          <h2>All cards are gone!</h2>
          <p>Would you like to restart?</p>
          <button style={popupButtonStyle} onClick={handleRestart}>
            Restart
          </button>
        </div>
      )}
    </div>
  );
}

// Add CSS for the spinning animation (vertical spin)
const style = `
@keyframes spinVertical {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}
`;

if (typeof window !== "undefined") {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = style;
  document.head.appendChild(styleTag);
}

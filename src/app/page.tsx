'use client';

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [removedCards, setRemovedCards] = useState<Set<number>>(new Set());
  const [displayedCards, setDisplayedCards] = useState<number[]>([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const images = [
    '/images/c1.png',
    '/images/c2.png',
    '/images/c3.png',
    '/images/c4.png',
    '/images/c5.png',
    '/images/c6.png',
    '/images/c7.png',
    '/images/c8.png',
    '/images/c9.png',
    '/images/c10.png',
  ];

  const selectedImages = [
    '/images/c1-selected.png',
    '/images/c2-selected.png',
    '/images/c3-selected.png',
    '/images/c4-selected.png',
    '/images/c5-selected.png',
    '/images/c6-selected.png',
    '/images/c7-selected.png',
    '/images/c8-selected.png',
    '/images/c9-selected.png',
    '/images/c10-selected.png',
  ];

  useEffect(() => {
    const availableCards = [...Array(images.length).keys()].filter(
      (index) => !removedCards.has(index)
    );

    // Show pop-up when all 5 cards are removed
    if (availableCards.length === 0 && !isPopupVisible) {
      setIsPopupVisible(true);
    }

    // If displayed cards are empty, select 5 random cards from the available ones
    if (displayedCards.length === 0 && availableCards.length > 0) {
      const randomCards = shuffle(availableCards).slice(0, 5);
      setDisplayedCards(randomCards);
    }
  }, [removedCards, displayedCards.length, isPopupVisible]);

  const shuffle = (array: number[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  const handleCardClick = (index: number) => {
    if (selectedCardIndex === null && !removedCards.has(index)) {
      setSelectedCardIndex(index);
    }
  };

  const closeCard = () => {
    if (selectedCardIndex !== null) {
      setRemovedCards((prev) => new Set(prev).add(selectedCardIndex)); // Mark card as removed
      setSelectedCardIndex(null); // Reset selected card
    }
  };

  const handleRestart = () => {
    setRemovedCards(new Set()); // Clear removed cards
    setDisplayedCards([]); // Reset displayed cards
    setIsPopupVisible(false); // Hide the pop-up
  };

  const deckStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url(/images/bg.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: 0.6,
    zIndex: -1,
  };

  const cardStyle = (isSelected: boolean, index: number, isUnselectable: boolean) => ({
    width: '250px',
    height: '350px',
    borderRadius: '10px',
    cursor: isUnselectable ? 'not-allowed' : 'pointer',
    opacity: isUnselectable ? 0.5 : 1,
    transition: 'transform 0.3s ease, z-index 0.2s, opacity 0.3s ease',
    transform: isSelected ? 'scale(1.5)' : 'scale(1)',
    zIndex: isSelected ? 10 : 1,
    position: isSelected ? 'absolute' : 'relative',
    top: isSelected ? '50%' : 'auto',
    left: isSelected ? '50%' : 'auto',
    transform: isSelected
      ? 'scale(1.5) translate(-50%, -50%)'
      : 'scale(1)',
    animation: isSelected ? 'none' : 'spinVertical 2s linear infinite',
    backgroundImage: `url(${isSelected ? selectedImages[index] : images[index]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  });

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
      <div style={overlayStyle}></div>

      {displayedCards.map((index) => {
        if (removedCards.has(index)) return null; // Skip removed cards

        const isSelected = selectedCardIndex === index;
        const isUnselectable = selectedCardIndex !== null && !isSelected;

        return (
          <div
            key={index}
            onDoubleClick={() => handleCardClick(index)}
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

      {/* Show the pop-up when all cards are removed */}
      {isPopupVisible && (
        <div style={popupStyle}>
          <h2>All cards are gone!</h2>
          <p>Would you like to restart?</p>
          <button style={popupButtonStyle} onClick={handleRestart}>
            Restart Deck
          </button>
        </div>
      )}
    </div>
  );
}

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

if (typeof window !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = style;
  document.head.appendChild(styleTag);
}

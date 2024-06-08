"use client";
import { VOTING_SYSTEM } from "@/model/user";
import { useEffect, useState } from "react";
import DeckCard from "./deckCard";

type Props = {
  votingSystem: VOTING_SYSTEM;
  submitVoteHandle: (value: string | null) => void;
  currentChoice: string | null;
  setCurrentChoice: (value: string | null) => void;
};

const Deck: React.FC<Props> = ({ votingSystem, submitVoteHandle, currentChoice, setCurrentChoice }) => {
  const [deck, setDeck] = useState<string[]>([]);

  const handleCardPress = (card: string) => {
    if (card === currentChoice) {
      setCurrentChoice(null);
      submitVoteHandle(null);
      return;
    }
    submitVoteHandle(card);
    setCurrentChoice(card);
  };

  // TODO: change vor values and labels
  useEffect(() => {
    if (votingSystem === VOTING_SYSTEM.FIBONACCI) {
      setDeck(["1", "2", "3", "5", "8", "13", "21", "34", "55", "89"]);
    } else if (votingSystem === VOTING_SYSTEM.TSHIRTS) {
      setDeck(["3XS", "2XS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"]);
    }
  }, [votingSystem]);

  useEffect(() => {
    console.log(currentChoice);
  }, [currentChoice]);

  return (
    <div className="my-4 flex gap-4 ">
      {deck.map((card, index) => (
        <DeckCard
          key={index}
          label={card}
          onClick={handleCardPress}
          isChosen={card === currentChoice}
        />
      ))}
    </div>
  );
};

export default Deck;

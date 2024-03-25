"use client";
import { VOTING_SYSTEM } from "@/model/user";
import { useEffect, useState } from "react";
import DeckCard from "./deckCard";

type Props = {
  votingSystem: VOTING_SYSTEM;
};

const Deck: React.FC<Props> = ({ votingSystem }) => {
  const [deck, setDeck] = useState<string[]>([]);
  const [currentChoice, setCurrentChoice] = useState<string | null>(null);

  const handleCardPress = (card: string) => {
    if (card === currentChoice) {
      setCurrentChoice(null);
      return;
    }
    setCurrentChoice(card);
  };

  // TODO: change vor values and labels
  useEffect(() => {
    if (votingSystem === VOTING_SYSTEM.FIBONACCI) {
      setDeck(["0", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89"]);
    } else if (votingSystem === VOTING_SYSTEM.TSHIRT) {
      setDeck([
        "3XS",
        "2XS",
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "2XL",
        "3XL",
        "4XL",
        "5XL",
      ]);
    }
  }, [votingSystem]);

  useEffect(() => {
    console.log(currentChoice);
  }, [currentChoice]);

  return (
    <div className="flex gap-4">
      {deck.map((card) => (
        <DeckCard
          label={card}
          onClick={handleCardPress}
          isChosen={card === currentChoice}
        />
      ))}
    </div>
  );
};

export default Deck;

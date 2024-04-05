import Participant from "./participant";

// TODO: move to model
export type TParticipant = {
  name: string;
  value: boolean | number;
};

type Props = {
  participants: TParticipant[];
};

const Participants: React.FC<Props> = ({ participants }) => {
  return (
    <div className="flex gap-4">
      {participants.map((el, index) => (
        <Participant key={index} data={el} />
      ))}
    </div>
  );
};

export default Participants;

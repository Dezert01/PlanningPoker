import { cn } from "@/lib/utils";
import { TParticipant } from "@/model/room";

type Props = {
  data: TParticipant;
};

const Participant: React.FC<Props> = ({ data }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex aspect-square w-20 items-center justify-center rounded-full bg-accent2 text-4xl font-bold uppercase">
        {data.name.slice(0, 1)}
      </div>
      <div className="mb-2 mt-1 text-xl font-semibold">{data.name}</div>
      <div
        className={cn(
          "transition-color flex aspect-[2/3] h-24 items-center justify-center rounded-lg border-2 text-lg font-semibold transition-transform ",
          typeof data.value === "string"
            ? " border-background2 bg-accent text-background2"
            : data.value
              ? "border-accent bg-background2 text-4xl  text-accent "
              : "border-dashed",
        )}
      >
        {typeof data.value === "string" ? data.value : data.value ? "?" : ""}
      </div>
    </div>
  );
};

export default Participant;

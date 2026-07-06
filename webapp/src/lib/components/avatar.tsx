import { personColor } from "@/lib/utils";

interface Props {
  name: string;
}

export default function Avatar(props: Props) {
  return (
    <span
      class="flex size-7 shrink-0 items-center justify-center rounded-full font-bold text-[11px] text-white shadow-sm"
      style={{ background: personColor(props.name) }}
    >
      {props.name[0]?.toUpperCase()}
    </span>
  );
}

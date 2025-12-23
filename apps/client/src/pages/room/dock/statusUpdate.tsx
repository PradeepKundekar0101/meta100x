import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const StatusUpdate = () => {
  // const [status, setStatus] = useState<"online" | "busy">("online");
  return (
    <div>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="online">Online</SelectItem>
          <SelectItem value="busy">Busy</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

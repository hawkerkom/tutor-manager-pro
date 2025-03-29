
import * as React from "react";
import { addDays, format } from "date-fns";
import { el } from 'date-fns/locale';
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DatePickerWithPresetsProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function DatePickerWithPresets({
  date,
  setDate,
}: DatePickerWithPresetsProps) {
  const [open, setOpen] = React.useState(false);

  const presets = [
    {
      name: "Σήμερα",
      date: new Date(),
    },
    {
      name: "Αύριο",
      date: addDays(new Date(), 1),
    },
    {
      name: "Σε 1 Εβδομάδα",
      date: addDays(new Date(), 7),
    },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd MMMM yyyy", { locale: el }) : <span>Επιλέξτε ημερομηνία</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2" align="start">
        <Select
          onValueChange={(value) => {
            setDate(new Date(value));
            setOpen(false);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Γρήγορη επιλογή" />
          </SelectTrigger>
          <SelectContent position="popper">
            {presets.map((preset) => (
              <SelectItem key={preset.name} value={preset.date.toDateString()}>
                {preset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

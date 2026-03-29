import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type CalCell = { day: number | null; pos: number };
type CalWeek = { cells: CalCell[]; startPos: number };

function getCalendarWeeks(year: number, month: number): CalWeek[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const flat: CalCell[] = [];
  for (let i = 0; i < firstDay; i++) flat.push({ day: null, pos: i });
  for (let d = 1; d <= daysInMonth; d++)
    flat.push({ day: d, pos: firstDay + d - 1 });
  while (flat.length % 7 !== 0) flat.push({ day: null, pos: flat.length });
  const weeks: CalWeek[] = [];
  for (let i = 0; i < flat.length; i += 7) {
    const slice = flat.slice(i, i + 7);
    weeks.push({ cells: slice, startPos: slice[0].pos });
  }
  return weeks;
}

export default function App() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [direction, setDirection] = useState(0);

  const isToday = (day: number) =>
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  const goToToday = () => {
    setDirection(0);
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  const goPrev = () => {
    setDirection(-1);
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  };

  const goNext = () => {
    setDirection(1);
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  };

  const weeks = getCalendarWeeks(viewYear, viewMonth);
  const calKey = `${viewYear}-${viewMonth}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-cal-header text-white h-[60px] flex items-center px-6 shadow-md">
        <div className="flex items-center gap-2 min-w-[160px]">
          <CalendarDays className="w-5 h-5 text-cal-today" />
          <span className="font-semibold text-base tracking-wide">
            SimpleCalendar
          </span>
        </div>

        <div className="flex-1 flex justify-center">
          <span className="text-lg font-semibold tracking-wide">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
        </div>

        <div className="flex items-center gap-2 min-w-[160px] justify-end">
          <button
            type="button"
            data-ocid="calendar.today_button"
            onClick={goToToday}
            className="px-3 py-1.5 text-sm font-medium rounded border border-white/30 text-white hover:bg-white/10 transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            data-ocid="calendar.prev_button"
            onClick={goPrev}
            aria-label="Previous month"
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            data-ocid="calendar.next_button"
            onClick={goNext}
            aria-label="Next month"
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-3xl bg-card rounded-lg shadow-card overflow-hidden border border-border">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {DAY_LABELS.map((day) => (
              <div
                key={day}
                className="py-3 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground bg-secondary"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid with slide animation */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={calKey}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.18, ease: "easeInOut" }}
            >
              {weeks.map((week, weekNum) => (
                <div
                  key={`w${week.startPos}`}
                  className="grid grid-cols-7"
                  data-ocid={`calendar.row.${weekNum + 1}`}
                >
                  {week.cells.map((cell) => (
                    <div
                      key={`c${cell.pos}`}
                      className={[
                        "relative flex items-center justify-center border-b border-r border-border h-[70px] last:border-r-0",
                        cell.day
                          ? "bg-cal-cell hover:brightness-95 transition-all"
                          : "bg-background",
                        cell.day && isToday(cell.day) ? "!bg-cal-today" : "",
                      ].join(" ")}
                      data-ocid={
                        cell.day ? `calendar.item.${cell.pos + 1}` : undefined
                      }
                    >
                      {cell.day && (
                        <span
                          className={[
                            "text-[22px] font-medium leading-none select-none",
                            isToday(cell.day)
                              ? "text-white font-bold"
                              : "text-foreground",
                          ].join(" ")}
                        >
                          {cell.day}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}

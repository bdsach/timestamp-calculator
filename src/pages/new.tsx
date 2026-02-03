import { useEffect, useState } from "react";

export default function NewTimeStamp() {
  const [currentTimestamp, setCurrentTimestamp] = useState(
    Math.floor(Date.now() / 1000)
  );
  const [years, setYears] = useState(0);
  const [months, setMonths] = useState(0);
  const [days, setDays] = useState(0);
  const [result, setResult] = useState<{
    date: string;
    timestamp: number;
  } | null>(null);

  const calculate = () => {
    const now = new Date();
    const newDate = new Date(now.getTime());

    // เพิ่มปี
    newDate.setFullYear(newDate.getFullYear() + years);
    // เพิ่มเดือน
    newDate.setMonth(newDate.getMonth() + months);
    // เพิ่มวัน
    newDate.setDate(newDate.getDate() + days);

    setResult({
      date: newDate.toISOString(),
      timestamp: Math.floor(newDate.getTime() / 1000),
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="container">
      <article>
        <h1>Timestamp Calculator</h1>
        <p>
          Current Unix Timestamp: <strong>{currentTimestamp}</strong>
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            calculate();
          }}
        >
          <div className="grid">
            <label>
              Years:
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
              />
            </label>
            <label>
              Months:
              <input
                type="number"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
              />
            </label>
            <label>
              Days:
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
              />
            </label>
          </div>
          <button type="submit">Calculate</button>
        </form>

        {result && (
          <div>
            <h2>Result:</h2>
            <p>Date (ISO): {result.date}</p>
            <p style={{ display: "flex", gap: "12px", alignItems: "baseline" }}>
              Unix Timestamp: <h4>{result.timestamp}</h4>
            </p>
          </div>
        )}
      </article>
    </main>
  );
}

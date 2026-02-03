import { useEffect, useState } from "react";

export default function AddTimeStampFromCurrent() {
  const [baseTimestamp, setBaseTimestamp] = useState<number>(
    Math.floor(Date.now() / 1000)
  );
  const [daysToAdd, setDaysToAdd] = useState<number>(30); // ตั้ง default ไว้ 30 เลย
  const [result, setResult] = useState<{
    date: string;
    timestamp: number;
  } | null>(null);

  const [now, setNow] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ฟังก์ชันสำหรับดึงเวลาปัจจุบันมาใส่ในช่อง Input
  const useCurrentTime = () => {
    setBaseTimestamp(now);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!baseTimestamp) return;

    // สูตรคำนวณ: วินาที + (จำนวนวัน * 24ชม. * 60นาที * 60วินาที)
    const secondsInDays = daysToAdd * 24 * 60 * 60;
    const newTimestamp = baseTimestamp + secondsInDays;

    const targetDate = new Date(newTimestamp * 1000);

    setResult({
      date: targetDate.toISOString(),
      timestamp: newTimestamp,
    });

    // Option: ถ้าต้องการให้ Base เปลี่ยนเป็นค่าใหม่ทันทีเพื่อกดบวกต่อได้เลย
    // setBaseTimestamp(newTimestamp); 
  };

  return (
    <main className="container">
      <article>
        <header>
          <h1>Timestamp Extended</h1>
          <p>เวลาปัจจุบัน (Unix): <code>{now}</code></p>
          <button className="outline" onClick={useCurrentTime}>
            ใช้เวลาปัจจุบันเป็นตัวตั้งต้น
          </button>
        </header>

        <form onSubmit={handleCalculate}>
          <div className="grid">
            <label>
              Base Unix Timestamp:
              <input
                type="number"
                value={baseTimestamp}
                onChange={(e) => setBaseTimestamp(Number(e.target.value))}
                placeholder="เช่น 1770777737"
              />
            </label>

            <label>
              จำนวนวันที่ต้องการบวก (+):
              <input
                type="number"
                value={daysToAdd}
                onChange={(e) => setDaysToAdd(Number(e.target.value))}
              />
            </label>
          </div>

          <button type="submit" style={{ width: '100%' }}>คำนวณวันหมดอายุใหม่</button>
        </form>

        {result && (
          <section style={{ marginTop: "2rem", borderTop: "1px solid #ccc", paddingTop: "1rem" }}>
            <h2 style={{ color: "#2ecc71" }}>ผลลัพธ์ใหม่:</h2>
            <div className="results-box">
              <p>Timestamp: <strong>{result.timestamp}</strong></p>
              <p>วันที่ (ไทย): <strong>
                {new Date(result.timestamp * 1000).toLocaleString("th-TH", {
                  dateStyle: "full",
                  timeStyle: "medium",
                })}
              </strong></p>
            </div>
            
            {/* ปุ่มทางเลือก: เอาค่าที่คำนวณได้ ไปเป็นตัวตั้งต้นเพื่อบวกต่อ */}
            <button 
              className="secondary" 
              onClick={() => setBaseTimestamp(result.timestamp)}
            >
              ใช้ค่านี้เป็นตัวตั้งต้นเพื่อบวกเพิ่มอีก
            </button>
          </section>
        )}
      </article>
    </main>
  );
}
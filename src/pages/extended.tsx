import {
  addMonths,
  addDays,
  fromUnixTime,
  getUnixTime,
  differenceInDays,
  startOfDay,
} from "date-fns";
import { useEffect, useState } from "react";

export default function AddTimeStampFromCurrent() {
  // เวลาปัจจุบัน (Live) วิ่งทุกวินาที
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));

  // ค่าตั้งต้นที่จะนำมาใช้คำนวณ (ยอมให้พิมพ์เลข หรือดึงเลขเดิมของลูกค้ามาใส่ได้)
  const [baseTimestamp, setBaseTimestamp] = useState<number>(
    Math.floor(Date.now() / 1000),
  );

  // เพิ่มตัวเลือกหน่วย: จะบวกเป็น "เดือน" หรือ "วัน"
  const [unit, setUnit] = useState<"months" | "days">("months");
  const [amountToAdd, setAmountToAdd] = useState<number>(1); // ค่าเริ่มต้น 1 เดือน (หรือเปลี่ยนเป็นวันตามสะดว)

  const [result, setResult] = useState<{
    date: string;
    timestamp: number;
    daysRemaining: number;
    isExpired: boolean;
  } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const useCurrentTime = () => {
    setBaseTimestamp(now);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!baseTimestamp) return;

    // 1. แปลง Base Timestamp เป็น Date Object
    let targetDate = fromUnixTime(baseTimestamp);

    // 2. ใช้ date-fns คำนวณข้ามเดือน/วัน แบบหมดห่วงเรื่องวันล้นเดือน
    if (unit === "months") {
      targetDate = addMonths(targetDate, amountToAdd);
    } else {
      targetDate = addDays(targetDate, amountToAdd);
    }

    // 3. คำนวณจำนวนวันคงเหลือ (ตัดเศษเวลาทิ้งแบบเดียวกับใน Google Sheets เพื่อความแม่นยำ)
    const todayStart = startOfDay(new Date());
    const targetStart = startOfDay(targetDate);
    const daysRemaining = differenceInDays(targetStart, todayStart);
    const isExpired = now > getUnixTime(targetDate);

    setResult({
      date: targetDate.toISOString(),
      timestamp: getUnixTime(targetDate),
      daysRemaining: daysRemaining,
      isExpired: isExpired,
    });
  };

  return (
    <main className="container">
      <article>
        <header>
          <h1>Timestamp Extended</h1>
          <p>
            เวลาปัจจุบัน (Unix): <code>{now}</code>
          </p>
          <button className="outline" onClick={useCurrentTime}>
            ใช้เวลาปัจจุบันเป็นตัวตั้งต้น
          </button>
        </header>

        <form onSubmit={handleCalculate}>
          <div className="grid">
            <label style={{ fontWeight: "bold" }}>
              Base Unix Timestamp (เวลาเดิม):
              <input
                type="number"
                value={baseTimestamp}
                onChange={(e) => setBaseTimestamp(Number(e.target.value))}
                placeholder="เช่น 1770777737"
              />
            </label>

            <label style={{ fontWeight: "bold" }}>
              หน่วยที่ต้องการต่ออายุ:
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as "months" | "days")}
              >
                <option value="months">เดือน (Months)</option>
                <option value="days">วัน (Days)</option>
              </select>
            </label>

            <label style={{ fontWeight: "bold" }}>
              จำนวนที่ต้องการบวก (+):
              <input
                type="number"
                min="1"
                value={amountToAdd}
                onChange={(e) => setAmountToAdd(Number(e.target.value))}
              />
            </label>
          </div>

          <button type="submit" style={{ width: "100%" }}>
            คำนวณวันหมดอายุใหม่
          </button>
        </form>

        {result && (
          <section
            style={{
              marginTop: "2rem",
              borderTop: "1px solid #ccc",
              paddingTop: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h2 style={{ color: "#2ecc71", margin: 0 }}>ผลลัพธ์ใหม่:</h2>

              {/* แสดงสถานะแพ็กเกจใหม่ */}
              {result.isExpired ? (
                <span
                  style={{
                    background: "#e74c3c",
                    color: "#fff",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  หมดอายุแล้ว
                </span>
              ) : (
                <span
                  style={{
                    background: "#2ecc71",
                    color: "#fff",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  ใช้งานได้
                </span>
              )}
            </div>

            <div
              className="results-box"
              style={{
                background: "rgba(0,0,0,0.05)",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            >
              {/* ไฮไลท์จำนวนวันคงเหลือใหม่ตามเสียงโหวต "เกินดีกว่าขาด" */}
              <p style={{ margin: "0.5rem 0", fontSize: "1.2rem" }}>
                <strong>จำนวนวันคงเหลือใหม่:</strong>{" "}
                <span
                  style={{
                    color: result.isExpired ? "#e74c3c" : "#3498db",
                    fontWeight: "bold",
                    fontSize: "1.4rem",
                  }}
                >
                  {result.isExpired ? "0" : result.daysRemaining} วัน
                </span>
              </p>

              <p style={{ margin: "0.5rem 0" }}>
                Timestamp ใหม่: <strong>{result.timestamp}</strong>
              </p>
              <p style={{ margin: "0.5rem 0" }}>
                วันที่ (ไทย):{" "}
                <strong>
                  {fromUnixTime(result.timestamp).toLocaleString("th-TH", {
                    dateStyle: "full",
                    timeStyle: "medium",
                  })}
                </strong>
              </p>
              <p style={{ margin: "0.5rem 0" }}>
                Date (ISO): <code>{result.date}</code>
              </p>
            </div>

            <button
              className="secondary"
              onClick={() => setBaseTimestamp(result.timestamp)}
              style={{ width: "100%" }}
            >
              ใช้ค่านี้เป็นตัวตั้งต้นเพื่อบวกเพิ่มอีก (ทบยอด)
            </button>
          </section>
        )}
      </article>
    </main>
  );
}

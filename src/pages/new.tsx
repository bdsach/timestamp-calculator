import { useEffect, useState } from "react";
import {
  addYears,
  addMonths,
  addDays,
  fromUnixTime,
  getUnixTime,
  differenceInDays,
  startOfDay,
} from "date-fns";

export default function NewTimeStamp() {
  // เวลาปัจจุบันอัปเดตทุกวินาที
  const [liveTimestamp, setLiveTimestamp] = useState(
    Math.floor(Date.now() / 1000),
  );

  // ค่า Unix Timestamp ตั้งต้นที่จะใช้คำนวณ
  const [baseTimestamp, setBaseTimestamp] = useState<number>(
    Math.floor(Date.now() / 1000),
  );

  const [years, setYears] = useState(0);
  const [months, setMonths] = useState(1);
  const [days, setDays] = useState(1);

  const [result, setResult] = useState<{
    date: string;
    timestamp: number;
    daysRemaining: number;
    isExpired: boolean;
  } | null>(null);

  // ฟังก์ชันคำนวณโดยใช้ date-fns
  const calculate = () => {
    if (!baseTimestamp) return;

    // 1. แปลงจาก Base Timestamp ตั้งต้น เป็น Date Object
    let targetDate = fromUnixTime(baseTimestamp);

    // 2. บวกเวลาตามจำนวนที่กรอก
    if (years > 0) targetDate = addYears(targetDate, years);
    if (months > 0) targetDate = addMonths(targetDate, months);
    if (days > 0) targetDate = addDays(targetDate, days);

    // 3. คำนวณจำนวนวันคงเหลือเทียบกับวันปัจจุบัน (ใช้ startOfDay เพื่อตัดเศษเวลาทิ้งเหมือนใน Google Sheets)
    const todayStart = startOfDay(new Date());
    const targetStart = startOfDay(targetDate);
    const daysRemaining = differenceInDays(targetStart, todayStart);
    const isExpired = liveTimestamp > getUnixTime(targetDate);

    setResult({
      date: targetDate.toISOString(),
      timestamp: getUnixTime(targetDate),
      daysRemaining: daysRemaining,
      isExpired: isExpired,
    });
  };

  const syncWithCurrentTime = () => {
    setBaseTimestamp(liveTimestamp);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="container">
      <article>
        <header>
          <h1>เครื่องมือคำนวณและแปลงเวลา (Timestamp)</h1>
          <p>
            เวลาปัจจุบัน (Live Unix): <code>{liveTimestamp}</code>
          </p>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            calculate();
          }}
        >
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontWeight: "bold" }}>
              Base Unix Timestamp (เวลาตั้งต้นคำนวณ):
              <div
                style={{ display: "flex", gap: "10px", marginTop: "0.5rem" }}
              >
                <input
                  type="number"
                  value={baseTimestamp}
                  onChange={(e) => setBaseTimestamp(Number(e.target.value))}
                  style={{ marginBottom: 0 }}
                />
                <button
                  type="button"
                  className="outline"
                  onClick={syncWithCurrentTime}
                  style={{ whiteSpace: "nowrap", width: "auto", margin: 0 }}
                >
                  ใช้เวลาปัจจุบัน
                </button>
              </div>
            </label>
          </div>

          <div className="grid">
            <label>
              จำนวนปีที่ต้องการบวก (+ ปี):
              <input
                type="number"
                min="0"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
              />
            </label>
            <label>
              จำนวนเดือนที่ต้องการบวก (+ เดือน):
              <input
                type="number"
                min="0"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
              />
            </label>
            <label>
              จำนวนวันที่ต้องการบวก (+ วัน):
              <input
                type="number"
                min="0"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
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
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h2 style={{ color: "#2ecc71", margin: 0 }}>ผลลัพธ์การคำนวณ:</h2>

              {/* แสดงผลสถานะหมดอายุแบบเข้าใจง่าย */}
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
              {/* ไฮไลท์จำนวนวันคงเหลือเด่นๆ */}
              <p style={{ margin: "0.5rem 0", fontSize: "1.2rem" }}>
                <strong>จำนวนวันคงเหลือ:</strong>{" "}
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
                <strong>วันที่ (ไทย):</strong>{" "}
                <span style={{ fontWeight: "bold" }}>
                  {fromUnixTime(result.timestamp).toLocaleString("th-TH", {
                    dateStyle: "full",
                    timeStyle: "medium",
                  })}
                </span>
              </p>
              <p style={{ margin: "0.5rem 0" }}>
                <strong>Unix Timestamp ใหม่:</strong>{" "}
                <code>{result.timestamp}</code>
              </p>
              <p style={{ margin: "0.5rem 0" }}>
                <strong>รูปแบบสากล Date (ISO):</strong>{" "}
                <code>{result.date}</code>
              </p>
            </div>

            <button
              type="button"
              className="secondary"
              onClick={() => setBaseTimestamp(result.timestamp)}
              style={{ width: "100%" }}
            >
              ใช้ค่าผลลัพธ์นี้เป็นตัวตั้งต้นใหม่ (เพื่อคำนวณทบยอด)
            </button>
          </section>
        )}
      </article>
    </main>
  );
}

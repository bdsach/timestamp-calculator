import { Link, Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div>
      {/* Header */}
      <header className="container">
        <nav>
          <ul>
            <li>
              <strong>Timestamp</strong>
            </li>
          </ul>
          <ul>
            <li>
              <Link to={`/new`}>ใหม่</Link>
            </li>
            <li>
              <Link to={`/extended`}>ขยายวัน</Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      {/* <footer>Footer</footer> */}
    </div>
  );
}

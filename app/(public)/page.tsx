// this page should be used only as a splash page to decide where a user should be navigated to
// when logged in --> to /heists
// when not logged in --> to /login

import { Clock8 } from "lucide-react";

export default function Home() {
  return (
    <div className="center-content">
      <div className="page-content">
        <h1>
          P<Clock8 className="logo" strokeWidth={2.75} />
          cket Heist
        </h1>
        <div>Tiny Crimes. Epic times.</div>
        <p className="intro-text">
          Welcome to Pocket Heist — the game where stealth meets spreadsheets.
          Complete covert micro-missions, outsmart your colleagues, and rise
          through the ranks of the most daring office operatives in the
          building. No experience required. Plausible deniability recommended.
        </p>
      </div>
    </div>
  );
}

import { LayoutDashboard, Radio, Shield } from "lucide-react";

const links = [
  { href: "/migration/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/migration/live-call", label: "Live Call", icon: Radio },
];

export function SecurityNav() {
  const path = window.location.pathname;

  return (
    <nav aria-label="Security navigation">
      <div className="nav-group">
        <label>EXTRACTED PAGES</label>
        {links.map(({ href, label, icon: Icon }) => {
          const active = path === href;
          return (
            <a key={href} href={href} aria-current={active ? "page" : undefined} className={active ? "active" : undefined}>
              <Icon size={15} />
              <span>{label}</span>
            </a>
          );
        })}
      </div>
      <div className="nav-group">
        <label>PLATFORM</label>
        <a href="/dashboard"><Shield size={15} /><span>Legacy command center</span></a>
      </div>
    </nav>
  );
}

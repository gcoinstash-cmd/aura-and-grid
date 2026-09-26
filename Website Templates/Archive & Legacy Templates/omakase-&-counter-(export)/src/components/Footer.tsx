import { RESTaurant_CONFIG } from "../config/menuManifest";

export default function Footer() {
  return (
    <footer className="border-t border-muted-charcoal py-24 px-6 bg-sumi-ink/50" id="restaurant-footer">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-xs font-sans text-raw-silk/55 lowercase tracking-wide">
        {/* Timing Information */}
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-raw-silk/40 block">
            session times
          </span>
          <div className="space-y-1">
            <p>wednesday through Sunday</p>
            {RESTaurant_CONFIG.seatingTimes.map((time, idx) => (
              <p key={time} className="font-mono text-raw-silk/40">
                {idx === 0 ? "first seating" : "second seating"} — {time}
              </p>
            ))}
          </div>
        </div>

        {/* Location coordinates */}
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-raw-silk/40 block">
            the sanctuary
          </span>
          <div className="space-y-1">
            <p>{RESTaurant_CONFIG.address}</p>
            <p>{RESTaurant_CONFIG.location}</p>
            <p className="font-mono text-raw-silk/40">{RESTaurant_CONFIG.phone}</p>
          </div>
        </div>

        {/* Minimal Social letters/Inquiries */}
        <div className="space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-raw-silk/40 block mb-3">
              transmission
            </span>
            <div className="flex gap-6">
              <a href={RESTaurant_CONFIG.instagramUrl} className="hover:text-raw-silk transition-colors">instagram</a>
              <a href={RESTaurant_CONFIG.journalUrl} className="hover:text-raw-silk transition-colors">journal</a>
              <a href={RESTaurant_CONFIG.privacyUrl} className="hover:text-raw-silk transition-colors">legal privacy</a>
            </div>
          </div>
          <p className="text-[10px] text-raw-silk/30 tracking-wider">
            &copy; 1889—2026 {RESTaurant_CONFIG.name} llc. the quiet art of subtraction.
          </p>
        </div>
      </div>
    </footer>
  );
}

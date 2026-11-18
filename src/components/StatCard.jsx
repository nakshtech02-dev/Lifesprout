
import {
  Wallet,
  TrendingUp,
  IndianRupee,
  Inbox,
  Video,
  FileText,
  Clock3,
  Eye,
} from "lucide-react";

const icons = {
  payment: Wallet,
  weekly: TrendingUp,
  monthly: IndianRupee,
  enquiries: Inbox,
  demo: Video,
  published: FileText,
  pending: Clock3,
  visitors: Eye,
};

const StatCard = ({ item }) => {
  const Icon = icons[item.type] || FileText;

  return (
    <div className="flex min-h-[110px] items-center gap-3 rounded-2xl border border-[#DFE7F5] bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#246BFA]">
        <Icon size={20} strokeWidth={2.7} />
      </div>

      <div className="min-w-0">
        <h3 className="text-[23px] font-bold leading-7 text-[#071A3B]">
          {item.value}
        </h3>

        <p className="mt-1 text-[11px] leading-4 text-[#8292B0]">
          {item.title}
        </p>

        <p className="mt-1 text-[10px] font-semibold text-emerald-600">
          {item.subtitle}
        </p>
      </div>
    </div>
  );
};

export default StatCard;

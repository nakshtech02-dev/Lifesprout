
import { Clock3, ListChecks } from "lucide-react";

const ReviewQueue = ({ pendingCount = 0 }) => {
  return (
    <div className="rounded-2xl border border-[#DFE7F5] bg-white p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-base font-bold text-[#0B1C3B]">
          <ListChecks size={19} className="text-[#246BFA]" />
          Waiting for your review
        </h2>

        <button className="shrink-0 text-xs font-medium text-[#246BFA] hover:underline">
          Open queue
        </button>
      </div>

      <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
        {pendingCount === 0 ? (
          <>
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#F0F5FF] text-[#246BFA]">
              <Clock3 size={25} />
            </div>

            <h3 className="text-sm font-bold text-[#0B1C3B]">
              Nothing to review 🎉
            </h3>

            <p className="mt-1 text-xs text-[#8292B0]">
              All submitted articles have been reviewed.
            </p>
          </>
        ) : (
          <>
            <p className="text-4xl font-bold text-[#246BFA]">
              {pendingCount}
            </p>

            <p className="mt-2 text-sm font-semibold text-[#0B1C3B]">
              Articles waiting for approval
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewQueue;


import { History } from "lucide-react";
import { useNavigate } from "react-router-dom";
const ArticleList = ({ articles }) => {

   const navigate = useNavigate();
  return (
    <div className="rounded-2xl border border-[#DFE7F5] bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold text-[#0B1C3B]">
          <History size={19} className="text-[#246BFA]" />
          Recent articles
        </h2>

        <button  onClick={() => navigate("/articles")}  className="text-xs font-medium text-[#246BFA] hover:underline">
          View all
        </button>
      </div>

      <div>
        {articles.map((article) => (
          <div
            key={article.title}
            className="flex items-start justify-between gap-3 border-b border-[#E5EAF3] px-2 py-3 last:border-0"
          >
            <div className="min-w-0">
              <h3 className="text-[12px] font-bold leading-5 text-[#0B1C3B]">
                {article.title}
              </h3>

              <p className="mt-0.5 text-[11px] leading-4 text-[#8292B0]">
                {article.category} · {article.author} · {article.date}
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-[#E0F6EA] px-2.5 py-1 text-[9px] font-bold uppercase text-[#079653]">
              {article.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleList;

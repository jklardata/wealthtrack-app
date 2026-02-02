import { createClient } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function FeedbackAdminPage() {
  const { data: feedback } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const feedbackCount = feedback?.length || 0;

  // Group by page
  const feedbackByPage = feedback?.reduce((acc: Record<string, number>, item: any) => {
    acc[item.page_or_tool_name] = (acc[item.page_or_tool_name] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium text-slate-900 flex items-center gap-2">
            <MessageSquare className="h-7 w-7 text-emerald-600" />
            User Feedback
          </h1>
          <p className="text-slate-500 mt-1">
            {feedbackCount} responses collected
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{feedbackCount}</div>
              <p className="text-xs text-slate-500">Total Responses</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {feedbackByPage ? Object.keys(feedbackByPage).length : 0}
              </div>
              <p className="text-xs text-slate-500">Pages with Feedback</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {feedbackByPage && Object.entries(feedbackByPage).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"}
              </div>
              <p className="text-xs text-slate-500">Most Active Page</p>
            </CardContent>
          </Card>
        </div>

        {/* Feedback by Page */}
        {feedbackByPage && (
          <Card>
            <CardContent className="pt-6">
              <h2 className="font-medium mb-4">Feedback by Page</h2>
              <div className="space-y-2">
                {Object.entries(feedbackByPage)
                  .sort((a, b) => b[1] - a[1])
                  .map(([page, count]) => (
                    <div key={page} className="flex justify-between text-sm">
                      <span className="text-slate-600">{page}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feedback List */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-slate-900">Recent Feedback</h2>
          {feedback?.map((item: any) => (
            <Card key={item.id} className="bg-white">
              <CardContent className="pt-4">
                <div className="flex justify-between text-sm text-slate-500 mb-2">
                  <span className="font-medium text-emerald-600">
                    {item.page_or_tool_name}
                  </span>
                  <span>
                    {new Date(item.created_at).toLocaleDateString()} at{" "}
                    {new Date(item.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-slate-900">{item.feedback_text}</p>
                {item.user_id && item.user_id !== "anonymous" && (
                  <p className="text-xs text-slate-400 mt-2">
                    User ID: {item.user_id}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

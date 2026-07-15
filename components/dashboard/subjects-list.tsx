import Link from "next/link";
import { ChevronRight, BookOpen } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Subject, Classroom } from "@/lib/AppContext";

interface SubjectsListProps {
  subjects: Subject[];
  classrooms: Classroom[];
  t: (k: string) => string;
}

export function SubjectsList({ subjects, classrooms, t }: SubjectsListProps) {
  return (
    <div className="lg:col-span-2 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-foreground tracking-tight">
          {t("mySubjectsTitle")}
        </h2>
        <Link href="/subjects">
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 font-bold gap-1">
            {t("viewAll") ?? "View All"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {subjects.length === 0 ? (
          <Card className="border border-dashed p-8 text-center text-muted-foreground bg-card">
            <BookOpen className="h-10 w-10 mx-auto mb-2 text-muted/60" />
            <p className="text-sm font-semibold">{t("noSubjects")}</p>
            <Link href="/subjects" className="mt-3 inline-block">
              <Button size="sm" className="font-bold">
                {t("addFirstSubject")}
              </Button>
            </Link>
          </Card>
        ) : (
          subjects.map((subject) => {
            const subjClassrooms = classrooms.filter(c => c.subjectId === subject.id);
            return (
              <Card key={subject.id} className="bg-card border shadow-sm hover:shadow transition-all">
                <CardHeader className="p-5 pb-2 flex flex-row items-start justify-between space-y-0">
                  <div>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-wider">
                      {subject.code}
                    </span>
                    <CardTitle className="text-lg font-bold text-foreground mt-2">
                      {subject.name}
                    </CardTitle>
                  </div>
                  <Link href={`/subjects`}>
                    <Button variant="outline" size="sm" className="font-bold text-xs">
                      {t("viewDetails")}
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <div className="mt-2 text-sm text-muted-foreground">
                    {subjClassrooms.length === 0 ? (
                      <span className="text-xs text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded">{t("noRoomsYet")}</span>
                    ) : (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {subjClassrooms.map((room) => (
                          <Link key={room.id} href={`/classrooms/${room.id}`}>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-muted hover:bg-primary/10 hover:text-primary border px-2.5 py-1 rounded-lg text-foreground transition-colors">
                              {room.name}
                              <ChevronRight className="h-3 w-3 shrink-0" />
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

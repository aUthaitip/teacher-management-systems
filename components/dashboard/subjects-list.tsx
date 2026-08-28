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
          {t("mySubjectsTitle") || "My Subjects"}
        </h2>
        <Link href="/subjects">
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/5 font-bold gap-1 rounded-full px-4">
            {t("viewAll") ?? "View All"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {subjects.length === 0 ? (
          <Card className="border-2 border-dashed border-border/60 p-10 text-center text-muted-foreground bg-card/50">
            <div className="bg-primary/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-primary/60" />
            </div>
            <p className="text-sm font-semibold text-foreground/80">{t("noSubjects") || "No subjects found."}</p>
            <p className="text-xs text-muted-foreground mt-1 mb-5">Create a subject to get started.</p>
            <Link href="/subjects" className="inline-block">
              <Button size="sm" className="font-bold rounded-full px-6 shadow-sm hover:shadow-md transition-shadow">
                {t("addFirstSubject") || "Add Subject"}
              </Button>
            </Link>
          </Card>
        ) : (
          subjects.map((subject) => {
            const subjClassrooms = classrooms.filter(c => c.subjectId === subject.id);
            return (
              <Card key={subject.id} className="group overflow-hidden bg-card border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
                <CardHeader className="p-5 pb-3 flex flex-row items-start justify-between space-y-0 relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/50 to-transparent group-hover:from-primary transition-colors" />
                  <div className="pl-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {subject.code}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-bold text-foreground mt-2 group-hover:text-primary transition-colors">
                      {subject.name}
                    </CardTitle>
                  </div>
                  <Link href={`/subjects`}>
                    <Button variant="outline" size="sm" className="font-bold text-xs rounded-full bg-background hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all">
                      {t("viewDetails") || "View"}
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-5 pt-0 pl-7">
                  <div className="mt-2 text-sm">
                    {subjClassrooms.length === 0 ? (
                      <span className="text-xs text-amber-600 font-medium bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">{t("noRoomsYet") || "No classrooms"}</span>
                    ) : (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {subjClassrooms.map((room) => (
                          <Link key={room.id} href={`/classrooms/${room.id}`}>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-muted/60 hover:bg-primary/10 hover:text-primary border border-border/50 px-2.5 py-1 rounded-md text-foreground transition-all duration-200 hover:shadow-sm">
                              {room.name}
                              <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
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

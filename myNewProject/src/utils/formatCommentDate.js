import format from "date-fns/format";
import uk from "date-fns/locale/uk";

export function formatCommentDate(date) {
  return format(Date.parse(date), "dd MMMM yyyy, HH:mm", {
    locale: uk,
  });
}

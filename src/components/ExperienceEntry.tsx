import type { UserExperience } from "../types/user";
import { format } from "date-fns"; // For formatting the date nicely

type ExperienceEntryProps = {
  experience: UserExperience;
};

export const ExperienceEntry = ({ experience }: ExperienceEntryProps) => {
  return (
    <div className="flex items-center gap-4 rounded bg-gray-50 p-4 shadow-sm transition hover:bg-gray-100">
      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md bg-blue-200 text-3xl">
        {/* do we still hide the emoji from screen readers when it is not decorative? */}
        <span aria-hidden="true">{experience.icon ?? "⚓"}</span>
      </div>
      <div>
        <h4 className="mb-1 font-medium">{experience.title}</h4>
        <p className="mb-1 text-sm text-gray-500">{experience.location}</p>
        <p className="mb-1 text-sm text-gray-500">{experience.vessel}</p>
        {/* parse the ISO string and format it */}
        <p className="text-sm text-gray-500">{format(new Date(experience.date), "do MMM yyyy")}</p>
      </div>
    </div>
  );
};

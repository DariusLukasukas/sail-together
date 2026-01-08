import { useMemo } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import SuitcaseIcon from "@/components/icons/SuitcaseIcon";
import CalendarDaysIcon from "@/components/icons/CalendarDaysIcon";
import LocationPin from "@/components/icons/LocationPin";
import IconMedal from "@/components/icons/IconMedal";
import VesselIcon from "@/components/icons/VesselIcon";
import GlobeIcon from "@/components/icons/GlobeIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Container } from "@/components/ui/container";
import { Rating } from "@/components/ui/rating";
import { ContactActions } from "@/components/ui/contact-actions";
import { Media, MediaFallback } from "@/components/ui/media";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useProfile } from "@/contexts/profile_context";
import { ArrowLeft } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { profile, isLoading, error } = useProfile();

  // Determine if viewing own profile
  const isOwnProfile = !userId || userId === profile?.id;

  // For now, only show own profile. In future, add logic to fetch other user profiles
  const displayProfile = isOwnProfile ? profile : null;

  const avatarInitials = useMemo(() => {
    if (!displayProfile?.name) return "U";
    return displayProfile.name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [displayProfile?.name]);

  if (isLoading) {
    return (
      <Container className="container mx-auto max-w-3xl p-2">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="flex items-center gap-2">
            <Spinner />
            <span className="text-muted-foreground">Loading profile...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="container mx-auto max-w-3xl p-2">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="border-destructive/20 bg-destructive/10 rounded-lg border p-6 text-center">
            <h2 className="text-destructive mb-2 text-lg font-semibold">Error Loading Profile</h2>
            <p className="text-destructive/80 mb-4 text-sm">{error.message}</p>
            <Button onClick={() => navigate("/")}>Go Home</Button>
          </div>
        </div>
      </Container>
    );
  }

  if (!displayProfile) {
    return <Navigate to="/404" replace />;
  }

  const {
    avatarUrl,
    name,
    rating,
    role,
    createdAt,
    location,
    email,
    phone,
    about,
    qualifications,
    skills,
    feedback,
    experiences,
  } = displayProfile;

  return (
    <Container className="container mx-auto max-w-3xl p-2">
      <article className="flex flex-col gap-6 [&>section]:space-y-2">
        {/* Back Button */}
        {!isOwnProfile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="w-fit gap-2"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
        )}

        <header className="flex flex-col items-center gap-2">
          <Avatar className="size-24 rounded-3xl bg-[#FFC7D6]">
            <AvatarImage src={avatarUrl} alt={`${name}'s avatar`} />
            <AvatarFallback className="text-2xl font-semibold">
              {avatarInitials}
            </AvatarFallback>
          </Avatar>

          <h1 id="profile-name" className="text-2xl font-bold">
            {name}
          </h1>

          {rating !== undefined && (
            <div className="flex items-center gap-2">
              <Rating value={rating} max={5} size={24} />
              <span className="sr-only">{rating} out of 5 stars</span>
              <span className="text-sm text-muted-foreground">
                ({rating.toFixed(1)})
              </span>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4 [&>p]:flex [&>p]:items-center [&>p]:gap-2 [&>p]:font-semibold">
            {role && (
              <p>
                <SuitcaseIcon className="size-6" aria-hidden="true" /> 
                <span className="capitalize">{role}</span>
              </p>
            )}
            {createdAt && (
              <p>
                <CalendarDaysIcon className="size-6" aria-hidden="true" /> 
                Joined {format(new Date(createdAt), "MMM yyyy")}
              </p>
            )}
          </div>

          {location && (
            <p className="flex items-center gap-2 font-semibold">
              <LocationPin className="size-6" aria-hidden="true" /> {location}
            </p>
          )}

          {(email || phone) && <ContactActions email={email} phone={phone} />}
        </header>

        {/* Edit Profile Button - only for own profile */}
        {isOwnProfile && (
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={() => navigate("/profile/edit")} 
            className="max-w-xs mx-auto"
          >
            Edit Profile
          </Button>
        )}

        {about && (
          <section>
            <h2 className="text-xl font-semibold">About Me</h2>
            <p className="leading-relaxed">{about}</p>
          </section>
        )}

        {experiences && experiences.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold">Experience Log</h2>
            <ul className="flex list-none flex-col gap-4" role="list">
              {experiences.map((experience) => (
                <li 
                  key={experience.id} 
                  className="flex flex-row gap-4 rounded-2xl"
                >
                  <Media className="size-24 rounded-3xl shrink-0">
                    <MediaFallback className="bg-neutral-300" />
                  </Media>
                  <div className="flex flex-col justify-between [&>p]:flex [&>p]:items-center [&>p]:gap-2 [&>p]:text-sm [&>p]:font-medium">
                    <h3 className="font-medium">{experience.title}</h3>
                    <p>
                      <GlobeIcon className="size-5" aria-hidden="true" /> 
                      {experience.location}
                    </p>
                    <p>
                      <VesselIcon className="size-5" aria-hidden="true" /> 
                      {experience.vessel}
                    </p>
                    <p>
                      <CalendarDaysIcon className="size-5" aria-hidden="true" /> 
                      {format(new Date(experience.date), "MMM yyyy")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {qualifications && qualifications.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold">Qualifications</h2>
            <ul 
              className="grid list-none grid-cols-1 gap-2 p-0 md:grid-cols-2"
              role="list"
            >
              {qualifications.map((qualification) => (
                <li 
                  key={qualification.id} 
                  className="flex items-start gap-2 font-medium"
                >
                  <IconMedal 
                    aria-hidden="true" 
                    className="size-6 shrink-0 text-blue-500" 
                  />
                  {qualification.name}
                </li>
              ))}
            </ul>
          </section>
        )}

        {skills && skills.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold">Skills</h2>
            <ul className="flex flex-wrap gap-2" role="list">
              {skills.map((skill, index) => (
                <li
                  key={`skill-${index}`}
                  className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        )}

        {feedback && feedback.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold">Feedback</h2>
            <ul className="flex flex-col gap-2" role="list">
              {feedback.map((f) => (
                <li key={f.id} className="bg-muted w-full rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="leading-none font-semibold">
                      {f.author.name || "Anonymous"}
                    </p>
                    {f.createdAt && (
                      <time
                        className="text-muted-foreground text-xs font-medium"
                        dateTime={f.createdAt.toString()}
                      >
                        {format(new Date(f.createdAt), "MMM d, yyyy")}
                      </time>
                    )}
                  </div>

                  <p className="text-muted-foreground mt-2 line-clamp-4 text-sm leading-relaxed">
                    {f.comment}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Empty State */}
        {!about && 
         (!experiences || experiences.length === 0) && 
         (!qualifications || qualifications.length === 0) && 
         (!skills || skills.length === 0) && 
         (!feedback || feedback.length === 0) && (
          <section className="py-12 text-center">
            <p className="text-muted-foreground">
              {isOwnProfile 
                ? "Complete your profile to help others learn more about you."
                : "This profile is incomplete."}
            </p>
            {isOwnProfile && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => navigate("/profile/edit")} 
                className="mt-4"
              >
                Complete Profile
              </Button>
            )}
          </section>
        )}
      </article>
    </Container>
  );
}
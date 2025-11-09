import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContactActionsProps {
  email: string;
  phone?: string;
  className?: string;
}

export function ContactActions({ email, phone, className }: ContactActionsProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Button asChild variant="outline" size={"sm"} title="Send Email">
        <a href={`mailto:${email}`}>Email</a>
      </Button>

      {phone && (
        <Button asChild variant="outline" size={"sm"} title="Send Message">
          <a href={`sms:${phone}`}>Message</a>
        </Button>
      )}

      {phone && (
        <Button asChild variant="outline" size={"sm"} title="Call">
          <a href={`tel:${phone}`}>Call</a>
        </Button>
      )}
    </div>
  );
}

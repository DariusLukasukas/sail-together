import * as React from "react";

function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="container" className={className} {...props} />;
}

export { Container };

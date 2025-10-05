import * as React from "react";

import { cn } from "./utils";

export function Badge({ className, ...props }: React.ComponentPropsWithRef<"span">) {
	return <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md", className)} {...props} />;
}

export default Badge;


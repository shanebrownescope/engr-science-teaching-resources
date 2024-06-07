import classNames from "classnames";
import { PropsWithChildren } from "react";

type ContainerLayoutProps = {
  container?: string;
  className?: string;
  paddingTop?: "regular" | "md" | "lg" | "none";
} & PropsWithChildren;

const ContainerLayout: React.FC<ContainerLayoutProps> = ({
  children,
  container = "regular",
  paddingTop = "lg",
  className = "",
}) => {
  const containerClass = classNames(
    {
      container: container === "regular",
      "container-md": container === "md",
      "pt-clamp-regular": paddingTop === "regular",
      "pt-clamp-md": paddingTop === "md",
      "pt-clamp-lg": paddingTop === "lg",
    },
    className,
  );

  return <div className={containerClass}>{children}</div>;
};

export default ContainerLayout;

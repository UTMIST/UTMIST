import type { Access } from "payload";

export const isCmsEditor: Access = ({ req }) =>
  req.user?.collection === "cms-users";

export const publishedOrCmsEditor: Access = ({ req }) =>
  req.user?.collection === "cms-users" || {
    _status: { equals: "published" },
  };
